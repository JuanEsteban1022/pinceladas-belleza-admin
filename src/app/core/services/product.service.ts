import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, CreateProductRequest, UpdateProductRequest } from '../models/product.models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/productos`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/productos/${id}`);
  }

  createProduct(product: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(`${this.API_URL}/productos/create`, product);
  }

  updateProduct(product: UpdateProductRequest): Observable<Product> {
    return this.http.patch<Product>(`${this.API_URL}/productos/update`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/productos/${id}`);
  }
}
