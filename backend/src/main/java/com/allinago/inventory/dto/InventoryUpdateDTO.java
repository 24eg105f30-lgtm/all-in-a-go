package com.allinago.inventory.dto;

public class InventoryUpdateDTO {
    private Integer qtyOnHand;
    private Integer safetyStock;

    public InventoryUpdateDTO() {}
    public InventoryUpdateDTO(Integer qtyOnHand, Integer safetyStock) {
        this.qtyOnHand = qtyOnHand;
        this.safetyStock = safetyStock;
    }
    public Integer getQtyOnHand() { return qtyOnHand; }
    public void setQtyOnHand(Integer qtyOnHand) { this.qtyOnHand = qtyOnHand; }
    public Integer getSafetyStock() { return safetyStock; }
    public void setSafetyStock(Integer safetyStock) { this.safetyStock = safetyStock; }
}
