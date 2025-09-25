package com.educandofe.course.resources;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.educandofe.course.Model.OrderModel;
import com.educandofe.course.services.OrderService;

@RestController
@RequestMapping("/orders")
public class OrderResource {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderModel>> findAll() {
        List<OrderModel> orders = orderService.findAll();
        return ResponseEntity.ok().body(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderModel> findById(@PathVariable Long id) {
        OrderModel order = orderService.findById(id);
        return ResponseEntity.ok().body(order);
    }

}

