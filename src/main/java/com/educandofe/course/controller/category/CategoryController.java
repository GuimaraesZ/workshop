package com.educandofe.course.controller.category;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.educandofe.course.Model.category.CategoryModel;
import com.educandofe.course.services.interfaces.ICategoryService;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private ICategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryModel>> findAll() {
        List<CategoryModel> categories = categoryService.findAll();
        return ResponseEntity.ok().body(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryModel> findById(@PathVariable Long id) {
        CategoryModel category = categoryService.findById(id);
        return ResponseEntity.ok().body(category);
    }

}