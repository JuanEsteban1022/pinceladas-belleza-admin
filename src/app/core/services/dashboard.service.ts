import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProductService } from './product.service';
import { CategoryService } from './category.service';
import { ProviderService } from './provider.service';
import { MockDataService } from './mock-data.service';
import { environment } from '../../../env/enviroment';

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalProviders: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
  topProducts: TopProduct[];
  monthlySales: { month: string; sales: number }[];
  lowStockProducts: { name: string; stock: number }[];
  productGrowth: number;
  categoryGrowth: number;
  providerGrowth: number;
}

export interface Order {
  id: string;
  customer: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = environment.API_URL;;

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private categoryService: CategoryService,
    private providerService: ProviderService,
    private mockDataService: MockDataService
  ) { }

  getDashboardStats(): Observable<DashboardStats> {
    // Get real data from existing services
    const products$ = this.productService.getAllProducts();
    const categories$ = this.categoryService.getAllCategories();
    const providers$ = this.providerService.getAllProviders();
    const orders$ = this.http.get<any[]>(`${this.API_URL}/pedidos`).pipe(
      catchError(() => this.mockDataService.getMockOrders())
    );
    const monthlySales$ = this.http.get<any[]>(`${this.API_URL}/ventas/mensuales`).pipe(
      catchError(() => this.mockDataService.getMockMonthlySales())
    );

    return forkJoin({
      products: products$,
      categories: categories$,
      providers: providers$,
      orders: orders$,
      monthlySales: monthlySales$
    }).pipe(
      map(({ products, categories, providers, orders, monthlySales }) => {
        return {
          totalProducts: products.length,
          totalCategories: categories.length,
          totalProviders: providers.length,
          totalOrders: orders.length,
          totalRevenue: this.calculateTotalRevenue(orders),
          recentOrders: this.getRecentOrders(orders),
          topProducts: this.getTopProducts(products),
          monthlySales: monthlySales,
          lowStockProducts: this.getLowStockProducts(products),
          productGrowth: this.calculateGrowth(products.length, 12),
          categoryGrowth: this.calculateGrowth(categories.length, 2),
          providerGrowth: this.calculateGrowth(providers.length, 0)
        };
      }),
      catchError(error => {
        console.error('Error loading dashboard data:', error);
        return of(this.getDefaultStats());
      })
    );
  }

  private calculateTotalRevenue(orders: any[]): number {
    return orders.reduce((total, order) => total + (order.total || 0), 0);
  }

  private getRecentOrders(orders: any[]): Order[] {
    return orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(order => ({
        id: order.id || `ORD-${order.id}`,
        customer: order.customer || order.cliente || 'Cliente',
        total: order.total || 0,
        status: order.status || 'Pendiente',
        createdAt: order.createdAt || order.fechaCreacion || new Date().toISOString()
      }));
  }

  private getTopProducts(products: any[]): TopProduct[] {
    // For now, simulate top products with sales data
    // In a real implementation, this would come from the backend
    return products
      .slice(0, 5)
      .map((product, index) => ({
        name: product.nombre,
        sales: Math.floor(Math.random() * 50) + 10,
        revenue: (product.precio || 0) * (Math.floor(Math.random() * 50) + 10),
        category: product.categoria?.nombre || 'Sin categoría'
      }))
      .sort((a, b) => b.sales - a.sales);
  }

  private getLowStockProducts(products: any[]): { name: string; stock: number }[] {
    return products
      .filter(product => (product.cantidadStock || 0) <= 12)
      .map(product => ({
        name: product.nombre,
        stock: product.cantidadStock || 0
      }))
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 10);
  }

  private calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  private getDefaultMonthlySales(): { month: string; sales: number }[] {
    return [
      { month: 'Enero', sales: 2800000 },
      { month: 'Febrero', sales: 3200000 },
      { month: 'Marzo', sales: 2900000 },
      { month: 'Abril', sales: 3500000 },
      { month: 'Mayo', sales: 3100000 },
      { month: 'Junio', sales: 3800000 }
    ];
  }

  private getDefaultStats(): DashboardStats {
    return {
      totalProducts: 0,
      totalCategories: 0,
      totalProviders: 0,
      totalOrders: 0,
      totalRevenue: 0,
      recentOrders: [],
      topProducts: [],
      monthlySales: this.getDefaultMonthlySales(),
      lowStockProducts: [],
      productGrowth: 0,
      categoryGrowth: 0,
      providerGrowth: 0
    };
  }
}
