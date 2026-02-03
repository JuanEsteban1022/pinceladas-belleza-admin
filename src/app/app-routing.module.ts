import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'providers',
    loadChildren: () => import('./features/providers/providers.module').then(m => m.ProvidersModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./features/categories/categories.module').then(m => m.CategoriesModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./features/orders/orders.module').then(m => m.OrdersModule)
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }