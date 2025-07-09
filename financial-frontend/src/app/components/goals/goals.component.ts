import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FinancialService, Goal, Category } from '../../services/financial.service';

@Component({
  selector: 'app-goal-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>{{ goal.id ? 'edit' : 'add' }}</mat-icon>
      {{ goal.id ? 'Editar' : 'Nova' }} Meta
    </h2>

    <mat-dialog-content>
      <form #goalForm="ngForm" class="goal-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome da Meta</mat-label>
          <input matInput [(ngModel)]="goal.name" name="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descrição</mat-label>
          <textarea matInput [(ngModel)]="goal.description" name="description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo de Meta</mat-label>
          <mat-select [(ngModel)]="goal.type" name="type" required>
            <mat-option value="SAVINGS">Poupança</mat-option>
            <mat-option value="EXPENSE_LIMIT">Limite de Gastos</mat-option>
            <mat-option value="DEBT_PAYMENT">Pagamento de Dívida</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Valor da Meta</mat-label>
          <input matInput type="number" [(ngModel)]="goal.targetAmount" name="targetAmount" required min="0.01" step="0.01">
          <span matPrefix>R$&nbsp;</span>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Data de Início</mat-label>
          <input matInput [matDatepicker]="startPicker" [(ngModel)]="startDate" name="startDate" required>
          <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
          <mat-datepicker #startPicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Data Limite</mat-label>
          <input matInput [matDatepicker]="targetPicker" [(ngModel)]="targetDate" name="targetDate" required>
          <mat-datepicker-toggle matSuffix [for]="targetPicker"></mat-datepicker-toggle>
          <mat-datepicker #targetPicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Categoria (Opcional)</mat-label>
          <mat-select [(ngModel)]="selectedCategoryId" name="category">
            <mat-option value="">Nenhuma</mat-option>
            <mat-option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div class="toggle-field">
          <mat-slide-toggle [(ngModel)]="goal.emailAlerts" name="emailAlerts">
            Receber alertas por e-mail
          </mat-slide-toggle>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary"
              [disabled]="!goalForm.valid"
              (click)="save()">
        Salvar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .goal-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
    }

    .full-width {
      width: 100%;
    }

    .toggle-field {
      margin: 16px 0;
    }
  `]
})
export class GoalDialogComponent implements OnInit {
  goal: Goal = {
    name: '',
    description: '',
    targetAmount: 0,
    currentAmount: 0,
    type: 'SAVINGS',
    status: 'ACTIVE',
    startDate: new Date().toISOString(),
    targetDate: new Date().toISOString(),
    emailAlerts: true
  };

  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  startDate: Date = new Date();
  targetDate: Date = new Date();

  constructor(
    private financialService: FinancialService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.financialService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    });
  }

  save() {
    if (this.selectedCategoryId) {
      const selectedCategory = this.categories.find(cat => cat.id === this.selectedCategoryId);
      if (selectedCategory) {
        this.goal.category = selectedCategory;
      }
    }

    this.goal.startDate = this.startDate.toISOString();
    this.goal.targetDate = this.targetDate.toISOString();

    const operation = this.goal.id
      ? this.financialService.updateGoal(this.goal.id, this.goal)
      : this.financialService.createGoal(this.goal);

    operation.subscribe({
      next: (result) => {
        this.snackBar.open('Meta salva com sucesso!', 'OK', { duration: 3000 });
        // Emit event or use dialog ref to close and refresh
      },
      error: (error) => {
        console.error('Erro ao salvar meta:', error);
        this.snackBar.open('Erro ao salvar meta', 'OK', { duration: 3000 });
      }
    });
  }
}

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="goals-container">
      <div class="goals-header">
        <h1><mat-icon>track_changes</mat-icon> Metas Financeiras</h1>
        <button mat-raised-button color="primary" (click)="openGoalDialog()">
          <mat-icon>add</mat-icon>
          Nova Meta
        </button>
      </div>

      <div class="goals-grid">
        <mat-card *ngFor="let goal of goals" class="goal-card"
                  [class.completed]="goal.status === 'COMPLETED'"
                  [class.overdue]="isOverdue(goal)">
          <mat-card-header>
            <div mat-card-avatar class="goal-avatar">
              <mat-icon>{{ getGoalIcon(goal.type) }}</mat-icon>
            </div>
            <mat-card-title>{{ goal.name }}</mat-card-title>
            <mat-card-subtitle>{{ goal.description }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="goal-progress">
              <div class="progress-info">
                <span class="current-amount">
                  {{ goal.currentAmount | currency:'BRL':'symbol':'1.2-2' }}
                </span>
                <span class="target-amount">
                  / {{ goal.targetAmount | currency:'BRL':'symbol':'1.2-2' }}
                </span>
              </div>
              <mat-progress-bar
                [value]="getProgressPercentage(goal)"
                [color]="getProgressColor(goal)">
              </mat-progress-bar>
              <div class="progress-percentage">
                {{ getProgressPercentage(goal) }}% concluído
              </div>
            </div>

            <div class="goal-details">
              <div class="goal-type">
                <mat-chip [color]="getTypeColor(goal.type)">
                  {{ getTypeLabel(goal.type) }}
                </mat-chip>
              </div>
              <div class="goal-dates">
                <div class="date-item">
                  <mat-icon>event</mat-icon>
                  <span>{{ goal.targetDate | date:'dd/MM/yyyy' }}</span>
                </div>
                <div class="date-item" *ngIf="goal.emailAlerts">
                  <mat-icon>notifications</mat-icon>
                  <span>Alertas ativos</span>
                </div>
              </div>
            </div>

            <div class="goal-status">
              <mat-chip [color]="getStatusColor(goal.status)">
                {{ getStatusLabel(goal.status) }}
              </mat-chip>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button (click)="editGoal(goal)">
              <mat-icon>edit</mat-icon>
              Editar
            </button>
            <button mat-button color="warn" (click)="deleteGoal(goal)">
              <mat-icon>delete</mat-icon>
              Excluir
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div *ngIf="goals.length === 0" class="no-data">
        <mat-icon>track_changes</mat-icon>
        <p>Nenhuma meta encontrada</p>
        <button mat-raised-button color="primary" (click)="openGoalDialog()">
          Criar primeira meta
        </button>
      </div>
    </div>
  `,
  styles: [`
    .goals-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .goals-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .goals-header h1 {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #1976d2;
      margin: 0;
    }

    .goals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
    }

    .goal-card {
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;
      overflow: hidden;
    }

    .goal-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .goal-card.completed {
      border-left: 4px solid #4caf50;
    }

    .goal-card.overdue {
      border-left: 4px solid #f44336;
    }

    .goal-avatar {
      background: #e3f2fd;
      color: #1976d2;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .goal-progress {
      margin: 16px 0;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .current-amount {
      font-weight: 600;
      color: #1976d2;
    }

    .target-amount {
      color: #666;
    }

    .progress-percentage {
      text-align: center;
      margin-top: 8px;
      font-size: 0.9rem;
      color: #666;
    }

    .goal-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 16px 0;
    }

    .goal-dates {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .date-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 0.9rem;
    }

    .date-item mat-icon {
      font-size: 1.2rem;
    }

    .goal-status {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 4rem;
      margin-bottom: 20px;
      opacity: 0.5;
    }

    .no-data p {
      font-size: 1.1rem;
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .goals-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .goals-grid {
        grid-template-columns: 1fr;
      }

      .goals-container {
        padding: 16px;
      }
    }
  `]
})
export class GoalsComponent implements OnInit {
  goals: Goal[] = [];

