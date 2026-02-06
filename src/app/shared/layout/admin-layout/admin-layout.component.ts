import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ToastModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  providers: [MessageService]
})
export class AdminLayoutComponent {
  sidebarVisible = false;
  currentRoute = '';

  menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/dashboard'
    },
    {
      label: 'Productos',
      icon: 'pi pi-box',
      routerLink: '/products'
    },
    {
      label: 'Categorías',
      icon: 'pi pi-sitemap',
      routerLink: '/categories'
    },
    {
      label: 'Proveedores',
      icon: 'pi pi-users',
      routerLink: '/providers'
    },
    {
      label: 'Pedidos',
      icon: 'pi pi-shopping-cart',
      routerLink: '/orders'
    }
  ];

  userName = sessionStorage.getItem('user');

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  onToggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onSidebarClose() {
    this.sidebarVisible = false;
  }

  onLogout() {
    this.authService.logout();
    this.messageService.add({
      severity: 'success',
      summary: 'Sesión cerrada',
      detail: 'Has cerrado sesión exitosamente'
    });
    this.router.navigate(['/auth/login']);
  }
}