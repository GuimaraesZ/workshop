package com.educandofe.course.services.product;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.educandofe.course.Model.product.ProductModel;
import com.educandofe.course.repositorys.product.ProductRepository;
import com.educandofe.course.services.interfaces.IProductService;

@Service
public class ProductService implements IProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<ProductModel> findAll() {
        return productRepository.findAll();
    }

    public ProductModel findById(Long id) {
        Optional<ProductModel> product = productRepository.findById(id);
        return product.get();
    }

    public ProductModel create(ProductModel product) {
        product.setId(null); // Garantir que é um novo produto
        return productRepository.save(product);
    }

    public ProductModel update(ProductModel product) {
        ProductModel existingProduct = findById(product.getId());
        updateData(existingProduct, product);
        return productRepository.save(existingProduct);
    }

    private void updateData(ProductModel entity, ProductModel product) {
        if (product == null) return;

        // Campos que não devem ser atualizados automaticamente
        Set<String> ignoredFields = new HashSet<>(Arrays.asList(
            "id", "categories", "orderItems", "serialVersionUID"
        ));

        for (Field field : ProductModel.class.getDeclaredFields()) {
            // Ignora campos da lista de ignorados
            if (ignoredFields.contains(field.getName())) {
                continue;
            }

            field.setAccessible(true);
            try {
                Object newValue = field.get(product);
                // Só atualiza se o novo valor não for nulo
                if (newValue != null) {
                    field.set(entity, newValue);
                }
            } catch (IllegalAccessException e) {
                // Log do erro, mas não interrompe o processo
                System.err.println("Erro ao acessar campo: " + field.getName());
            }
        }
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }

}
