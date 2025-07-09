package org.example.service;

import org.example.entity.Category;
import org.example.entity.User;
import org.example.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public Category createCategory(Category category) {
        if (categoryRepository.existsByNameAndUser(category.getName(), category.getUser())) {
            throw new RuntimeException("Category already exists for this user");
        }
        return categoryRepository.save(category);
    }

    public List<Category> getCategoriesByUser(User user) {
        return categoryRepository.findByUserAndActiveTrue(user);
    }

    public List<Category> getCategoriesByUserAndType(User user, Category.TransactionType type) {
        return categoryRepository.findByUserAndType(user, type);
    }

    public Optional<Category> getCategoryById(Long id, User user) {
        return categoryRepository.findByIdAndUser(id, user);
    }

    public Category updateCategory(Category category) {
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id, User user) {
        Optional<Category> category = categoryRepository.findByIdAndUser(id, user);
        if (category.isPresent()) {
            Category cat = category.get();
            cat.setActive(false);
            categoryRepository.save(cat);
        }
    }

    public void createDefaultCategories(User user) {
        // Categorias padrão de receita
        if (!categoryRepository.existsByNameAndUser("Salário", user)) {
            Category salary = new Category("Salário", "Salário mensal", Category.TransactionType.INCOME, user);
            salary.setColor("#28a745");
            salary.setIcon("money");
            categoryRepository.save(salary);
        }

        if (!categoryRepository.existsByNameAndUser("Freelance", user)) {
            Category freelance = new Category("Freelance", "Trabalhos extras", Category.TransactionType.INCOME, user);
            freelance.setColor("#17a2b8");
            freelance.setIcon("briefcase");
            categoryRepository.save(freelance);
        }

        // Categorias padrão de despesa
        if (!categoryRepository.existsByNameAndUser("Alimentação", user)) {
            Category food = new Category("Alimentação", "Gastos com comida", Category.TransactionType.EXPENSE, user);
            food.setColor("#dc3545");
            food.setIcon("utensils");
            categoryRepository.save(food);
        }

        if (!categoryRepository.existsByNameAndUser("Transporte", user)) {
            Category transport = new Category("Transporte", "Gastos com transporte", Category.TransactionType.EXPENSE, user);
            transport.setColor("#ffc107");
            transport.setIcon("car");
            categoryRepository.save(transport);
        }

        if (!categoryRepository.existsByNameAndUser("Moradia", user)) {
            Category housing = new Category("Moradia", "Aluguel, financiamento, contas", Category.TransactionType.EXPENSE, user);
            housing.setColor("#6f42c1");
            housing.setIcon("home");
            categoryRepository.save(housing);
        }

        if (!categoryRepository.existsByNameAndUser("Lazer", user)) {
            Category leisure = new Category("Lazer", "Entretenimento e diversão", Category.TransactionType.EXPENSE, user);
            leisure.setColor("#fd7e14");
            leisure.setIcon("gamepad");
            categoryRepository.save(leisure);
        }
    }
}
