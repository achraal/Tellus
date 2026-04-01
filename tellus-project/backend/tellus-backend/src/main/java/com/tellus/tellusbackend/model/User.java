package com.tellus.tellusbackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password; // Sera haché avec BCrypt ou Argon2 [cite: 61]
    private String nom;
    private String entreprise; // Pour l'acheteur Pro
    private String role; // "ROLE_AGRICULTEUR", "ROLE_ACHETEUR", "ROLE_ADMIN"
}