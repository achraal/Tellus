package com.tellus.tellusbackend.controller;

import com.tellus.tellusbackend.config.JwtUtils;
import com.tellus.tellusbackend.model.User;
import com.tellus.tellusbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Erreur: Email déjà utilisé !");
        }

        // Hachage du mot de passe avec Argon2
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Par défaut, on peut assigner ROLE_AGRICULTEUR pour le mobile [cite: 14]
        if (user.getRole() == null) user.setRole("ROLE_AGRICULTEUR");

        userRepository.save(user);
        return ResponseEntity.ok("Utilisateur enregistré avec succès !");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérification du mot de passe Argon2
        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            String jwt = jwtUtils.generateJwtToken(user.getEmail());
            return ResponseEntity.ok(new JwtResponse(jwt, user.getEmail(), user.getRole()));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Identifiants incorrects");
        }
    }
}