package com.educandofe.course.dto.order;

import com.educandofe.course.Model.order.OrderItemModel;

public class OrderItemResponseDTO {

    private Long productId;
    private String productName;
    private String productImageUrl;
    private Integer quantity;
    private Double price;
    private Double subTotal;

    // Constructors
    public OrderItemResponseDTO() {
    }

    public OrderItemResponseDTO(Long productId, String productName, String productImageUrl,
                                Integer quantity, Double price, Double subTotal) {
        this.productId = productId;
        this.productName = productName;
        this.productImageUrl = productImageUrl;
        this.quantity = quantity;
        this.price = price;
        this.subTotal = subTotal;
    }

    // Constructor from Entity
    public OrderItemResponseDTO(OrderItemModel item) {
        this.productId = item.getProduct().getId();
        this.productName = item.getProduct().getName();
        this.productImageUrl = item.getProduct().getImgUrl();
        this.quantity = item.getQuantity();
        this.price = item.getPrice();
        this.subTotal = item.getSubTotal();
    }

    // Getters and Setters
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductImageUrl() {
        return productImageUrl;
    }

    public void setProductImageUrl(String productImageUrl) {
        this.productImageUrl = productImageUrl;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getSubTotal() {
        return subTotal;
    }

    public void setSubTotal(Double subTotal) {
        this.subTotal = subTotal;
    }
}
