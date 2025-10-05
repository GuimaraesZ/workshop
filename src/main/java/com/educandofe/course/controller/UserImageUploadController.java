package com.educandofe.course.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.educandofe.course.Model.UserModel;
import com.educandofe.course.repositorys.UserRepository;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class UserImageUploadController {

    @Autowired
    private UserRepository userRepository;

    private static final String UPLOAD_DIR = "uploads/users/";

    @PostMapping("/{id}/upload-profile-image")
    public ResponseEntity<?> uploadProfileImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        
        try {
            // Verificar se o usuário existe
            UserModel user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            // Criar diretório se não existir
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Gerar nome único para o arquivo
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ProfileImageUploadResponse(null, "Nome do arquivo inválido"));
            }
            
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + fileExtension;

            // Salvar arquivo
            Path filePath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Atualizar URL da imagem no usuário
            String imageUrl = "/uploads/users/" + newFilename;
            user.setProfileImage(imageUrl);
            userRepository.save(user);

            return ResponseEntity.ok().body(new ProfileImageUploadResponse(imageUrl, "Upload realizado com sucesso"));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ProfileImageUploadResponse(null, "Erro ao fazer upload: " + e.getMessage()));
        }
    }

    // Classe para resposta do upload
    static class ProfileImageUploadResponse {
        private String imageUrl;
        private String message;

        public ProfileImageUploadResponse(String imageUrl, String message) {
            this.imageUrl = imageUrl;
            this.message = message;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
