package api.point_interet.api_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import api.point_interet.api_service.model.Proprietaire;

import java.util.List;

@Repository
public interface ProprietaireRepository extends JpaRepository<Proprietaire, Long> {
    
    // Rechercher les propriétaires ayant des points relais avec une capacité disponible
    @Query("SELECT DISTINCT p FROM Proprietaire p JOIN p.pointsRelais pr WHERE pr.stockActuel < pr.capaciteMaximale")
    List<Proprietaire> findProprietairesWithAvailablePointsRelais();
    
    // Rechercher les propriétaires par ville
    @Query("SELECT DISTINCT p FROM Proprietaire p JOIN p.pointsRelais pr JOIN pr.adresse a WHERE a.ville = :ville")
    List<Proprietaire> findByPointsRelaisVille(String ville);
    
    // Rechercher les propriétaires par code postal
    @Query("SELECT DISTINCT p FROM Proprietaire p JOIN p.pointsRelais pr JOIN pr.adresse a WHERE a.codePostal = :codePostal")
    List<Proprietaire> findByPointsRelaisCodePostal(String codePostal);
} 