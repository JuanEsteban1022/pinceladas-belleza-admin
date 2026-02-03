import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, CreateProductRequest, UpdateProductRequest } from '../../../core/models/product.models';
import { Category } from '../../../core/models/category.models';
import { Provider } from '../../../core/models/provider.models';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { ProviderService } from '../../../core/services/provider.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEdit: boolean = false;
  loading: boolean = false;
  productId: number | null = null;

  categories: Category[] = [];
  providers: Provider[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private providerService: ProviderService,
    private messageService: MessageService
  ) {
    this.productForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      cantidadStock: [0, [Validators.required, Validators.min(0)]],
      categoriaId: [null, [Validators.required]],
      proveedorId: [null, [Validators.required]],
      urlDrive: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProviders();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.productId = +id;
      this.loadProduct(this.productId);
    }
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data.filter(cat => cat.estado); // Solo categorías activas
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las categorías'
        });
      }
    });
  }

  loadProviders(): void {
    this.providerService.getAllProviders().subscribe({
      next: (data: Provider[]) => {
        this.providers = data;
      },
      error: (error: any) => {
        console.error('Error loading providers:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los proveedores'
        });
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product: Product) => {
        this.productForm.patchValue({
          nombre: product.nombre,
          descripcion: product.descripcion,
          precio: product.precio,
          cantidadStock: product.cantidadStock,
          categoriaId: product.categoriaId,
          proveedorId: product.proveedorId,
          urlDrive: product.urlDrive || ''
        });
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading product:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el producto'
        });
        this.loading = false;
      }
    });
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const productData = this.productForm.value;

    if (this.isEdit && this.productId) {
      const updateRequest: UpdateProductRequest = {
        id: this.productId,
        ...productData
      };

      this.productService.updateProduct(updateRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Producto actualizado correctamente'
          });
          this.loading = false;
          this.router.navigate(['/products']);
        },
        error: (error: any) => {
          console.error('Error updating product:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el producto'
          });
          this.loading = false;
        }
      });
    } else {
      const createRequest: CreateProductRequest = productData;

      this.productService.createProduct(createRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Producto creado correctamente'
          });
          this.loading = false;
          this.router.navigate(['/products']);
        },
        error: (error: any) => {
          console.error('Error creating product:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el producto'
          });
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholder-product.png';
  }

  // Getters para validaciones en el template
  get nombre() { return this.productForm.get('nombre'); }
  get descripcion() { return this.productForm.get('descripcion'); }
  get precio() { return this.productForm.get('precio'); }
  get cantidadStock() { return this.productForm.get('cantidadStock'); }
  get categoriaId() { return this.productForm.get('categoriaId'); }
  get proveedorId() { return this.productForm.get('proveedorId'); }
  get urlDrive() { return this.productForm.get('urlDrive'); }
}
