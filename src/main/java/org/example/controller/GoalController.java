package org.example.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.entity.Goal;
import org.example.entity.User;
import org.example.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/goals")
@Tag(name = "Goals", description = "Gerenciamento de metas financeiras")
@CrossOrigin(origins = "http://localhost:4200")
public class GoalController {

    @Autowired
    private GoalService goalService;

    @PostMapping
    @Operation(summary = "Criar meta", description = "Cria uma nova meta financeira")
    public ResponseEntity<?> createGoal(@Valid @RequestBody Goal goal,
                                       Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            goal.setUser(user);

            Goal savedGoal = goalService.createGoal(goal);
            return ResponseEntity.ok(savedGoal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping
    @Operation(summary = "Listar metas", description = "Lista todas as metas do usuário")
    public ResponseEntity<List<Goal>> getGoals(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Goal> goals = goalService.getGoalsByUser(user);
        return ResponseEntity.ok(goals);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Listar por status", description = "Lista metas por status")
    public ResponseEntity<List<Goal>> getGoalsByStatus(
            @PathVariable Goal.GoalStatus status,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Goal> goals = goalService.getGoalsByUserAndStatus(user, status);
        return ResponseEntity.ok(goals);
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Listar por tipo", description = "Lista metas por tipo")
    public ResponseEntity<List<Goal>> getGoalsByType(
            @PathVariable Goal.GoalType type,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Goal> goals = goalService.getGoalsByUserAndType(user, type);
        return ResponseEntity.ok(goals);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar meta", description = "Busca uma meta específica por ID")
    public ResponseEntity<?> getGoal(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Optional<Goal> goal = goalService.getGoalById(id, user);

        if (goal.isPresent()) {
            return ResponseEntity.ok(goal.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar meta", description = "Atualiza uma meta existente")
    public ResponseEntity<?> updateGoal(@PathVariable Long id,
                                       @Valid @RequestBody Goal goal,
                                       Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Optional<Goal> existingGoal = goalService.getGoalById(id, user);

            if (existingGoal.isPresent()) {
                goal.setId(id);
                goal.setUser(user);
                Goal updatedGoal = goalService.updateGoal(goal);
                return ResponseEntity.ok(updatedGoal);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar meta", description = "Cancela uma meta")
    public ResponseEntity<?> deleteGoal(@PathVariable Long id, Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            goalService.deleteGoal(id, user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/overdue")
    @Operation(summary = "Metas vencidas", description = "Lista metas vencidas do usuário")
    public ResponseEntity<List<Goal>> getOverdueGoals(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Goal> goals = goalService.getOverdueGoals(user);
        return ResponseEntity.ok(goals);
    }

    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() { return message; }
    }
}
