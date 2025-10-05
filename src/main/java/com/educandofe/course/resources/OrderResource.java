package com.educandofe.course.resources;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

import com.educandofe.course.Model.OrderModel;
import com.educandofe.course.dto.OrderRequestDTO;
import com.educandofe.course.dto.OrderResponseDTO;
import com.educandofe.course.services.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/orders")
public class OrderResource {

    @Autowired
    private OrderService orderService;

    /**
     * Buscar todos os pedidos (Admin) ou pedidos do usuário autenticado
     * Futuramente: adicionar lógica de autenticação e filtro por usuário
     */
    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> findAll(@RequestHeader(value = "X-User-Id", required = false) Long userId) {
        List<OrderModel> orders;
        
        if (userId != null) {
            // Buscar apenas pedidos do usuário autenticado
            orders = orderService.findByClientId(userId);
        } else {
            // Buscar todos os pedidos (admin)
            orders = orderService.findAll();
        }
        
        List<OrderResponseDTO> response = orders.stream()
            .map(OrderResponseDTO::new)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok().body(response);
    }

    /**
     * Buscar um pedido específico por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> findById(@PathVariable Long id) {
        OrderModel order = orderService.findById(id);
        OrderResponseDTO response = new OrderResponseDTO(order);
        return ResponseEntity.ok().body(response);
    }

    /**
     * Criar um novo pedido
     * Requer autenticação - userId deve vir do token JWT
     * Por enquanto, recebe via header X-User-Id
     */
    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(
            @Valid @RequestBody OrderRequestDTO orderRequest,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        
        // TODO: Quando JWT estiver implementado, pegar userId do token
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        OrderResponseDTO response = orderService.createOrder(orderRequest, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Cancelar um pedido
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}

