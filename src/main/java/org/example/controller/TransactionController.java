package org.example.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.dto.DashboardDto;
import org.example.dto.MonthlyReportDto;
import org.example.entity.Transaction;
import org.example.entity.User;
import org.example.service.ReportService;
import org.example.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
@Tag(name = "Transactions", description = "Gerenciamento de transações financeiras")
@CrossOrigin(origins = "http://localhost:4200")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private ReportService reportService;

    @PostMapping
    @Operation(summary = "Criar transação", description = "Cria uma nova transação financeira")
    public ResponseEntity<?> createTransaction(@Valid @RequestBody Transaction transaction,
                                              Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            transaction.setUser(user);

            Transaction savedTransaction = transactionService.createTransaction(transaction);
            return ResponseEntity.ok(savedTransaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping
    @Operation(summary = "Listar transações", description = "Lista todas as transações do usuário")
    public ResponseEntity<List<Transaction>> getTransactions(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Transaction> transactions = transactionService.getTransactionsByUser(user);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar transação", description = "Busca uma transação específica por ID")
    public ResponseEntity<?> getTransaction(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Optional<Transaction> transaction = transactionService.getTransactionById(id, user);

        if (transaction.isPresent()) {
            return ResponseEntity.ok(transaction.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar transação", description = "Atualiza uma transação existente")
    public ResponseEntity<?> updateTransaction(@PathVariable Long id,
                                              @Valid @RequestBody Transaction transaction,
                                              Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Optional<Transaction> existingTransaction = transactionService.getTransactionById(id, user);

            if (existingTransaction.isPresent()) {
                transaction.setId(id);
                transaction.setUser(user);
                Transaction updatedTransaction = transactionService.updateTransaction(transaction);
                return ResponseEntity.ok(updatedTransaction);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar transação", description = "Remove uma transação")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id, Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            transactionService.deleteTransaction(id, user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/period")
    @Operation(summary = "Transações por período", description = "Lista transações em um período específico")
    public ResponseEntity<List<Transaction>> getTransactionsByPeriod(
            @RequestParam String startDate,
            @RequestParam String endDate,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);

        List<Transaction> transactions = transactionService.getTransactionsByUserAndDateRange(user, start, end);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Dashboard", description = "Retorna dados do dashboard financeiro")
    public ResponseEntity<DashboardDto> getDashboard(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        DashboardDto dashboard = reportService.getDashboardData(user);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/report/monthly")
    @Operation(summary = "Relatório mensal", description = "Gera relatório mensal detalhado")
    public ResponseEntity<MonthlyReportDto> getMonthlyReport(
            @RequestParam int year,
            @RequestParam int month,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        MonthlyReportDto report = reportService.getMonthlyReport(user, year, month);
        return ResponseEntity.ok(report);
    }

    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() { return message; }
    }
}
