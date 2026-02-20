import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Product } from "../../../core/models/product.models";
import { ProductService } from "../../../core/services/product.service";
import { CategoryService } from "../../../core/services/category.service";
import { ProviderService } from "../../../core/services/provider.service";
import { Category } from "../../../core/models/category.models";
import { Provider } from "../../../core/models/provider.models";
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  providers: Provider[] = [];
  loading: boolean = false;
  searchValue: string = "";

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private providerService: ProviderService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadProviders();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error("Error loading products:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron cargar los productos",
        });
        this.loading = false;
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
      },
      error: (error: any) => {
        console.error("Error loading categories:", error);
      },
    });
  }

  loadProviders(): void {
    this.providerService.getAllProviders().subscribe({
      next: (data: Provider[]) => {
        this.providers = data;
      },
      error: (error: any) => {
        console.error("Error loading providers:", error);
      },
    });
  }

  createProduct(): void {
    this.router.navigate(["/products/new"]);
  }

  editProduct(product: Product): void {
    this.router.navigate(["/products/edit", product.id]);
  }

  viewProduct(product: Product): void {
    this.router.navigate(["/products", product.id]);
  }

  deleteProduct(product: Product): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar el producto "${product.nombre}"?`,
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.productService.deleteProduct(product.id).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: "success",
              summary: "Éxito",
              detail: response || "Producto eliminado correctamente",
            });
            this.loadProducts();
          },
          error: (error: any) => {
            console.error("Error deleting product:", error);
            console.error("Error status:", error.status);
            console.error("Error message:", error.message);
            console.error("Error details:", error.error);
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "No se pudo eliminar el producto",
            });
          },
        });
      },
    });
  }

  getCategoryName(categoryId?: number): string {
    if (!categoryId) return "N/A";
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.nombreCategoria : "N/A";
  }

  getProviderName(providerId?: number): string {
    if (!providerId) return "N/A";
    const provider = this.providers.find((p) => p.id === providerId);
    return provider ? provider.nombre : "N/A";
  }

  getStockSeverity(stock: number): string {
    if (stock <= 5) return "danger";
    if (stock <= 20) return "warning";
    return "success";
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  }

  refreshData(): void {
    this.loadProducts();
  }
}
