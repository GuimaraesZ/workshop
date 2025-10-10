package com.educandofe.course.repositorys.order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.educandofe.course.Model.order.OrderModel;

public interface OrderRepository extends JpaRepository<OrderModel, Long> {
    
    /**
     * Busca todos os pedidos de um cliente específico
     * @param clientId ID do cliente
     * @return Lista de pedidos do cliente
     */
    List<OrderModel> findByClientId(Long clientId);
    
}
