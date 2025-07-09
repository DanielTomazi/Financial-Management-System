import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { FinancialService } from '../../services/financial.service';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatChipsModule
  ],
  template: `
    <div class="reports-container">
      <div class="reports-header">
        <h1><mat-icon>assessment</mat-icon> Relatórios Financeiros</h1>
        <div class="report-filters">
          <mat-form-field appearance="outline">
            <mat-label>Mês</mat-label>
            <mat-select [(ngModel)]="selectedMonth" (selectionChange)="loadReport()">
              <mat-option *ngFor="let month of months; let i = index" [value]="i + 1">
                {{ month }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Ano</mat-label>
            <mat-select [(ngModel)]="selectedYear" (selectionChange)="loadReport()">
              <mat-option *ngFor="let year of years" [value]="year">
                {{ year }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </div>

      <div *ngIf="reportData" class="reports-content">
        <!-- Resumo Mensal -->
        <div class="summary-grid">
          <mat-card class="summary-card income-summary">
            <mat-card-content>
              <div class="summary-icon">
                <mat-icon>trending_up</mat-icon>
              </div>
              <div class="summary-details">
                <h3>{{ reportData.totalIncome | currency:'BRL':'symbol':'1.2-2' }}</h3>
                <p>Receitas do Mês</p>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="summary-card expense-summary">
            <mat-card-content>
              <div class="summary-icon">
                <mat-icon>trending_down</mat-icon>
              </div>
              <div class="summary-details">
                <h3>{{ reportData.totalExpense | currency:'BRL':'symbol':'1.2-2' }}</h3>
                <p>Despesas do Mês</p>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="summary-card balance-summary">
            <mat-card-content>
              <div class="summary-icon">
                <mat-icon>account_balance</mat-icon>
              </div>
              <div class="summary-details">
                <h3 [class.negative]="reportData.balance < 0">
                  {{ reportData.balance | currency:'BRL':'symbol':'1.2-2' }}
                </h3>
                <p>Saldo do Mês</p>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Gráficos -->
        <div class="charts-grid">
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>pie_chart</mat-icon>
                Receitas por Categoria
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <canvas #incomeChart width="400" height="300"></canvas>
            </mat-card-content>
          </mat-card>

          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>donut_large</mat-icon>
                Despesas por Categoria
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <canvas #expenseChart width="400" height="300"></canvas>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Tabela de Transações -->
        <mat-card class="transactions-report-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>list</mat-icon>
              Transações do Período
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="table-container">
              <table mat-table [dataSource]="reportData.transactions" class="report-table">
                <!-- Data Column -->
                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef>Data</th>
                  <td mat-cell *matCellDef="let transaction">
                    {{ transaction.transactionDate | date:'dd/MM/yyyy' }}
                  </td>
                </ng-container>

                <!-- Description Column -->
                <ng-container matColumnDef="description">
                  <th mat-header-cell *matHeaderCellDef>Descrição</th>
                  <td mat-cell *matCellDef="let transaction">
                    {{ transaction.description }}
                  </td>
                </ng-container>

                <!-- Category Column -->
                <ng-container matColumnDef="category">
                  <th mat-header-cell *matHeaderCellDef>Categoria</th>
                  <td mat-cell *matCellDef="let transaction">
                    <mat-chip [style.background-color]="transaction.category.color">
                      {{ transaction.category.name }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Type Column -->
                <ng-container matColumnDef="type">
                  <th mat-header-cell *matHeaderCellDef>Tipo</th>
                  <td mat-cell *matCellDef="let transaction">
                    <mat-chip [class]="transaction.type === 'INCOME' ? 'income-chip' : 'expense-chip'">
                      {{ transaction.type === 'INCOME' ? 'Receita' : 'Despesa' }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Amount Column -->
                <ng-container matColumnDef="amount">
                  <th mat-header-cell *matHeaderCellDef>Valor</th>
                  <td mat-cell *matCellDef="let transaction">
                    <span [class]="transaction.type === 'INCOME' ? 'income-amount' : 'expense-amount'">
                      {{ transaction.amount | currency:'BRL':'symbol':'1.2-2' }}
                    </span>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>

              <div *ngIf="reportData.transactions.length === 0" class="no-transactions">
                <mat-icon>info</mat-icon>
                <p>Nenhuma transação encontrada para este período</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Análise por Categoria -->
        <div class="category-analysis">
          <mat-card class="category-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>trending_up</mat-icon>
                Receitas por Categoria
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="category-list">
                <div *ngFor="let item of reportData.incomeByCategory" class="category-item">
                  <span class="category-name">{{ item.categoryName }}</span>
                  <span class="category-amount income-amount">
                    {{ item.amount | currency:'BRL':'symbol':'1.2-2' }}
                  </span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="category-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>trending_down</mat-icon>
                Despesas por Categoria
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="category-list">
                <div *ngFor="let item of reportData.expenseByCategory" class="category-item">
                  <span class="category-name">{{ item.categoryName }}</span>
                  <span class="category-amount expense-amount">
                    {{ item.amount | currency:'BRL':'symbol':'1.2-2' }}
                  </span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <div *ngIf="!reportData" class="no-data">
        <mat-icon>assessment</mat-icon>
        <p>Selecione um período para visualizar o relatório</p>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .reports-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 20px;
    }

    .reports-header h1 {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #1976d2;
      margin: 0;
    }

    .report-filters {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .summary-card {
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .summary-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px;
    }

    .summary-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
    }

    .summary-icon mat-icon {
      font-size: 2rem;
      color: white;
    }

    .summary-details h3 {
      font-size: 1.8rem;
      margin: 0 0 8px 0;
      color: white;
    }

    .summary-details p {
      font-size: 0.9rem;
      margin: 0;
      color: rgba(255, 255, 255, 0.8);
    }

    .income-summary {
      background: linear-gradient(135deg, #4caf50, #388e3c);
    }

    .expense-summary {
      background: linear-gradient(135deg, #f44336, #d32f2f);
    }

    .balance-summary {
      background: linear-gradient(135deg, #2196f3, #1976d2);
    }

    .negative {
      color: #f44336 !important;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 32px;
    }

    .chart-card {
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .chart-card mat-card-header {
      background: #f8f9fa;
      border-radius: 16px 16px 0 0;
    }

    .chart-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #1976d2;
    }

    .transactions-report-card {
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 32px;
    }

    .transactions-report-card mat-card-header {
      background: #f8f9fa;
      border-radius: 16px 16px 0 0;
    }

    .transactions-report-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #1976d2;
    }

    .table-container {
      overflow-x: auto;
    }

    .report-table {
      width: 100%;
      background: white;
    }

    .income-amount {
      color: #4caf50;
      font-weight: 600;
    }

    .expense-amount {
      color: #f44336;
      font-weight: 600;
    }

    .income-chip {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .expense-chip {
      background: #ffebee;
      color: #c62828;
    }

    .category-analysis {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .category-card {
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .category-card mat-card-header {
      background: #f8f9fa;
      border-radius: 16px 16px 0 0;
    }

    .category-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #1976d2;
    }

    .category-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .category-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .category-item:last-child {
      border-bottom: none;
    }

    .category-name {
      font-weight: 500;
    }

    .no-data, .no-transactions {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-data mat-icon, .no-transactions mat-icon {
      font-size: 4rem;
      margin-bottom: 20px;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .reports-header {
        flex-direction: column;
        align-items: stretch;
      }

      .report-filters {
        justify-content: center;
      }

      .charts-grid {
        grid-template-columns: 1fr;
      }

      .category-analysis {
        grid-template-columns: 1fr;
      }

      .summary-grid {
        grid-template-columns: 1fr;
      }

      .reports-container {
        padding: 16px;
      }
    }
  `]
})
export class ReportsComponent implements OnInit {
  reportData: any = null;
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  displayedColumns: string[] = ['date', 'description', 'category', 'type', 'amount'];

