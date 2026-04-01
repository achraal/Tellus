package com.tellus.tellusbackend.service;

import com.tellus.tellusbackend.model.Produit;
import java.util.List;
import java.util.Optional;

public interface ProduitService {
    Produit creerAnnonce(Produit produit);
    List<Produit> listerToutesLesAnnonces();
    Optional<Produit> recupererParId(String id);
    Produit modifierAnnonce(String id, Produit produitDetails);
    void supprimerAnnonce(String id);
    // Pour la synchronisation offline-first
    List<Produit> synchroniserAnnonces(List<Produit> produits);
}
