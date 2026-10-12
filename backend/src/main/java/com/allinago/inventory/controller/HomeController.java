package com.allinago.inventory.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {

    @GetMapping("/")
    @ResponseBody
    public String home() {
        return "<!DOCTYPE html>" +
               "<html><head><title>All in a Go - Backend Live</title>" +
               "<style>body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; padding: 60px 20px; background: #f8fafc; color: #1e293b; } " +
               ".card { background: white; max-width: 550px; margin: 0 auto; padding: 40px; border-radius: 24px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; } " +
               "h1 { color: #4338ca; font-size: 26px; margin-bottom: 12px; } " +
               "p { color: #64748b; font-size: 14px; line-height: 1.6; } " +
               ".btn { display: inline-block; margin-top: 24px; padding: 14px 28px; background: #4f46e5; color: white; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.39); } " +
               ".links { margin-top: 30px; padding-top: 20px; border-top: 1px solid #f1f5f9; font-size: 13px; } " +
               ".links a { color: #4f46e5; text-decoration: none; margin: 0 10px; font-weight: 600; }" +
               "</style></head><body>" +
               "<div class='card'>" +
               "<h1>🚀 Backend API is Live!</h1>" +
               "<p>Your Java Spring Boot multi-inventory backend is up and running healthy.</p>" +
               "<p>To view your website, storefront, vendor portal, and order tracker:</p>" +
               "<a class='btn' href='http://localhost:5173'>👉 Open Storefront: http://localhost:5173</a>" +
               "<div class='links'>" +
               "<a href='/h2-console'>📊 H2 Database Console</a>" +
               "<a href='/api/products'>📦 Products API</a>" +
               "<a href='/api/inventory/low-stock-alerts'>🔔 Low Stock Alerts API</a>" +
               "</div>" +
               "</div></body></html>";
    }
}
