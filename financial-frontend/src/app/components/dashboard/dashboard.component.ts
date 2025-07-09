import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { FinancialService, DashboardData, Transaction } from '../../services/financial.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1><mat-icon>dashboard</mat-icon> Dashboard Financeiro</h1>
        <p>Visão geral das suas finanças</p>
      </div>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Carregando dados...</p>
      </div>

      <div *ngIf="!loading && dashboardData" class="dashboard-content">
        <div class="stats-grid">
          <mat-card class="stat-card income-card">
            <mat-card-content>
              <div class="stat-icon">
                <mat-icon>trending_up</mat-icon>
              </div>
              <div class="stat-details">
                <h3>{{ dashboardData.totalIncome | currency:'BRL':'symbol':'1.2-2' }}</h3>
                <p>Receita Total</p>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card expense-card">
            <mat-card-content>
              <div class="stat-icon">
                <mat-icon>trending_down</mat-icon>
              </div>
              <div class="stat-details">
                <h3>{{ dashboardData.totalExpense | currency:'BRL':'symbol':'1.2-2' }}</h3>
                <p>Despesas Total</p>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card balance-card">
            <mat-card-content>
              <div class="stat-icon">
                <mat-icon>account_balance</mat-icon>
              </div>
              <div class="stat-details">
                <h3 [class.negative]="dashboardData.balance < 0">
                  {{ dashboardData.balance | currency:'BRL':'symbol':'1.2-2' }}
                </h3>
                <p>Saldo</p>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card goals-card">
            <mat-card-content>
              <div class="stat-icon">
                <mat-icon>track_changes</mat-icon>
              </div>
              <div class="stat-details">
                <h3>{{ dashboardData.activeGoalsCount }}</h3>
                <p>Metas Ativas</p>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="dashboard-grid">
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>pie_chart</mat-icon>
                Receitas vs Despesas (Mês Atual)
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <canvas #chartCanvas></canvas>
            </mat-card-content>
          </mat-card>

          <mat-card class="transactions-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>history</mat-icon>
                Transações Recentes
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="transactions-list">
                <div *ngFor="let transaction of dashboardData.recentTransactions"
                     class="transaction-item">
                  <div class="transaction-info">
                    <div class="transaction-description">
                      {{ transaction.description }}
                    </div>
                    <div class="transaction-date">
                      {{ transaction.transactionDate | date:'dd/MM/yyyy' }}
                    </div>
                  </div>
                  <div class="transaction-amount">
                    <mat-chip [class]="transaction.type === 'INCOME' ? 'income-chip' : 'expense-chip'">
                      {{ transaction.type === 'INCOME' ? '+' : '-' }}
                      {{ transaction.amount | currency:'BRL':'symbol':'1.2-2' }}
                    </mat-chip>
                  </div>
                </div>
                <div *ngIf="dashboardData.recentTransactions.length === 0"
                     class="no-transactions">
                  <mat-icon>info</mat-icon>
                  <p>Nenhuma transação encontrada</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .dashboard-header h1 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      color: #1976d2;
      margin-bottom: 8px;
    }

    .dashboard-header p {
      color: #666;
      font-size: 1.1rem;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      gap: 20px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
    }

    .stat-icon mat-icon {
      font-size: 2rem;
      color: white;
    }

    .stat-details h3 {
      font-size: 1.8rem;
      margin: 0 0 8px 0;
      color: white;
    }

    .stat-details p {
      font-size: 0.9rem;
      margin: 0;
      color: rgba(255, 255, 255, 0.8);
    }

    .income-card {
      background: linear-gradient(135deg, #4caf50, #388e3c);
    }

    .expense-card {
      background: linear-gradient(135deg, #f44336, #d32f2f);
    }

    .balance-card {
      background: linear-gradient(135deg, #2196f3, #1976d2);
    }

    .goals-card {
      background: linear-gradient(135deg, #ff9800, #f57c00);
    }

    .negative {
      color: #f44336 !important;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .chart-card, .transactions-card {
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .chart-card mat-card-header,
    .transactions-card mat-card-header {
      background: #f8f9fa;
      border-radius: 16px 16px 0 0;
    }

    .chart-card mat-card-title,
    .transactions-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #1976d2;
    }

    .transactions-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .transaction-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .transaction-item:last-child {
      border-bottom: none;
    }

    .transaction-info {
      flex: 1;
    }

    .transaction-description {
      font-weight: 500;
      color: #333;
    }

    .transaction-date {
      font-size: 0.85rem;
      color: #666;
      margin-top: 4px;
    }

    .transaction-amount {
      flex-shrink: 0;
    }

    .income-chip {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .expense-chip {
      background: #ffebee;
      color: #c62828;
    }

    .no-transactions {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #666;
    }

    .no-transactions mat-icon {
      font-size: 3rem;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
      }

      .dashboard-container {
        padding: 16px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardData | null = null;
  loading = true;

  constructor(private financialService: FinancialService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.loading = true;
    this.financialService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
        this.createChart();
      },
      error: (error) => {
        console.error('Erro ao carregar dashboard:', error);
        this.loading = false;
      }
    });
  }

  private createChart() {
    if (!this.dashboardData) return;

    const canvas = document.querySelector('#chartCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'doughnut' as ChartType,
      data: {
        labels: ['Receitas', 'Despesas'],
        datasets: [{
          data: [this.dashboardData.monthlyIncome, this.dashboardData.monthlyExpense],
          backgroundColor: ['#4caf50', '#f44336'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    };

    new Chart(ctx, config);
  }
}
