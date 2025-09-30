package com.educandofe.course.repositorys;
import org.springframework.data.jpa.repository.JpaRepository;
import com.educandofe.course.Model.CategoryModel;

public interface CategoryRepository extends JpaRepository<CategoryModel, Long>{

}
