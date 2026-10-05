package com.example.JWTProject.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.JWTProject.security.JwtFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Authentication
                        .requestMatchers(
                                "/auth/register",
                                "/auth/login"
                        ).permitAll()

                        // Everyone logged in can view products
                        .requestMatchers(
                                org.springframework.http.HttpMethod.GET,
                                "/products/**"
                        ).hasAnyRole(
                                "CUSTOMER",
                                "SELLER",
                                "ADMIN"
                        )

                        // Seller and Admin can add
                        .requestMatchers(
                                org.springframework.http.HttpMethod.POST,
                                "/products/**"
                        ).hasAnyRole(
                                "SELLER",
                                "ADMIN"
                        )

                        // Seller/Admin can update
                        .requestMatchers(
                                org.springframework.http.HttpMethod.PUT,
                                "/products/**"
                        ).hasAnyRole(
                                "SELLER",
                                "ADMIN"
                        )

                        // Seller/Admin can delete
                        .requestMatchers(
                                org.springframework.http.HttpMethod.DELETE,
                                "/products/**"
                        ).hasAnyRole(
                                "SELLER",
                                "ADMIN"
                        )

                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}