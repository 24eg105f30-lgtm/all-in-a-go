package com.allinago.inventory.dto;

/**
 * DTO representing an automated Low Stock Warning.
 * Triggered whenever qtyOnHand <= safetyStock.
 */
public class LowStockAlertDTO {
    private Long inventoryId;
    private Long variantId;
    private Long productId;
    private String productTitle;
    private String brand;
    private String category;
    private String vendorSku;
    private Double price;
    private Long vendorId;
    private String vendorName;
    private Long warehouseId;
    private String warehouseLocation;
    private Integer qtyOnHand;
    private Integer safetyStock;
    private Integer shortfall; // safetyStock - qtyOnHand (if positive)
    private String severity; // "CRITICAL_OUT_OF_STOCK" if 0, "LOW_STOCK_WARNING" if <= safetyStock

    public LowStockAlertDTO() {}

    public Long getInventoryId() { return inventoryId; }
    public void setInventoryId(Long inventoryId) { this.inventoryId = inventoryId; }
    public Long getVariantId() { return variantId; }
    public void setVariantId(Long variantId) { this.variantId = variantId; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductTitle() { return productTitle; }
    public void setProductTitle(String productTitle) { this.productTitle = productTitle; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getVendorSku() { return vendorSku; }
    public void setVendorSku(String vendorSku) { this.vendorSku = vendorSku; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Long getVendorId() { return vendorId; }
    public void setVendorId(Long vendorId) { this.vendorId = vendorId; }
    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }
    public Long getWarehouseId() { return warehouseId; }
    public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
    public String getWarehouseLocation() { return warehouseLocation; }
    public void setWarehouseLocation(String warehouseLocation) { this.warehouseLocation = warehouseLocation; }
    public Integer getQtyOnHand() { return qtyOnHand; }
    public void setQtyOnHand(Integer qtyOnHand) { this.qtyOnHand = qtyOnHand; }
    public Integer getSafetyStock() { return safetyStock; }
    public void setSafetyStock(Integer safetyStock) { this.safetyStock = safetyStock; }
    public Integer getShortfall() { return shortfall; }
    public void setShortfall(Integer shortfall) { this.shortfall = shortfall; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
}
