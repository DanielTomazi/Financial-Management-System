package org.example.service;

import org.example.entity.Category;
import org.example.entity.Transaction;
import org.example.entity.User;
import org.example.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private GoalService goalService;

    public Transaction createTransaction(Transaction transaction) {
        Transaction savedTransaction = transactionRepository.save(transaction);

        // Atualizar metas relacionadas
        goalService.updateGoalProgress(transaction.getUser(), transaction.getCategory(),
                                     transaction.getAmount(), transaction.getType());

        return savedTransaction;
    }

    public List<Transaction> getTransactionsByUser(User user) {
        return transactionRepository.findByUserOrderByTransactionDateDesc(user);
    }

    public List<Transaction> getTransactionsByUserAndDateRange(User user, LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.findByUserAndTransactionDateBetweenOrderByTransactionDateDesc(
                user, startDate, endDate);
    }

    public List<Transaction> getTransactionsByUserAndCategory(User user, Category category) {
        return transactionRepository.findByUserAndCategoryOrderByTransactionDateDesc(user, category);
    }

    public List<Transaction> getTransactionsByUserAndType(User user, Transaction.TransactionType type) {
        return transactionRepository.findByUserAndTypeOrderByTransactionDateDesc(user, type);
    }

    public Optional<Transaction> getTransactionById(Long id, User user) {
        return transactionRepository.findByIdAndUser(id, user);
    }

    public Transaction updateTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id, User user) {
        Optional<Transaction> transaction = transactionRepository.findByIdAndUser(id, user);
        if (transaction.isPresent()) {
            transactionRepository.delete(transaction.get());

            // Atualizar metas relacionadas (reverter o progresso)
            goalService.updateGoalProgress(user, transaction.get().getCategory(),
                                         transaction.get().getAmount().negate(),
                                         transaction.get().getType());
        }
    }

    public BigDecimal getTotalIncomeByUser(User user) {
        BigDecimal total = transactionRepository.sumByUserAndType(user, Transaction.TransactionType.INCOME);
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getTotalExpenseByUser(User user) {
        BigDecimal total = transactionRepository.sumByUserAndType(user, Transaction.TransactionType.EXPENSE);
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getBalanceByUser(User user) {
        return getTotalIncomeByUser(user).subtract(getTotalExpenseByUser(user));
    }

    public BigDecimal getIncomeByPeriod(User user, LocalDateTime startDate, LocalDateTime endDate) {
        BigDecimal total = transactionRepository.sumByUserAndTypeAndDateBetween(
                user, Transaction.TransactionType.INCOME, startDate, endDate);
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getExpenseByPeriod(User user, LocalDateTime startDate, LocalDateTime endDate) {
        BigDecimal total = transactionRepository.sumByUserAndTypeAndDateBetween(
                user, Transaction.TransactionType.EXPENSE, startDate, endDate);
        return total != null ? total : BigDecimal.ZERO;
    }

    public List<Object[]> getCategorySummary(User user, Transaction.TransactionType type,
                                           LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.findCategorySummaryByUserAndTypeAndDateBetween(
                user, type, startDate, endDate);
    }

    public List<Object[]> getMonthlySummary(User user, Transaction.TransactionType type) {
        return transactionRepository.findMonthlySummaryByUserAndType(user, type);
    }
}
