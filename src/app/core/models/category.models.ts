export interface Category {
  id: number;
  nombreCategoria: string;
  estado: boolean;
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
