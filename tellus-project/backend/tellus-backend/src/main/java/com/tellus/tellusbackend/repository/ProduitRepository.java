package com.tellus.tellusbackend.repository;

import com.tellus.tellusbackend.model.Produit;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProduitRepository extends MongoRepository<Produit, String> {
    // Permettra de trouver les récoltes proches d'un acheteur [cite: 75]
    List<Produit> findByLocationNear(Point location, Distance distance);
}
