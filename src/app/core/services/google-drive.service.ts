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
        });
      });
    };
    document.body.appendChild(script);
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
          reject(new Error('Error de autenticación: ' + error));
        }
      });

      tokenClient.requestAccessToken();
    });
  }

  public selectMultipleImages(): Observable<GoogleDriveFile[]> {
    const subject = new Subject<GoogleDriveFile[]>();

    if (!this.pickerApiLoaded) {
      subject.error(new Error('Google Picker API no está cargado'));
      return subject.asObservable();
    }
    this.authenticate().then((token) => {

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
    }).catch((error) => {
      console.error('Error en autenticación:', error);
      subject.error(error);
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
