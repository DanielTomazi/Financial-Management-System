package org.example.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.entity.Category;
import org.example.entity.User;
import org.example.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@Tag(name = "Categories", description = "Gerenciamento de categorias")
@CrossOrigin(origins = "http://localhost:4200")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    @Operation(summary = "Criar categoria", description = "Cria uma nova categoria")
    public ResponseEntity<?> createCategory(@Valid @RequestBody Category category,
                                          Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            category.setUser(user);

            Category savedCategory = categoryService.createCategory(category);
            return ResponseEntity.ok(savedCategory);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping
    @Operation(summary = "Listar categorias", description = "Lista todas as categorias ativas do usuário")
    public ResponseEntity<List<Category>> getCategories(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Category> categories = categoryService.getCategoriesByUser(user);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Listar por tipo", description = "Lista categorias por tipo (INCOME/EXPENSE)")
    public ResponseEntity<List<Category>> getCategoriesByType(
            @PathVariable Category.TransactionType type,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Category> categories = categoryService.getCategoriesByUserAndType(user, type);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar categoria", description = "Busca uma categoria específica por ID")
    public ResponseEntity<?> getCategory(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Optional<Category> category = categoryService.getCategoryById(id, user);

        if (category.isPresent()) {
            return ResponseEntity.ok(category.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar categoria", description = "Atualiza uma categoria existente")
    public ResponseEntity<?> updateCategory(@PathVariable Long id,
                                          @Valid @RequestBody Category category,
                                          Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Optional<Category> existingCategory = categoryService.getCategoryById(id, user);

            if (existingCategory.isPresent()) {
                category.setId(id);
                category.setUser(user);
                Category updatedCategory = categoryService.updateCategory(category);
                return ResponseEntity.ok(updatedCategory);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar categoria", description = "Remove uma categoria (soft delete)")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id, Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            categoryService.deleteCategory(id, user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() { return message; }
    }
}
