package com.tellus.tellusbackend.service;

import com.tellus.tellusbackend.model.Commande;
import com.tellus.tellusbackend.model.User;
import com.tellus.tellusbackend.repository.CommandeRepository;
import com.tellus.tellusbackend.repository.UserRepository;
import com.tellus.tellusbackend.service.CommandeService;
import com.tellus.tellusbackend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommandeServiceImpl implements CommandeService {

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Override
    public Commande creerCommande(Commande commande) {
        // 1. Sauvegarde en base
        Commande nouvelleCommande = commandeRepository.save(commande);

        // 2. Récupérer l'agriculteur pour avoir son FCM Token
        userRepository.findById(commande.getAgriculteurId()).ifPresent(agriculteur -> {
            if (agriculteur.getFcmToken() != null) {
                // 3. Envoyer la notification push au mobile
                notificationService.sendPushNotification(
                        agriculteur.getFcmToken(),
                        "Nouvelle commande !",
                        "Vous avez reçu une demande pour " + commande.getQuantite() + " kg."
                );
            }
        });

        return nouvelleCommande;
    }

    @Override
    public Commande modifierStatut(String id, String nouveauStatut) {
        Commande cmd = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
        cmd.setStatut(nouveauStatut);
        return commandeRepository.save(cmd);
    }

    @Override
    public List<Commande> getCommandesParAgriculteur(String agriculteurId) {
        return commandeRepository.findByAgriculteurId(agriculteurId);
    }

    @Override
    public List<Commande> getCommandesParAcheteur(String acheteurId) {
        return commandeRepository.findByAcheteurId(acheteurId);
    }
}