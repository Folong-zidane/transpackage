package api.point_interet.api_service.service;

import api.point_interet.api_service.model.notification.NotificationType;
import api.point_interet.api_service.model.Client;
import api.point_interet.api_service.model.Colis;
import api.point_interet.api_service.model.Colis.ColisStatus;
import api.point_interet.api_service.model.PointRelais;
import api.point_interet.api_service.model.Proprietaire;
import api.point_interet.api_service.repository.ClientRepository;
//import api.point_interet.api_service.model.StatutColis;
import api.point_interet.api_service.repository.ColisRepository;
import api.point_interet.api_service.repository.PointRelaisRepository;
import api.point_interet.api_service.repository.ProprietaireRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PointRelaisService {

    private final PointRelaisRepository pointRelaisRepository;
    private final ProprietaireRepository proprietaireRepository;
    private final ColisRepository colisRepository;
    private final NotificationService notificationService;

    @Autowired
    public PointRelaisService(PointRelaisRepository pointRelaisRepository,
                              ProprietaireRepository proprietaireRepository,
                              ColisRepository colisRepository,
                              NotificationService notificationService) {
        this.pointRelaisRepository = pointRelaisRepository;
        this.proprietaireRepository = proprietaireRepository;
        this.colisRepository = colisRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public PointRelais createPointRelais(PointRelais pointRelais) {
        // Charger le proprietaire
        Proprietaire proprietaire = proprietaireRepository.findById(pointRelais.getProprietaire().getId())
            .orElseThrow(() -> new EntityNotFoundException("Proprietaire non trouvé avec l'ID : " + pointRelais.getProprietaire().getId()));

        // Associer les entités attachées
        pointRelais.setProprietaire(proprietaire);

        // Pour coordonnees et adresse, s'assurer que l'id est null si c'est une création (sinon Hibernate risque une erreur)
        if (pointRelais.getCoordonnees() != null) {
            pointRelais.getCoordonnees().setId(null);
        }
        if (pointRelais.getAdresse() != null) {
            pointRelais.getAdresse().setId(null);
        }

        return pointRelaisRepository.save(pointRelais);
    }

    public List<PointRelais> getAllPointsRelais() {
        return pointRelaisRepository.findAll();
    }

    public Optional<PointRelais> getPointRelaisById(Long id) {
        return pointRelaisRepository.findById(id);
    }

    @Transactional
    public PointRelais updatePointRelais(PointRelais pointRelais) {
        if (!pointRelaisRepository.existsById(pointRelais.getId())) {
            throw new EntityNotFoundException("Point relais non trouvé avec l'ID : " + pointRelais.getId());
        }
        return pointRelaisRepository.save(pointRelais);
    }

    @Transactional
    public void deletePointRelais(Long id) {
        if (!pointRelaisRepository.existsById(id)) {
            throw new EntityNotFoundException("Point relais non trouvé avec l'ID : " + id);
        }
        pointRelaisRepository.deleteById(id);
    }

    public List<Colis> getColisForPointRelais(Long pointRelaisId) {
        PointRelais pointRelais = pointRelaisRepository.findById(pointRelaisId)
                .orElseThrow(() -> new EntityNotFoundException("Point relais non trouvé avec l'ID : " + pointRelaisId));
        return colisRepository.findByPointRelaisId(pointRelaisId);
    }

    public List<PointRelais> searchPointsRelais(String ville, String codePostal) {
        if (ville != null && codePostal != null) {
            return pointRelaisRepository.findByVilleAndCodePostal(ville, codePostal);
        } else if (ville != null) {
            return pointRelaisRepository.findByVille(ville);
        } else if (codePostal != null) {
            return pointRelaisRepository.findByCodePostal(codePostal);
        }
        return getAllPointsRelais();
    }

    @Transactional
    public void recevoirColis(Long pointRelaisId, UUID colisId) {
        PointRelais pointRelais = pointRelaisRepository.findById(pointRelaisId)
                .orElseThrow(() -> new EntityNotFoundException("Point relais non trouvé avec l'ID : " + pointRelaisId));
        
        Colis colis = colisRepository.findById(colisId)
                .orElseThrow(() -> new EntityNotFoundException("Colis non trouvé avec l'ID : " + colisId));

        if (colis.getPointRelais().getId().equals(pointRelaisId)) {
            colis.marquerCommeRecu();
            colisRepository.save(colis);
            notificationService.notifierClient(colis.getRecipient().getId().toString(), "Votre colis est disponible au point relais");
        } else {
            throw new IllegalStateException("Le colis n'est pas assigné à ce point relais");
        }
    }

    @Transactional
    public void retirerColis(Long pointRelaisId, UUID colisId, String codeQR) {
        PointRelais pointRelais = pointRelaisRepository.findById(pointRelaisId)
                .orElseThrow(() -> new EntityNotFoundException("Point relais non trouvé avec l'ID : " + pointRelaisId));
        
        Colis colis = colisRepository.findById(colisId)
                .orElseThrow(() -> new EntityNotFoundException("Colis non trouvé avec l'ID : " + colisId));

        if (!colis.getPointRelais().getId().equals(pointRelaisId)) {
            throw new IllegalStateException("Le colis n'est pas dans ce point relais");
        }

        if (!colis.verifierCodeQR(codeQR)) {
            throw new IllegalArgumentException("Code QR invalide");
        }

        if (colis.getStatus() != ColisStatus.RECU) {
            throw new IllegalStateException("Le colis n'est pas disponible pour le retrait");
        }

        colis.marquerCommeRetire();
        colisRepository.save(colis);
        notificationService.notifierClient(colis.getRecipient().getId().toString(), "Votre colis a été retiré avec succès");
    }

    // Méthodes de recherche de points relais
    public List<PointRelais> rechercherParVille(String ville) {
        return pointRelaisRepository.findByVille(ville);
    }

    public List<PointRelais> rechercherParCodePostal(String codePostal) {
        return pointRelaisRepository.findByCodePostal(codePostal);
    }

    public List<PointRelais> rechercherPointsRelaisDisponibles() {
        return pointRelaisRepository.findAvailablePointsRelais();
    }

    public List<PointRelais> rechercherPointsRelaisProches(double latitude, double longitude, double rayonKm) {
        return pointRelaisRepository.findPointsRelaisWithinRadius(latitude, longitude, rayonKm);
    }

    // Gestion des points relais
    public void modifierHoraires(Long pointRelaisId, String nouveauxHoraires) {
        PointRelais pointRelais = pointRelaisRepository.findById(pointRelaisId)
            .orElseThrow(() -> new IllegalArgumentException("Point relais non trouvé"));
        
        pointRelais.modifierHoraires(nouveauxHoraires);
        pointRelaisRepository.save(pointRelais);

        // Notification aux clients ayant des colis en attente
        List<Colis> colisEnAttente = colisRepository.findByPointRelaisIdAndStatus(pointRelaisId, ColisStatus.RECU);
        for (Colis colis : colisEnAttente) {
            String message = String.format(
                "Les horaires du point relais %s ont changé. Nouveaux horaires : %s",
                pointRelais.getNom(),
                nouveauxHoraires
            );
            notificationService.notifierClient(colis.getRecipient().getId().toString(), message);
        }
    }

    public void mettreAJourNote(Long pointRelaisId, Double nouvelleNote) {
        PointRelais pointRelais = pointRelaisRepository.findById(pointRelaisId)
            .orElseThrow(() -> new IllegalArgumentException("Point relais non trouvé"));
        
        pointRelais.setNote(nouvelleNote);
        pointRelaisRepository.save(pointRelais);
    }

    public void mettreAJourStock(Long pointRelaisId) {
        PointRelais pointRelais = pointRelaisRepository.findById(pointRelaisId)
            .orElseThrow(() -> new IllegalArgumentException("Point relais non trouvé"));
        
        pointRelais.mettreAJourStock();
        pointRelaisRepository.save(pointRelais);
    }
} 