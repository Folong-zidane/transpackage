package api.point_interet.api_service.service;

import api.point_interet.api_service.model.Proprietaire;
import api.point_interet.api_service.repository.ProprietaireRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProprietaireService {

    private final ProprietaireRepository proprietaireRepository;

    public ProprietaireService(ProprietaireRepository proprietaireRepository) {
        this.proprietaireRepository = proprietaireRepository;
    }

    public List<Proprietaire> findAll() {
        return proprietaireRepository.findAll();
    }

    public Optional<Proprietaire> findById(Long id) {
        return proprietaireRepository.findById(id);
    }

    public Proprietaire save(Proprietaire proprietaire) {
        return proprietaireRepository.save(proprietaire);
    }

    public String delete(Long id) {
        Optional<Proprietaire> proprietaireOpt = proprietaireRepository.findById(id);
        if (proprietaireOpt.isPresent()) {
            proprietaireRepository.deleteById(id);
            return "Propriétaire supprimé avec succès.";
        } else {
            return "Propriétaire introuvable.";
        }
    }
}

