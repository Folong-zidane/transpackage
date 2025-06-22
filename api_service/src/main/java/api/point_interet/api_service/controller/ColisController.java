package api.point_interet.api_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import api.point_interet.api_service.model.Colis;
import api.point_interet.api_service.service.ColisService;
import api.point_interet.dto.ColisDTO;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/colis")
public class ColisController {

    @Autowired
    private final ColisService colisService;

    public ColisController(ColisService colisService) {
        this.colisService = colisService;
    }

    @PostMapping
    public ResponseEntity<ColisDTO> createColis(@RequestBody ColisDTO colis) {
        ColisDTO createdColis = colisService.createColis(colis);
        return ResponseEntity.ok(createdColis);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ColisDTO> getColisById(@PathVariable UUID id) {
        ColisDTO colis = colisService.getColisById(id);
        return ResponseEntity.ok(colis);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ColisDTO>> getColisBySenderAndRecipient(
        @RequestParam UUID senderId,
        @RequestParam UUID recipientId) {
        return ResponseEntity.ok(colisService.getColisBySenderAndRecipient(senderId, recipientId));
    }

    @GetMapping("/search/by-status")
    public ResponseEntity<List<ColisDTO>> getColisByStatus(@RequestParam Colis.ColisStatus statut) {
        return ResponseEntity.ok(colisService.getColisByStatus(statut));
    }   


    @GetMapping("/search/by-date-depot")
    public ResponseEntity<List<ColisDTO>> getColisByDateDepot(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(colisService.getColisByDateDepot(date));
    }



    @GetMapping
    public ResponseEntity<List<ColisDTO>> getAllColiss() {
        List<ColisDTO> Coliss = colisService.getAllColis();
        return ResponseEntity.ok(Coliss);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ColisDTO> updateColis(@PathVariable UUID id, @RequestParam Colis.ColisStatus colisStatus) {
        ColisDTO updatedColis = colisService.updateColisStatus(id, colisStatus);
        return ResponseEntity.ok(updatedColis);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteColis(@PathVariable UUID id) {
        colisService.deleteColis(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/generate-qr")
    public ResponseEntity<String> generateQRCode(@PathVariable UUID id) throws IOException {
        String qrCodePath = colisService.generateQRCode(id);
        return ResponseEntity.ok(qrCodePath);
    }

    @GetMapping("/qr/{qrCodePath}")
    public ResponseEntity<ColisDTO> getColisByQRCode(@PathVariable String qrCodePath) {
        ColisDTO colis = colisService.getColisByQRCode("/qr-codes/" + qrCodePath);
        return ResponseEntity.ok(colis);
    }

    @PostMapping("/{id}/update-status/{newStatus}")
    public ResponseEntity<ColisDTO> updateStatus(
            @PathVariable UUID id,
            @PathVariable Colis.ColisStatus newStatus) {
        ColisDTO updatedColis = colisService.updateColisStatus(id, newStatus);
        return ResponseEntity.ok(updatedColis);
    }
}