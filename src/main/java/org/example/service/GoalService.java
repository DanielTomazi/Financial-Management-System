package org.example.service;

import org.example.entity.Category;
import org.example.entity.Goal;
import org.example.entity.Transaction;
import org.example.entity.User;
import org.example.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private EmailService emailService;

    public Goal createGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    public List<Goal> getGoalsByUser(User user) {
        return goalRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Goal> getGoalsByUserAndStatus(User user, Goal.GoalStatus status) {
        return goalRepository.findByUserAndStatus(user, status);
    }

    public List<Goal> getGoalsByUserAndType(User user, Goal.GoalType type) {
        return goalRepository.findByUserAndType(user, type);
    }

    public Optional<Goal> getGoalById(Long id, User user) {
        return goalRepository.findByIdAndUser(id, user);
    }

    public Goal updateGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    public void deleteGoal(Long id, User user) {
        Optional<Goal> goal = goalRepository.findByIdAndUser(id, user);
        if (goal.isPresent()) {
            Goal g = goal.get();
            g.setStatus(Goal.GoalStatus.CANCELLED);
            goalRepository.save(g);
        }
    }

    public void updateGoalProgress(User user, Category category, BigDecimal amount, Transaction.TransactionType type) {
        List<Goal> activeGoals = goalRepository.findByUserAndStatus(user, Goal.GoalStatus.ACTIVE);

        for (Goal goal : activeGoals) {
            if (shouldUpdateGoal(goal, category, type)) {
                BigDecimal newAmount = goal.getCurrentAmount().add(amount);
                goal.setCurrentAmount(newAmount);

                // Verificar se a meta foi atingida
                if (goal.getType() == Goal.GoalType.SAVINGS &&
                    newAmount.compareTo(goal.getTargetAmount()) >= 0) {
                    goal.setStatus(Goal.GoalStatus.COMPLETED);
                    goal.setCompletedAt(LocalDateTime.now());

                    if (goal.getEmailAlerts()) {
                        emailService.sendGoalCompletedEmail(user, goal);
                    }
                }

                goalRepository.save(goal);
            }
        }
    }

    private boolean shouldUpdateGoal(Goal goal, Category category, Transaction.TransactionType type) {
        if (goal.getCategory() != null && !goal.getCategory().equals(category)) {
            return false;
        }

        switch (goal.getType()) {
            case SAVINGS:
                return type == Transaction.TransactionType.INCOME;
            case EXPENSE_LIMIT:
                return type == Transaction.TransactionType.EXPENSE;
            case DEBT_PAYMENT:
                return type == Transaction.TransactionType.EXPENSE;
            default:
                return false;
        }
    }

    public List<Goal> getOverdueGoals(User user) {
        return goalRepository.findOverdueGoals(user, LocalDateTime.now());
    }

    public void checkGoalDeadlines() {
        List<Goal> goalsWithAlerts = goalRepository.findGoalsWithEmailAlerts(null);

        for (Goal goal : goalsWithAlerts) {
            if (goal.isOverdue() && goal.getEmailAlerts()) {
                emailService.sendGoalOverdueEmail(goal.getUser(), goal);
            }
        }
    }

    public void sendGoalProgressAlerts() {
        List<Goal> activeGoals = goalRepository.findByUserAndStatus(null, Goal.GoalStatus.ACTIVE);

        for (Goal goal : activeGoals) {
            if (goal.getEmailAlerts()) {
                double progress = goal.getProgressPercentage();

                // Enviar alertas em marcos específicos (25%, 50%, 75%, 90%)
                if (progress >= 25 && progress < 30) {
                    emailService.sendGoalProgressEmail(goal.getUser(), goal, 25);
                } else if (progress >= 50 && progress < 55) {
                    emailService.sendGoalProgressEmail(goal.getUser(), goal, 50);
                } else if (progress >= 75 && progress < 80) {
                    emailService.sendGoalProgressEmail(goal.getUser(), goal, 75);
                } else if (progress >= 90 && progress < 95) {
                    emailService.sendGoalProgressEmail(goal.getUser(), goal, 90);
                }
            }
        }
    }
}
