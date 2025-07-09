package org.example.repository;

import org.example.entity.Transaction;
import org.example.entity.User;
import org.example.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserOrderByTransactionDateDesc(User user);

    List<Transaction> findByUserAndTransactionDateBetweenOrderByTransactionDateDesc(
            User user, LocalDateTime startDate, LocalDateTime endDate);

    List<Transaction> findByUserAndCategoryOrderByTransactionDateDesc(User user, Category category);

    List<Transaction> findByUserAndTypeOrderByTransactionDateDesc(User user, Transaction.TransactionType type);

    Optional<Transaction> findByIdAndUser(Long id, User user);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.type = :type")
    BigDecimal sumByUserAndType(@Param("user") User user, @Param("type") Transaction.TransactionType type);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.type = :type AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal sumByUserAndTypeAndDateBetween(@Param("user") User user,
                                            @Param("type") Transaction.TransactionType type,
                                            @Param("startDate") LocalDateTime startDate,
                                            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT t.category.name, SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.type = :type AND t.transactionDate BETWEEN :startDate AND :endDate GROUP BY t.category.name")
    List<Object[]> findCategorySummaryByUserAndTypeAndDateBetween(@Param("user") User user,
                                                                 @Param("type") Transaction.TransactionType type,
                                                                 @Param("startDate") LocalDateTime startDate,
                                                                 @Param("endDate") LocalDateTime endDate);

    @Query("SELECT FUNCTION('DATE_FORMAT', t.transactionDate, '%Y-%m'), SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.type = :type GROUP BY FUNCTION('DATE_FORMAT', t.transactionDate, '%Y-%m') ORDER BY FUNCTION('DATE_FORMAT', t.transactionDate, '%Y-%m')")
    List<Object[]> findMonthlySummaryByUserAndType(@Param("user") User user, @Param("type") Transaction.TransactionType type);
}
