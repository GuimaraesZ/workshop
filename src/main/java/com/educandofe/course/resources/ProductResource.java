package com.educandofe.course.resources;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.educandofe.course.Model.ProductModel;
import com.educandofe.course.services.ProductService;

@RestController
@RequestMapping("/products")
public class ProductResource {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductModel>> findAll() {
        List<ProductModel> products = productService.findAll();
        return ResponseEntity.ok().body(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductModel> findById(@PathVariable Long id) {
        ProductModel product = productService.findById(id);
        return ResponseEntity.ok().body(product);
    }

}
