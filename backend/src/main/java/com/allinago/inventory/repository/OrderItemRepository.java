package com.allinago.inventory.repository;

import com.allinago.inventory.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByParentOrderId(Long parentOrderId);
    List<OrderItem> findBySplitId(Long splitId);
}
