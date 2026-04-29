package com.tellus.tellusbackend.service;

import com.tellus.tellusbackend.model.Commande;
import java.util.List;

public interface CommandeService {
    Commande creerCommande(Commande commande);
    Commande modifierStatut(String id, String nouveauStatut);
    List<Commande> getCommandesParAgriculteur(String agriculteurId);
    List<Commande> getCommandesParAcheteur(String acheteurId);
}