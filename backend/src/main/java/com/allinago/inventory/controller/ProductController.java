package com.allinago.inventory.controller;

import com.allinago.inventory.dto.ProductDTO;
import com.allinago.inventory.model.Product;
import com.allinago.inventory.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        return ResponseEntity.ok(productService.getAllProducts(category, search, minPrice, maxPrice));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(productService.getProductById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<ProductDTO>> getProductsByVendor(@PathVariable Long vendorId) {
        return ResponseEntity.ok(productService.getProductsByVendor(vendorId));
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Map<String, Object> body) {
        try {
            Long vendorId = Long.valueOf(body.get("vendorId").toString());
            String title = (String) body.get("title");
            String brand = (String) body.get("brand");
            String globalSku = (String) body.get("globalSku");
            String taxClass = (String) body.getOrDefault("taxClass", "GST_18");
            String category = (String) body.get("category");
            String description = (String) body.get("description");
            String imageUrl = (String) body.get("imageUrl");

            String vendorSku = (String) body.getOrDefault("vendorSku", globalSku + "-V1");
            String barcode = (String) body.getOrDefault("barcode", "890" + (System.currentTimeMillis() % 1000000000L));
            String attributesJson = (String) body.getOrDefault("attributesJson", "{\"standard\": true}");
            Double price = Double.valueOf(body.get("price").toString());

            Integer initialStock = body.containsKey("initialStock") ? Integer.valueOf(body.get("initialStock").toString()) : 20;
            Integer safetyStock = body.containsKey("safetyStock") ? Integer.valueOf(body.get("safetyStock").toString()) : 5;
            Long warehouseId = body.containsKey("warehouseId") ? Long.valueOf(body.get("warehouseId").toString()) : 1L;

            Product created = productService.createProductWithVariant(
                    vendorId, title, brand, globalSku, taxClass, category, description, imageUrl,
                    vendorSku, barcode, attributesJson, price, initialStock, safetyStock, warehouseId
            );

            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
