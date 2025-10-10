package com.educandofe.course.controller.upload;

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

import com.educandofe.course.Model.product.ProductModel;
import com.educandofe.course.repositorys.product.ProductRepository;

@RestController
@RequestMapping("/manager")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ImageUploadController {

    @Autowired
    private ProductRepository productRepository;

    private static final String UPLOAD_DIR = "uploads/products/";

    @PostMapping("/products/{id}/upload-image")
    public ResponseEntity<?> uploadProductImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        
        try {
            // Verificar se o produto existe
            ProductModel product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

            // Criar diretório se não existir
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Gerar nome único para o arquivo
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ImageUploadResponse(null, "Nome do arquivo inválido"));
            }
            
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + fileExtension;

            // Salvar arquivo
            Path filePath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Atualizar URL da imagem no produto
            String imageUrl = "/uploads/products/" + newFilename;
            product.setImgUrl(imageUrl);
            productRepository.save(product);

            return ResponseEntity.ok().body(new ImageUploadResponse(imageUrl, "Upload realizado com sucesso"));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ImageUploadResponse(null, "Erro ao fazer upload: " + e.getMessage()));
        }
    }

    // Classe para resposta do upload
    static class ImageUploadResponse {
        private String imageUrl;
        private String message;

        public ImageUploadResponse(String imageUrl, String message) {
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
