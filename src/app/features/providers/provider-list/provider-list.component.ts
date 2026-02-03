import { Component, OnInit } from '@angular/core';
import { Provider } from '../../../core/models/provider.models';
import { ProviderService } from '../../../core/services/provider.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss']
})
export class ProviderListComponent implements OnInit {
  providers: Provider[] = [];
  loading: boolean = false;
  searchValue: string = '';

  constructor(
    private providerService: ProviderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadProviders();
  }

  loadProviders(): void {
    this.loading = true;
    this.providerService.getAllProviders().subscribe({
      next: (data) => {
        this.providers = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading providers:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los proveedores'
        });
        this.loading = false;
      }
    });
  }

  deleteProvider(provider: Provider): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar el proveedor "${provider.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.providerService.deleteProvider(provider.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Proveedor eliminado correctamente'
            });
            this.loadProviders();
          },
          error: (error) => {
            console.error('Error deleting provider:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el proveedor'
            });
          }
        });
      }
    });
  }
}
