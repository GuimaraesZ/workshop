package com.educandofe.course.repositorys.category;
import org.springframework.data.jpa.repository.JpaRepository;
import com.educandofe.course.Model.category.CategoryModel;

public interface CategoryRepository extends JpaRepository<CategoryModel, Long>{

}
