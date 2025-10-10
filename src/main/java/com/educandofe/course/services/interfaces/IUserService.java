package com.educandofe.course.services.interfaces;

import java.util.List;

import com.educandofe.course.Model.user.UserModel;


public interface IUserService {
    
    /**
     * Busca todos os usuários
     * @return Lista de usuários
     */
    List<UserModel> findAll();
    
    /**
     * Busca um usuário por ID
     * @param id ID do usuário
     * @return Usuário encontrado
     * @throws com.educandofe.course.services.exception.ResourceNotFoundException se não encontrado
     */
    UserModel findById(Long id);
    
    /**
     * Insere um novo usuário
     * @param user Dados do usuário
     * @return Usuário criado
     */
    UserModel insert(UserModel user);
    
    /**
     * Atualiza um usuário existente
     * @param id ID do usuário
     * @param user Dados atualizados
     * @return Usuário atualizado
     * @throws com.educandofe.course.services.exception.ResourceNotFoundException se não encontrado
     */
    UserModel update(Long id, UserModel user);
    
    /**
     * Deleta um usuário por ID
     * @param id ID do usuário
     * @throws com.educandofe.course.services.exception.ResourceNotFoundException se não encontrado
     * @throws com.educandofe.course.services.exception.DatabaseException se houver registros relacionados
     */
    void delete(Long id);
    
    /**
     * Altera a senha do usuário
     * @param id ID do usuário
     * @param currentPassword Senha atual para validação
     * @param newPassword Nova senha
     * @throws com.educandofe.course.services.exception.ResourceNotFoundException se usuário não existir
     * @throws IllegalArgumentException se senha atual estiver incorreta ou nova senha inválida
     */
    void changePassword(Long id, String currentPassword, String newPassword);
}
