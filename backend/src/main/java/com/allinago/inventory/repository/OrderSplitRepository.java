package com.allinago.inventory.repository;

import com.allinago.inventory.model.OrderSplit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderSplitRepository extends JpaRepository<OrderSplit, Long> {
    List<OrderSplit> findByVendorIdOrderByCreatedAtDesc(Long vendorId);
    List<OrderSplit> findByParentOrderId(Long parentOrderId);
    Optional<OrderSplit> findByTrackingNumber(String trackingNumber);
}
