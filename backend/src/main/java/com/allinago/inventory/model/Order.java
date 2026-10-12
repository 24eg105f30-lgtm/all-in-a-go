package com.allinago.inventory.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Parent Order placed by the Customer.
 * Contains the cumulative total, shipping info, and partitions into OrderSplits per vendor.
 */
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "parent_order_id")
    private Long parentOrderId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_email", nullable = false)
    private String customerEmail;

    @Column(name = "shipping_address", nullable = false, length = 1000)
    private String shippingAddress;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate = LocalDateTime.now();

    @Column(nullable = false)
    private String status; // "CONFIRMED", "PROCESSING", "COMPLETED", "CANCELLED"

    public Order() {}

    public Order(Long customerId, String customerName, String customerEmail, String shippingAddress, Double totalAmount, String status) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.shippingAddress = shippingAddress;
        this.totalAmount = totalAmount;
        this.status = status;
        this.orderDate = LocalDateTime.now();
    }

    public Long getParentOrderId() {
        return parentOrderId;
    }

    public void setParentOrderId(Long parentOrderId) {
        this.parentOrderId = parentOrderId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
