package com.allinago.inventory.repository;

import com.allinago.inventory.model.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findByProductId(Long productId);
    Optional<ProductVariant> findByVendorSku(String vendorSku);
    Optional<ProductVariant> findByBarcode(String barcode);
    List<ProductVariant> findByPriceBetween(Double minPrice, Double maxPrice);
}
