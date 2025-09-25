package com.educandofe.course.repositorys;
import org.springframework.data.jpa.repository.JpaRepository;

import com.educandofe.course.Model.OrderModel;

public interface OrderRepository  extends JpaRepository<OrderModel, Long> {
    
}
