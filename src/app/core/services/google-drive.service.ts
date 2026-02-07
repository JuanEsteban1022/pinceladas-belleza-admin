import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

declare var gapi: any;
declare var google: any;

export interface GoogleDriveFile {
  id: string;
  name: string;
  url: string;
  mimeType: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {
  private pickerApiLoaded = false;
  private oauthToken: string | null = null;
  private readonly API_KEY = 'AIzaSyCsXRScUGzIzGWQtdPc_ZHXO8DYW2rMz8c'; // Reemplaza con tu API key
  private readonly CLIENT_ID = '709010338132-lied1ngllur46021362dmos7b9m111b2.apps.googleusercontent.com'; // Reemplaza con tu Client ID

  constructor() {
    this.loadGoogleApi();
  }

  private loadGoogleApi(): void {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      gapi.load('auth2', () => {
        gapi.load('picker', () => {
          this.pickerApiLoaded = true;
          console.log('Google Picker API cargado correctamente');
        });
      });
    };
    script.onerror = () => {
      console.error('Error al cargar Google API');
    };
    document.body.appendChild(script);
  }

  private waitForGoogleApi(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.pickerApiLoaded && typeof google !== 'undefined' && google.accounts && google.picker) {
        resolve();
        return;
      }

      const checkInterval = setInterval(() => {
        if (this.pickerApiLoaded && typeof google !== 'undefined' && google.accounts && google.picker) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('Tiempo de espera agotado para cargar Google APIs'));
      }, 10000);
    });
  }

  private authenticate(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.oauthToken) {
        resolve(this.oauthToken!);
        return;
      }

      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.readonly',
        callback: (tokenResponse: any) => {
          if (tokenResponse && tokenResponse.access_token) {
            this.oauthToken = tokenResponse.access_token;
            resolve(this.oauthToken!);
          } else {
            reject(new Error('Error al obtener el token de autenticación'));
          }
        },
        error_callback: (error: any) => {
          if (error && error.message && error.message.includes('popup closed')) {
            reject(new Error('Ventana de autenticación cerrada por el usuario'));
          } else {
            reject(new Error('Error de autenticación: ' + (error?.message || error)));
          }
        }
      });

      try {
        tokenClient.requestAccessToken();
      } catch (error) {
        reject(new Error('Error al iniciar autenticación: ' + error));
      }
    });
  }

  public selectMultipleImages(): Observable<GoogleDriveFile[]> {
    const subject = new Subject<GoogleDriveFile[]>();

    this.waitForGoogleApi().then(() => {
      return this.authenticate();
    }).then((token) => {
      try {
        const picker = new google.picker.PickerBuilder()
          .addView(
            new google.picker.DocsView(google.picker.ViewId.DOCS_IMAGES)
              .setIncludeFolders(true)
              .setSelectFolderEnabled(false)
          )
          .setOAuthToken(token)
          .setDeveloperKey(this.API_KEY)
          .setCallback((data: any) => {
            if (data.action === google.picker.Action.PICKED) {
              const files: GoogleDriveFile[] = [];
              if (data.docs && data.docs.length > 0) {
                data.docs.forEach((doc: any) => {
                  files.push({
                    id: doc.id,
                    name: doc.name,
                    url: doc.url,
                    mimeType: doc.mimeType
                  });
                });
              }
              subject.next(files);
              subject.complete();
            } else if (data.action === google.picker.Action.CANCEL) {
              subject.complete();
            }
          })
          .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
          .build();

        picker.setVisible(true);
      } catch (pickerError) {
        console.error('Error al crear el picker:', pickerError);
        subject.error(new Error('Error al abrir el selector de archivos'));
      }
    }).catch((error) => {
      console.error('Error en Google Drive:', error);
      if (error.message.includes('Ventana de autenticación cerrada')) {
        subject.error(new Error('Se canceló la autenticación. Por favor, inténtalo de nuevo.'));
      } else if (error.message.includes('Tiempo de espera agotado')) {
        subject.error(new Error('Las APIs de Google tardaron demasiado en cargar. Por favor, recarga la página.'));
      } else {
        subject.error(error);
      }
    });

    return subject.asObservable();
  }

  public convertToDirectUrl(driveUrl: string): string {
    const fileId = this.extractFileIdFromUrl(driveUrl);

    if (fileId) {
      // Try multiple URL formats in order of reliability
      const urls = [
        `https://lh3.googleusercontent.com/d/${fileId}=s800`, // Most reliable for images
        `https://drive.google.com/uc?export=view&id=${fileId}`,
        `https://drive.google.com/thumbnail?id=${fileId}&sz=w800-h600`,
        `https://drive.google.com/file/d/${fileId}/view?usp=sharing` // Fallback
      ];

      return urls[0]; // Return the most reliable format
    }

    return driveUrl;
  }

  public async testImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);

      img.src = url;

      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000);
    });
  }

  public async getWorkingImageUrl(driveUrl: string): Promise<string> {
    const fileId = this.extractFileIdFromUrl(driveUrl);

    if (!fileId) {
      return driveUrl;
    }

    const urls = [
      `https://lh3.googleusercontent.com/d/${fileId}=s800`,
      `https://drive.google.com/uc?export=view&id=${fileId}`,
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w800-h600`,
      `https://drive.google.com/file/d/${fileId}/view?usp=sharing`
    ];

    for (const url of urls) {
      const works = await this.testImageUrl(url);
      if (works) {
        return url;
      }
    }

    return urls[0]; // Return first option as fallback
  }

  private extractFileIdFromUrl(url: string): string | null {

    // Extraer ID de archivo de URL de Google Drive
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/,
      /\/d\/([a-zA-Z0-9_-]+)\//,
      /\/open\?id=([a-zA-Z0-9_-]+)/,
      /\/uc\?id=([a-zA-Z0-9_-]+)/,
      /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }
}
