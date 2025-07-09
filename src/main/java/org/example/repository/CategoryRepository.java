package org.example.repository;

import org.example.entity.Category;
import org.example.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserAndActiveTrue(User user);
    List<Category> findByUserAndType(User user, Category.TransactionType type);
    Optional<Category> findByIdAndUser(Long id, User user);
    Boolean existsByNameAndUser(String name, User user);
}
