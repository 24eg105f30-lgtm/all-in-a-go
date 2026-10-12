package com.allinago.inventory.controller;

import com.allinago.inventory.model.Vendor;
import com.allinago.inventory.model.Warehouse;
import com.allinago.inventory.repository.VendorRepository;
import com.allinago.inventory.repository.WarehouseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class VendorController {

    private final VendorRepository vendorRepository;
    private final WarehouseRepository warehouseRepository;

    public VendorController(VendorRepository vendorRepository, WarehouseRepository warehouseRepository) {
        this.vendorRepository = vendorRepository;
        this.warehouseRepository = warehouseRepository;
    }

    @GetMapping("/vendors")
    public ResponseEntity<List<Vendor>> getAllVendors() {
        return ResponseEntity.ok(vendorRepository.findAll());
    }

    @GetMapping("/vendors/{id}")
    public ResponseEntity<?> getVendorById(@PathVariable Long id) {
        return vendorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/warehouses")
    public ResponseEntity<List<Warehouse>> getAllWarehouses() {
        return ResponseEntity.ok(warehouseRepository.findAll());
    }
}
