package com.educandofe.course.repositorys.order;
import org.springframework.data.jpa.repository.JpaRepository;
import com.educandofe.course.Model.order.OrderItemModel;
import com.educandofe.course.Model.common.pk.OrderItemPk;

public interface OrderItemRepository extends JpaRepository<OrderItemModel, OrderItemPk> {

}
