package com.allinago.inventory.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * College Specification Table: Vendors
 * Represents marketplace sellers supplying products into the inventory system.
 */
@Entity
@Table(name = "vendors")
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vendor_id")
    private Long vendorId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String status; // "ACTIVE", "PENDING", "SUSPENDED"

    @Column(name = "commission_rate", nullable = false)
    private Double commissionRate; // e.g., 8.5 for 8.5%

    @Column(name = "api_key_hash")
    private String apiKeyHash;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Vendor() {}

    public Vendor(String name, String status, Double commissionRate, String apiKeyHash, String email, String password, String contactPhone) {
        this.name = name;
        this.status = status;
        this.commissionRate = commissionRate;
        this.apiKeyHash = apiKeyHash;
        this.email = email;
        this.password = password;
        this.contactPhone = contactPhone;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getVendorId() {
        return vendorId;
    }

    public void setVendorId(Long vendorId) {
        this.vendorId = vendorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getCommissionRate() {
        return commissionRate;
    }

    public void setCommissionRate(Double commissionRate) {
        this.commissionRate = commissionRate;
    }

    public String getApiKeyHash() {
        return apiKeyHash;
    }

    public void setApiKeyHash(String apiKeyHash) {
        this.apiKeyHash = apiKeyHash;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
