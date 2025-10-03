package com.educandofe.course.services.exception;

public class ResourceNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public ResourceNotFoundException(Object id) {
        super("No user record found with Id " + id);
    }
    
}
