import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provider, CreateProviderRequest, UpdateProviderRequest } from '../models/provider.models';
import { environment } from '../../../env/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private readonly API_URL = environment.API_URL;;

  constructor(private http: HttpClient) { }

  getAllProviders(): Observable<Provider[]> {
    return this.http.get<Provider[]>(`${this.API_URL}/proveedor`);
  }

  getProviderById(id: number): Observable<Provider> {
    return this.http.get<Provider>(`${this.API_URL}/proveedor/${id}`);
  }

  createProvider(provider: CreateProviderRequest): Observable<Provider> {
    return this.http.post<Provider>(`${this.API_URL}/proveedor/create`, provider);
  }

  updateProvider(provider: UpdateProviderRequest): Observable<Provider> {
    return this.http.patch<Provider>(`${this.API_URL}/proveedor/update`, provider);
  }

  deleteProvider(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/proveedor/${id}`);
  }
}
