package com.allinago.inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Entry Point for "All in a Go" - Multi-Inventory Management System.
 * 
 * Features:
 * 1. Multi-vendor order splitting into independent Order_Splits.
 * 2. Automated low-stock warning system when qty_on_hand <= safety_stock.
 * 3. Real-time parcel tracking for customers.
 * 4. Zero-configuration H2 in-memory DB + PostgreSQL ready for Render deployment.
 */
@SpringBootApplication
public class AllInAGoApplication {

    public static void main(String[] args) {
        SpringApplication.run(AllInAGoApplication.class, args);
        System.out.println("===============================================================");
        System.out.println("🚀 [All in a Go] Multi-Inventory Backend Started Successfully!");
        System.out.println("📦 REST API Root:   http://localhost:8080/api/products");
        System.out.println("📊 H2 DB Console:   http://localhost:8080/h2-console");
        System.out.println("🔔 Low Stock Alerts: http://localhost:8080/api/inventory/low-stock-alerts");
        System.out.println("===============================================================");
    }
}
