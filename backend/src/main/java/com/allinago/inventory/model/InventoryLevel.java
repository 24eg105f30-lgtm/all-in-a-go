package com.allinago.inventory.model;

import jakarta.persistence.*;

/**
 * College Specification Table: Inventory_Levels
 * Manages physical, reserved, and allocated counts per warehouse.
 * Unique Selling Point: Low stock warning triggers when qty_on_hand <= safety_stock.
 */
@Entity
@Table(name = "inventory_levels")
public class InventoryLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Long inventoryId;

    @Column(name = "variant_id", nullable = false)
    private Long variantId;

    @Column(name = "warehouse_id", nullable = false)
    private Long warehouseId;

    @Column(name = "qty_on_hand", nullable = false)
    private Integer qtyOnHand; // Physical items physically present in warehouse

    @Column(name = "qty_reserved", nullable = false)
    private Integer qtyReserved; // Held for checkouts in progress

    @Column(name = "qty_allocated", nullable = false)
    private Integer qtyAllocated; // Committed to orders awaiting packing

    @Column(name = "safety_stock", nullable = false)
    private Integer safetyStock; // Minimum buffer threshold before triggering warning

    public InventoryLevel() {}

    public InventoryLevel(Long variantId, Long warehouseId, Integer qtyOnHand, Integer qtyReserved, Integer qtyAllocated, Integer safetyStock) {
        this.variantId = variantId;
        this.warehouseId = warehouseId;
        this.qtyOnHand = qtyOnHand;
        this.qtyReserved = qtyReserved;
        this.qtyAllocated = qtyAllocated;
        this.safetyStock = safetyStock;
    }

    /**
     * USP Evaluation:
     * Returns true if inventory is understocked or depleted.
     */
    public boolean isLowStock() {
        return this.qtyOnHand <= this.safetyStock;
    }

    public Long getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(Long inventoryId) {
        this.inventoryId = inventoryId;
    }

    public Long getVariantId() {
        return variantId;
    }

    public void setVariantId(Long variantId) {
        this.variantId = variantId;
    }

    public Long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Long warehouseId) {
        this.warehouseId = warehouseId;
    }

    public Integer getQtyOnHand() {
        return qtyOnHand;
    }

    public void setQtyOnHand(Integer qtyOnHand) {
        this.qtyOnHand = qtyOnHand;
    }

    public Integer getQtyReserved() {
        return qtyReserved;
    }

    public void setQtyReserved(Integer qtyReserved) {
        this.qtyReserved = qtyReserved;
    }

    public Integer getQtyAllocated() {
        return qtyAllocated;
    }

    public void setQtyAllocated(Integer qtyAllocated) {
        this.qtyAllocated = qtyAllocated;
    }

    public Integer getSafetyStock() {
        return safetyStock;
    }

    public void setSafetyStock(Integer safetyStock) {
        this.safetyStock = safetyStock;
    }
}
