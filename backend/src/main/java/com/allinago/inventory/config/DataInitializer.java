package com.allinago.inventory.config;

import com.allinago.inventory.model.*;
import com.allinago.inventory.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Pre-populates the database with realistic products strictly matching the user's 4 categories,
 * Indian prices (₹100 to ₹2,000), multi-vendor setups, and low-stock test scenarios.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final VendorRepository vendorRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final InventoryLevelRepository inventoryRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final OrderSplitRepository orderSplitRepository;
    private final OrderItemRepository orderItemRepository;

    public DataInitializer(
            VendorRepository vendorRepository,
            WarehouseRepository warehouseRepository,
            ProductRepository productRepository,
            ProductVariantRepository variantRepository,
            InventoryLevelRepository inventoryRepository,
            UserRepository userRepository,
            OrderRepository orderRepository,
            OrderSplitRepository orderSplitRepository,
            OrderItemRepository orderItemRepository
    ) {
        this.vendorRepository = vendorRepository;
        this.warehouseRepository = warehouseRepository;
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
        this.inventoryRepository = inventoryRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.orderSplitRepository = orderSplitRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Already initialized
        }

        // ==========================================
        // 1. SEED VENDORS
        // ==========================================
        Vendor v1 = vendorRepository.save(new Vendor("Apex Lifestyle & Home", "ACTIVE", 8.0, "KEY_APEX_8912", "vendor@allinago.com", "vendor123", "+91 9820011223"));
        Vendor v2 = vendorRepository.save(new Vendor("Urban Trendz Fashion", "ACTIVE", 10.0, "KEY_URBAN_3321", "fashion@allinago.com", "fashion123", "+91 9830022334"));
        Vendor v3 = vendorRepository.save(new Vendor("NextGen Tech & Hobbies", "ACTIVE", 7.5, "KEY_NEXTGEN_7714", "tech@allinago.com", "tech123", "+91 9840033445"));

        // ==========================================
        // 2. SEED WAREHOUSES
        // ==========================================
        Warehouse w1 = warehouseRepository.save(new Warehouse(v1.getVendorId(), "Mumbai Central Logistics Hub", "Plot 42, MIDC Industrial Area, Andheri East, Mumbai, Maharashtra 400093", true));
        Warehouse w2 = warehouseRepository.save(new Warehouse(v2.getVendorId(), "Bengaluru Tech Park Depot", "Survey 88, Electronic City Phase 1, Bengaluru, Karnataka 560100", false));
        Warehouse w3 = warehouseRepository.save(new Warehouse(v3.getVendorId(), "Delhi NCR North Fulfillment", "Khasra 21, NH-8 Logistics Corridor, Gurugram, Haryana 122001", true));

        // ==========================================
        // 3. SEED USERS (Customers, Vendors, Admin)
        // ==========================================
        userRepository.save(new User("Rahul Sharma (Customer)", "customer@allinago.com", "customer123", "CUSTOMER", null));
        userRepository.save(new User("Priya Patel (Customer)", "priya@gmail.com", "priya123", "CUSTOMER", null));
        userRepository.save(new User("Apex Vendor Admin", "vendor@allinago.com", "vendor123", "VENDOR", v1.getVendorId()));
        userRepository.save(new User("Urban Trendz Vendor Admin", "fashion@allinago.com", "fashion123", "VENDOR", v2.getVendorId()));
        userRepository.save(new User("NextGen Vendor Admin", "tech@allinago.com", "tech123", "VENDOR", v3.getVendorId()));
        userRepository.save(new User("Marketplace SuperAdmin", "admin@allinago.com", "admin123", "ADMIN", null));

        // ==========================================
        // 4. SEED PRODUCTS & VARIANTS & INVENTORIES
        // ==========================================

        // --- Category 1: Home, Living & Lifestyle (Vendor 1) ---
        seedItem(
                v1.getVendorId(), w1.getWarehouseId(),
                "Bohemian Jute Floor Rug (3x5 ft)", "UrbanCraft", "HM-RUG-01", "GST_12",
                "Home, Living & Lifestyle",
                "Handcrafted eco-friendly natural jute braided rug. Durable, reversible, and perfect for living rooms or bedrooms.",
                "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&q=80",
                "SKU-RUG-NAT-01", "8901001001", "{\"color\": \"Natural Jute\", \"size\": \"3x5 ft\"}",
                799.0, 18, 5
        );

        seedItem(
                v1.getVendorId(), w1.getWarehouseId(),
                "Blackout Velvet Curtains (Set of 2)", "LoomLiving", "HM-CURT-02", "GST_12",
                "Home, Living & Lifestyle",
                "Thermal insulated room darkening velvet curtains with stainless steel rust-free eyelets (7 feet length).",
                "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
                "SKU-CURT-NAVY-02", "8901001002", "{\"color\": \"Navy Blue\", \"length\": \"7 ft\"}",
                949.0, 3, 5 // UNDERSTOCK ALERT: stock=3, safety=5!
        );

        seedItem(
                v1.getVendorId(), w1.getWarehouseId(),
                "Handcrafted Ceramic Flower Vase", "ClayStudio", "HM-VASE-03", "GST_12",
                "Home, Living & Lifestyle",
                "Modern fluted design ceramic flower vase finished in matte terracotta finish. Perfect for dry floral arrangements.",
                "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80",
                "SKU-VASE-TERR-03", "8901001003", "{\"material\": \"Ceramic\", \"color\": \"Terracotta\"}",
                399.0, 24, 6
        );

        seedItem(
                v1.getVendorId(), w1.getWarehouseId(),
                "Tri-Ply Stainless Steel Cooking Pan", "VinodCook", "HM-PAN-04", "GST_18",
                "Home, Living & Lifestyle",
                "Heavy-bottom 3-ply induction-compatible frying pan with stay-cool riveted handle (24 cm diameter).",
                "https://images.unsplash.com/photo-1584990347449-3995874c84db?auto=format&fit=crop&w=600&q=80",
                "SKU-PAN-SS-24", "8901001004", "{\"diameter\": \"24 cm\", \"finish\": \"Mirror Polish\"}",
                1499.0, 15, 4
        );

        seedItem(
                v1.getVendorId(), w1.getWarehouseId(),
                "Ceramic Dinner Plates (Set of 4)", "EarthWare", "HM-PLT-05", "GST_12",
                "Home, Living & Lifestyle",
                "Microwave & dishwasher safe artisan glazed ceramic quarter dinner plates in speckled ivory tone.",
                "https://images.unsplash.com/photo-1614088445019-3f191b2c55b6?auto=format&fit=crop&w=600&q=80",
                "SKU-PLT-IVR-4PK", "8901001005", "{\"color\": \"Speckled Ivory\", \"count\": \"4 pcs\"}",
                649.0, 12, 4
        );

        seedItem(
                v1.getVendorId(), w1.getWarehouseId(),
                "Self-Watering Ceramic Planters (Set of 3)", "GreenLeaf", "HM-PLNT-06", "GST_12",
                "Home, Living & Lifestyle",
                "Indoor gardening planter pot combo with drainage holes and bamboo saucer trays for succulents and herbs.",
                "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
                "SKU-PLNT-WHT-3PK", "8901001006", "{\"color\": \"White Ceramic\", \"size\": \"Small/Med\"}",
                499.0, 20, 5
        );

        // --- Category 2: Apparel, Fashion & Accessories (Vendor 2) ---
        seedItem(
                v2.getVendorId(), w2.getWarehouseId(),
                "100% Organic Heavyweight Cotton T-Shirt", "SoulStore", "AP-TSHIRT-01", "GST_5",
                "Apparel, Fashion & Accessories",
                "240 GSM pre-shrunk combed organic cotton oversized drop-shoulder t-shirt. Ultra soft breathable fabric.",
                "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
                "SKU-TSHIRT-BLK-L", "8902001001", "{\"color\": \"Pitch Black\", \"size\": \"L\"}",
                499.0, 35, 10
        );

        seedItem(
                v2.getVendorId(), w2.getWarehouseId(),
                "Slim Fit Stretchable Denim Jeans", "Urbano", "AP-JEANS-02", "GST_12",
                "Apparel, Fashion & Accessories",
                "Mid-rise 5-pocket faded wash stretchable comfort denim jeans tailored for daily commuting.",
                "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
                "SKU-JEANS-BLU-32", "8902001002", "{\"color\": \"Dark Indigo\", \"waist\": \"32\"}",
                1199.0, 2, 8 // UNDERSTOCK ALERT: stock=2, safety=8!
        );

        seedItem(
                v2.getVendorId(), w2.getWarehouseId(),
                "Breathable Mesh Athletic Running Shoes", "RedTape", "AP-SHOE-03", "GST_18",
                "Apparel, Fashion & Accessories",
                "Lightweight cushioned EVA sole sneakers with memory foam insole for sports and running.",
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
                "SKU-SHOE-RED-8", "8902001003", "{\"color\": \"Crimson Red\", \"size\": \"UK 8\"}",
                1499.0, 14, 5
        );

        seedItem(
                v2.getVendorId(), w2.getWarehouseId(),
                "Genuine Leather Bifold RFID Protected Wallet", "UrbanForest", "AP-WLT-04", "GST_18",
                "Apparel, Fashion & Accessories",
                "Top-grain matte leather wallet with currency dividers, coin pocket, and 6 RFID card slots.",
                "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
                "SKU-WLT-BRN-01", "8902001004", "{\"material\": \"Genuine Leather\", \"color\": \"Vintage Brown\"}",
                599.0, 28, 6
        );

        seedItem(
                v2.getVendorId(), w2.getWarehouseId(),
                "Polarized Wayfarer Sunglasses (UV400)", "VincentChase", "AP-SUN-05", "GST_18",
                "Apparel, Fashion & Accessories",
                "Featherweight TR90 frame with TAC anti-glare polarized lenses protecting 100% against UVA/UVB rays.",
                "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
                "SKU-SUN-MBLK", "8902001005", "{\"frame\": \"Matte Black\", \"lens\": \"Smoke Grey\"}",
                799.0, 16, 5
        );

        seedItem(
                v2.getVendorId(), w2.getWarehouseId(),
                "Water-Resistant City Laptop Backpack (25L)", "Wildcraft", "AP-BAG-06", "GST_18",
                "Apparel, Fashion & Accessories",
                "Ergonomic padded shoulder straps with padded sleeve holding laptops up to 15.6 inches.",
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
                "SKU-BAG-GRY-25L", "8902001006", "{\"color\": \"Space Grey\", \"capacity\": \"25L\"}",
                1299.0, 11, 4
        );

        // --- Category 3: Electronics & Gadgets (Vendor 3) ---
        seedItem(
                v3.getVendorId(), w3.getWarehouseId(),
                "Wireless Over-Ear ANC Headphones", "BoatRockerz", "EL-HEAD-01", "GST_18",
                "Electronics & Gadgets",
                "Active Noise Cancelling Bluetooth 5.3 headphones with 40-hour playback and rapid fast charge.",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
                "SKU-HEAD-BLK-01", "8903001001", "{\"connectivity\": \"Bluetooth 5.3\", \"color\": \"Matte Black\"}",
                1699.0, 22, 6
        );

        seedItem(
                v3.getVendorId(), w3.getWarehouseId(),
                "Portable Waterproof Bluetooth Speaker (16W)", "Portronics", "EL-SPK-02", "GST_18",
                "Electronics & Gadgets",
                "IPX7 waterproof rugged portable speaker with dual bass radiators and 12-hour playtime.",
                "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
                "SKU-SPK-BLU-16W", "8903001002", "{\"power\": \"16W\", \"color\": \"Ocean Blue\"}",
                1199.0, 19, 5
        );

        seedItem(
                v3.getVendorId(), w3.getWarehouseId(),
                "20000mAh 22.5W Fast Charging Power Bank", "MiPower", "EL-PB-03", "GST_18",
                "Electronics & Gadgets",
                "Triple output USB-A & Type-C power bank supporting PD 3.0 and QC 3.0 fast charging protocols.",
                "https://images.unsplash.com/photo-1609592424308-410787e95b05?auto=format&fit=crop&w=600&q=80",
                "SKU-PB-BLK-20K", "8903001003", "{\"capacity\": \"20000mAh\", \"speed\": \"22.5W\"}",
                1499.0, 1, 5 // UNDERSTOCK ALERT: stock=1, safety=5!
        );

        seedItem(
                v3.getVendorId(), w3.getWarehouseId(),
                "Adjustable Aluminium Ergonomic Laptop Stand", "Portronics", "EL-STND-04", "GST_18",
                "Electronics & Gadgets",
                "Foldable ventilated aluminum alloy riser with 6-level angle adjustments for cooling and posture.",
                "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
                "SKU-STND-SLV-01", "8903001004", "{\"material\": \"Aluminum Alloy\", \"color\": \"Silver\"}",
                649.0, 30, 8
        );

        seedItem(
                v3.getVendorId(), w3.getWarehouseId(),
                "Smart Home WiFi Plug with Energy Monitor", "WiproNext", "EL-PLUG-05", "GST_18",
                "Electronics & Gadgets",
                "Control lights and appliances remotely via mobile app or Alexa/Google Home without requiring hub.",
                "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
                "SKU-PLUG-16A-WHT", "8903001005", "{\"rating\": \"16 Amp\", \"voice_control\": \"Alexa/Google\"}",
                699.0, 40, 10
        );

        // --- Category 4: Hobbies, Toys & Entertainment (Vendor 3 & 1) ---
        seedItem(
                v3.getVendorId(), w3.getWarehouseId(),
                "Classic Strategy Board Game (Settlers)", "Funskool", "HB-GAME-01", "GST_12",
                "Hobbies, Toys & Entertainment",
                "Award-winning strategic island building board game for 3-4 players. High replayability for families & friends.",
                "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80",
                "SKU-GAME-SETTL-01", "8904001001", "{\"players\": \"3-4 Players\", \"age\": \"10+\"}",
                899.0, 15, 4
        );

        seedItem(
                v3.getVendorId(), w3.getWarehouseId(),
                "Anti-Slip High Density Yoga Mat (6mm)", "Boldfit", "HB-YOGA-02", "GST_12",
                "Hobbies, Toys & Entertainment",
                "Non-toxic TPE eco-friendly dual-layer textured gym workout mat with carry bag and alignment lines.",
                "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80",
                "SKU-YOGA-TEAL-6MM", "8904001002", "{\"thickness\": \"6mm\", \"color\": \"Teal Green\"}",
                699.0, 25, 5
        );

        seedItem(
                v3.getVendorId(), w3.getWarehouseId(),
                "Hexagonal Rubber Coated Dumbbells (5kg Pair)", "KoboFit", "HB-DB-03", "GST_18",
                "Hobbies, Toys & Entertainment",
                "Cast iron solid core dumbbell pair with anti-roll hexagonal rubber casing and knurled chrome handles.",
                "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
                "SKU-DB-5KG-PAIR", "8904001003", "{\"weight\": \"5kg x 2\", \"shape\": \"Hexagonal\"}",
                1399.0, 4, 6 // UNDERSTOCK ALERT: stock=4, safety=6!
        );

        seedItem(
                v3.getVendorId(), w3.getWarehouseId(),
                "Hardcover Dot-Grid Bullet Journal Planner", "FactorNotes", "HB-NOTE-04", "GST_12",
                "Hobbies, Toys & Entertainment",
                "100 GSM bleed-resistant ivory pages notebook with faux leather binding, elastic closure, and ribbon bookmark.",
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
                "SKU-NOTE-A5-EMRLD", "8904001004", "{\"pages\": \"192 Pages\", \"color\": \"Emerald Green\"}",
                349.0, 50, 10
        );

        seedItem(
                v3.getVendorId(), w3.getWarehouseId(),
                "38-Inch Acoustic Guitar with Gig Bag", "Kadence", "HB-GTR-05", "GST_18",
                "Hobbies, Toys & Entertainment",
                "Cutaway design linden wood acoustic guitar with truss rod, steel strings, picks, and nylon carry strap.",
                "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80",
                "SKU-GTR-38-NAT", "8904001005", "{\"size\": \"38-Inch\", \"color\": \"Natural Wood\"}",
                1999.0, 8, 3
        );

        // ==========================================
        // 5. SEED INITIAL SAMPLE ORDER TO DEMONSTRATE MULTI-VENDOR SPLITTING & TRACKING
        // ==========================================
        Order sampleOrder = new Order(
                1L,
                "Rahul Sharma",
                "customer@allinago.com",
                "Flat 402, Sunrise Residency, Powai, Mumbai - 400076",
                1298.0,
                "CONFIRMED"
        );
        sampleOrder = orderRepository.save(sampleOrder);

        // Split 1: for Vendor 1 (Apex Lifestyle) -> Bohemian Jute Floor Rug
        OrderSplit split1 = new OrderSplit(
                sampleOrder.getParentOrderId(),
                v1.getVendorId(),
                799.0,
                "SHIPPED",
                "AG-V1-984210",
                "BlueDart Express",
                "14 Oct 2026"
        );
        split1 = orderSplitRepository.save(split1);

        orderItemRepository.save(new OrderItem(
                sampleOrder.getParentOrderId(),
                split1.getSplitId(),
                1L,
                "Bohemian Jute Floor Rug (3x5 ft)",
                "Natural Jute (3x5 ft)",
                1,
                799.0,
                799.0
        ));

        // Split 2: for Vendor 2 (Urban Trendz) -> 100% Organic Heavyweight Cotton T-Shirt
        OrderSplit split2 = new OrderSplit(
                sampleOrder.getParentOrderId(),
                v2.getVendorId(),
                499.0,
                "PACKED",
                "AG-V2-883194",
                "Delhivery Logistics",
                "16 Oct 2026"
        );
        split2 = orderSplitRepository.save(split2);

        orderItemRepository.save(new OrderItem(
                sampleOrder.getParentOrderId(),
                split2.getSplitId(),
                7L,
                "100% Organic Heavyweight Cotton T-Shirt",
                "Pitch Black (Size L)",
                1,
                499.0,
                499.0
        ));

        System.out.println(">>> [All in a Go] Initial Seed Data Loaded Successfully!");
        System.out.println(">>> Pre-loaded Vendors: 3 | Warehouses: 3 | Products: 17 | Low-Stock Scenarios: Active");
    }

    private void seedItem(
            Long vendorId, Long warehouseId,
            String title, String brand, String globalSku, String taxClass,
            String category, String description, String imageUrl,
            String vendorSku, String barcode, String attributesJson,
            Double price, Integer qtyOnHand, Integer safetyStock
    ) {
        Product p = productRepository.save(new Product(vendorId, title, brand, globalSku, taxClass, category, description, imageUrl));
        ProductVariant pv = variantRepository.save(new ProductVariant(p.getProductId(), vendorSku, barcode, attributesJson, price));
        inventoryRepository.save(new InventoryLevel(pv.getVariantId(), warehouseId, qtyOnHand, 0, 0, safetyStock));
    }
}
