package com.allinago.inventory.dto;

import java.util.List;

public class OrderCreateRequest {
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String shippingAddress;
    private List<OrderItemRequest> items;

    public OrderCreateRequest() {}

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }

    public static class OrderItemRequest {
        private Long variantId;
        private Integer quantity;

        public OrderItemRequest() {}
        public OrderItemRequest(Long variantId, Integer quantity) {
            this.variantId = variantId;
            this.quantity = quantity;
        }
        public Long getVariantId() { return variantId; }
        public void setVariantId(Long variantId) { this.variantId = variantId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}
