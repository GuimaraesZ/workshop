package com.educandofe.course.dto.order;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.educandofe.course.Model.common.Enums.OrderStatus;
import com.educandofe.course.Model.order.OrderItemModel;
import com.educandofe.course.Model.order.OrderModel;
import com.fasterxml.jackson.annotation.JsonFormat;

public class OrderResponseDTO {

    private Long id;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "UTC")
    private LocalDateTime moment;
    
    private OrderStatus status;
    private String orderNumber;
    
    private List<OrderItemResponseDTO> items = new ArrayList<>();
    
    private ShippingAddressDTO shippingAddress;
    private String paymentMethod;
    
    private Double shippingCost;
    private Double subtotal;
    private Double total;
    
    private String clientName;
    private String clientEmail;

    // Constructors
    public OrderResponseDTO() {
    }

    public OrderResponseDTO(Long id, LocalDateTime moment, OrderStatus status, String orderNumber,
                            List<OrderItemResponseDTO> items, ShippingAddressDTO shippingAddress,
                            String paymentMethod, Double shippingCost, Double subtotal, Double total,
                            String clientName, String clientEmail) {
        this.id = id;
        this.moment = moment;
        this.status = status;
        this.orderNumber = orderNumber;
        this.items = items;
        this.shippingAddress = shippingAddress;
        this.paymentMethod = paymentMethod;
        this.shippingCost = shippingCost;
        this.subtotal = subtotal;
        this.total = total;
        this.clientName = clientName;
        this.clientEmail = clientEmail;
    }

    // Constructor from Entity
    public OrderResponseDTO(OrderModel order) {
        this.id = order.getId();
        this.moment = order.getMoment();
        this.status = order.getOrderStatus();
        this.orderNumber = String.format("ORD-%05d", order.getId());
        
        for (OrderItemModel item : order.getItems()) {
            this.items.add(new OrderItemResponseDTO(item));
        }
        
        this.total = order.getTotal();
        this.clientName = order.getClient() != null ? order.getClient().getName() : null;
        this.clientEmail = order.getClient() != null ? order.getClient().getEmail() : null;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getMoment() {
        return moment;
    }

    public void setMoment(LocalDateTime moment) {
        this.moment = moment;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public List<OrderItemResponseDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponseDTO> items) {
        this.items = items;
    }

    public ShippingAddressDTO getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(ShippingAddressDTO shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Double getShippingCost() {
        return shippingCost;
    }

    public void setShippingCost(Double shippingCost) {
        this.shippingCost = shippingCost;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getClientEmail() {
        return clientEmail;
    }

    public void setClientEmail(String clientEmail) {
        this.clientEmail = clientEmail;
    }
}
