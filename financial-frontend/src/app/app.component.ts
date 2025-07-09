import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <div class="app-container">
      <!-- Header -->
      <mat-toolbar color="primary" class="app-header">
        <button mat-icon-button (click)="drawer.toggle()" *ngIf="authService.isAuthenticated()">
          <mat-icon>menu</mat-icon>
        </button>

        <span class="app-title">Gestão Financeira</span>

        <span class="spacer"></span>

        <div *ngIf="authService.isAuthenticated()" class="user-menu">
          <button mat-button [matMenuTriggerFor]="userMenu">
            <mat-icon>person</mat-icon>
            {{ authService.getCurrentUser()?.fullName }}
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item (click)="logout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Sair</span>
            </button>
          </mat-menu>
        </div>
      </mat-toolbar>

      <!-- Sidebar -->
      <mat-sidenav-container class="app-sidenav-container" *ngIf="authService.isAuthenticated()">
        <mat-sidenav #drawer class="app-sidenav" mode="side" opened>
          <mat-nav-list>
            <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
              <mat-icon>dashboard</mat-icon>
              <span>Dashboard</span>
            </a>
            <a mat-list-item routerLink="/transactions" routerLinkActive="active">
              <mat-icon>account_balance_wallet</mat-icon>
              <span>Transações</span>
            </a>
            <a mat-list-item routerLink="/categories" routerLinkActive="active">
              <mat-icon>category</mat-icon>
              <span>Categorias</span>
            </a>
            <a mat-list-item routerLink="/goals" routerLinkActive="active">
              <mat-icon>track_changes</mat-icon>
              <span>Metas</span>
            </a>
            <a mat-list-item routerLink="/reports" routerLinkActive="active">
              <mat-icon>assessment</mat-icon>
              <span>Relatórios</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="app-content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>

      <!-- Content for non-authenticated users -->
      <div class="auth-container" *ngIf="!authService.isAuthenticated()">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .app-title {
      font-size: 1.2rem;
      font-weight: 500;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-menu {
      display: flex;
      align-items: center;
    }

    .app-sidenav-container {
      flex: 1;
    }

    .app-sidenav {
      width: 240px;
    }

    .app-content {
      padding: 20px;
      background-color: #f5f5f5;
    }

    .auth-container {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .active {
      background-color: rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 768px) {
      .app-sidenav {
        width: 200px;
      }

      .app-content {
        padding: 16px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'financial-frontend';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
