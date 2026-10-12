package com.allinago.inventory.service;

import com.allinago.inventory.dto.ProductDTO;
import com.allinago.inventory.model.InventoryLevel;
import com.allinago.inventory.model.Product;
import com.allinago.inventory.model.ProductVariant;
import com.allinago.inventory.model.Warehouse;
import com.allinago.inventory.repository.InventoryLevelRepository;
import com.allinago.inventory.repository.ProductRepository;
import com.allinago.inventory.repository.ProductVariantRepository;
import com.allinago.inventory.repository.VendorRepository;
import com.allinago.inventory.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service managing product catalogs, variants, and stock aggregation.
 */
@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final InventoryLevelRepository inventoryRepository;
    private final VendorRepository vendorRepository;
    private final WarehouseRepository warehouseRepository;

    public ProductService(
            ProductRepository productRepository,
            ProductVariantRepository variantRepository,
            InventoryLevelRepository inventoryRepository,
            VendorRepository vendorRepository,
            WarehouseRepository warehouseRepository
    ) {
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
        this.inventoryRepository = inventoryRepository;
        this.vendorRepository = vendorRepository;
        this.warehouseRepository = warehouseRepository;
    }

    public List<ProductDTO> getAllProducts(String category, String search, Double minPrice, Double maxPrice) {
        List<Product> products = productRepository.findAll();

        if (category != null && !category.isBlank() && !"All".equalsIgnoreCase(category)) {
            products = products.stream()
                    .filter(p -> p.getCategory().equalsIgnoreCase(category.trim()))
                    .collect(Collectors.toList());
        }

        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase();
            products = products.stream()
                    .filter(p -> p.getTitle().toLowerCase().contains(q) ||
                                 p.getBrand().toLowerCase().contains(q) ||
                                 p.getCategory().toLowerCase().contains(q))
                    .collect(Collectors.toList());
        }

        // Map warehouses for easy name lookup
        Map<Long, String> warehouseNames = warehouseRepository.findAll().stream()
                .collect(Collectors.toMap(Warehouse::getWarehouseId, Warehouse::getLocationName, (a, b) -> a));

        List<ProductDTO> dtoList = new ArrayList<>();

        for (Product product : products) {
            List<ProductVariant> variants = variantRepository.findByProductId(product.getProductId());
            if (variants.isEmpty()) continue;

            List<ProductDTO.VariantDetailDTO> variantDetails = new ArrayList<>();
            double min = Double.MAX_VALUE;
            double max = 0.0;
            int totalStock = 0;
            boolean hasLowStock = false;

            for (ProductVariant v : variants) {
                if (v.getPrice() < min) min = v.getPrice();
                if (v.getPrice() > max) max = v.getPrice();

                List<InventoryLevel> invList = inventoryRepository.findByVariantId(v.getVariantId());
                int variantStock = invList.stream().mapToInt(InventoryLevel::getQtyOnHand).sum();
                int safety = invList.stream().mapToInt(InventoryLevel::getSafetyStock).max().orElse(5);
                boolean low = invList.stream().anyMatch(InventoryLevel::isLowStock);

                Long warehouseId = invList.isEmpty() ? null : invList.get(0).getWarehouseId();
                String warehouseName = warehouseId != null ? warehouseNames.getOrDefault(warehouseId, "Primary Hub") : "Primary Hub";

                if (low) hasLowStock = true;
                totalStock += variantStock;

                variantDetails.add(new ProductDTO.VariantDetailDTO(
                        v,
                        variantStock,
                        safety,
                        low,
                        warehouseId,
                        warehouseName
                ));
            }

            // Price filtering between ₹100 and ₹2000
            if (minPrice != null && max < minPrice) continue;
            if (maxPrice != null && min > maxPrice) continue;

            ProductDTO dto = new ProductDTO();
            dto.setProduct(product);
            dto.setVariants(variantDetails);
            dto.setMinPrice(min == Double.MAX_VALUE ? 0.0 : min);
            dto.setMaxPrice(max);
            dto.setTotalStock(totalStock);
            dto.setIsLowStock(hasLowStock);

            vendorRepository.findById(product.getVendorId()).ifPresent(v -> dto.setVendorName(v.getName()));

            dtoList.add(dto);
        }

        return dtoList;
    }

    public ProductDTO getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        List<ProductVariant> variants = variantRepository.findByProductId(productId);
        Map<Long, String> warehouseNames = warehouseRepository.findAll().stream()
                .collect(Collectors.toMap(Warehouse::getWarehouseId, Warehouse::getLocationName, (a, b) -> a));

        List<ProductDTO.VariantDetailDTO> variantDetails = new ArrayList<>();
        double min = Double.MAX_VALUE;
        double max = 0.0;
        int totalStock = 0;
        boolean hasLowStock = false;

        for (ProductVariant v : variants) {
            if (v.getPrice() < min) min = v.getPrice();
            if (v.getPrice() > max) max = v.getPrice();

            List<InventoryLevel> invList = inventoryRepository.findByVariantId(v.getVariantId());
            int variantStock = invList.stream().mapToInt(InventoryLevel::getQtyOnHand).sum();
            int safety = invList.stream().mapToInt(InventoryLevel::getSafetyStock).max().orElse(5);
            boolean low = invList.stream().anyMatch(InventoryLevel::isLowStock);

            Long warehouseId = invList.isEmpty() ? null : invList.get(0).getWarehouseId();
            String warehouseName = warehouseId != null ? warehouseNames.getOrDefault(warehouseId, "Primary Hub") : "Primary Hub";

            if (low) hasLowStock = true;
            totalStock += variantStock;

            variantDetails.add(new ProductDTO.VariantDetailDTO(
                    v,
                    variantStock,
                    safety,
                    low,
                    warehouseId,
                    warehouseName
            ));
        }

        ProductDTO dto = new ProductDTO();
        dto.setProduct(product);
        dto.setVariants(variantDetails);
        dto.setMinPrice(min == Double.MAX_VALUE ? 0.0 : min);
        dto.setMaxPrice(max);
        dto.setTotalStock(totalStock);
        dto.setIsLowStock(hasLowStock);
        vendorRepository.findById(product.getVendorId()).ifPresent(v -> dto.setVendorName(v.getName()));

        return dto;
    }

    public List<ProductDTO> getProductsByVendor(Long vendorId) {
        List<ProductDTO> all = getAllProducts(null, null, null, null);
        return all.stream()
                .filter(p -> p.getProduct().getVendorId().equals(vendorId))
                .collect(Collectors.toList());
    }

    @Transactional
    public Product createProductWithVariant(
            Long vendorId,
            String title,
            String brand,
            String globalSku,
            String taxClass,
            String category,
            String description,
            String imageUrl,
            String vendorSku,
            String barcode,
            String attributesJson,
            Double price,
            Integer initialStock,
            Integer safetyStock,
            Long warehouseId
    ) {
        Product product = new Product(vendorId, title, brand, globalSku, taxClass, category, description, imageUrl);
        product = productRepository.save(product);

        ProductVariant variant = new ProductVariant(product.getProductId(), vendorSku, barcode, attributesJson, price);
        variant = variantRepository.save(variant);

        InventoryLevel inventory = new InventoryLevel(
                variant.getVariantId(),
                warehouseId != null ? warehouseId : 1L,
                initialStock != null ? initialStock : 20,
                0,
                0,
                safetyStock != null ? safetyStock : 5
        );
        inventoryRepository.save(inventory);

        return product;
    }
}
