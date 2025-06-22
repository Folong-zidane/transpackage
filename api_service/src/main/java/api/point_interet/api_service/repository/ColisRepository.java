package api.point_interet.api_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import api.point_interet.api_service.model.Colis;
import api.point_interet.api_service.model.Colis.ColisStatus;
//import api.point_interet.api_service.model.StatutColis;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ColisRepository extends JpaRepository<Colis, UUID> {
    
    // Rechercher par code QR
    Optional<Colis> findByQrCodePath(String qrCodePath);
    
    // Rechercher tous les colis d'un client
    List<Colis> findBySenderId(UUID senderId);
    
    // Rechercher les colis par point relais et status (pas statut)
    List<Colis> findByPointRelaisIdAndStatus(Long pointRelaisId, ColisStatus status);
    
    // Rechercher les colis par status (pas statut)
    List<Colis> findByStatus(ColisStatus status);
    
    // Rechercher les colis déposés dans une période donnée
    List<Colis> findByDateDepotBetween(LocalDateTime debut, LocalDateTime fin);
    
    // Rechercher les colis non retirés après X jours
    List<Colis> findByStatusAndDateDepotBefore(ColisStatus status, LocalDateTime date);
    
    // Rechercher les colis par point relais
    List<Colis> findByPointRelaisId(Long pointRelaisId);

    @Modifying
    @Transactional
    @Query("UPDATE Colis c SET c.status = :status WHERE c.id = :id")
    Colis updateStatus(@Param("id") UUID id, @Param("status") ColisStatus status);

    @Query("SELECT c FROM Colis c WHERE c.qrCodePath = :qrCodePath")
    Colis getColisByQrCodePath(@Param("qrCodePath") String qrCodePath);

    List<Colis> findBySenderIdAndRecipientId(UUID senderId, UUID recipientId);
}
