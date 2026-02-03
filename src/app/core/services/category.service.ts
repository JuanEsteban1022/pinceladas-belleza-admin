import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../models/category.models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly API_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/category`);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.API_URL}/category/${id}`);
  }

  createCategory(category: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(`${this.API_URL}/category/create`, category);
  }

  updateCategory(category: UpdateCategoryRequest): Observable<Category> {
    return this.http.patch<Category>(`${this.API_URL}/category/update`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/category/${id}`);
  }
}
