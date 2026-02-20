import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CategoryService } from "../../../core/services/category.service";
import { Category } from "../../../core/models/category.models";
import {
  subCategory,
  CreateSubCategoryRequest,
  UpdateSubCategoryRequest,
} from "../../../core/models/subcategory.model";
import { MessageService } from "primeng/api";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-subcategories-form",
  templateUrl: "./subcategories-form.component.html",
  styleUrls: ["./subcategories-form.component.scss"],
})
export class SubcategoriesFormComponent implements OnInit {
  subcategoryForm: FormGroup;
  loading = false;
  isEdit = false;
  subcategoryId: number | null = null;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) {
    this.subcategoryForm = this.fb.group({
      nombreSubcategoria: ["", [Validators.required, Validators.minLength(3)]],
      estado: [true, [Validators.required]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.isEdit = true;
      this.subcategoryId = +id;
      this.loadSubcategory(this.subcategoryId);
    }
  }

  loadSubcategory(id: number): void {
    this.loading = true;
    this.categoryService.getSubcategoryById(id).subscribe({
      next: (subcategory: subCategory) => {
        this.subcategoryForm.patchValue({
          nombreSubcategoria: subcategory.nombreSubcategoria,
          estado: !!subcategory.estado,
        });
        this.loading = false;
      },
      error: (error: any) => {
        console.error("Error loading category:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "No se pudo cargar la categoría",
        });
        this.loading = false;
      },
    });
  }

  saveSubcategory(): void {
    if (this.subcategoryForm.invalid) {
      return;
    }

    this.loading = true;
    const subcategoryData = this.subcategoryForm.value;

    if (this.isEdit && this.subcategoryId) {
      const updateRequest: UpdateSubCategoryRequest = {
        id: this.subcategoryId,
        ...subcategoryData,
      };

      this.categoryService.updateSubcategory(updateRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Éxito",
            detail: "Subcategoría actualizada correctamente",
          });
          this.router.navigate(["/categories"]);
        },
        error: (error: any) => {
          console.error("Error updating subcategory:", error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "No se pudo actualizar la subcategoría",
          });
          this.loading = false;
        },
      });
    } else {
      const createRequest: CreateSubCategoryRequest = subcategoryData;

      this.categoryService.createSubcategory(createRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Éxito",
            detail: "Subcategoría creada correctamente",
          });
          this.router.navigate(["/categories"]);
        },
        error: (error: any) => {
          console.error("Error creating subcategory:", error);
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "No se pudo crear la subcategoría",
          });
          this.loading = false;
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(["/categories"]);
  }
}
