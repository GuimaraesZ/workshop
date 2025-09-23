package com.educandofe.course.resources;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.educandofe.course.Model.UserModel;

@RestController
@RequestMapping("/users")
public class UserResource {

    @GetMapping
    public ResponseEntity<UserModel> findAll() {
        UserModel u = new UserModel(1L, "maria",
         "maria@gmail.com",
         "999999999", "123456");
        return ResponseEntity.ok().body(u);
    }
    
}


    
