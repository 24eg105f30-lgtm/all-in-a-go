package com.allinago.inventory.dto;

import com.allinago.inventory.model.Product;
import com.allinago.inventory.model.ProductVariant;

import java.util.List;

public class ProductDTO {
    private Product product;
    private List<VariantDetailDTO> variants;
    private String vendorName;
    private Double minPrice;
    private Double maxPrice;
    private Integer totalStock;
    private Boolean isLowStock;

    public ProductDTO() {}

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public List<VariantDetailDTO> getVariants() { return variants; }
    public void setVariants(List<VariantDetailDTO> variants) { this.variants = variants; }
    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }
    public Double getMinPrice() { return minPrice; }
    public void setMinPrice(Double minPrice) { this.minPrice = minPrice; }
    public Double getMaxPrice() { return maxPrice; }
    public void setMaxPrice(Double maxPrice) { this.maxPrice = maxPrice; }
    public Integer getTotalStock() { return totalStock; }
    public void setTotalStock(Integer totalStock) { this.totalStock = totalStock; }
    public Boolean getIsLowStock() { return isLowStock; }
    public void setIsLowStock(Boolean isLowStock) { this.isLowStock = isLowStock; }

    public static class VariantDetailDTO {
        private ProductVariant variant;
        private Integer qtyOnHand;
        private Integer safetyStock;
        private Boolean isLowStock;
        private Long warehouseId;
        private String warehouseName;

        public VariantDetailDTO() {}
        public VariantDetailDTO(ProductVariant variant, Integer qtyOnHand, Integer safetyStock, Boolean isLowStock, Long warehouseId, String warehouseName) {
            this.variant = variant;
            this.qtyOnHand = qtyOnHand;
            this.safetyStock = safetyStock;
            this.isLowStock = isLowStock;
            this.warehouseId = warehouseId;
            this.warehouseName = warehouseName;
        }

        public ProductVariant getVariant() { return variant; }
        public void setVariant(ProductVariant variant) { this.variant = variant; }
        public Integer getQtyOnHand() { return qtyOnHand; }
        public void setQtyOnHand(Integer qtyOnHand) { this.qtyOnHand = qtyOnHand; }
        public Integer getSafetyStock() { return safetyStock; }
        public void setSafetyStock(Integer safetyStock) { this.safetyStock = safetyStock; }
        public Boolean getIsLowStock() { return isLowStock; }
        public void setIsLowStock(Boolean isLowStock) { this.isLowStock = isLowStock; }
        public Long getWarehouseId() { return warehouseId; }
        public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
        public String getWarehouseName() { return warehouseName; }
        public void setWarehouseName(String warehouseName) { this.warehouseName = warehouseName; }
    }
}
