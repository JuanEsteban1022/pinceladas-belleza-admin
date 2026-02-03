import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Provider, CreateProviderRequest, UpdateProviderRequest } from '../../../core/models/provider.models';
import { ProviderService } from '../../../core/services/provider.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-provider-form',
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.scss']
})
export class ProviderFormComponent implements OnInit {
  providerForm: FormGroup;
  isEdit: boolean = false;
  providerId: number | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private providerService: ProviderService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.providerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      contacto: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.providerId = +id;
      this.loadProvider(this.providerId);
    }
  }

  loadProvider(id: number): void {
    this.loading = true;
    this.providerService.getProviderById(id).subscribe({
      next: (provider: Provider) => {
        this.providerForm.patchValue({
          nombre: provider.nombre,
          contacto: provider.contacto
        });
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading provider:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el proveedor'
        });
        this.loading = false;
      }
    });
  }

  saveProvider(): void {
    if (this.providerForm.invalid) {
      return;
    }

    this.loading = true;
    const providerData = this.providerForm.value;

    if (this.isEdit && this.providerId) {
      const updateRequest: UpdateProviderRequest = {
        id: this.providerId,
        ...providerData
      };

      this.providerService.updateProvider(updateRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Proveedor actualizado correctamente'
          });
          this.router.navigate(['/providers']);
        },
        error: (error: any) => {
          console.error('Error updating provider:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el proveedor'
          });
          this.loading = false;
        }
      });
    } else {
      const createRequest: CreateProviderRequest = providerData;

      this.providerService.createProvider(createRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Proveedor creado correctamente'
          });
          this.router.navigate(['/providers']);
        },
        error: (error: any) => {
          console.error('Error creating provider:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el proveedor'
          });
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/providers']);
  }
}