  constructor(
    private financialService: FinancialService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadGoals();
  }

  loadGoals() {
    this.financialService.getGoals().subscribe({
      next: (goals) => {
        this.goals = goals;
      },
      error: (error) => {
        console.error('Erro ao carregar metas:', error);
        this.snackBar.open('Erro ao carregar metas', 'OK', { duration: 3000 });
      }
    });
  }

  openGoalDialog(goal?: Goal) {
    const dialogRef = this.dialog.open(GoalDialogComponent, {
      width: '500px',
      data: goal || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGoals();
      }
    });
  }

  editGoal(goal: Goal) {
    this.openGoalDialog(goal);
  }

  deleteGoal(goal: Goal) {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      this.financialService.deleteGoal(goal.id!).subscribe({
        next: () => {
          this.snackBar.open('Meta excluída com sucesso!', 'OK', { duration: 3000 });
          this.loadGoals();
        },
        error: (error) => {
          console.error('Erro ao excluir meta:', error);
          this.snackBar.open('Erro ao excluir meta', 'OK', { duration: 3000 });
        }
      });
    }
  }

  getProgressPercentage(goal: Goal): number {
    if (goal.targetAmount === 0) return 0;
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  }

  getProgressColor(goal: Goal): string {
    const percentage = this.getProgressPercentage(goal);
    if (percentage >= 90) return 'primary';
    if (percentage >= 50) return 'accent';
    return 'warn';
  }

  getGoalIcon(type: string): string {
    switch (type) {
      case 'SAVINGS': return 'savings';
      case 'EXPENSE_LIMIT': return 'trending_down';
      case 'DEBT_PAYMENT': return 'payment';
      default: return 'track_changes';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'SAVINGS': return 'Poupança';
      case 'EXPENSE_LIMIT': return 'Limite de Gastos';
      case 'DEBT_PAYMENT': return 'Pagamento de Dívida';
      default: return type;
    }
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'SAVINGS': return 'primary';
      case 'EXPENSE_LIMIT': return 'warn';
      case 'DEBT_PAYMENT': return 'accent';
      default: return 'primary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'Ativa';
      case 'COMPLETED': return 'Concluída';
      case 'CANCELLED': return 'Cancelada';
      case 'PAUSED': return 'Pausada';
      default: return status;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'primary';
      case 'COMPLETED': return 'primary';
      case 'CANCELLED': return 'warn';
      case 'PAUSED': return 'accent';
      default: return 'primary';
    }
  }

  isOverdue(goal: Goal): boolean {
    const now = new Date();
    const targetDate = new Date(goal.targetDate);
    return now > targetDate && goal.status === 'ACTIVE';
  }
}
