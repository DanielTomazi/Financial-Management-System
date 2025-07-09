import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  id?: number;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  transactionDate: string;
  notes?: string;
  category: Category;
  createdAt?: string;
}

export interface Category {
  id?: number;
  name: string;
  description?: string;
  type: 'INCOME' | 'EXPENSE';
  color: string;
  icon: string;
  active?: boolean;
}

export interface Goal {
  id?: number;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  type: 'SAVINGS' | 'EXPENSE_LIMIT' | 'DEBT_PAYMENT';
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PAUSED';
  startDate: string;
  targetDate: string;
  emailAlerts: boolean;
  category?: Category;
}

export interface DashboardData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  recentTransactions: Transaction[];
  activeGoalsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class FinancialService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Transactions
  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`);
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/transactions`, transaction);
  }

  updateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/transactions/${id}`, transaction);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/transactions/${id}`);
  }

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/transactions/dashboard`);
  }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getCategoriesByType(type: 'INCOME' | 'EXPENSE'): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/type/${type}`);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, category);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`);
  }

  // Goals
  getGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/goals`);
  }

  getGoalsByStatus(status: string): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/goals/status/${status}`);
  }

  createGoal(goal: Goal): Observable<Goal> {
    return this.http.post<Goal>(`${this.apiUrl}/goals`, goal);
  }

  updateGoal(id: number, goal: Goal): Observable<Goal> {
    return this.http.put<Goal>(`${this.apiUrl}/goals/${id}`, goal);
  }

  deleteGoal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/goals/${id}`);
  }

  // Reports
  getMonthlyReport(year: number, month: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/transactions/report/monthly?year=${year}&month=${month}`);
  }
}
