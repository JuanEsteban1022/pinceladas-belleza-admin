import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from "../models/product.models";
import { environment } from "../../../env/enviroment";
import { PaginatedResponse } from "../models/paginated-response.model";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private readonly API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http
      .get<PaginatedResponse<Product> | Product[]>(`${this.API_URL}/productos`)
      .pipe(map((response) => this.extractItems<Product>(response)));
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/productos/${id}`);
  }

  createProduct(product: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(`${this.API_URL}/productos/create`, product);
  }

  updateProduct(product: UpdateProductRequest): Observable<Product> {
    return this.http.patch<Product>(
      `${this.API_URL}/productos/update`,
      product,
    );
  }

  deleteProduct(id: number): Observable<string> {
    return this.http.delete(`${this.API_URL}/productos/${id}`, {
      responseType: "text",
    });
  }

  private extractItems<T>(response: PaginatedResponse<T> | T[]): T[] {
    if (Array.isArray(response)) {
      return response;
    }
    return response.items ?? [];
  }
}
