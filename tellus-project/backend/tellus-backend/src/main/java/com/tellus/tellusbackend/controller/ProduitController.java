package com.tellus.tellusbackend.controller;

import com.tellus.tellusbackend.model.Produit;
import com.tellus.tellusbackend.service.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
@CrossOrigin(origins = "*") // Utile pour le développement avec le Front
public class ProduitController {

    @Autowired
    private ProduitService produitService;

    // 1. Création d'une annonce (Standard)
    @PostMapping
    public ResponseEntity<Produit> creerAnnonce(@RequestBody Produit produit) {
        return new ResponseEntity<>(produitService.creerAnnonce(produit), HttpStatus.CREATED);
    }

    // 2. Synchronisation en masse (Mode Hors-ligne)
    // Reçoit la liste des annonces stockées localement sur le téléphone
    @PostMapping("/sync")
    public ResponseEntity<List<Produit>> synchroniser(@RequestBody List<Produit> produits) {
        return ResponseEntity.ok(produitService.synchroniserAnnonces(produits));
    }

    // 3. Récupérer toutes les annonces
    @GetMapping
    public ResponseEntity<List<Produit>> listerToutesLesAnnonces() {
        return ResponseEntity.ok(produitService.listerToutesLesAnnonces());
    }

    // 4. Récupérer une annonce spécifique
    @GetMapping("/{id}")
    public ResponseEntity<Produit> recupererParId(@PathVariable String id) {
        return produitService.recupererParId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 5. Modification d'une annonce
    @PutMapping("/{id}")
    public ResponseEntity<Produit> modifierAnnonce(@PathVariable String id, @RequestBody Produit produit) {
        try {
            return ResponseEntity.ok(produitService.modifierAnnonce(id, produit));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 6. Suppression d'une annonce
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerAnnonce(@PathVariable String id) {
        produitService.supprimerAnnonce(id);
        return ResponseEntity.noContent().build();
    }
}