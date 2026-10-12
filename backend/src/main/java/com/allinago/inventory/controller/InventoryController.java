package com.allinago.inventory.controller;

import com.allinago.inventory.dto.InventoryUpdateDTO;
import com.allinago.inventory.dto.LowStockAlertDTO;
import com.allinago.inventory.model.InventoryLevel;
import com.allinago.inventory.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    /**
     * USP Endpoint: Fetches active low-stock warnings (qtyOnHand <= safetyStock).
     */
    @GetMapping("/low-stock-alerts")
    public ResponseEntity<List<LowStockAlertDTO>> getLowStockAlerts(@RequestParam(required = false) Long vendorId) {
        return ResponseEntity.ok(inventoryService.getLowStockAlerts(vendorId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<InventoryLevel>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @PutMapping("/{inventoryId}")
    public ResponseEntity<?> updateInventory(
            @PathVariable Long inventoryId,
            @RequestBody InventoryUpdateDTO dto
    ) {
        try {
            InventoryLevel updated = inventoryService.updateInventory(inventoryId, dto.getQtyOnHand(), dto.getSafetyStock());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{inventoryId}/restock")
    public ResponseEntity<?> quickRestock(
            @PathVariable Long inventoryId,
            @RequestParam(defaultValue = "15") int units
    ) {
        try {
            InventoryLevel updated = inventoryService.quickRestock(inventoryId, units);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
