import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { SharedModule } from '../../shared.module';
import { SubcategoriesListComponent } from './subcategories-list/subcategories-list.component';
import { SubcategoriesFormComponent } from './subcategories-form/subcategories-form.component';

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryFormComponent,
    CategoryDetailComponent,
    SubcategoriesListComponent,
    SubcategoriesFormComponent
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    SharedModule
  ]
})
export class CategoriesModule { }
