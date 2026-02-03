import { Component, OnInit } from '@angular/core';

interface Order {
  id: string;
  customer: string;
  total: number;
  status: string;
  createdAt: string;
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  category: string;
}

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalProviders: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
  topProducts: TopProduct[];
  monthlySales: { month: string; sales: number }[];
  lowStockProducts: { name: string; stock: number }[];
}

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
    lowStockProducts: []
  };

  loading: boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Simular carga de datos
    setTimeout(() => {
      this.stats = {
        totalProducts: 150,
        totalCategories: 12,
        totalProviders: 8,
        totalOrders: 245,
        totalRevenue: 12500000,
        recentOrders: [
          { id: 'ORD-001', customer: 'María García', total: 125000, status: 'Entregado', createdAt: '2024-01-15' },
          { id: 'ORD-002', customer: 'Ana López', total: 85000, status: 'En proceso', createdAt: '2024-01-15' },
          { id: 'ORD-003', customer: 'Laura Martínez', total: 200000, status: 'Pendiente', createdAt: '2024-01-14' },
          { id: 'ORD-004', customer: 'Carolina Rodríguez', total: 95000, status: 'Entregado', createdAt: '2024-01-14' },
          { id: 'ORD-005', customer: 'Sofía Hernández', total: 175000, status: 'Enviado', createdAt: '2024-01-13' }
        ],
        topProducts: [
          { name: 'Serum Facial Vitamina C', sales: 45, revenue: 2250000, category: 'Facial' },
          { name: 'Crema Hidratante', sales: 38, revenue: 1140000, category: 'Facial' },
          { name: 'Mascarilla Detox', sales: 32, revenue: 960000, category: 'Tratamiento' },
          { name: 'Tónico Facial', sales: 28, revenue: 560000, category: 'Facial' },
          { name: 'Contorno de Ojos', sales: 25, revenue: 1250000, category: 'Ojos' }
        ],
        monthlySales: [
          { month: 'Enero', sales: 2800000 },
          { month: 'Febrero', sales: 3200000 },
          { month: 'Marzo', sales: 2900000 },
          { month: 'Abril', sales: 3500000 },
          { month: 'Mayo', sales: 3100000 },
          { month: 'Junio', sales: 3800000 }
        ],
        lowStockProducts: [
          { name: 'Serum Facial Vitamina C', stock: 5 },
          { name: 'Mascarilla Detox', stock: 8 },
          { name: 'Tónico Facial', stock: 12 }
        ]
      };
      this.loading = false;
    }, 1000);
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

  refreshData(): void {
    this.loadDashboardData();
  }
}