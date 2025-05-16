package api.point_interet.api_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import api.point_interet.api_service.model.PointRelais;

import java.util.List;

@Repository
public interface PointRelaisRepository extends JpaRepository<PointRelais, Long> {
    
    // Rechercher par ville
    @Query("SELECT p FROM PointRelais p WHERE p.adresse.ville = :ville")
    List<PointRelais> findByVille(@Param("ville") String ville);
    
    // Rechercher par code postal
    @Query("SELECT p FROM PointRelais p WHERE p.adresse.codePostal = :codePostal")
    List<PointRelais> findByCodePostal(@Param("codePostal") String codePostal);
    
    // Rechercher les points relais avec de la capacité disponible
    @Query("SELECT p FROM PointRelais p WHERE p.stockActuel < p.capaciteMaximale")
    List<PointRelais> findAvailablePointsRelais();
    
    // Rechercher les points relais dans un rayon donné (en km) autour d'un point
    @Query(value = "SELECT p FROM PointRelais p WHERE " +
           "(6371 * acos(cos(radians(:latitude)) * cos(radians(p.coordonnees.latitude)) * " +
           "cos(radians(p.coordonnees.longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(p.coordonnees.latitude)))) <= :rayon")
    List<PointRelais> findPointsRelaisWithinRadius(
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("rayon") double rayonKm);
    
    // Rechercher par note minimale
    List<PointRelais> findByNoteGreaterThanEqual(Double noteMinimale);
    
    // Rechercher par propriétaire
    List<PointRelais> findByProprietaireId(Long proprietaireId);

    // Rechercher par ville et code postal
    @Query("SELECT p FROM PointRelais p WHERE p.adresse.ville = :ville AND p.adresse.codePostal = :codePostal")
    List<PointRelais> findByVilleAndCodePostal(
        @Param("ville") String ville,
        @Param("codePostal") String codePostal);
} 