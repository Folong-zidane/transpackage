package api.point_interet.api_service.controller;

import api.point_interet.api_service.model.Proprietaire;
import api.point_interet.api_service.service.ProprietaireService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proprietaires")
public class ProprietaireController {

    private final ProprietaireService proprietaireService;

    public ProprietaireController(ProprietaireService proprietaireService) {
        this.proprietaireService = proprietaireService;
    }

    @GetMapping
    public List<Proprietaire> getAllProprietaires() {
        return proprietaireService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Proprietaire> getProprietaireById(@PathVariable Long id) {
        return proprietaireService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Proprietaire createProprietaire(@RequestBody Proprietaire proprietaire) {
        return proprietaireService.save(proprietaire);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Proprietaire> updateProprietaire(@PathVariable Long id, @RequestBody Proprietaire updatedProprietaire) {
        return proprietaireService.findById(id)
                .map(existing -> {
                    existing.setPointsRelais(updatedProprietaire.getPointsRelais());
                    return ResponseEntity.ok(proprietaireService.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProprietaire(@PathVariable Long id) {
        String result = proprietaireService.delete(id);

        if (result.equals("Propriétaire supprimé avec succès.")) {
            return ResponseEntity.ok(result); // 200 OK
        } else {
            return ResponseEntity.status(404).body(result); // 404 Not Found
        }
    }


}
