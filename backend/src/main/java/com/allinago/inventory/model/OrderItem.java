package com.allinago.inventory.model;

import jakarta.persistence.*;

/**
 * Line items within an order, tied to an OrderSplit and ProductVariant.
 */
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "parent_order_id", nullable = false)
    private Long parentOrderId;

    @Column(name = "split_id", nullable = false)
    private Long splitId;

    @Column(name = "variant_id", nullable = false)
    private Long variantId;

    @Column(name = "product_title", nullable = false)
    private String productTitle;

    @Column(name = "variant_details")
    private String variantDetails;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false)
    private Double unitPrice;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    public OrderItem() {}

    public OrderItem(Long parentOrderId, Long splitId, Long variantId, String productTitle, String variantDetails, Integer quantity, Double unitPrice, Double totalPrice) {
        this.parentOrderId = parentOrderId;
        this.splitId = splitId;
        this.variantId = variantId;
        this.productTitle = productTitle;
        this.variantDetails = variantDetails;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public Long getParentOrderId() {
        return parentOrderId;
    }

    public void setParentOrderId(Long parentOrderId) {
        this.parentOrderId = parentOrderId;
    }

    public Long getSplitId() {
        return splitId;
    }

    public void setSplitId(Long splitId) {
        this.splitId = splitId;
    }

    public Long getVariantId() {
        return variantId;
    }

    public void setVariantId(Long variantId) {
        this.variantId = variantId;
    }

    public String getProductTitle() {
        return productTitle;
    }

    public void setProductTitle(String productTitle) {
        this.productTitle = productTitle;
    }

    public String getVariantDetails() {
        return variantDetails;
    }

    public void setVariantDetails(String variantDetails) {
        this.variantDetails = variantDetails;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }
}
