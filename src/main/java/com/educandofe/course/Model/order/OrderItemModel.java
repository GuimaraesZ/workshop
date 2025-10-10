package com.educandofe.course.Model.order;
import java.io.Serializable;

import com.educandofe.course.Model.common.pk.OrderItemPk;
import com.educandofe.course.Model.product.ProductModel;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_order_item")
public class OrderItemModel implements Serializable {

    private static final long serialVersionUID = 1L;

    @EmbeddedId
    private OrderItemPk id = new OrderItemPk();

    private Integer quantity;
    private Double price;

    public OrderItemModel() {
    }
    
    public OrderItemModel(OrderModel order, ProductModel product, Integer quantity, Double price) {
        this.id.setOrder(order);
        this.id.setProduct(product);
        this.quantity = quantity;
        this.price = price;
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
    @JsonIgnore
    public OrderItemPk getId() {
        return id;
    }

    public void setId(OrderItemPk id) {
        this.id = id;
    }
    
    public ProductModel getProduct() {
        return id.getProduct();
    }
    
    public void setProduct(ProductModel product) {
        id.setProduct(product);
    }
    
    @JsonIgnore
    public OrderModel getOrder() {
        return id.getOrder();
    }
    
    public void setOrder(OrderModel order) {
        id.setOrder(order);
    }

    public Double getSubTotal() {
        return price * quantity;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        return result;
    }
    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        OrderItemModel other = (OrderItemModel) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        return true;
    }

}
