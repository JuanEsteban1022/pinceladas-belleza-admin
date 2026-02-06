import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryFormComponent,
    CategoryDetailComponent
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    SharedModule
  ]
})
export class CategoriesModule { }
