package com.allinago.inventory.controller;

import com.allinago.inventory.dto.OrderCreateRequest;
import com.allinago.inventory.dto.OrderResponseDTO;
import com.allinago.inventory.dto.TrackingUpdateDTO;
import com.allinago.inventory.model.OrderSplit;
import com.allinago.inventory.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * Places a customer order and automatically splits it across vendors into OrderSplits.
     */
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderCreateRequest request) {
        try {
            OrderResponseDTO response = orderService.createOrder(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Gets all parent orders for a customer with split statuses.
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderResponseDTO>> getCustomerOrders(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderService.getCustomerOrders(customerId));
    }

    /**
     * Gets all splits for a specific vendor.
     */
    @GetMapping("/vendor/{vendorId}/splits")
    public ResponseEntity<List<OrderSplit>> getVendorSplits(@PathVariable Long vendorId) {
        return ResponseEntity.ok(orderService.getVendorSplits(vendorId));
    }

    /**
     * USP Endpoint: Customer live order tracking by tracking number.
     */
    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<?> trackOrder(@PathVariable String trackingNumber) {
        try {
            Map<String, Object> trackingData = orderService.trackOrderByTrackingNumber(trackingNumber);
            return ResponseEntity.ok(trackingData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Vendor updates shipment status (e.g. PACKED -> SHIPPED -> DELIVERED).
     */
    @PutMapping("/splits/{splitId}/status")
    public ResponseEntity<?> updateSplitStatus(
            @PathVariable Long splitId,
            @RequestBody TrackingUpdateDTO dto
    ) {
        try {
            OrderSplit updated = orderService.updateSplitStatus(
                    splitId,
                    dto.getShippingStatus(),
                    dto.getTrackingNumber(),
                    dto.getCarrier(),
                    dto.getEstimatedDelivery()
            );
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
