package com.tellus.tellusbackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "produits")
@Data
public class Produit {
    @Id
    private String id;

    private String titre; // [cite: 19]
    private String photoUrl; // [cite: 19]
    private Double quantite; // [cite: 19]
    private Double prixAuKg; // [cite: 19]
    private LocalDate dateDisponibilite; // [cite: 19]
    private String label; // [cite: 19]

    // Indexation géospatiale pour la recherche par rayon
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint location;

    private String agriculteurId; // ID de l'utilisateur qui crée l'annonce
    private String statut = "DISPONIBLE"; // [cite: 77, 78]
}
