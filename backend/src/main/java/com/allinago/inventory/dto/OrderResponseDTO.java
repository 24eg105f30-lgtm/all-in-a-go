package com.allinago.inventory.dto;

import com.allinago.inventory.model.Order;
import com.allinago.inventory.model.OrderItem;
import com.allinago.inventory.model.OrderSplit;

import java.util.List;

public class OrderResponseDTO {
    private Order order;
    private List<OrderSplit> splits;
    private List<OrderItem> items;

    public OrderResponseDTO() {}

    public OrderResponseDTO(Order order, List<OrderSplit> splits, List<OrderItem> items) {
        this.order = order;
        this.splits = splits;
        this.items = items;
    }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public List<OrderSplit> getSplits() { return splits; }
    public void setSplits(List<OrderSplit> splits) { this.splits = splits; }
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}
