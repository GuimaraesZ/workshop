package com.educandofe.course.resources;

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

import com.educandofe.course.Model.UserModel;
import com.educandofe.course.dto.ChangePasswordRequest;
import com.educandofe.course.dto.ErrorResponse;
import com.educandofe.course.services.UserService;



@RestController
@RequestMapping("/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class UserResource {

    @Autowired
    private UserService userService;

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
        try {
            System.out.println("=== Recebendo requisição PUT /users/" + id + " ===");
            System.out.println("Dados recebidos: " + user);
            user = userService.update(id, user);
            return ResponseEntity.ok().body(user);
        } catch (Exception e) {
            System.err.println("Erro no endpoint PUT /users/" + id + ": " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody ChangePasswordRequest request) {
        try {
            System.out.println("=== Recebendo requisição POST /users/" + id + "/change-password ===");
            userService.changePassword(id, request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            System.err.println("Erro de validação ao alterar senha: " + e.getMessage());
            ErrorResponse error = new ErrorResponse(e.getMessage(), 400);
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            System.err.println("Erro ao alterar senha: " + e.getMessage());
            e.printStackTrace();
            ErrorResponse error = new ErrorResponse("Erro interno ao alterar senha", 500);
            return ResponseEntity.internalServerError().body(error);
        }
    }

}


    
