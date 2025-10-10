package com.educandofe.course.services.auth;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.educandofe.course.Model.user.UserModel;
import com.educandofe.course.repositorys.user.UserRepository;
import com.educandofe.course.security.PasswordEncoder;
import com.educandofe.course.services.interfaces.IAuthService;

@Service
public class AuthService implements IAuthService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Autentica um usuário com email e senha
     * @param email Email do usuário
     * @param password Senha do usuário
     * @return UserModel se autenticado
     * @throws IllegalArgumentException se credenciais inválidas
     */
    public UserModel authenticate(String email, String password) {
        // Buscar usuário por email
        Optional<UserModel> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            System.out.println("Tentativa de login falhou: Email não encontrado - " + email);
            throw new IllegalArgumentException("Email ou senha incorretos");
        }
        
        UserModel user = userOpt.get();
        
        // Validar senha usando BCrypt
        if (!passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("Tentativa de login falhou: Senha incorreta para email - " + email);
            throw new IllegalArgumentException("Email ou senha incorretos");
        }
        
        System.out.println("Login bem-sucedido: " + user.getName() + " (" + email + ")");
        return user;
    }

    /**
     * Registra um novo usuário
     * @param name Nome do usuário
     * @param email Email do usuário
     * @param phone Telefone do usuário
     * @param password Senha do usuário
     * @return UserModel criado
     * @throws IllegalArgumentException se email já existe
     */
    public UserModel register(String name, String email, String phone, String password) {
        // Verificar se email já existe
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        
        // Criar novo usuário
        UserModel newUser = new UserModel();
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setPhone(phone);
        
        // Hash da senha usando BCrypt
        String hashedPassword = passwordEncoder.encode(password);
        newUser.setPassword(hashedPassword);
        
        UserModel savedUser = userRepository.save(newUser);
        System.out.println("Novo usuário registrado: " + savedUser.getName() + " (" + email + ")");
        
        return savedUser;
    }

    /**
     * Gera um token JWT simples (mock)
     * Em produção, usar biblioteca JWT real como jjwt
     * @param user Usuário autenticado
     * @return Token JWT mock
     */
    public String generateToken(UserModel user) {
        // Token mock simples: user_id + timestamp + random
        // Em produção, usar JWT real com claims, expiração, etc.
        String token = "Bearer_" + user.getId() + "_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8);
        return token;
    }
}
