package com.educandofe.course.services.interfaces;

import java.util.List;

import com.educandofe.course.Model.category.CategoryModel;


public interface ICategoryService {
    
    /**
     * Busca todas as categorias
     * @return Lista de categorias
     */
    List<CategoryModel> findAll();
    
    /**
     * Busca uma categoria por ID
     * @param id ID da categoria
     * @return Categoria encontrada
     * @throws com.educandofe.course.services.exception.ResourceNotFoundException se não encontrada
     */
    CategoryModel findById(Long id);
}
