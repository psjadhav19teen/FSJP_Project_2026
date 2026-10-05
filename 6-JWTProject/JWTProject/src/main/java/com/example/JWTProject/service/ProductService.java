package com.example.JWTProject.service;



import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.example.JWTProject.model.Product;
import com.example.JWTProject.model.Role;
import com.example.JWTProject.model.User;
import com.example.JWTProject.repository.ProductRepository;
import com.example.JWTProject.repository.UserRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductService(
            ProductRepository productRepository,
            UserRepository userRepository) {

        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public List<Product> getAllProducts() {

        return productRepository.findAll();
    }

    public Product addProduct(
            Product product,
            String username) {

        User user = getUser(username);

        if (user.getRole() != Role.SELLER &&
                user.getRole() != Role.ADMIN) {

            throw new AccessDeniedException(
                    "Only Seller or Admin can add products"
            );
        }

        product.setSeller(user);

        return productRepository.save(product);
    }

    public Product updateProduct(
            Integer id,
            Product updatedProduct,
            String username) {

        User loggedInUser = getUser(username);

        Product existingProduct =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                )
                        );

        // ADMIN can update any product
        if (loggedInUser.getRole() == Role.ADMIN) {

            updateProductData(
                    existingProduct,
                    updatedProduct
            );

            return productRepository.save(
                    existingProduct
            );
        }

        // SELLER can update only own product
        if (loggedInUser.getRole() == Role.SELLER) {

            if (!existingProduct
                    .getSeller()
                    .getId()
                    .equals(loggedInUser.getId())) {

                throw new AccessDeniedException(
                        "You can update only your own products"
                );
            }

            updateProductData(
                    existingProduct,
                    updatedProduct
            );

            return productRepository.save(
                    existingProduct
            );
        }

        throw new AccessDeniedException(
                "You are not allowed to update products"
        );
    }

    public void deleteProduct(
            Integer id,
            String username) {

        User loggedInUser = getUser(username);

        Product product =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                )
                        );

        // ADMIN can delete any product
        if (loggedInUser.getRole() == Role.ADMIN) {

            productRepository.delete(product);
            return;
        }

        // SELLER can delete own product
        if (loggedInUser.getRole() == Role.SELLER) {

            if (!product
                    .getSeller()
                    .getId()
                    .equals(loggedInUser.getId())) {

                throw new AccessDeniedException(
                        "You can delete only your own products"
                );
            }

            productRepository.delete(product);
            return;
        }

        throw new AccessDeniedException(
                "You are not allowed to delete products"
        );
    }

    private void updateProductData(
            Product existing,
            Product updated) {

        existing.setName(updated.getName());
        existing.setCategory(updated.getCategory());
        existing.setPrice(updated.getPrice());
        existing.setQuantity(updated.getQuantity());
    }

    private User getUser(String username) {

        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }
}