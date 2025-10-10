package com.educandofe.course.validation.auth;

import org.springframework.stereotype.Component;

import com.educandofe.course.dto.auth.SignupRequest;

/**
 * Validador para requisições de cadastro.
 * Segue SRP: responsável apenas por validação de SignupRequest.
 */
@Component
public class SignupRequestValidator {
    
    /**
     * Valida os dados de cadastro
     * @param request Dados do cadastro
     * @throws IllegalArgumentException se dados inválidos
     */
    public void validate(SignupRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dados de cadastro não podem ser nulos");
        }
        
        // Validar nome
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }
        
        if (request.getName().length() < 3) {
            throw new IllegalArgumentException("Nome deve ter pelo menos 3 caracteres");
        }
        
        // Validar email
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email é obrigatório");
        }
        
        if (!isValidEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email inválido");
        }
        
        // Validar senha
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Senha é obrigatória");
        }
        
        if (request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Senha deve ter pelo menos 6 caracteres");
        }
        
        // Validar telefone (opcional, mas se fornecido deve ser válido)
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            if (!isValidPhone(request.getPhone())) {
                throw new IllegalArgumentException("Telefone inválido");
            }
        }
    }
    
    private boolean isValidEmail(String email) {
        return email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
    
    private boolean isValidPhone(String phone) {
        // Remove caracteres não numéricos
        String cleanPhone = phone.replaceAll("[^0-9]", "");
        // Aceita telefones com 10 ou 11 dígitos (Brasil)
        return cleanPhone.length() >= 10 && cleanPhone.length() <= 11;
    }
}
