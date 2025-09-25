package com.educandofe.course.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.educandofe.course.repositorys.OrderRepository;
import com.educandofe.course.Model.OrderModel;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<OrderModel> findAll() {
        return orderRepository.findAll();
    }

    public OrderModel findById(Long id) {
        Optional<OrderModel> order = orderRepository.findById(id);
        return order.get();
    }



}
