package com.educandofe.course.controller.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.educandofe.course.Model.user.UserModel;
import com.educandofe.course.dto.auth.LoginRequest;
import com.educandofe.course.dto.auth.LoginResponse;
import com.educandofe.course.dto.auth.SignupRequest;
import com.educandofe.course.services.interfaces.IAuthService;
import com.educandofe.course.validation.auth.LoginRequestValidator;
import com.educandofe.course.validation.auth.SignupRequestValidator;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    @Autowired
    private IAuthService authService;
    
    @Autowired
    private LoginRequestValidator loginValidator;
    
    @Autowired
    private SignupRequestValidator signupValidator;

    /**
     * Endpoint de login
     * POST /auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        System.out.println("=== Tentativa de login ===");
        System.out.println("Email: " + request.getEmail());
        
        // Validar (lança IllegalArgumentException se inválido)
        loginValidator.validate(request);
        
        // Autenticar
        UserModel user = authService.authenticate(request.getEmail(), request.getPassword());
        
        // Gerar token
        String token = authService.generateToken(user);
        
        // Retornar resposta
        LoginResponse response = new LoginResponse(token, user);
        System.out.println("Login bem-sucedido para: " + user.getEmail());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint de cadastro
     * POST /auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<LoginResponse> signup(@RequestBody SignupRequest request) {
        System.out.println("=== Novo cadastro ===");
        System.out.println("Nome: " + request.getName());
        System.out.println("Email: " + request.getEmail());
        
        // Validar (lança IllegalArgumentException se inválido)
        signupValidator.validate(request);
        
        // Registrar usuário
        UserModel user = authService.register(
            request.getName(),
            request.getEmail(),
            request.getPhone(),
            request.getPassword()
        );
        
        // Gerar token
        String token = authService.generateToken(user);
        
        // Retornar resposta
        LoginResponse response = new LoginResponse(token, user);
        System.out.println("Cadastro bem-sucedido para: " + user.getEmail());
        
        return ResponseEntity.ok(response);
    }
}
