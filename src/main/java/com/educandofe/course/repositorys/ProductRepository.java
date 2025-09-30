package com.educandofe.course.repositorys;

import org.springframework.data.jpa.repository.JpaRepository;
import com.educandofe.course.Model.ProductModel;

public interface  ProductRepository extends JpaRepository<ProductModel, Long>{

}
