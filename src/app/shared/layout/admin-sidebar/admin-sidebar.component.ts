import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent {
  @Input() visible = true;
  @Output() closeSidebar = new EventEmitter<void>();

  constructor(private router: Router) { }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }
}