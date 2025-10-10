package com.educandofe.course.services.interfaces;

import java.util.List;

import com.educandofe.course.Model.product.ProductModel;


public interface IProductService {
    
    /**
     * Busca todos os produtos
     * @return Lista de produtos
     */
    List<ProductModel> findAll();
    
    /**
     * Busca um produto por ID
     * @param id ID do produto
     * @return Produto encontrado
     * @throws com.educandofe.course.services.exception.ResourceNotFoundException se não encontrado
     */
    ProductModel findById(Long id);
    
    /**
     * Cria um novo produto
     * @param product Dados do produto
     * @return Produto criado
     */
    ProductModel create(ProductModel product);
    
    /**
     * Atualiza um produto existente
     * @param product Dados atualizados do produto (deve conter ID)
     * @return Produto atualizado
     * @throws com.educandofe.course.services.exception.ResourceNotFoundException se não encontrado
     */
    ProductModel update(ProductModel product);
    
    /**
     * Deleta um produto por ID
     * @param id ID do produto
     * @throws com.educandofe.course.services.exception.ResourceNotFoundException se não encontrado
     */
    void delete(Long id);
}
