package com.educandofe.course.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.educandofe.course.repositorys.ProductRepository;
import com.educandofe.course.Model.ProductModel;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<ProductModel> findAll() {
        return productRepository.findAll();
    }

    public ProductModel findById(Long id) {
        Optional<ProductModel> product = productRepository.findById(id);
        return product.get();
    }



}
