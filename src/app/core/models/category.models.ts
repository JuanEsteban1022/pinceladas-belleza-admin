export interface Category {
  id: number;
  nombreCategoria: string;
  estado: number | boolean;
}

export interface CreateCategoryRequest {
  nombreCategoria: string;
  estado: boolean;
}

export interface UpdateCategoryRequest {
  id: number;
  nombreCategoria?: string;
  estado?: boolean;
}
