package com.allinago.inventory.service;

import com.allinago.inventory.dto.AuthRequest;
import com.allinago.inventory.dto.AuthResponse;
import com.allinago.inventory.dto.RegisterRequest;
import com.allinago.inventory.model.User;
import com.allinago.inventory.model.Vendor;
import com.allinago.inventory.repository.UserRepository;
import com.allinago.inventory.repository.VendorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.Optional;

/**
 * Service handling authentication and registration for Customers and Vendors.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;

    public AuthService(UserRepository userRepository, VendorRepository vendorRepository) {
        this.userRepository = userRepository;
        this.vendorRepository = vendorRepository;
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid credentials provided.");
        }

        // Generate demo auth token (Base64 encoded identifier for simple and fast viva demonstration)
        String token = Base64.getEncoder().encodeToString((user.getEmail() + ":" + System.currentTimeMillis()).getBytes());

        return new AuthResponse(
                token,
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getVendorId()
        );
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already registered: " + email);
        }

        Long vendorId = null;
        String role = request.getRole() != null ? request.getRole().toUpperCase() : "CUSTOMER";

        if ("VENDOR".equalsIgnoreCase(role)) {
            // Automatically create a corresponding Vendor record in the 'vendors' table
            String vendorName = request.getVendorName() != null && !request.getVendorName().isBlank()
                    ? request.getVendorName()
                    : request.getName() + " Store";

            Vendor vendor = new Vendor(
                    vendorName,
                    "ACTIVE",
                    8.0, // standard 8% commission rate
                    "API_KEY_" + System.currentTimeMillis(),
                    email,
                    request.getPassword(),
                    request.getPhone() != null ? request.getPhone() : "+91 9876543210"
            );
            vendor = vendorRepository.save(vendor);
            vendorId = vendor.getVendorId();
        }

        User newUser = new User(
                request.getName(),
                email,
                request.getPassword(),
                role,
                vendorId
        );
        userRepository.save(newUser);

        String token = Base64.getEncoder().encodeToString((newUser.getEmail() + ":" + System.currentTimeMillis()).getBytes());

        return new AuthResponse(
                token,
                newUser.getUserId(),
                newUser.getName(),
                newUser.getEmail(),
                newUser.getRole(),
                newUser.getVendorId()
        );
    }
}
