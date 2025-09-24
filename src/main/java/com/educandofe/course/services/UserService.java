package com.educandofe.course.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.educandofe.course.repositorys.UserRepository;
import com.educandofe.course.Model.UserModel;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserModel> findAll() {
        return userRepository.findAll();
    }

    public UserModel findById(Long id) {
        Optional<UserModel> user = userRepository.findById(id);
        return user.get();
    }



}
