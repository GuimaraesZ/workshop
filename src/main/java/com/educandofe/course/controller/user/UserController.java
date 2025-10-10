package com.educandofe.course.controller.user;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.educandofe.course.Model.user.UserModel;
import com.educandofe.course.dto.user.ChangePasswordRequest;
import com.educandofe.course.services.interfaces.IUserService;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class UserController {

    @Autowired
    private IUserService userService;

    @GetMapping
    public ResponseEntity<List<UserModel>> findAll() {
        List<UserModel> users = userService.findAll();
        return ResponseEntity.ok().body(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserModel> findById(@PathVariable Long id) {
        UserModel user = userService.findById(id);
        return ResponseEntity.ok().body(user);
    }

    @PostMapping
    public ResponseEntity<UserModel> insert(@RequestBody UserModel user){
        user = userService.insert(user);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(user.getId()).toUri();
        return ResponseEntity.created(uri).body(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserModel> update(@PathVariable Long id, @RequestBody UserModel user) {
        System.out.println("=== Recebendo requisição PUT /users/" + id + " ===");
        System.out.println("Dados recebidos: " + user);
        user = userService.update(id, user);
        return ResponseEntity.ok().body(user);
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<Void> changePassword(@PathVariable Long id, @RequestBody ChangePasswordRequest request) {
        System.out.println("=== Recebendo requisição POST /users/" + id + "/change-password ===");
        userService.changePassword(id, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok().build();
    }
}
