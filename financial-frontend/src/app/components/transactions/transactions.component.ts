import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FinancialService, Transaction, Category } from '../../services/financial.service';

@Component({
  selector: 'app-transaction-dialog',
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
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>{{ transaction.id ? 'edit' : 'add' }}</mat-icon>
      {{ transaction.id ? 'Editar' : 'Nova' }} Transação
    </h2>

    <mat-dialog-content>
      <form #transactionForm="ngForm" class="transaction-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descrição</mat-label>
          <input matInput [(ngModel)]="transaction.description" name="description" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Valor</mat-label>
          <input matInput type="number" [(ngModel)]="transaction.amount" name="amount" required min="0.01" step="0.01">
          <span matPrefix>R$&nbsp;</span>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo</mat-label>
          <mat-select [(ngModel)]="transaction.type" name="type" required (selectionChange)="onTypeChange()">
            <mat-option value="INCOME">Receita</mat-option>
            <mat-option value="EXPENSE">Despesa</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Categoria</mat-label>
          <mat-select [(ngModel)]="selectedCategoryId" name="category" required>
            <mat-option *ngFor="let category of filteredCategories" [value]="category.id">
              {{ category.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Data</mat-label>
          <input matInput [matDatepicker]="picker" [(ngModel)]="transactionDate" name="date" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Observações</mat-label>
          <textarea matInput [(ngModel)]="transaction.notes" name="notes" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary"
              [disabled]="!transactionForm.valid"
              (click)="save()">
        Salvar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .transaction-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
    }

    .full-width {
      width: 100%;
    }
  `]
})
export class TransactionDialogComponent implements OnInit {
  transaction: Transaction = {
    description: '',
    amount: 0,
    type: 'EXPENSE',
    transactionDate: new Date().toISOString(),
    notes: '',
    category: { id: 0, name: '', type: 'EXPENSE', color: '', icon: '' }
  };

  categories: Category[] = [];
  filteredCategories: Category[] = [];
  selectedCategoryId: number = 0;
  transactionDate: Date = new Date();

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
        this.filterCategories();
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    });
  }

  onTypeChange() {
    this.filterCategories();
    this.selectedCategoryId = 0;
  }

  filterCategories() {
    this.filteredCategories = this.categories.filter(cat => cat.type === this.transaction.type);
  }

  save() {
    if (!this.selectedCategoryId) {
      this.snackBar.open('Selecione uma categoria', 'OK', { duration: 3000 });
      return;
    }

    const selectedCategory = this.categories.find(cat => cat.id === this.selectedCategoryId);
    if (!selectedCategory) return;

    this.transaction.category = selectedCategory;
    this.transaction.transactionDate = this.transactionDate.toISOString();

    const operation = this.transaction.id
      ? this.financialService.updateTransaction(this.transaction.id, this.transaction)
      : this.financialService.createTransaction(this.transaction);

    operation.subscribe({
      next: (result) => {
        this.snackBar.open('Transação salva com sucesso!', 'OK', { duration: 3000 });
        // Emit event or use dialog ref to close and refresh
      },
      error: (error) => {
        console.error('Erro ao salvar transação:', error);
        this.snackBar.open('Erro ao salvar transação', 'OK', { duration: 3000 });
      }
    });
  }
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="transactions-container">
      <div class="transactions-header">
        <h1><mat-icon>account_balance_wallet</mat-icon> Transações</h1>
        <button mat-raised-button color="primary" (click)="openTransactionDialog()">
          <mat-icon>add</mat-icon>
          Nova Transação
        </button>
      </div>

      <mat-card class="transactions-card">
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="transactions" class="transactions-table">
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
                  <div class="transaction-desc">
                    <strong>{{ transaction.description }}</strong>
                    <small *ngIf="transaction.notes">{{ transaction.notes }}</small>
                  </div>
                </td>
              </ng-container>

              <!-- Category Column -->
              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef>Categoria</th>
                <td mat-cell *matCellDef="let transaction">
                  <mat-chip [style.background-color]="transaction.category.color"
                           [style.color]="getTextColor(transaction.category.color)">
                    {{ transaction.category.name }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Amount Column -->
              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef>Valor</th>
                <td mat-cell *matCellDef="let transaction">
                  <span [class]="transaction.type === 'INCOME' ? 'income-amount' : 'expense-amount'">
                    {{ transaction.type === 'INCOME' ? '+' : '-' }}
                    {{ transaction.amount | currency:'BRL':'symbol':'1.2-2' }}
                  </span>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Ações</th>
                <td mat-cell *matCellDef="let transaction">
                  <button mat-icon-button (click)="editTransaction(transaction)"
                          matTooltip="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteTransaction(transaction)"
                          matTooltip="Excluir">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div *ngIf="transactions.length === 0" class="no-data">
              <mat-icon>info</mat-icon>
              <p>Nenhuma transação encontrada</p>
              <button mat-raised-button color="primary" (click)="openTransactionDialog()">
                Criar primeira transação
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .transactions-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .transactions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .transactions-header h1 {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #1976d2;
      margin: 0;
    }

    .transactions-card {
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .table-container {
      overflow-x: auto;
    }

    .transactions-table {
      width: 100%;
      background: white;
    }

    .transaction-desc strong {
      display: block;
      margin-bottom: 4px;
    }

    .transaction-desc small {
      color: #666;
      font-size: 0.8rem;
    }

    .income-amount {
      color: #4caf50;
      font-weight: 600;
    }

    .expense-amount {
      color: #f44336;
      font-weight: 600;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
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
      .transactions-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .transactions-container {
        padding: 16px;
      }
    }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  displayedColumns: string[] = ['date', 'description', 'category', 'amount', 'actions'];

  constructor(
    private financialService: FinancialService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.financialService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
      },
      error: (error) => {
        console.error('Erro ao carregar transações:', error);
        this.snackBar.open('Erro ao carregar transações', 'OK', { duration: 3000 });
      }
    });
  }

  openTransactionDialog(transaction?: Transaction) {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '500px',
      data: transaction || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
      }
    });
  }

  editTransaction(transaction: Transaction) {
    this.openTransactionDialog(transaction);
  }

  deleteTransaction(transaction: Transaction) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      this.financialService.deleteTransaction(transaction.id!).subscribe({
        next: () => {
          this.snackBar.open('Transação excluída com sucesso!', 'OK', { duration: 3000 });
          this.loadTransactions();
        },
        error: (error) => {
          console.error('Erro ao excluir transação:', error);
          this.snackBar.open('Erro ao excluir transação', 'OK', { duration: 3000 });
        }
      });
    }
  }

  getTextColor(backgroundColor: string): string {
    // Simple function to determine text color based on background
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? '#000000' : '#ffffff';
  }
}
