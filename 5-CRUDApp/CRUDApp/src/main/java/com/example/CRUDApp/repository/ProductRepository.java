package com.example.CRUDApp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.CRUDApp.model.Product;
public interface ProductRepository extends JpaRepository<Product, Integer>
{
}