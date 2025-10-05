package com.educandofe.course.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.educandofe.course.Model.UserModel;
import com.educandofe.course.dto.ErrorResponse;
import com.educandofe.course.dto.LoginRequest;
import com.educandofe.course.dto.LoginResponse;
import com.educandofe.course.dto.SignupRequest;
import com.educandofe.course.services.AuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Endpoint de login
     * POST /auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("=== Tentativa de login ===");
            System.out.println("Email: " + request.getEmail());
            
            // Validar campos
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Email é obrigatório", 400));
            }
            
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Senha é obrigatória", 400));
            }
            
            // Autenticar
            UserModel user = authService.authenticate(
                request.getEmail(), 
                request.getPassword()
            );
            
            // Gerar token
            String token = authService.generateToken(user);
            
            // Retornar resposta
            LoginResponse response = new LoginResponse(token, user);
            System.out.println("Login bem-sucedido para: " + user.getEmail());
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            System.err.println("Erro de autenticação: " + e.getMessage());
            return ResponseEntity.status(401)
                .body(new ErrorResponse(e.getMessage(), 401));
        } catch (Exception e) {
            System.err.println("Erro no login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(new ErrorResponse("Erro interno no servidor", 500));
        }
    }

    /**
     * Endpoint de cadastro
     * POST /auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            System.out.println("=== Novo cadastro ===");
            System.out.println("Nome: " + request.getName());
            System.out.println("Email: " + request.getEmail());
            
            // Validar campos
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Nome é obrigatório", 400));
            }
            
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Email é obrigatório", 400));
            }
            
            if (request.getPassword() == null || request.getPassword().length() < 6) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Senha deve ter pelo menos 6 caracteres", 400));
            }
            
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
            
        } catch (IllegalArgumentException e) {
            System.err.println("Erro no cadastro: " + e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage(), 400));
        } catch (Exception e) {
            System.err.println("Erro no cadastro: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(new ErrorResponse("Erro interno no servidor", 500));
        }
    }
}
