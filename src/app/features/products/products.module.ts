import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductFormComponent,
    ProductDetailComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule
  ]
})
export class ProductsModule { }
