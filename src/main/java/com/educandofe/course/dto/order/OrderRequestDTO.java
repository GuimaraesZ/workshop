package com.educandofe.course.dto.order;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class OrderRequestDTO {

    @NotEmpty(message = "Lista de itens não pode estar vazia")
    @Valid
    private List<OrderItemRequestDTO> items;

    @NotNull(message = "Endereço de entrega é obrigatório")
    @Valid
    private ShippingAddressDTO shippingAddress;

    @NotNull(message = "Método de pagamento é obrigatório")
    private String paymentMethod;

    private Double shippingCost;
    private Double subtotal;
    private Double total;

    // Constructors
    public OrderRequestDTO() {
    }

    public OrderRequestDTO(List<OrderItemRequestDTO> items, ShippingAddressDTO shippingAddress, 
                           String paymentMethod, Double shippingCost, Double subtotal, Double total) {
        this.items = items;
        this.shippingAddress = shippingAddress;
        this.paymentMethod = paymentMethod;
        this.shippingCost = shippingCost;
        this.subtotal = subtotal;
        this.total = total;
    }

    // Getters and Setters
    public List<OrderItemRequestDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequestDTO> items) {
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
}
