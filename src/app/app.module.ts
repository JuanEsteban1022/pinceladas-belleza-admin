import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core.module';
import { SharedModule } from './shared.module';
import { AuthModule } from './features/auth/auth.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { ProvidersModule } from './features/providers/providers.module';
import { CategoriesModule } from './features/categories/categories.module';
import { ProductsModule } from './features/products/products.module';
import { OrdersModule } from './features/orders/orders.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    AuthModule,
    DashboardModule,
    ProvidersModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
