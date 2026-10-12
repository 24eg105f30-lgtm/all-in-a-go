package com.allinago.inventory.model;

import jakarta.persistence.*;

/**
 * College Specification Table: Warehouses
 * Represents storage centers where product variants are stocked.
 */
@Entity
@Table(name = "warehouses")
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "warehouse_id")
    private Long warehouseId;

    @Column(name = "vendor_id", nullable = false)
    private Long vendorId;

    @Column(name = "location_name", nullable = false)
    private String locationName;

    @Column(nullable = false, length = 500)
    private String address;

    @Column(name = "is_marketplace_owned", nullable = false)
    private Boolean isMarketplaceOwned; // true if managed by platform, false if vendor facility

    public Warehouse() {}

    public Warehouse(Long vendorId, String locationName, String address, Boolean isMarketplaceOwned) {
        this.vendorId = vendorId;
        this.locationName = locationName;
        this.address = address;
        this.isMarketplaceOwned = isMarketplaceOwned;
    }

    public Long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Long warehouseId) {
        this.warehouseId = warehouseId;
    }

    public Long getVendorId() {
        return vendorId;
    }

    public void setVendorId(Long vendorId) {
        this.vendorId = vendorId;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Boolean getIsMarketplaceOwned() {
        return isMarketplaceOwned;
    }

    public void setIsMarketplaceOwned(Boolean isMarketplaceOwned) {
        this.isMarketplaceOwned = isMarketplaceOwned;
    }
}
