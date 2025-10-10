package com.educandofe.course.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Componente para codificação e validação de senhas usando BCrypt.
 * 
 * Princípios SOLID aplicados:
 * - SRP: Responsável apenas por hash e validação de senhas
 * - OCP: Pode ser estendido para outros algoritmos de hash
 * - DIP: Outros componentes dependem desta abstração
 * 
 * BCrypt é um algoritmo de hash forte, projetado para ser lento
 * e resistente a ataques de força bruta.
 */
@Component
public class PasswordEncoder {
    
    private final BCryptPasswordEncoder encoder;
    
    public PasswordEncoder() {
        // Strength padrão: 10 (quanto maior, mais lento e seguro)
        this.encoder = new BCryptPasswordEncoder(10);
    }
    
    /**
     * Codifica (hash) uma senha em texto plano
     * @param rawPassword Senha em texto plano
     * @return Hash BCrypt da senha
     */
    public String encode(String rawPassword) {
        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Senha não pode ser vazia");
        }
        return encoder.encode(rawPassword);
    }
    
    /**
     * Verifica se uma senha em texto plano corresponde ao hash
     * @param rawPassword Senha em texto plano
     * @param encodedPassword Hash BCrypt armazenado
     * @return true se as senhas correspondem
     */
    public boolean matches(String rawPassword, String encodedPassword) {
        if (rawPassword == null || encodedPassword == null) {
            return false;
        }
        return encoder.matches(rawPassword, encodedPassword);
    }
    
    /**
     * Verifica se um hash precisa ser recodificado
     * (útil para atualizar o strength ao longo do tempo)
     * @param encodedPassword Hash existente
     * @return true se precisa ser recodificado
     */
    public boolean needsUpgrade(String encodedPassword) {
        return encoder.upgradeEncoding(encodedPassword);
    }
}
