package org.example.repository;

import org.example.entity.Goal;
import org.example.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByUserOrderByCreatedAtDesc(User user);

    List<Goal> findByUserAndStatus(User user, Goal.GoalStatus status);

    List<Goal> findByUserAndType(User user, Goal.GoalType type);

    Optional<Goal> findByIdAndUser(Long id, User user);

    @Query("SELECT g FROM Goal g WHERE g.user = :user AND g.status = 'ACTIVE' AND g.targetDate < :currentDate")
    List<Goal> findOverdueGoals(@Param("user") User user, @Param("currentDate") LocalDateTime currentDate);

    @Query("SELECT g FROM Goal g WHERE g.user = :user AND g.emailAlerts = true AND g.status = 'ACTIVE'")
    List<Goal> findGoalsWithEmailAlerts(@Param("user") User user);
}
