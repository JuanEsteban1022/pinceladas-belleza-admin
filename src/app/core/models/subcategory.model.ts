export interface subCategory {
  id: number;
  nombreSubcategoria: string;
  estado: number | boolean;
}

export interface CreateSubCategoryRequest {
  nombreSubcategoria: string;
  estado: boolean;
}

export interface UpdateSubCategoryRequest {
  id: number;
  nombreSubcategoria?: string;
  estado?: boolean;
}
