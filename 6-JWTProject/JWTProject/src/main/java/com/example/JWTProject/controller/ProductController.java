package com.example.JWTProject.controller;



import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.JWTProject.model.Product;
import com.example.JWTProject.service.ProductService;

@RestController
@RequestMapping("/products")
@CrossOrigin("*")
public class ProductController {

    private final ProductService productService;

    public ProductController(
            ProductService productService) {

        this.productService = productService;
    }

    // CUSTOMER + SELLER + ADMIN
    @GetMapping
    public List<Product> getAllProducts() {

        return productService.getAllProducts();
    }

    // SELLER + ADMIN
    @PostMapping
    public ResponseEntity<Product> addProduct(
            @RequestBody Product product,
            Authentication authentication) {

        String username =
                authentication.getName();

        return ResponseEntity.ok(
                productService.addProduct(
                        product,
                        username
                )
        );
    }

    // SELLER own + ADMIN all
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Integer id,
            @RequestBody Product product,
            Authentication authentication) {

        String username =
                authentication.getName();

        return ResponseEntity.ok(
                productService.updateProduct(
                        id,
                        product,
                        username
                )
        );
    }

    // SELLER own + ADMIN all
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable Integer id,
            Authentication authentication) {

        String username =
                authentication.getName();

        productService.deleteProduct(
                id,
                username
        );

        return ResponseEntity.ok(
                "Product deleted successfully"
        );
    }
}