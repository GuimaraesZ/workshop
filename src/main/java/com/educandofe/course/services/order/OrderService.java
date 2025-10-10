package com.educandofe.course.services.order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.educandofe.course.Model.common.Enums.OrderStatus;
import com.educandofe.course.Model.order.OrderItemModel;
import com.educandofe.course.Model.order.OrderModel;
import com.educandofe.course.Model.product.ProductModel;
import com.educandofe.course.Model.user.UserModel;
import com.educandofe.course.dto.order.OrderItemRequestDTO;
import com.educandofe.course.dto.order.OrderRequestDTO;
import com.educandofe.course.dto.order.OrderResponseDTO;
import com.educandofe.course.repositorys.order.OrderItemRepository;
import com.educandofe.course.repositorys.order.OrderRepository;
import com.educandofe.course.repositorys.product.ProductRepository;
import com.educandofe.course.repositorys.user.UserRepository;
import com.educandofe.course.services.exception.ResourceNotFoundException;
import com.educandofe.course.services.interfaces.IOrderService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService implements IOrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public List<OrderModel> findAll() {
        return orderRepository.findAll();
    }

    public OrderModel findById(Long id) {
        Optional<OrderModel> order = orderRepository.findById(id);
        return order.orElseThrow(() -> new ResourceNotFoundException(id));
    }

    public List<OrderModel> findByClientId(Long clientId) {
        return orderRepository.findByClientId(clientId);
    }

    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO orderRequest, Long userId) {
        // Buscar usuário
        UserModel user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException(userId));

        // Criar pedido
        OrderModel order = new OrderModel();
        order.setMoment(LocalDateTime.now());
        order.setOrderStatus(OrderStatus.WAITING_PAYMENT);
        order.setClient(user);

        // Salvar pedido primeiro para obter o ID
        order = orderRepository.save(order);

        // Adicionar itens
        for (OrderItemRequestDTO itemDTO : orderRequest.getItems()) {
            ProductModel product = productRepository.findById(itemDTO.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException(itemDTO.getProductId()));

            OrderItemModel orderItem = new OrderItemModel(order, product, itemDTO.getQuantity(), itemDTO.getPrice());
            order.getItems().add(orderItem);
            orderItemRepository.save(orderItem);
        }

        // Criar resposta
        OrderResponseDTO response = new OrderResponseDTO(order);
        response.setShippingAddress(orderRequest.getShippingAddress());
        response.setPaymentMethod(orderRequest.getPaymentMethod());
        response.setShippingCost(orderRequest.getShippingCost());
        response.setSubtotal(orderRequest.getSubtotal());
        response.setTotal(orderRequest.getTotal());

        return response;
    }

    @Transactional
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new ResourceNotFoundException(id);
        }
        orderRepository.deleteById(id);
    }
}
