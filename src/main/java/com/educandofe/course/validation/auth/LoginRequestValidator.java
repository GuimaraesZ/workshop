package com.educandofe.course.validation.auth;

import org.springframework.stereotype.Component;

import com.educandofe.course.dto.auth.LoginRequest;

/**
 * Validador para requisições de login.
 * Segue SRP: responsável apenas por validação de LoginRequest.
 */
@Component
public class LoginRequestValidator {
    
    /**
     * Valida os dados de login
     * @param request Dados do login
     * @throws IllegalArgumentException se dados inválidos
     */
    public void validate(LoginRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dados de login não podem ser nulos");
        }
        
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email é obrigatório");
        }
        
        if (!isValidEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email inválido");
        }
        
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Senha é obrigatória");
        }
    }
    
    private boolean isValidEmail(String email) {
        // Regex simples para validação de email
        return email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
}
