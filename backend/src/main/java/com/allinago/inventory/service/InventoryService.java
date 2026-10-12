package com.allinago.inventory.service;

import com.allinago.inventory.dto.LowStockAlertDTO;
import com.allinago.inventory.model.InventoryLevel;
import com.allinago.inventory.model.Product;
import com.allinago.inventory.model.ProductVariant;
import com.allinago.inventory.model.Vendor;
import com.allinago.inventory.model.Warehouse;
import com.allinago.inventory.repository.InventoryLevelRepository;
import com.allinago.inventory.repository.ProductRepository;
import com.allinago.inventory.repository.ProductVariantRepository;
import com.allinago.inventory.repository.VendorRepository;
import com.allinago.inventory.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service managing Inventory Levels and the Low-Stock Alert System.
 * Core USP: Automated low-stock trigger whenever qty_on_hand <= safety_stock.
 */
@Service
public class InventoryService {

    private final InventoryLevelRepository inventoryRepository;
    private final ProductVariantRepository variantRepository;
    private final ProductRepository productRepository;
    private final VendorRepository vendorRepository;
    private final WarehouseRepository warehouseRepository;

    public InventoryService(
            InventoryLevelRepository inventoryRepository,
            ProductVariantRepository variantRepository,
            ProductRepository productRepository,
            VendorRepository vendorRepository,
            WarehouseRepository warehouseRepository
    ) {
        this.inventoryRepository = inventoryRepository;
        this.variantRepository = variantRepository;
        this.productRepository = productRepository;
        this.vendorRepository = vendorRepository;
        this.warehouseRepository = warehouseRepository;
    }

    /**
     * USP Method: Returns all products/variants whose stock is at or below the safety threshold.
     * Can be filtered by vendorId.
     */
    public List<LowStockAlertDTO> getLowStockAlerts(Long vendorId) {
        List<InventoryLevel> lowStocks = inventoryRepository.findLowStockInventories();
        List<LowStockAlertDTO> alerts = new ArrayList<>();

        Map<Long, ProductVariant> variants = variantRepository.findAll().stream()
                .collect(Collectors.toMap(ProductVariant::getVariantId, v -> v));
        Map<Long, Product> products = productRepository.findAll().stream()
                .collect(Collectors.toMap(Product::getProductId, p -> p));
        Map<Long, Vendor> vendors = vendorRepository.findAll().stream()
                .collect(Collectors.toMap(Vendor::getVendorId, v -> v));
        Map<Long, Warehouse> warehouses = warehouseRepository.findAll().stream()
                .collect(Collectors.toMap(Warehouse::getWarehouseId, w -> w));

        for (InventoryLevel inv : lowStocks) {
            ProductVariant variant = variants.get(inv.getVariantId());
            if (variant == null) continue;

            Product product = products.get(variant.getProductId());
            if (product == null) continue;

            // If a vendorId filter is provided, skip alerts for other vendors
            if (vendorId != null && !product.getVendorId().equals(vendorId)) {
                continue;
            }

            Vendor vendor = vendors.get(product.getVendorId());
            Warehouse warehouse = warehouses.get(inv.getWarehouseId());

            LowStockAlertDTO alert = new LowStockAlertDTO();
            alert.setInventoryId(inv.getInventoryId());
            alert.setVariantId(variant.getVariantId());
            alert.setProductId(product.getProductId());
            alert.setProductTitle(product.getTitle());
            alert.setBrand(product.getBrand());
            alert.setCategory(product.getCategory());
            alert.setVendorSku(variant.getVendorSku());
            alert.setPrice(variant.getPrice());
            alert.setVendorId(product.getVendorId());
            alert.setVendorName(vendor != null ? vendor.getName() : "Vendor #" + product.getVendorId());
            alert.setWarehouseId(inv.getWarehouseId());
            alert.setWarehouseLocation(warehouse != null ? warehouse.getLocationName() : "Warehouse #" + inv.getWarehouseId());
            alert.setQtyOnHand(inv.getQtyOnHand());
            alert.setSafetyStock(inv.getSafetyStock());

            int shortfall = inv.getSafetyStock() - inv.getQtyOnHand();
            alert.setShortfall(Math.max(shortfall, 0));

            if (inv.getQtyOnHand() == 0) {
                alert.setSeverity("CRITICAL_OUT_OF_STOCK");
            } else {
                alert.setSeverity("LOW_STOCK_WARNING");
            }

            alerts.add(alert);
        }

        return alerts;
    }

    public List<InventoryLevel> getAllInventory() {
        return inventoryRepository.findAll();
    }

    @Transactional
    public InventoryLevel updateInventory(Long inventoryId, Integer qtyOnHand, Integer safetyStock) {
        InventoryLevel inv = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + inventoryId));

        if (qtyOnHand != null) {
            inv.setQtyOnHand(Math.max(0, qtyOnHand));
        }
        if (safetyStock != null) {
            inv.setSafetyStock(Math.max(1, safetyStock));
        }

        return inventoryRepository.save(inv);
    }

    @Transactional
    public InventoryLevel quickRestock(Long inventoryId, int unitsToAdd) {
        InventoryLevel inv = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + inventoryId));

        inv.setQtyOnHand(inv.getQtyOnHand() + Math.max(1, unitsToAdd));
        return inventoryRepository.save(inv);
    }
}
