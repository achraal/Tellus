package com.tellus.tellusbackend.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtils {
    private String jwtSecret = "votre_cle_secrete_tres_longue_pour_tellus_2026";
    private int jwtExpirationMs = 86400000; // 24 heures

    public String generateJwtToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    // Ajoutez ici les méthodes de validation du token (validateJwtToken, getEmailFromJwtToken)
}
