package org.example.dto;

import org.example.entity.Transaction;

import java.math.BigDecimal;
import java.util.List;

public class MonthlyReportDto {
    private int year;
    private int month;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private List<Transaction> transactions;
    private List<CategorySummaryDto> incomeByCategory;
    private List<CategorySummaryDto> expenseByCategory;

    public MonthlyReportDto() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private MonthlyReportDto dto = new MonthlyReportDto();

        public Builder year(int year) {
            dto.year = year;
            return this;
        }

        public Builder month(int month) {
            dto.month = month;
            return this;
        }

        public Builder totalIncome(BigDecimal totalIncome) {
            dto.totalIncome = totalIncome;
            return this;
        }

        public Builder totalExpense(BigDecimal totalExpense) {
            dto.totalExpense = totalExpense;
            return this;
        }

        public Builder balance(BigDecimal balance) {
            dto.balance = balance;
            return this;
        }

        public Builder transactions(List<Transaction> transactions) {
            dto.transactions = transactions;
            return this;
        }

        public Builder incomeByCategory(List<CategorySummaryDto> incomeByCategory) {
            dto.incomeByCategory = incomeByCategory;
            return this;
        }

        public Builder expenseByCategory(List<CategorySummaryDto> expenseByCategory) {
            dto.expenseByCategory = expenseByCategory;
            return this;
        }

        public MonthlyReportDto build() {
            return dto;
        }
    }

    // Getters and Setters
    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public int getMonth() { return month; }
    public void setMonth(int month) { this.month = month; }

    public BigDecimal getTotalIncome() { return totalIncome; }
    public void setTotalIncome(BigDecimal totalIncome) { this.totalIncome = totalIncome; }

    public BigDecimal getTotalExpense() { return totalExpense; }
    public void setTotalExpense(BigDecimal totalExpense) { this.totalExpense = totalExpense; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public List<Transaction> getTransactions() { return transactions; }
    public void setTransactions(List<Transaction> transactions) { this.transactions = transactions; }

    public List<CategorySummaryDto> getIncomeByCategory() { return incomeByCategory; }
    public void setIncomeByCategory(List<CategorySummaryDto> incomeByCategory) { this.incomeByCategory = incomeByCategory; }

    public List<CategorySummaryDto> getExpenseByCategory() { return expenseByCategory; }
    public void setExpenseByCategory(List<CategorySummaryDto> expenseByCategory) { this.expenseByCategory = expenseByCategory; }
}
