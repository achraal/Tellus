package com.tellus.tellusbackend.controller;

import com.tellus.tellusbackend.model.Commande;
import com.tellus.tellusbackend.repository.CommandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commandes")
@CrossOrigin(origins = "*")
public class CommandeController {

    @Autowired
    private CommandeRepository commandeRepository;

    // 1. L'agriculteur récupère SES commandes reçues
    @GetMapping("/mes-ventes")
    @PreAuthorize("hasRole('ROLE_AGRICULTEUR')")
    public List<Commande> getMesVentes(@AuthenticationPrincipal String email) {
        // Ici, on récupère les commandes où agriculteurId correspond à l'utilisateur connecté
        return commandeRepository.findByAgriculteurEmail(email);
    }

    // 2. L'agriculteur Valide ou Refuse
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ROLE_AGRICULTEUR')")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody String nouveauStatut) {
        Commande cmd = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        cmd.setStatut(nouveauStatut);
        commandeRepository.save(cmd);

        // TODO: Déclencher la notification Push vers l'acheteur ici
        return ResponseEntity.ok("Statut mis à jour : " + nouveauStatut);
    }
}
