import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../../core/models/category.models';
import { CategoryService } from '../../../core/services/category.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEdit: boolean = false;
  categoryId: number | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.categoryForm = this.fb.group({
      nombreCategoria: ['', [Validators.required, Validators.minLength(3)]],
      estado: [true, [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.categoryId = +id;
      this.loadCategory(this.categoryId);
    }
  }

  loadCategory(id: number): void {
    this.loading = true;
    this.categoryService.getCategoryById(id).subscribe({
      next: (category: Category) => {
        this.categoryForm.patchValue({
          nombreCategoria: category.nombreCategoria,
          estado: category.estado
        });
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading category:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la categoría'
        });
        this.loading = false;
      }
    });
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    this.loading = true;
    const categoryData = this.categoryForm.value;

    if (this.isEdit && this.categoryId) {
      const updateRequest: UpdateCategoryRequest = {
        id: this.categoryId,
        ...categoryData
      };

      this.categoryService.updateCategory(updateRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Categoría actualizada correctamente'
          });
          this.router.navigate(['/categories']);
        },
        error: (error: any) => {
          console.error('Error updating category:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la categoría'
          });
          this.loading = false;
        }
      });
    } else {
      const createRequest: CreateCategoryRequest = categoryData;

      this.categoryService.createCategory(createRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Categoría creada correctamente'
          });
          this.router.navigate(['/categories']);
        },
        error: (error: any) => {
          console.error('Error creating category:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear la categoría'
          });
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }
}
