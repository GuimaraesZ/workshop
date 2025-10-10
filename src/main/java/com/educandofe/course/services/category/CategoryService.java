package com.educandofe.course.services.category;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import com.educandofe.course.Model.category.CategoryModel;
import com.educandofe.course.repositorys.category.CategoryRepository;
import com.educandofe.course.services.interfaces.ICategoryService;

@Service
public class CategoryService implements ICategoryService {

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