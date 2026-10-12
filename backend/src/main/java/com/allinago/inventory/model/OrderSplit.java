package com.allinago.inventory.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * College Specification Table: Order_Splits
 * Core Multi-Vendor Feature: When an order contains items from multiple vendors,
 * it is partitioned into vendor-specific splits.
 * Each vendor fulfills their own split with an independent tracking number.
 */
@Entity
@Table(name = "order_splits")
public class OrderSplit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "split_id")
    private Long splitId;

    @Column(name = "parent_order_id", nullable = false)
    private Long parentOrderId;

    @Column(name = "vendor_id", nullable = false)
    private Long vendorId;

    @Column(nullable = false)
    private Double subtotal;

    @Column(name = "shipping_status", nullable = false)
    private String shippingStatus; // "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"

    @Column(name = "tracking_number", nullable = false, unique = true)
    private String trackingNumber; // e.g. "AG-DEL-74921"

    @Column(name = "carrier")
    private String carrier = "BlueDart Express";

    @Column(name = "estimated_delivery")
    private String estimatedDelivery;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public OrderSplit() {}

    public OrderSplit(Long parentOrderId, Long vendorId, Double subtotal, String shippingStatus, String trackingNumber, String carrier, String estimatedDelivery) {
        this.parentOrderId = parentOrderId;
        this.vendorId = vendorId;
        this.subtotal = subtotal;
        this.shippingStatus = shippingStatus;
        this.trackingNumber = trackingNumber;
        this.carrier = carrier != null ? carrier : "BlueDart Express";
        this.estimatedDelivery = estimatedDelivery;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getSplitId() {
        return splitId;
    }

    public void setSplitId(Long splitId) {
        this.splitId = splitId;
    }

    public Long getParentOrderId() {
        return parentOrderId;
    }

    public void setParentOrderId(Long parentOrderId) {
        this.parentOrderId = parentOrderId;
    }

    public Long getVendorId() {
        return vendorId;
    }

    public void setVendorId(Long vendorId) {
        this.vendorId = vendorId;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    public String getShippingStatus() {
        return shippingStatus;
    }

    public void setShippingStatus(String shippingStatus) {
        this.shippingStatus = shippingStatus;
        this.updatedAt = LocalDateTime.now();
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public String getCarrier() {
        return carrier;
    }

    public void setCarrier(String carrier) {
        this.carrier = carrier;
    }

    public String getEstimatedDelivery() {
        return estimatedDelivery;
    }

    public void setEstimatedDelivery(String estimatedDelivery) {
        this.estimatedDelivery = estimatedDelivery;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
