package com.allinago.inventory.model;

import jakarta.persistence.*;

/**
 * College Specification Table: Product_Variants
 * Holds individual SKUs, pricing (between ₹100 and ₹2000), barcodes, and attributes.
 */
@Entity
@Table(name = "product_variants")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variant_id")
    private Long variantId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "vendor_sku", nullable = false)
    private String vendorSku;

    @Column(nullable = false)
    private String barcode;

    @Column(name = "attributes_json", columnDefinition = "TEXT")
    private String attributesJson; // e.g., {"color": "Onyx Black", "size": "Large"}

    @Column(nullable = false)
    private Double price; // Indian pricing (₹100 - ₹2000)

    public ProductVariant() {}

    public ProductVariant(Long productId, String vendorSku, String barcode, String attributesJson, Double price) {
        this.productId = productId;
        this.vendorSku = vendorSku;
        this.barcode = barcode;
        this.attributesJson = attributesJson;
        this.price = price;
    }

    public Long getVariantId() {
        return variantId;
    }

    public void setVariantId(Long variantId) {
        this.variantId = variantId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getVendorSku() {
        return vendorSku;
    }

    public void setVendorSku(String vendorSku) {
        this.vendorSku = vendorSku;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getAttributesJson() {
        return attributesJson;
    }

    public void setAttributesJson(String attributesJson) {
        this.attributesJson = attributesJson;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}
