import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardStats } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalProducts: 0,
    totalCategories: 0,
    totalProviders: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: [],
    monthlySales: [],
    lowStockProducts: [],
    productGrowth: 0,
    categoryGrowth: 0,
    providerGrowth: 0
  };

  loading: boolean = true;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
      }
    });
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'Entregado': return 'success';
      case 'En proceso': return 'info';
      case 'Enviado': return 'warning';
      case 'Pendiente': return 'danger';
      default: return 'info';
    }
  }

  getStockSeverity(stock: number): string {
    if (stock <= 5) return 'danger';
    if (stock <= 10) return 'warning';
    return 'success';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  abs(value: number): number {
    return Math.abs(value);
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}