package com.tellus.tellusbackend.repository;

import com.tellus.tellusbackend.model.Commande;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommandeRepository extends MongoRepository<Commande, String> {
    List<Commande> findByAgriculteurEmail(String email);

    // Pour l'agriculteur (Mobile) : Voir ses ventes
    List<Commande> findByAgriculteurId(String agriculteurId);

    // Pour l'acheteur (Web) : Voir ses achats
    List<Commande> findByAcheteurId(String acheteurId);

    // Filtrer par statut (ex: toutes les commandes "PENDING")
    List<Commande> findByAgriculteurIdAndStatut(String agriculteurId, String statut);
}