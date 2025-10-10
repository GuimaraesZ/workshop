package com.educandofe.course.repositorys.user;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.educandofe.course.Model.user.UserModel;

public interface UserRepository  extends JpaRepository<UserModel, Long> {
    
    /**
     * Busca um usuário por email
     * @param email Email do usuário
     * @return Optional com o usuário se encontrado
     */
    Optional<UserModel> findByEmail(String email);
    
}
