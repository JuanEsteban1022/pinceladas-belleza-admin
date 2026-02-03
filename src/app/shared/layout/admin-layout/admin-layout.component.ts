import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  sidebarVisible = true;
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

  onToggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onSidebarClose() {
    this.sidebarVisible = false;
  }
}