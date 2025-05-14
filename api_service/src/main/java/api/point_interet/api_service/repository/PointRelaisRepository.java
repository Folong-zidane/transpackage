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
    List<PointRelais> findByVille(String ville);
    
    // Rechercher par code postal
    List<PointRelais> findByCodePostal(String codePostal);
    
    // Rechercher les points relais avec de la capacité disponible
    @Query("SELECT p FROM PointRelais p WHERE p.capaciteActuelle < p.capaciteMaximale")
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

    List<PointRelais> findByVilleAndCodePostal(String ville, String codePostal);
} 