package com.example.JWTProject.repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.JWTProject.model.Product;
import com.example.JWTProject.model.User;

public interface ProductRepository
        extends JpaRepository<Product, Integer> {

    List<Product> findBySeller(User seller);
}