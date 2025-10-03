package com.educandofe.course.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import com.educandofe.course.services.exception.DatabaseException;

import com.educandofe.course.Model.UserModel;
import com.educandofe.course.repositorys.UserRepository;
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
            UserModel entity = userRepository.getReferenceById(id);
            updateData(entity, user);
            return userRepository.save(entity);
        } catch (jakarta.persistence.EntityNotFoundException e) {
            throw new ResourceNotFoundException(id);
        }
    }
    private void updateData(UserModel entity, UserModel user) {
        entity.setName(user.getName());
        entity.setEmail(user.getEmail());
        entity.setPhone(user.getPhone());
    }

}
