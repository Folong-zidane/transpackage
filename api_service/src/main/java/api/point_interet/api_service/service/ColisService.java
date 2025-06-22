package api.point_interet.api_service.service;

import api.point_interet.api_service.model.Client;
import api.point_interet.api_service.model.Colis;
import api.point_interet.api_service.model.PointRelais;
import api.point_interet.api_service.repository.ClientRepository;
import api.point_interet.api_service.repository.ColisRepository;
import api.point_interet.api_service.repository.PointRelaisRepository;
import api.point_interet.dto.ColisDTO;


import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ColisService {

    private static final String QR_CODE_IMAGE_PATH = "./src/main/resources/static/qr-codes/";

    private final ColisRepository colisRepository;
    private final ClientRepository clientRepository;
    private final PointRelaisRepository pointRelaisRepository;

    @Autowired
    public ColisService(ColisRepository colisRepository, ClientRepository clientRepository, PointRelaisRepository pointRelaisRepository) {
        this.colisRepository = colisRepository;
        this.clientRepository = clientRepository;
        this.pointRelaisRepository = pointRelaisRepository;
    }

    // Mappers
    private ColisDTO toDTO(Colis colis) {
        ColisDTO dto = new ColisDTO();
        dto.setId(colis.getId());
        dto.setSenderId(colis.getSender().getId());
        dto.setRecipientId(colis.getRecipient().getId());
        dto.setPointRelaisId(colis.getPointRelais() != null ? colis.getPointRelais().getId() : null);
        dto.setDescription(colis.getDescription());
        dto.setWeight(colis.getWeight());
        dto.setDimensions(colis.getDimensions());
        dto.setStatus(colis.getStatus());
        dto.setDateDepot(colis.getDateDepot());
        dto.setDateRetrait(colis.getDateRetrait());
        dto.setLastUpdateDate(colis.getLastUpdateDate());
        dto.setQrCodePath(colis.getQrCodePath());
        return dto;
    }

    private Colis toEntity(ColisDTO dto) {
        Colis colis = new Colis();
        colis.setId(dto.getId());
        colis.setDescription(dto.getDescription());
        colis.setWeight(dto.getWeight());
        colis.setDimensions(dto.getDimensions());
        colis.setStatus(dto.getStatus());
        colis.setDateDepot(dto.getDateDepot() != null ? dto.getDateDepot() : LocalDateTime.now());
        colis.setDateRetrait(dto.getDateRetrait());
        colis.setLastUpdateDate(dto.getLastUpdateDate());
        colis.setQrCodePath(dto.getQrCodePath());

        Client sender = clientRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("Expéditeur introuvable"));
        colis.setSender(sender);

        Client recipient = clientRepository.findById(dto.getRecipientId())
                .orElseThrow(() -> new IllegalArgumentException("Destinataire introuvable"));
        colis.setRecipient(recipient);

        if (dto.getPointRelaisId() != null) {
            PointRelais pr = pointRelaisRepository.findById(dto.getPointRelaisId())
                    .orElseThrow(() -> new IllegalArgumentException("Point relais introuvable"));
            colis.setPointRelais(pr);
        }

        return colis;
    }

    // CRUD

    public ColisDTO createColis(ColisDTO dto) {
        Colis colis = toEntity(dto);
        colis.setLastUpdateDate(colis.getDateDepot());
        Colis saved = colisRepository.save(colis);
        return toDTO(saved);
    }

    public ColisDTO getColisById(UUID id) {
        Colis colis = colisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Colis non trouvé avec l'ID: " + id));
        return toDTO(colis);
    }

    public List<ColisDTO> getAllColis() {
        return colisRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ColisDTO updateColisStatus(UUID id, Colis.ColisStatus status) {
        Colis colis = colisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Colis non trouvé"));

        colis.setStatus(status);
        colis.setLastUpdateDate(LocalDateTime.now());
        return toDTO(colisRepository.save(colis));
    }

    public void deleteColis(UUID id) {
        Colis colis = colisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Colis non trouvé"));
        colisRepository.delete(colis);
    }

    public String generateQRCode(UUID colisId) throws IOException {
        Colis colis = colisRepository.findById(colisId)
                .orElseThrow(() -> new RuntimeException("Colis non trouvé"));

        try {
            Path path = Paths.get(QR_CODE_IMAGE_PATH);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }

            String qrContent = colisId.toString();
            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix matrix = writer.encode(qrContent, BarcodeFormat.QR_CODE, 200, 200);

            String fileName = "QRCode_" + colisId + ".png";
            Path filePath = FileSystems.getDefault().getPath(QR_CODE_IMAGE_PATH + fileName);
            MatrixToImageWriter.writeToPath(matrix, "PNG", filePath);

            colis.setQrCodePath("/qr-codes/" + fileName);
            colisRepository.save(colis);

            return colis.getQrCodePath();
        } catch (WriterException e) {
            throw new IOException("Erreur lors de la génération du QR Code", e);
        }
    }

    public ColisDTO getColisByQRCode(String qrCodePath) {
        Colis colis = colisRepository.getColisByQrCodePath(qrCodePath);
        return toDTO(colis);
    }

    public List<ColisDTO> getColisBySenderAndRecipient(UUID senderId, UUID recipientId) {
        List<Colis> colisList = colisRepository.findBySenderIdAndRecipientId(senderId, recipientId);
        return colisList.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ColisDTO> getColisByDateDepot(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        List<Colis> colisList = colisRepository.findByDateDepotBetween(startOfDay, endOfDay);
        return colisList.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ColisDTO> getColisBySender(UUID clientId) {
        List<Colis> colisList = colisRepository.findBySenderId(clientId);
        return colisList.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ColisDTO> getColisByPointRelaisAndStatus(Long pointRelaisId, Colis.ColisStatus statut) {
        List<Colis> colisList = colisRepository.findByPointRelaisIdAndStatus(pointRelaisId, statut);
        return colisList.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ColisDTO> getColisNonRetiresDepuis(Colis.ColisStatus statut, int jours) {
        LocalDateTime limite = LocalDateTime.now().minusDays(jours);
        List<Colis> colisList = colisRepository.findByStatusAndDateDepotBefore(statut, limite);
        return colisList.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ColisDTO> getColisByPointRelais(Long pointRelaisId) {
        List<Colis> colisList = colisRepository.findByPointRelaisId(pointRelaisId);
        return colisList.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ColisDTO> getColisByStatus(Colis.ColisStatus statut) {
        List<Colis> colisList = colisRepository.findByStatus(statut);
        return colisList.stream().map(this::toDTO).collect(Collectors.toList());
    }



}