  months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  years = [2020, 2021, 2022, 2023, 2024, 2025];

  constructor(private financialService: FinancialService) {}

  ngOnInit() {
    this.loadReport();
  }

  loadReport() {
    this.financialService.getMonthlyReport(this.selectedYear, this.selectedMonth).subscribe({
      next: (data) => {
        this.reportData = data;
        setTimeout(() => {
          this.createCharts();
        }, 100);
      },
      error: (error) => {
        console.error('Erro ao carregar relatório:', error);
      }
    });
  }

  private createCharts() {
    this.createIncomeChart();
    this.createExpenseChart();
  }

  private createIncomeChart() {
    const canvas = document.querySelector('#incomeChart') as HTMLCanvasElement;
    if (!canvas || !this.reportData?.incomeByCategory) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const labels = this.reportData.incomeByCategory.map((item: any) => item.categoryName);
    const data = this.reportData.incomeByCategory.map((item: any) => item.amount);

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b',
            '#ffc107', '#ff9800', '#ff5722', '#f44336'
          ]
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
    });
  }

  private createExpenseChart() {
    const canvas = document.querySelector('#expenseChart') as HTMLCanvasElement;
    if (!canvas || !this.reportData?.expenseByCategory) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const labels = this.reportData.expenseByCategory.map((item: any) => item.categoryName);
    const data = this.reportData.expenseByCategory.map((item: any) => item.amount);

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            '#f44336', '#e91e63', '#9c27b0', '#673ab7',
            '#3f51b5', '#2196f3', '#00bcd4', '#009688'
          ]
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
    });
  }
}
