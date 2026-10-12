package com.allinago.inventory.service;

import com.allinago.inventory.dto.OrderCreateRequest;
import com.allinago.inventory.dto.OrderResponseDTO;
import com.allinago.inventory.model.*;
import com.allinago.inventory.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Service managing customer orders and multi-vendor order splits.
 * Core College Feature:
 * Splits a single cart into vendor-specific splits with independent tracking numbers.
 */
@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderSplitRepository orderSplitRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductVariantRepository variantRepository;
    private final ProductRepository productRepository;
    private final InventoryLevelRepository inventoryRepository;
    private final VendorRepository vendorRepository;

    public OrderService(
            OrderRepository orderRepository,
            OrderSplitRepository orderSplitRepository,
            OrderItemRepository orderItemRepository,
            ProductVariantRepository variantRepository,
            ProductRepository productRepository,
            InventoryLevelRepository inventoryRepository,
            VendorRepository vendorRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderSplitRepository = orderSplitRepository;
        this.orderItemRepository = orderItemRepository;
        this.variantRepository = variantRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.vendorRepository = vendorRepository;
    }

    /**
     * Core Algorithm:
     * 1. Check stock for each line item.
     * 2. Group items by their vendor.
     * 3. Create parent Order.
     * 4. For each vendor, create an OrderSplit with a unique tracking number.
     * 5. Persist OrderItems linked to both parentOrderId and splitId.
     * 6. Decrement qty_on_hand in inventory_levels.
     */
    @Transactional
    public OrderResponseDTO createOrder(OrderCreateRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty. Please add items to checkout.");
        }

        // Helper structure for pre-validated items
        class ValidatedItem {
            ProductVariant variant;
            Product product;
            InventoryLevel inventory;
            int quantity;
            double totalPrice;
        }

        List<ValidatedItem> validatedItems = new ArrayList<>();
        Map<Long, List<ValidatedItem>> itemsByVendor = new HashMap<>();
        double grandTotal = 0.0;

        for (OrderCreateRequest.OrderItemRequest reqItem : request.getItems()) {
            ProductVariant variant = variantRepository.findById(reqItem.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Product variant not found: " + reqItem.getVariantId()));

            Product product = productRepository.findById(variant.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + variant.getProductId()));

            List<InventoryLevel> invList = inventoryRepository.findByVariantId(variant.getVariantId());
            if (invList.isEmpty()) {
                throw new RuntimeException("No inventory record for variant: " + variant.getVendorSku());
            }

            InventoryLevel primaryInv = invList.get(0);
            if (primaryInv.getQtyOnHand() < reqItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for '" + product.getTitle() + "'. Available: " + primaryInv.getQtyOnHand());
            }

            ValidatedItem vi = new ValidatedItem();
            vi.variant = variant;
            vi.product = product;
            vi.inventory = primaryInv;
            vi.quantity = reqItem.getQuantity();
            vi.totalPrice = variant.getPrice() * reqItem.getQuantity();

            validatedItems.add(vi);
            grandTotal += vi.totalPrice;

            itemsByVendor.computeIfAbsent(product.getVendorId(), k -> new ArrayList<>()).add(vi);
        }

        // Step 1: Save Parent Order
        Order parentOrder = new Order(
                request.getCustomerId() != null ? request.getCustomerId() : 1L,
                request.getCustomerName() != null ? request.getCustomerName() : "Customer",
                request.getCustomerEmail() != null ? request.getCustomerEmail() : "customer@allinago.com",
                request.getShippingAddress() != null ? request.getShippingAddress() : "Standard Delivery Address, India",
                grandTotal,
                "CONFIRMED"
        );
        parentOrder = orderRepository.save(parentOrder);

        List<OrderSplit> createdSplits = new ArrayList<>();
        List<OrderItem> createdItems = new ArrayList<>();

        long timestamp = System.currentTimeMillis();
        int counter = 100;

        // Step 2: Create an OrderSplit for each vendor involved
        for (Map.Entry<Long, List<ValidatedItem>> entry : itemsByVendor.entrySet()) {
            Long vendorId = entry.getKey();
            List<ValidatedItem> vItems = entry.getValue();

            double vendorSubtotal = vItems.stream().mapToDouble(i -> i.totalPrice).sum();

            // Unique tracking number: AG-VND<VendorId>-<TimestampSuffix>
            String trackingNumber = "AG-V" + vendorId + "-" + (timestamp % 100000) + (counter++);
            String estimatedDelivery = LocalDate.now().plusDays(3 + (vendorId % 3))
                    .format(DateTimeFormatter.ofPattern("dd MMM yyyy"));

            OrderSplit split = new OrderSplit(
                    parentOrder.getParentOrderId(),
                    vendorId,
                    vendorSubtotal,
                    "CONFIRMED",
                    trackingNumber,
                    "BlueDart Express",
                    estimatedDelivery
            );
            split = orderSplitRepository.save(split);
            createdSplits.add(split);

            // Step 3: Create OrderItems and decrement inventory
            for (ValidatedItem vi : vItems) {
                String variantDetails = vi.variant.getAttributesJson() != null ? vi.variant.getAttributesJson() : "Standard";
                OrderItem orderItem = new OrderItem(
                        parentOrder.getParentOrderId(),
                        split.getSplitId(),
                        vi.variant.getVariantId(),
                        vi.product.getTitle(),
                        variantDetails,
                        vi.quantity,
                        vi.variant.getPrice(),
                        vi.totalPrice
                );
                orderItem = orderItemRepository.save(orderItem);
                createdItems.add(orderItem);

                // Inventory decrement:
                InventoryLevel inv = vi.inventory;
                inv.setQtyOnHand(inv.getQtyOnHand() - vi.quantity);
                inv.setQtyAllocated(inv.getQtyAllocated() + vi.quantity);
                inventoryRepository.save(inv);
            }
        }

        return new OrderResponseDTO(parentOrder, createdSplits, createdItems);
    }

    public List<OrderResponseDTO> getCustomerOrders(Long customerId) {
        List<Order> orders = orderRepository.findByCustomerIdOrderByOrderDateDesc(customerId);
        List<OrderResponseDTO> results = new ArrayList<>();

        for (Order o : orders) {
            List<OrderSplit> splits = orderSplitRepository.findByParentOrderId(o.getParentOrderId());
            List<OrderItem> items = orderItemRepository.findByParentOrderId(o.getParentOrderId());
            results.add(new OrderResponseDTO(o, splits, items));
        }

        return results;
    }

    public List<OrderSplit> getVendorSplits(Long vendorId) {
        return orderSplitRepository.findByVendorIdOrderByCreatedAtDesc(vendorId);
    }

    public Map<String, Object> trackOrderByTrackingNumber(String trackingNumber) {
        OrderSplit split = orderSplitRepository.findByTrackingNumber(trackingNumber.trim())
                .orElseThrow(() -> new RuntimeException("Tracking number not found: " + trackingNumber));

        Order parentOrder = orderRepository.findById(split.getParentOrderId())
                .orElseThrow(() -> new RuntimeException("Associated parent order not found"));

        List<OrderItem> items = orderItemRepository.findBySplitId(split.getSplitId());
        Vendor vendor = vendorRepository.findById(split.getVendorId()).orElse(null);

        Map<String, Object> trackingInfo = new HashMap<>();
        trackingInfo.put("trackingNumber", split.getTrackingNumber());
        trackingInfo.put("shippingStatus", split.getShippingStatus());
        trackingInfo.put("carrier", split.getCarrier());
        trackingInfo.put("estimatedDelivery", split.getEstimatedDelivery());
        trackingInfo.put("subtotal", split.getSubtotal());
        trackingInfo.put("updatedAt", split.getUpdatedAt());
        trackingInfo.put("createdAt", split.getCreatedAt());
        trackingInfo.put("parentOrderId", parentOrder.getParentOrderId());
        trackingInfo.put("customerName", parentOrder.getCustomerName());
        trackingInfo.put("shippingAddress", parentOrder.getShippingAddress());
        trackingInfo.put("vendorName", vendor != null ? vendor.getName() : "Vendor #" + split.getVendorId());
        trackingInfo.put("items", items);

        // Stages for visualization
        List<Map<String, Object>> steps = new ArrayList<>();
        String[] statuses = {"CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"};
        int currentIndex = 0;
        for (int i = 0; i < statuses.length; i++) {
            if (statuses[i].equalsIgnoreCase(split.getShippingStatus())) {
                currentIndex = i;
                break;
            }
        }

        for (int i = 0; i < statuses.length; i++) {
            Map<String, Object> step = new HashMap<>();
            step.put("status", statuses[i]);
            step.put("completed", i <= currentIndex);
            step.put("current", i == currentIndex);
            steps.add(step);
        }
        trackingInfo.put("timelineSteps", steps);

        return trackingInfo;
    }

    @Transactional
    public OrderSplit updateSplitStatus(Long splitId, String shippingStatus, String trackingNumber, String carrier, String estimatedDelivery) {
        OrderSplit split = orderSplitRepository.findById(splitId)
                .orElseThrow(() -> new RuntimeException("Order split not found with id: " + splitId));

        if (shippingStatus != null && !shippingStatus.isBlank()) {
            split.setShippingStatus(shippingStatus.toUpperCase());
        }
        if (trackingNumber != null && !trackingNumber.isBlank()) {
            split.setTrackingNumber(trackingNumber.trim());
        }
        if (carrier != null && !carrier.isBlank()) {
            split.setCarrier(carrier.trim());
        }
        if (estimatedDelivery != null && !estimatedDelivery.isBlank()) {
            split.setEstimatedDelivery(estimatedDelivery);
        }

        return orderSplitRepository.save(split);
    }
}
