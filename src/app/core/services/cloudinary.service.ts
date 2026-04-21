import { Injectable } from '@angular/core';
import { Observable, Subject, from } from 'rxjs';
import { Cloudinary } from 'cloudinary-core';
import { CloudinaryConfig } from './cloudinary-config';

export interface CloudinaryImage {
  public_id: string;
  url: string;
  secure_url: string;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  width?: number;
  height?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudinary: any;
  private readonly CLOUD_NAME = CloudinaryConfig.CLOUD_NAME;
  private readonly API_KEY = CloudinaryConfig.API_KEY;
  private readonly UPLOAD_PRESET = CloudinaryConfig.UPLOAD_PRESET;
  private readonly FOLDER = CloudinaryConfig.FOLDER;

  constructor() {
    this.cloudinary = new Cloudinary({
      cloud_name: this.CLOUD_NAME,
      secure: true
    });
  }

  /**
   * Abre el widget de Cloudinary para seleccionar múltiples imágenes
   */
  public selectMultipleImages(): Observable<CloudinaryImage[]> {
    const subject = new Subject<CloudinaryImage[]>();

    // Cargar el widget de Cloudinary si no está cargado
    this.loadCloudinaryWidget().then(() => {
      // Abrir el widget de Cloudinary
      (window as any).cloudinary.openUploadWidget(
        {
          cloudName: this.CLOUD_NAME,
          uploadPreset: this.UPLOAD_PRESET,
          multiple: true,
          resourceType: 'image',
          maxFiles: 10,
          folder: this.FOLDER,
          theme: 'white',
          styles: {
            palette: {
              window: '#FFFFFF',
              windowBorder: '#90A0B3',
              tabIcon: '#000000',
            },
            fonts: {
              default: null,
              "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif": null
            }
          }
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Error en widget de Cloudinary:', error);
            subject.error(new Error('Error al seleccionar imágenes de Cloudinary'));
            return;
          }

          if (result.event === 'success') {
            // Si es una sola imagen
            const images: CloudinaryImage[] = [this.transformCloudinaryResult(result.info)];
            subject.next(images);
            subject.complete();
          } else if (result.event === 'queues-end') {
            // Si son múltiples imágenes, procesar todas
            const images: CloudinaryImage[] = result.info
              .filter((info: any) => info.info.resource_type === 'image')
              .map((info: any) => this.transformCloudinaryResult(info.info));

            subject.next(images);
            subject.complete();
          } else if (result.event === 'close') {
            subject.complete();
          }
        }
      );
    }).catch((error) => {
      console.error('Error al cargar widget de Cloudinary:', error);
      subject.error(new Error('No se pudo cargar el widget de Cloudinary'));
    });

