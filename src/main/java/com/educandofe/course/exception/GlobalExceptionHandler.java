package com.educandofe.course.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import com.educandofe.course.dto.common.ErrorResponse;
import com.educandofe.course.services.exception.DatabaseException;
import com.educandofe.course.services.exception.ResourceNotFoundException;

/**
 * Manipulador global de exceções.
 * Centraliza o tratamento de erros seguindo SRP.
 * 
 * Benefícios:
 * - Controllers não precisam tratar exceções
 * - Respostas de erro consistentes
 * - Fácil manutenção e extensão
 */
@ControllerAdvice
public class GlobalExceptionHandler {
    
    /**
     * Trata exceções de recurso não encontrado (404)
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex, 
            WebRequest request) {
        
        ErrorResponse error = new ErrorResponse(
            ex.getMessage(), 
            HttpStatus.NOT_FOUND.value()
        );
        
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(error);
    }
    
    /**
     * Trata exceções de validação (400)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(
            IllegalArgumentException ex, 
            WebRequest request) {
        
        ErrorResponse error = new ErrorResponse(
            ex.getMessage(), 
            HttpStatus.BAD_REQUEST.value()
        );
        
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(error);
    }
    
    /**
     * Trata exceções de banco de dados (409)
     */
    @ExceptionHandler(DatabaseException.class)
    public ResponseEntity<ErrorResponse> handleDatabase(
            DatabaseException ex, 
            WebRequest request) {
        
        ErrorResponse error = new ErrorResponse(
            ex.getMessage(), 
            HttpStatus.CONFLICT.value()
        );
        
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(error);
    }
    
    /**
     * Trata exceções genéricas (500)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, 
            WebRequest request) {
        
        System.err.println("Erro não tratado: " + ex.getMessage());
        ex.printStackTrace();
        
        ErrorResponse error = new ErrorResponse(
            "Erro interno no servidor", 
            HttpStatus.INTERNAL_SERVER_ERROR.value()
        );
        
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(error);
    }
}
