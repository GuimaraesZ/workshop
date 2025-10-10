package com.educandofe.course.services.interfaces;

import java.util.List;

import com.educandofe.course.Model.order.OrderModel;
import com.educandofe.course.dto.order.OrderRequestDTO;
import com.educandofe.course.dto.order.OrderResponseDTO;


public interface IOrderService {
    
    /**
     * Busca todos os pedidos
     * @return Lista de pedidos
     */
    List<OrderModel> findAll();
    
    /**
     * Busca um pedido por ID
     * @param id ID do pedido
     * @return Pedido encontrado
     * @throws com.educandofe.course.services.exception.ResourceNotFoundException se não encontrado
     */
    OrderModel findById(Long id);
    
    /**
     * Busca pedidos por ID do cliente
     * @param clientId ID do cliente
     * @return Lista de pedidos do cliente
     */
    List<OrderModel> findByClientId(Long clientId);
    
    /**
     * Cria um novo pedido
     * @param orderRequest Dados do pedido
     * @param userId ID do usuário que está criando o pedido
     * @return DTO com dados do pedido criado
     * @throws IllegalArgumentException se dados inválidos
     */
    OrderResponseDTO createOrder(OrderRequestDTO orderRequest, Long userId);
    
    /**
     * Deleta um pedido (cancelamento)
     * @param id ID do pedido
     * @throws com.educandofe.course.services.exception.ResourceNotFoundException se não encontrado
     */
    void deleteOrder(Long id);
}
