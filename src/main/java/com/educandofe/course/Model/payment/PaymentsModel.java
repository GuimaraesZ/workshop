package com.educandofe.course.Model.payment;
import java.time.Instant;
import java.time.LocalDateTime;
import java.io.Serializable;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.educandofe.course.Model.order.OrderModel;

@Entity
public class PaymentsModel implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime moment;

    @OneToOne
    @MapsId
    private OrderModel order;

    public PaymentsModel() {
    }

    public PaymentsModel(Long id, LocalDateTime moment, OrderModel order) {
        this.id = id;
        this.moment = moment;
        this.order = order;
    }
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
    @JsonIgnore
    public OrderModel getOrder() {
        return order;
    }
    public void setOrder(OrderModel order) {
        this.order = order;
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
        PaymentsModel other = (PaymentsModel) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        return true;
    }


}
