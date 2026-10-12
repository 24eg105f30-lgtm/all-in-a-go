package com.allinago.inventory.repository;

import com.allinago.inventory.model.InventoryLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryLevelRepository extends JpaRepository<InventoryLevel, Long> {

    List<InventoryLevel> findByVariantId(Long variantId);

    Optional<InventoryLevel> findByVariantIdAndWarehouseId(Long variantId, Long warehouseId);

    List<InventoryLevel> findByWarehouseId(Long warehouseId);

    /**
     * USP Query: Finds all understocked inventory records where physical quantity is at or below safety stock.
     */
    @Query("SELECT i FROM InventoryLevel i WHERE i.qtyOnHand <= i.safetyStock")
    List<InventoryLevel> findLowStockInventories();
}
