package org.example.service;

import org.example.dto.DashboardDto;
import org.example.dto.MonthlyReportDto;
import org.example.dto.CategorySummaryDto;
import org.example.entity.Transaction;
import org.example.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private GoalService goalService;

    public DashboardDto getDashboardData(User user) {
        BigDecimal totalIncome = transactionService.getTotalIncomeByUser(user);
        BigDecimal totalExpense = transactionService.getTotalExpenseByUser(user);
        BigDecimal balance = totalIncome.subtract(totalExpense);

        // Dados do mês atual
        LocalDateTime startOfMonth = LocalDateTime.now().with(TemporalAdjusters.firstDayOfMonth()).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfMonth = LocalDateTime.now().with(TemporalAdjusters.lastDayOfMonth()).withHour(23).withMinute(59).withSecond(59);

        BigDecimal monthlyIncome = transactionService.getIncomeByPeriod(user, startOfMonth, endOfMonth);
        BigDecimal monthlyExpense = transactionService.getExpenseByPeriod(user, startOfMonth, endOfMonth);

        // Transações recentes
        List<Transaction> recentTransactions = transactionService.getTransactionsByUser(user)
                .stream()
                .limit(10)
                .collect(Collectors.toList());

        // Metas ativas
        int activeGoals = goalService.getGoalsByUserAndStatus(user, org.example.entity.Goal.GoalStatus.ACTIVE).size();

        return DashboardDto.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(balance)
                .monthlyIncome(monthlyIncome)
                .monthlyExpense(monthlyExpense)
                .recentTransactions(recentTransactions)
                .activeGoalsCount(activeGoals)
                .build();
    }

    public MonthlyReportDto getMonthlyReport(User user, int year, int month) {
        LocalDateTime startDate = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime endDate = startDate.with(TemporalAdjusters.lastDayOfMonth()).withHour(23).withMinute(59).withSecond(59);

        List<Transaction> transactions = transactionService.getTransactionsByUserAndDateRange(user, startDate, endDate);

        BigDecimal totalIncome = transactionService.getIncomeByPeriod(user, startDate, endDate);
        BigDecimal totalExpense = transactionService.getExpenseByPeriod(user, startDate, endDate);

        List<CategorySummaryDto> incomeByCategory = getCategorySummary(user, Transaction.TransactionType.INCOME, startDate, endDate);
        List<CategorySummaryDto> expenseByCategory = getCategorySummary(user, Transaction.TransactionType.EXPENSE, startDate, endDate);

        return MonthlyReportDto.builder()
                .year(year)
                .month(month)
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(totalIncome.subtract(totalExpense))
                .transactions(transactions)
                .incomeByCategory(incomeByCategory)
                .expenseByCategory(expenseByCategory)
                .build();
    }

    public List<CategorySummaryDto> getCategorySummary(User user, Transaction.TransactionType type,
                                                     LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> results = transactionService.getCategorySummary(user, type, startDate, endDate);

        return results.stream()
                .map(result -> CategorySummaryDto.builder()
                        .categoryName((String) result[0])
                        .amount((BigDecimal) result[1])
                        .build())
                .collect(Collectors.toList());
    }

    public List<Object[]> getYearlyComparison(User user, int year) {
        return transactionService.getMonthlySummary(user, Transaction.TransactionType.EXPENSE);
    }
}
