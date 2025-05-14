package api.point_interet.api_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import api.point_interet.api_service.model.Colis;
import api.point_interet.api_service.model.StatutColis;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ColisRepository extends JpaRepository<Colis, Long> {
    
    // Rechercher par référence
    Optional<Colis> findByReference(String reference);
    
    // Rechercher par code QR
    Optional<Colis> findByCodeQR(String codeQR);
    
    // Rechercher tous les colis d'un client
    List<Colis> findByClientId(String clientId);
    
    // Rechercher les colis par point relais et statut
    List<Colis> findByPointRelaisIdAndStatut(Long pointRelaisId, StatutColis statut);
    
    // Rechercher les colis par statut
    List<Colis> findByStatut(StatutColis statut);
    
    // Rechercher les colis déposés dans une période donnée
    List<Colis> findByDateDepotBetween(LocalDateTime debut, LocalDateTime fin);
    
    // Rechercher les colis non retirés après X jours
    List<Colis> findByStatutAndDateDepotBefore(StatutColis statut, LocalDateTime date);
    
    // Rechercher les colis par point relais
    List<Colis> findByPointRelaisId(Long pointRelaisId);
} 