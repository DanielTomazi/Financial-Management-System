package org.example.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.dto.AuthRequest;
import org.example.dto.AuthResponse;
import org.example.dto.RegisterRequest;
import org.example.entity.User;
import org.example.service.CategoryService;
import org.example.service.JwtService;
import org.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints de autenticação")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    @Operation(summary = "Fazer login", description = "Autentica o usuário e retorna um token JWT")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    authRequest.getUsername(),
                    authRequest.getPassword()
                )
            );

            User user = (User) authentication.getPrincipal();
            String token = jwtService.generateToken(user);

            return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getFullName(), user.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Credenciais inválidas"));
        }
    }

    @PostMapping("/register")
    @Operation(summary = "Registrar usuário", description = "Cria uma nova conta de usuário")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.createUser(
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                registerRequest.getPassword(),
                registerRequest.getFullName()
            );

            // Criar categorias padrão para o novo usuário
            categoryService.createDefaultCategories(user);

            String token = jwtService.generateToken(user);

            return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getFullName(), user.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/validate")
    @Operation(summary = "Validar token", description = "Valida se o token JWT é válido")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String username = jwtService.extractUsername(token);
            User user = userService.findByUsername(username).orElseThrow();

            if (jwtService.isTokenValid(token, user)) {
                return ResponseEntity.ok(new ValidationResponse(true, "Token válido"));
            } else {
                return ResponseEntity.badRequest().body(new ValidationResponse(false, "Token inválido"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ValidationResponse(false, "Token inválido"));
        }
    }

    // Inner classes para responses
    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() { return message; }
    }

    public static class ValidationResponse {
        private boolean valid;
        private String message;

        public ValidationResponse(boolean valid, String message) {
            this.valid = valid;
            this.message = message;
        }

        public boolean isValid() { return valid; }
        public String getMessage() { return message; }
    }
}
