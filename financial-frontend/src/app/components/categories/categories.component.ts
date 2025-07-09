import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FinancialService, Category } from '../../services/financial.service';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>{{ category.id ? 'edit' : 'add' }}</mat-icon>
      {{ category.id ? 'Editar' : 'Nova' }} Categoria
    </h2>

    <mat-dialog-content>
      <form #categoryForm="ngForm" class="category-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome</mat-label>
          <input matInput [(ngModel)]="category.name" name="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descrição</mat-label>
          <textarea matInput [(ngModel)]="category.description" name="description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo</mat-label>
          <mat-select [(ngModel)]="category.type" name="type" required>
            <mat-option value="INCOME">Receita</mat-option>
            <mat-option value="EXPENSE">Despesa</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="color-section">
          <label>Cor da Categoria</label>
          <div class="color-grid">
            <div *ngFor="let color of colors"
                 class="color-option"
                 [class.selected]="category.color === color"
                 [style.background-color]="color"
                 (click)="category.color = color">
            </div>
          </div>
        </div>

        <div class="icon-section">
          <label>Ícone</label>
          <div class="icon-grid">
            <div *ngFor="let icon of icons"
                 class="icon-option"
                 [class.selected]="category.icon === icon"
                 (click)="category.icon = icon">
              <mat-icon>{{ icon }}</mat-icon>
            </div>
          </div>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary"
              [disabled]="!categoryForm.valid"
              (click)="save()">
        Salvar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .category-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
    }

    .full-width {
      width: 100%;
    }

    .color-section, .icon-section {
      margin: 16px 0;
    }

    .color-section label, .icon-section label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #555;
    }

    .color-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 8px;
    }

    .color-option {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s;
    }

    .color-option:hover {
      transform: scale(1.1);
    }

    .color-option.selected {
      border-color: #1976d2;
      transform: scale(1.2);
    }

    .icon-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 8px;
    }

    .icon-option {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #ddd;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .icon-option:hover {
      border-color: #1976d2;
      background: #f0f8ff;
    }

    .icon-option.selected {
      border-color: #1976d2;
      background: #1976d2;
      color: white;
    }
  `]
})
export class CategoryDialogComponent implements OnInit {
  category: Category = {
    name: '',
    description: '',
    type: 'EXPENSE',
    color: '#1976d2',
    icon: 'category'
  };

  colors = [
    '#1976d2', '#f44336', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4',
    '#795548', '#607d8b', '#e91e63', '#3f51b5', '#009688', '#ff5722',
    '#ffc107', '#8bc34a', '#2196f3', '#673ab7', '#cddc39', '#ffeb3b'
  ];

  icons = [
    'category', 'restaurant', 'directions_car', 'home', 'work', 'shopping_cart',
    'local_gas_station', 'medical_services', 'school', 'fitness_center',
    'movie', 'music_note', 'sports_esports', 'flight', 'hotel', 'phone',
    'wifi', 'pets', 'child_care', 'elderly', 'savings', 'account_balance',
    'credit_card', 'payment', 'receipt', 'shopping_bag', 'local_grocery_store',
    'fastfood', 'local_cafe', 'local_bar', 'local_pizza', 'cake'
  ];

  constructor(
    private financialService: FinancialService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Initialize with default values if needed
  }

  save() {
    const operation = this.category.id
      ? this.financialService.updateCategory(this.category.id, this.category)
      : this.financialService.createCategory(this.category);

    operation.subscribe({
      next: (result) => {
        this.snackBar.open('Categoria salva com sucesso!', 'OK', { duration: 3000 });
        // Emit event or use dialog ref to close and refresh
      },
      error: (error) => {
        console.error('Erro ao salvar categoria:', error);
        this.snackBar.open('Erro ao salvar categoria', 'OK', { duration: 3000 });
      }
    });
  }
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatSnackBarModule
  ],
  template: `
    <div class="categories-container">
      <div class="categories-header">
        <h1><mat-icon>category</mat-icon> Categorias</h1>
        <button mat-raised-button color="primary" (click)="openCategoryDialog()">
          <mat-icon>add</mat-icon>
          Nova Categoria
        </button>
      </div>

      <div class="categories-sections">
        <!-- Income Categories -->
        <div class="category-section">
          <h2><mat-icon>trending_up</mat-icon> Receitas</h2>
          <div class="categories-grid">
            <mat-card *ngFor="let category of incomeCategories"
                      class="category-card"
                      [style.border-left]="'4px solid ' + category.color">
              <mat-card-content>
                <div class="category-icon" [style.color]="category.color">
                  <mat-icon>{{ category.icon }}</mat-icon>
                </div>
                <div class="category-info">
                  <h3>{{ category.name }}</h3>
                  <p *ngIf="category.description">{{ category.description }}</p>
                </div>
              </mat-card-content>
              <mat-card-actions>
                <button mat-icon-button (click)="editCategory(category)" matTooltip="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteCategory(category)" matTooltip="Excluir">
                  <mat-icon>delete</mat-icon>
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </div>

        <!-- Expense Categories -->
        <div class="category-section">
          <h2><mat-icon>trending_down</mat-icon> Despesas</h2>
          <div class="categories-grid">
            <mat-card *ngFor="let category of expenseCategories"
                      class="category-card"
                      [style.border-left]="'4px solid ' + category.color">
              <mat-card-content>
                <div class="category-icon" [style.color]="category.color">
                  <mat-icon>{{ category.icon }}</mat-icon>
                </div>
                <div class="category-info">
                  <h3>{{ category.name }}</h3>
                  <p *ngIf="category.description">{{ category.description }}</p>
                </div>
              </mat-card-content>
              <mat-card-actions>
                <button mat-icon-button (click)="editCategory(category)" matTooltip="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteCategory(category)" matTooltip="Excluir">
                  <mat-icon>delete</mat-icon>
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </div>
      </div>

      <div *ngIf="categories.length === 0" class="no-data">
        <mat-icon>info</mat-icon>
        <p>Nenhuma categoria encontrada</p>
        <button mat-raised-button color="primary" (click)="openCategoryDialog()">
          Criar primeira categoria
        </button>
      </div>
    </div>
  `,
  styles: [`
    .categories-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .categories-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .categories-header h1 {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #1976d2;
      margin: 0;
    }

    .categories-sections {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .category-section h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #333;
      margin-bottom: 16px;
      font-size: 1.3rem;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .category-card {
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.2s;
    }

    .category-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .category-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
    }

    .category-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.05);
    }

    .category-icon mat-icon {
      font-size: 24px;
    }

    .category-info {
      flex: 1;
    }

    .category-info h3 {
      margin: 0 0 4px 0;
      color: #333;
      font-size: 1.1rem;
    }

    .category-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .category-card mat-card-actions {
      padding: 8px 16px;
      border-top: 1px solid #f0f0f0;
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
      .categories-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .categories-grid {
        grid-template-columns: 1fr;
      }

      .categories-container {
        padding: 16px;
      }
    }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  incomeCategories: Category[] = [];
  expenseCategories: Category[] = [];

  constructor(
    private financialService: FinancialService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.financialService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.incomeCategories = categories.filter(cat => cat.type === 'INCOME');
        this.expenseCategories = categories.filter(cat => cat.type === 'EXPENSE');
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
        this.snackBar.open('Erro ao carregar categorias', 'OK', { duration: 3000 });
      }
    });
  }

  openCategoryDialog(category?: Category) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '500px',
      data: category || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  editCategory(category: Category) {
    this.openCategoryDialog(category);
  }

  deleteCategory(category: Category) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      this.financialService.deleteCategory(category.id!).subscribe({
        next: () => {
          this.snackBar.open('Categoria excluída com sucesso!', 'OK', { duration: 3000 });
          this.loadCategories();
        },
        error: (error) => {
          console.error('Erro ao excluir categoria:', error);
          this.snackBar.open('Erro ao excluir categoria', 'OK', { duration: 3000 });
        }
      });
    }
  }
}
