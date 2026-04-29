package com.tellus.tellusbackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "commandes")
@Data
public class Commande {
    @Id
    private String id;
    private String produitId;
    private String acheteurId;
    private String agriculteurId; // Pratique pour filtrer les ventes de l'agriculteur
    private String agriculteurEmail;

    private Double quantite;
    private Double prixTotal;
    private String statut; // "EN_ATTENTE", "VALIDEE", "REFUSEE", "LIVREE"
    private LocalDateTime dateCommande = LocalDateTime.now();

    // Token FCM de l'agriculteur pour la notification
    private String fcmTokenAgriculteur;
}
