package com.educandofe.course.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        userRepository.deleteById(id);
    }

    public UserModel update(Long id, UserModel user) {
        UserModel entity = userRepository.getReferenceById(id);
        updateData(entity, user);
        return userRepository.save(entity);
    }
    private void updateData(UserModel entity, UserModel user) {
        entity.setName(user.getName());
        entity.setEmail(user.getEmail());
        entity.setPhone(user.getPhone());
    }

}
