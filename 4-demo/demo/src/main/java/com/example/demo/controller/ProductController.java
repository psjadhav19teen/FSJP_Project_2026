package com.example.demo.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Product;

@RestController
@CrossOrigin("*")
public class ProductController {

    List<Product> productList = new ArrayList<>();

    public ProductController() {

        productList.add(
                new Product(1, "Laptop", "Electronics", 55000)
        );

        productList.add(
                new Product(2, "Smartphone", "Electronics", 25000)
        );

        productList.add(
                new Product(3, "Headphones", "Accessories", 2500)
        );

        productList.add(
                new Product(4, "Running Shoes", "Footwear", 3500)
        );
    }

    @GetMapping("/products")
    public List<Product> getProducts() {

        return productList;
    }
}
