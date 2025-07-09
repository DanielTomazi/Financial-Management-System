import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, LoginRequest } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title class="auth-title">
            <mat-icon class="auth-icon">account_balance_wallet</mat-icon>
            Login
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form #loginForm="ngForm" (ngSubmit)="onLogin()" class="auth-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Usuário</mat-label>
              <input matInput
                     name="username"
                     [(ngModel)]="credentials.username"
                     required
                     #username="ngModel">
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="username.invalid && username.touched">
                Usuário é obrigatório
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Senha</mat-label>
              <input matInput
                     type="password"
                     name="password"
                     [(ngModel)]="credentials.password"
                     required
                     #password="ngModel">
              <mat-icon matSuffix>lock</mat-icon>
              <mat-error *ngIf="password.invalid && password.touched">
                Senha é obrigatória
              </mat-error>
            </mat-form-field>

            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <div class="auth-actions">
              <button mat-raised-button
                      color="primary"
                      type="submit"
                      [disabled]="loginForm.invalid || loading"
                      class="full-width">
                <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
                <span *ngIf="!loading">Entrar</span>
              </button>
            </div>
          </form>
        </mat-card-content>

        <mat-card-actions class="auth-footer">
          <p>
            Não tem conta?
            <a routerLink="/register" class="auth-link">Registre-se</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      border-radius: 16px;
    }

    .auth-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 1.5rem;
      color: #1976d2;
    }

    .auth-icon {
      font-size: 2rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
    }

    .full-width {
      width: 100%;
    }

    .auth-actions {
      margin-top: 24px;
    }

    .auth-footer {
      text-align: center;
      padding-top: 16px;
    }

    .auth-link {
      color: #1976d2;
      text-decoration: none;
      font-weight: 500;
    }

    .auth-link:hover {
      text-decoration: underline;
    }

    .error-message {
      color: #f44336;
      font-size: 0.875rem;
      margin-top: 8px;
      text-align: center;
    }

    mat-spinner {
      margin-right: 8px;
    }
  `]
})
export class LoginComponent {
  credentials: LoginRequest = {
    username: '',
    password: ''
  };

  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    if (this.loading) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Erro ao fazer login';
      }
    });
  }
}
