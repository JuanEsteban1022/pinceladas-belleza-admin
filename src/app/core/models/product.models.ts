import { Category } from "./category.models";
import { Provider } from "./provider.models";

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidadStock: number;
  categoriaId?: number;
  proveedorId?: number;
  urlDrive?: string;
  categoria?: Category;
  proveedor?: Provider;
}

export interface CreateProductRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  cantidadStock: number;
  categoriaId: number;
  proveedorId: number;
  urlDrive?: string;
}

export interface UpdateProductRequest {
  id: number;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  cantidadStock?: number;
  categoriaId?: number;
  proveedorId?: number;
  urlDrive?: string;
}
