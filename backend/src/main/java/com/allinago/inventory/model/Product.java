package com.allinago.inventory.model;

import jakarta.persistence.*;

/**
 * College Specification Table: Products
 * Represents the parent product catalog item.
 */
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "vendor_id", nullable = false)
    private Long vendorId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String brand;

    @Column(name = "global_sku", nullable = false, unique = true)
    private String globalSku;

    @Column(name = "tax_class", nullable = false)
    private String taxClass; // e.g., "GST_18", "GST_12", "GST_5"

    @Column(nullable = false)
    private String category; // e.g. "Home, Living & Lifestyle", "Apparel, Fashion & Accessories", etc.

    @Column(length = 2000)
    private String description;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    public Product() {}

    public Product(Long vendorId, String title, String brand, String globalSku, String taxClass, String category, String description, String imageUrl) {
        this.vendorId = vendorId;
        this.title = title;
        this.brand = brand;
        this.globalSku = globalSku;
        this.taxClass = taxClass;
        this.category = category;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getVendorId() {
        return vendorId;
    }

    public void setVendorId(Long vendorId) {
        this.vendorId = vendorId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getGlobalSku() {
        return globalSku;
    }

    public void setGlobalSku(String globalSku) {
        this.globalSku = globalSku;
    }

    public String getTaxClass() {
        return taxClass;
    }

    public void setTaxClass(String taxClass) {
        this.taxClass = taxClass;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
