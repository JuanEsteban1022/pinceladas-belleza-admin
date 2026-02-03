import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../../core/models/category.models';
import { CategoryService } from '../../../core/services/category.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  loading: boolean = false;
  searchValue: string = '';

  constructor(
    private categoryService: CategoryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las categorías'
        });
        this.loading = false;
      }
    });
  }

  createCategory(): void {
    this.router.navigate(['/categories/new']);
  }

  editCategory(category: Category): void {
    this.router.navigate(['/categories/edit', category.id]);
  }

  viewCategory(category: Category): void {
    this.router.navigate(['/categories', category.id]);
  }

  deleteCategory(category: Category): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar la categoría "${category.nombreCategoria}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoryService.deleteCategory(category.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Categoría eliminada correctamente'
            });
            this.loadCategories();
          },
          error: (error: any) => {
            console.error('Error deleting category:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la categoría'
            });
          }
        });
      }
    });
  }

  toggleCategoryStatus(category: Category): void {
    const updatedCategory = {
      id: category.id,
      nombreCategoria: category.nombreCategoria,
      estado: !category.estado
    };

    this.categoryService.updateCategory(updatedCategory).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Categoría ${updatedCategory.estado ? 'activada' : 'desactivada'} correctamente`
        });
        this.loadCategories();
      },
      error: (error: any) => {
        console.error('Error updating category:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el estado de la categoría'
        });
      }
    });
  }

  refreshData(): void {
    this.loadCategories();
  }
}
