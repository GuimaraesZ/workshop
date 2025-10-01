package com.educandofe.course.repositorys;
import org.springframework.data.jpa.repository.JpaRepository;
import com.educandofe.course.Model.OrderItemModel;
import com.educandofe.course.Model.pk.OrderItemPk;

public interface OrderItemRepository extends JpaRepository<OrderItemModel, OrderItemPk> {

}
