import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  constructor() { }

  getMockOrders(): Observable<any[]> {
    const mockOrders = [
      { id: 'ORD-001', customer: 'María García', total: 125000, status: 'Entregado', createdAt: '2024-01-15' },
      { id: 'ORD-002', customer: 'Ana López', total: 85000, status: 'En proceso', createdAt: '2024-01-15' },
      { id: 'ORD-003', customer: 'Laura Martínez', total: 200000, status: 'Pendiente', createdAt: '2024-01-14' },
      { id: 'ORD-004', customer: 'Carolina Rodríguez', total: 95000, status: 'Entregado', createdAt: '2024-01-14' },
      { id: 'ORD-005', customer: 'Sofía Hernández', total: 175000, status: 'Enviado', createdAt: '2024-01-13' },
      { id: 'ORD-006', customer: 'Valentina Díaz', total: 145000, status: 'Entregado', createdAt: '2024-01-13' },
      { id: 'ORD-007', customer: 'Isabella Torres', total: 110000, status: 'En proceso', createdAt: '2024-01-12' },
      { id: 'ORD-008', customer: 'Camila Ruiz', total: 185000, status: 'Entregado', createdAt: '2024-01-12' }
    ];
    return of(mockOrders).pipe(delay(500));
  }

  getMockMonthlySales(): Observable<any[]> {
    const mockSales = [
      { month: 'Enero', sales: 2800000 },
      { month: 'Febrero', sales: 3200000 },
      { month: 'Marzo', sales: 2900000 },
      { month: 'Abril', sales: 3500000 },
      { month: 'Mayo', sales: 3100000 },
      { month: 'Junio', sales: 3800000 }
    ];
    return of(mockSales).pipe(delay(300));
  }
}
