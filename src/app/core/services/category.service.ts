import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../models/category.models";
import {
  CreateSubCategoryRequest,
  UpdateSubCategoryRequest,
} from "../models/subcategory.model";
import { environment } from "../../../env/enviroment";
import { subCategory } from "../models/subcategory.model";
import { PaginatedResponse } from "../models/paginated-response.model";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private readonly API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http
      .get<PaginatedResponse<Category> | Category[]>(`${this.API_URL}/category`)
      .pipe(map((response) => this.extractItems<Category>(response)));
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.API_URL}/category/${id}`);
  }

  createCategory(category: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(
      `${this.API_URL}/category/create`,
      category,
    );
  }

  updateCategory(category: UpdateCategoryRequest): Observable<Category> {
    return this.http.patch<Category>(
      `${this.API_URL}/category/update`,
      category,
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/category/${id}`);
  }

  getAllSubcategories(): Observable<subCategory[]> {
    return this.http
      .get<
        PaginatedResponse<subCategory> | subCategory[]
      >(`${this.API_URL}/subcategory`)
      .pipe(map((response) => this.extractItems<subCategory>(response)));
  }

  getSubcategoryById(id: number): Observable<subCategory> {
    return this.http.get<subCategory>(`${this.API_URL}/subcategory/${id}`);
  }

  createSubcategory(
    subcategory: CreateSubCategoryRequest,
  ): Observable<subCategory> {
    return this.http.post<subCategory>(
      `${this.API_URL}/subcategory/create`,
      subcategory,
    );
  }

  updateSubcategory(
    subcategory: UpdateSubCategoryRequest,
  ): Observable<subCategory> {
    return this.http.patch<subCategory>(
      `${this.API_URL}/subcategory/update`,
      subcategory,
    );
  }

  deleteSubcategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/subcategory/${id}`);
  }

  private extractItems<T>(response: PaginatedResponse<T> | T[]): T[] {
    if (Array.isArray(response)) {
      return response;
    }
    return response.items ?? [];
  }
}
