package com.educandofe.course.services.interfaces;

import com.educandofe.course.Model.user.UserModel;


public interface IAuthService {
    
    /**
     * Autentica um usuário com email e senha
     * @param email Email do usuário
     * @param password Senha do usuário
     * @return UserModel se autenticado com sucesso
     * @throws IllegalArgumentException se credenciais inválidas
     */
    UserModel authenticate(String email, String password);
    
    /**
     * Registra um novo usuário no sistema
     * @param name Nome do usuário
     * @param email Email do usuário
     * @param phone Telefone do usuário (opcional)
     * @param password Senha do usuário
     * @return UserModel criado
     * @throws IllegalArgumentException se email já existe ou dados inválidos
     */
    UserModel register(String name, String email, String phone, String password);
    
    /**
     * Gera um token de autenticação para o usuário
     * @param user Usuário autenticado
     * @return Token de autenticação (formato depende da implementação)
     */
    String generateToken(UserModel user);
}
