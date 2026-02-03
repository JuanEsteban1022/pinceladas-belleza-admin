export interface Provider {
  id: number;
  nombre: string;
  contacto: string;
}

export interface CreateProviderRequest {
  nombre: string;
  contacto: string;
}

export interface UpdateProviderRequest {
  id: number;
  nombre?: string;
  contacto?: string;
}
