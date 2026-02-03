import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

interface Order {
  id: string;
  customer: string;
  customerEmail: string;
  total: number;
  status: 'Pendiente' | 'En proceso' | 'Enviado' | 'Entregado' | 'Cancelado';
  createdAt: string;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
}

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = false;
  selectedOrder: Order | null = null;
  displayOrderDialog: boolean = false;
  searchValue: string = '';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    // Datos de ejemplo - luego conectar con API
    setTimeout(() => {
      this.orders = [
        {
          id: 'ORD-001',
          customer: 'María García',
          customerEmail: 'maria.garcia@email.com',
          total: 125000,
          status: 'Entregado',
          createdAt: '2024-01-15T10:30:00',
          items: [
            { id: 1, productName: 'Serum Facial', quantity: 2, unitPrice: 45000, subtotal: 90000 },
            { id: 2, productName: 'Crema Hidratante', quantity: 1, unitPrice: 35000, subtotal: 35000 }
          ],
          shippingAddress: 'Calle 123 #45-67, Bogotá',
          paymentMethod: 'Tarjeta de Crédito'
        },
        {
          id: 'ORD-002',
          customer: 'Ana López',
          customerEmail: 'ana.lopez@email.com',
          total: 85000,
          status: 'En proceso',
          createdAt: '2024-01-16T14:20:00',
          items: [
            { id: 3, productName: 'Mascarilla Facial', quantity: 1, unitPrice: 25000, subtotal: 25000 },
            { id: 4, productName: 'Tónico Facial', quantity: 2, unitPrice: 30000, subtotal: 60000 }
          ],
          shippingAddress: 'Avenida 89 #12-34, Medellín',
          paymentMethod: 'PSE'
        },
        {
          id: 'ORD-003',
          customer: 'Laura Martínez',
          customerEmail: 'lara.martinez@email.com',
          total: 200000,
          status: 'Pendiente',
          createdAt: '2024-01-17T09:15:00',
          items: [
            { id: 5, productName: 'Kit Completo de Skincare', quantity: 1, unitPrice: 200000, subtotal: 200000 }
          ],
          shippingAddress: 'Carrera 45 #78-90, Cali',
          paymentMethod: 'Contraentrega'
        }
      ];
      this.loading = false;
    }, 1000);
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.displayOrderDialog = true;
  }

  updateOrderStatus(order: Order, newStatus: Order['status']): void {
    const oldStatus = order.status;
    order.status = newStatus;

    this.messageService.add({
      severity: 'success',
      summary: 'Estado Actualizado',
      detail: `El pedido ${order.id} ha sido actualizado a ${newStatus}`
    });

    // Aquí se haría la llamada a la API para actualizar el estado
    console.log(`Order ${order.id} status updated from ${oldStatus} to ${newStatus}`);
  }

  getStatusSeverity(status: Order['status']): string {
    switch (status) {
      case 'Pendiente': return 'warning';
      case 'En proceso': return 'info';
      case 'Enviado': return 'secondary';
      case 'Entregado': return 'success';
      case 'Cancelado': return 'danger';
      default: return 'info';
    }
  }

  getStatusMenuItems(order: Order): any[] {
    const statuses: Order['status'][] = ['Pendiente', 'En proceso', 'Enviado', 'Entregado', 'Cancelado'];

    return statuses
      .filter(status => status !== order.status)
      .map(status => ({
        label: status,
        icon: 'pi pi-refresh',
        command: () => this.updateOrderStatus(order, status)
      }));
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
