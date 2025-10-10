package com.educandofe.course.repositorys.product;

import org.springframework.data.jpa.repository.JpaRepository;
import com.educandofe.course.Model.product.ProductModel;

public interface  ProductRepository extends JpaRepository<ProductModel, Long>{

}
