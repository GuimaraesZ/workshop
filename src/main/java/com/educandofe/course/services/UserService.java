package com.educandofe.course.services;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.educandofe.course.Model.UserModel;
import com.educandofe.course.repositorys.UserRepository;
import com.educandofe.course.services.exception.DatabaseException;
import com.educandofe.course.services.exception.ResourceNotFoundException;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserModel> findAll() {
        return userRepository.findAll();
    }

    public UserModel findById(Long id) {
        Optional<UserModel> user = userRepository.findById(id);
        return user.orElseThrow(() -> new ResourceNotFoundException(id));
    }
    
    public UserModel insert(UserModel user) {
        return userRepository.save(user);
    }

    public void delete(Long id) {
        try {
            if (!userRepository.existsById(id)) {
                throw new ResourceNotFoundException(id);
            }
            userRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Cannot delete user because there are related records");
        }
    }

    public UserModel update(Long id, UserModel user) {
        try {
            // Usa findById em vez de getReferenceById para evitar proxy lazy
            UserModel entity = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
            updateData(entity, user);
            return userRepository.save(entity);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Erro ao atualizar usuário: " + e.getMessage());
            e.printStackTrace();
            throw new DatabaseException("Erro ao atualizar usuário: " + e.getMessage());
        }
    }

    private void updateData(UserModel entity, UserModel user) {
        if (user == null) return;

        // Campos que não devem ser atualizados automaticamente
        Set<String> ignoredFields = new HashSet<>(Arrays.asList(
            "id", "password", "orders", "serialVersionUID"
        ));

        System.out.println("=== Iniciando atualização de usuário ID: " + entity.getId() + " ===");

        for (Field field : UserModel.class.getDeclaredFields()) {
            // Ignora campos da lista de ignorados
            if (ignoredFields.contains(field.getName())) {
                continue;
            }

            field.setAccessible(true);
            try {
                Object newValue = field.get(user);
                // Só atualiza se o novo valor não for nulo
                if (newValue != null) {
                    Object oldValue = field.get(entity);
                    field.set(entity, newValue);
                    System.out.println("Campo atualizado: " + field.getName() + 
                                     " | Antigo: " + oldValue + " | Novo: " + newValue);
                }
            } catch (IllegalAccessException e) {
                // Log do erro, mas não interrompe o processo
                System.err.println("Erro ao acessar campo: " + field.getName() + " - " + e.getMessage());
            }
        }
        
        System.out.println("=== Finalizado atualização de usuário ===");
    }

    /**
     * Altera a senha do usuário após validar a senha atual
     * @param id ID do usuário
     * @param currentPassword Senha atual para validação
     * @param newPassword Nova senha
     * @throws ResourceNotFoundException se o usuário não existir
     * @throws IllegalArgumentException se a senha atual estiver incorreta
     */
    public void changePassword(Long id, String currentPassword, String newPassword) {
        UserModel user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(id));
        
        // Validar senha atual
        if (!user.getPassword().equals(currentPassword)) {
            throw new IllegalArgumentException("Senha atual incorreta");
        }
        
        // Validar nova senha
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Nova senha não pode ser vazia");
        }
        
        if (newPassword.length() < 6) {
            throw new IllegalArgumentException("Nova senha deve ter pelo menos 6 caracteres");
        }
        
        // Atualizar senha
        user.setPassword(newPassword);
        userRepository.save(user);
        
        System.out.println("Senha alterada com sucesso para usuário ID: " + id);
    }

}
