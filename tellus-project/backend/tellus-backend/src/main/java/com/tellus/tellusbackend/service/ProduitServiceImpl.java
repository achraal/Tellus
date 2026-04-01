package com.tellus.tellusbackend.service;

import com.tellus.tellusbackend.model.Produit;
import com.tellus.tellusbackend.repository.ProduitRepository;
import com.tellus.tellusbackend.service.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProduitServiceImpl implements ProduitService {

    @Autowired
    private ProduitRepository produitRepository;

    @Override
    public Produit creerAnnonce(Produit produit) {
        // Le statut initial est toujours DISPONIBLE
        produit.setStatut("DISPONIBLE");
        return produitRepository.save(produit);
    }

    @Override
    public List<Produit> listerToutesLesAnnonces() {
        return produitRepository.findAll();
    }

    @Override
    public Optional<Produit> recupererParId(String id) {
        return produitRepository.findById(id);
    }

    @Override
    public Produit modifierAnnonce(String id, Produit details) {
        return produitRepository.findById(id).map(p -> {
            p.setTitre(details.getTitre());
            p.setQuantite(details.getQuantite());
            p.setPrixAuKg(details.getPrixAuKg());
            p.setLabel(details.getLabel());
            p.setPhotoUrl(details.getPhotoUrl());
            p.setLocation(details.getLocation()); // Mise à jour GPS
            return produitRepository.save(p);
        }).orElseThrow(() -> new RuntimeException("Annonce non trouvée"));
    }

    @Override
    public void supprimerAnnonce(String id) {
        produitRepository.deleteById(id);
    }

    @Override
    public List<Produit> synchroniserAnnonces(List<Produit> produits) {
        // Sauvegarde en masse pour le mode Offline-First
        return produitRepository.saveAll(produits);
    }
}