    return subject.asObservable();
  }

  /**
   * Obtiene imágenes existentes usando el widget de Cloudinary con opción de explorar
   */
  public getExistingImages(folder: string = this.FOLDER): Observable<CloudinaryImage[]> {
    const subject = new Subject<CloudinaryImage[]>();

    // Usar el widget con configuración simplificada para ver imágenes existentes
    this.loadCloudinaryWidget().then(() => {
      (window as any).cloudinary.openUploadWidget(
        {
          cloudName: this.CLOUD_NAME,
          uploadPreset: this.UPLOAD_PRESET,
          multiple: true,
          resourceType: 'image',
          maxFiles: 50,
          folder: this.FOLDER,
          theme: 'white',
          show_powered_by: false,
          sources: ['local', 'url', 'camera', 'image_search', 'google_drive', 'dropbox', 'instagram', 'facebook'],
          default_source: 'local',
          google_access_token: null,
          dropbox_access_token: null,
          // Configuración simple para búsqueda
          search: {
            expression: `folder:${folder}`
          },
          styles: {
            palette: {
              window: '#FFFFFF',
              windowBorder: '#90A0B3',
              tabIcon: '#000000',
              menuIcons: '#000000',
              textDark: '#000000',
              textLight: '#FFFFFF',
              link: '#000000',
              action: '#FF6B6B',
              inactiveTabIcon: '#0E2F5A',
              error: '#F44235',
              inProgress: '#2EB9EC',
              complete: '#20B832',
              sourceIcons: '#0E2F5A'
            },
            fonts: {
              default: null,
              "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif": null
            }
          }
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Error en widget de Cloudinary:', error);
            subject.error(new Error('Error al cargar imágenes existentes'));
            return;
          }

          if (result.event === 'success') {
            const images: CloudinaryImage[] = [this.transformCloudinaryResult(result.info)];
            subject.next(images);
            subject.complete();
          } else if (result.event === 'queues-end') {
            const images: CloudinaryImage[] = result.info
              .filter((info: any) => info.info && info.info.resource_type === 'image')
              .map((info: any) => this.transformCloudinaryResult(info.info));

            subject.next(images);
            subject.complete();
          } else if (result.event === 'close') {
            subject.complete();
          }
        }
      );
    }).catch((error) => {
      console.error('Error al cargar widget de Cloudinary:', error);
      subject.error(new Error('No se pudo cargar el widget de Cloudinary'));
    });

    return subject.asObservable();
  }


  /**
   * Método alternativo usando el widget para mostrar imágenes existentes
   */
  private getExistingImagesWithWidget(folder: string = this.FOLDER): Observable<CloudinaryImage[]> {
    const subject = new Subject<CloudinaryImage[]>();

    this.loadCloudinaryWidget().then(() => {
      (window as any).cloudinary.openUploadWidget(
        {
          cloudName: this.CLOUD_NAME,
          uploadPreset: this.UPLOAD_PRESET,
          multiple: true,
          resourceType: 'image',
          maxFiles: 50,
          folder: this.FOLDER,
          theme: 'white',
          show_powered_by: false,
          sources: ['local', 'url', 'camera', 'image_search', 'google_drive', 'dropbox', 'instagram', 'facebook'],
          default_source: 'local',
          google_access_token: null,
          dropbox_access_token: null,
          search: {
            expression: `resource_type:image AND folder:${folder}`
          },
          styles: {
            palette: {
              window: '#FFFFFF',
              windowBorder: '#90A0B3',
              tabIcon: '#000000',
              menuIcons: '#000000',
              textDark: '#000000',
              textLight: '#FFFFFF',
              link: '#000000',
              action: '#FF6B6B',
              inactiveTabIcon: '#0E2F5A',
              error: '#F44235',
              inProgress: '#2EB9EC',
              complete: '#20B832',
              sourceIcons: '#0E2F5A'
            },
            fonts: {
              default: null,
              "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif": null
            }
          }
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Error en widget de Cloudinary:', error);
            subject.error(new Error('Error al seleccionar imágenes de Cloudinary'));
            return;
          }

          if (result.event === 'success') {
            const images: CloudinaryImage[] = [this.transformCloudinaryResult(result.info)];
            subject.next(images);
            subject.complete();
          } else if (result.event === 'queues-end') {
            const images: CloudinaryImage[] = result.info
              .filter((info: any) => info.info.resource_type === 'image')
              .map((info: any) => this.transformCloudinaryResult(info.info));

            subject.next(images);
            subject.complete();
          } else if (result.event === 'close') {
            subject.complete();
          }
        }
      );
    }).catch((error) => {
      console.error('Error al cargar widget de Cloudinary:', error);
      subject.error(new Error('No se pudo cargar el widget de Cloudinary'));
    });

    return subject.asObservable();
  }

  /**
   * Abre el widget de Cloudinary para seleccionar imágenes existentes o subir nuevas
   */
  public getAllImages(folder: string = this.FOLDER): Observable<CloudinaryImage[]> {
    const subject = new Subject<CloudinaryImage[]>();

    // Cargar el widget de Cloudinary si no está cargado
    this.loadCloudinaryWidget().then(() => {
      // Abrir el widget de Cloudinary con opción de buscar imágenes existentes
      (window as any).cloudinary.openUploadWidget(
        {
          cloudName: this.CLOUD_NAME,
          uploadPreset: this.UPLOAD_PRESET,
          multiple: true,
          resourceType: 'image',
          maxFiles: 50,
          folder: this.FOLDER,
          theme: 'white',
          show_powered_by: false,
          sources: ['local', 'url', 'camera', 'image_search', 'google_drive', 'dropbox', 'instagram', 'facebook', 'cloudinary'],
          google_access_token: null, // Para evitar errores de autenticación
          dropbox_access_token: null, // Para evitar errores de autenticación
          styles: {
            palette: {
              window: '#FFFFFF',
              windowBorder: '#90A0B3',
              tabIcon: '#000000',
              menuIcons: '#000000',
              textDark: '#000000',
              textLight: '#FFFFFF',
              link: '#000000',
              action: '#FF6B6B',
              inactiveTabIcon: '#0E2F5A',
              error: '#F44235',
              inProgress: '#2EB9EC',
              complete: '#20B832',
              sourceIcons: '#0E2F5A'
            },
            fonts: {
              default: null,
              "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif": null
            }
          }
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Error en widget de Cloudinary:', error);
            subject.error(new Error('Error al seleccionar imágenes de Cloudinary'));
            return;
          }

          if (result.event === 'success') {
            // Si es una sola imagen
            const images: CloudinaryImage[] = [this.transformCloudinaryResult(result.info)];
            subject.next(images);
            subject.complete();
          } else if (result.event === 'queues-end') {
            // Si son múltiples imágenes, procesar todas
            const images: CloudinaryImage[] = result.info
              .filter((info: any) => info.info.resource_type === 'image')
              .map((info: any) => this.transformCloudinaryResult(info.info));

            subject.next(images);
            subject.complete();
          } else if (result.event === 'close') {
            subject.complete();
          }
        }
      );
    }).catch((error) => {
      console.error('Error al cargar widget de Cloudinary:', error);
      subject.error(new Error('No se pudo cargar el widget de Cloudinary'));
    });

    return subject.asObservable();
  }

  /**
   * Transforma el resultado del widget de Cloudinary a nuestra interfaz
   */
  private transformCloudinaryResult(result: any): CloudinaryImage {
    return {
      public_id: result.public_id,
      url: result.url,
      secure_url: result.secure_url,
      format: result.format,
      resource_type: result.resource_type,
      created_at: result.created_at,
      bytes: result.bytes,
      width: result.width,
      height: result.height
    };
  }

  /**
   * Carga el widget de Cloudinary dinámicamente
   */
  private loadCloudinaryWidget(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Verificar si el widget ya está cargado
      if ((window as any).cloudinary) {
        resolve();
        return;
      }

      // El script ya está cargado en index.html, solo esperamos
      const checkInterval = setInterval(() => {
        if ((window as any).cloudinary) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout después de 5 segundos
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('Tiempo de espera agotado para cargar Cloudinary widget'));
      }, 5000);
    });
  }

  /**
   * Genera una URL optimizada para una imagen de Cloudinary
   */
  public getOptimizedUrl(publicId: string, options: any = {}): string {
    const defaultOptions = {
      width: 800,
      height: 600,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto'
    };

    const finalOptions = { ...defaultOptions, ...options };
    return this.cloudinary.url(publicId, finalOptions);
  }

  /**
   * Verifica si una URL de Cloudinary es válida
   */
  public async testImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);

      img.src = url;

      // Timeout después de 5 segundos
      setTimeout(() => resolve(false), 5000);
    });
  }

  /**
   * Convierte una URL de Cloudinary a formato seguro si es necesario
   */
  public convertToSecureUrl(url: string): string {
    if (url.includes('http://')) {
      return url.replace('http://', 'https://');
    }
    return url;
  }

  /**
   * Extrae el public_id de una URL de Cloudinary
   */
  public extractPublicIdFromUrl(url: string): string | null {
    // Patrón para extraer public_id de URLs de Cloudinary
    const patterns = [
      /cloudinary\.com\/[^\/]+\/image\/upload\/.*\/([^\/\.]+\.[a-zA-Z]+)/,
      /cloudinary\.com\/[^\/]+\/image\/upload\/([^\/\.]+\.[a-zA-Z]+)/,
      /res\.cloudinary\.com\/[^\/]+\/image\/upload\/.*\/([^\/\.]+\.[a-zA-Z]+)/,
      /res\.cloudinary\.com\/[^\/]+\/image\/upload\/([^\/\.]+\.[a-zA-Z]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1].replace(/\.[a-zA-Z]+$/, ''); // Remover extensión
      }
    }

    return null;
  }
}
