package com.educandofe.course.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import com.educandofe.course.Model.CategoryModel;
import com.educandofe.course.repositorys.CategoryRepository;



@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryModel> findAll() {
        return categoryRepository.findAll();
    }

    public CategoryModel findById(Long id) {
        Optional<CategoryModel> category = categoryRepository.findById(id);
        return category.get();
    }

}