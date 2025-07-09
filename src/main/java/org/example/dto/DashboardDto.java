package org.example.dto;

import org.example.entity.Transaction;

import java.math.BigDecimal;
import java.util.List;

public class DashboardDto {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpense;
    private List<Transaction> recentTransactions;
    private int activeGoalsCount;

    // Constructor
    public DashboardDto() {}

    // Builder pattern para melhor legibilidade
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private DashboardDto dto = new DashboardDto();

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

        public Builder monthlyIncome(BigDecimal monthlyIncome) {
            dto.monthlyIncome = monthlyIncome;
            return this;
        }

        public Builder monthlyExpense(BigDecimal monthlyExpense) {
            dto.monthlyExpense = monthlyExpense;
            return this;
        }

        public Builder recentTransactions(List<Transaction> recentTransactions) {
            dto.recentTransactions = recentTransactions;
            return this;
        }

        public Builder activeGoalsCount(int activeGoalsCount) {
            dto.activeGoalsCount = activeGoalsCount;
            return this;
        }

        public DashboardDto build() {
            return dto;
        }
    }

    // Getters and Setters
    public BigDecimal getTotalIncome() { return totalIncome; }
    public void setTotalIncome(BigDecimal totalIncome) { this.totalIncome = totalIncome; }

    public BigDecimal getTotalExpense() { return totalExpense; }
    public void setTotalExpense(BigDecimal totalExpense) { this.totalExpense = totalExpense; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public BigDecimal getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; }

    public BigDecimal getMonthlyExpense() { return monthlyExpense; }
    public void setMonthlyExpense(BigDecimal monthlyExpense) { this.monthlyExpense = monthlyExpense; }

    public List<Transaction> getRecentTransactions() { return recentTransactions; }
    public void setRecentTransactions(List<Transaction> recentTransactions) { this.recentTransactions = recentTransactions; }

    public int getActiveGoalsCount() { return activeGoalsCount; }
    public void setActiveGoalsCount(int activeGoalsCount) { this.activeGoalsCount = activeGoalsCount; }
}
