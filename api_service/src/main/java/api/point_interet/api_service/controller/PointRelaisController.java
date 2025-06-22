package api.point_interet.api_service.controller;

import api.point_interet.api_service.model.Colis;
import api.point_interet.api_service.model.PointRelais;
import api.point_interet.api_service.service.PointRelaisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/points-relais")
@CrossOrigin(origins = "*")
@Tag(name = "Points Relais", description = "API de gestion des points relais")
public class PointRelaisController {

    private final PointRelaisService pointRelaisService;

    @Autowired
    public PointRelaisController(PointRelaisService pointRelaisService) {
        this.pointRelaisService = pointRelaisService;
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> handleHttpMessageNotReadable(HttpMessageNotReadableException e) {
        return ResponseEntity.badRequest().body("Erreur de lecture JSON : " + e.getMostSpecificCause().getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationException(MethodArgumentNotValidException e) {
        return ResponseEntity.badRequest().body("Erreur de validation : " + e.getBindingResult().toString());
    }

    @Operation(summary = "Rechercher des points relais par ville",
            description = "Retourne la liste des points relais dans une ville donnée")
    @ApiResponse(responseCode = "200", description = "Points relais trouvés")
    @GetMapping("/recherche/ville/{ville}")
    public ResponseEntity<List<PointRelais>> rechercherParVille(
            @Parameter(description = "Nom de la ville") @PathVariable String ville) {
        return ResponseEntity.ok(pointRelaisService.rechercherParVille(ville));
    }

    @Operation(summary = "Rechercher des points relais par code postal",
            description = "Retourne la liste des points relais dans un code postal donné")
    @ApiResponse(responseCode = "200", description = "Points relais trouvés")
    @GetMapping("/recherche/code-postal/{codePostal}")
    public ResponseEntity<List<PointRelais>> rechercherParCodePostal(
            @Parameter(description = "Code postal") @PathVariable String codePostal) {
        return ResponseEntity.ok(pointRelaisService.rechercherParCodePostal(codePostal));
    }

    @Operation(summary = "Rechercher les points relais disponibles",
            description = "Retourne la liste des points relais ayant de la capacité disponible")
    @ApiResponse(responseCode = "200", description = "Points relais disponibles trouvés")
    @GetMapping("/recherche/disponibles")
    public ResponseEntity<List<PointRelais>> rechercherPointsRelaisDisponibles() {
        return ResponseEntity.ok(pointRelaisService.rechercherPointsRelaisDisponibles());
    }

    @Operation(summary = "Rechercher les points relais proches",
            description = "Retourne la liste des points relais dans un rayon donné autour d'un point")
    @ApiResponse(responseCode = "200", description = "Points relais trouvés")
    @GetMapping("/recherche/proches")
    public ResponseEntity<List<PointRelais>> rechercherPointsRelaisProches(
            @Parameter(description = "Latitude du point central") @RequestParam double latitude,
            @Parameter(description = "Longitude du point central") @RequestParam double longitude,
            @Parameter(description = "Rayon de recherche en kilomètres") @RequestParam(defaultValue = "5.0") double rayonKm) {
        return ResponseEntity.ok(pointRelaisService.rechercherPointsRelaisProches(latitude, longitude, rayonKm));
    }

    @Operation(summary = "Créer un point relais",
            description = "Crée un nouveau point relais")
    @ApiResponse(responseCode = "201", description = "Point relais créé avec succès")
    @PostMapping
    public ResponseEntity<PointRelais> creerPointRelais(
            @Parameter(description = "Détails du point relais") @RequestBody PointRelais pointRelais) {
        PointRelais created = pointRelaisService.createPointRelais(pointRelais);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Modifier les horaires",
            description = "Modifie les horaires d'ouverture d'un point relais")
    @ApiResponse(responseCode = "200", description = "Horaires modifiés avec succès")
    @ApiResponse(responseCode = "400", description = "Point relais introuvable")
    @PutMapping("/{pointRelaisId}/horaires")
    public ResponseEntity<Void> modifierHoraires(
            @Parameter(description = "ID du point relais") @PathVariable Long pointRelaisId,
            @Parameter(description = "Nouveaux horaires") @RequestBody String nouveauxHoraires) {
        pointRelaisService.modifierHoraires(pointRelaisId, nouveauxHoraires);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Mettre à jour la note",
            description = "Met à jour la note d'un point relais")
    @ApiResponse(responseCode = "200", description = "Note mise à jour avec succès")
    @ApiResponse(responseCode = "400", description = "Point relais introuvable")
    @PutMapping("/{pointRelaisId}/note")
    public ResponseEntity<Void> mettreAJourNote(
            @Parameter(description = "ID du point relais") @PathVariable Long pointRelaisId,
            @Parameter(description = "Nouvelle note") @RequestBody Double nouvelleNote) {
        pointRelaisService.mettreAJourNote(pointRelaisId, nouvelleNote);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Mettre à jour le stock",
            description = "Met à jour le stock d'un point relais")
    @ApiResponse(responseCode = "200", description = "Stock mis à jour avec succès")
    @ApiResponse(responseCode = "400", description = "Point relais introuvable")
    @PutMapping("/{pointRelaisId}/stock")
    public ResponseEntity<Void> mettreAJourStock(
            @Parameter(description = "ID du point relais") @PathVariable Long pointRelaisId) {
        pointRelaisService.mettreAJourStock(pointRelaisId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<PointRelais>> getAllPointsRelais() {
        return ResponseEntity.ok(pointRelaisService.getAllPointsRelais());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PointRelais> getPointRelaisById(@PathVariable Long id) {
        return pointRelaisService.getPointRelaisById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PointRelais> updatePointRelais(@PathVariable Long id, @RequestBody PointRelais pointRelais) {
        pointRelais.setId(id);
        return ResponseEntity.ok(pointRelaisService.updatePointRelais(pointRelais));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePointRelais(@PathVariable Long id) {
        pointRelaisService.deletePointRelais(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/colis")
    public ResponseEntity<List<Colis>> getColisForPointRelais(@PathVariable Long id) {
        return ResponseEntity.ok(pointRelaisService.getColisForPointRelais(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PointRelais>> searchPointsRelais(
            @RequestParam(required = false) String ville,
            @RequestParam(required = false) String codePostal) {
        return ResponseEntity.ok(pointRelaisService.searchPointsRelais(ville, codePostal));
    }

    @PostMapping("/{id}/colis/{colisId}/reception")
    public ResponseEntity<Void> recevoirColis(@PathVariable Long id, @PathVariable UUID colisId) {
        pointRelaisService.recevoirColis(id, colisId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/colis/{colisId}/retrait")
    public ResponseEntity<Void> retirerColis(
            @PathVariable Long id, 
            @PathVariable UUID colisId, 
            @RequestParam String codeQR) {
        pointRelaisService.retirerColis(id, colisId, codeQR);
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalStateException(IllegalStateException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
} 