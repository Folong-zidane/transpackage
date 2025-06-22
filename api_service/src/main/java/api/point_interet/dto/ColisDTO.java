package api.point_interet.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import api.point_interet.api_service.model.Colis.ColisStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ColisDTO {
    private UUID id;
    private UUID senderId;
    private UUID recipientId;
    private Long pointRelaisId;
    private String description;
    private Double weight;
    private Double dimensions;
    private ColisStatus status;
    private LocalDateTime dateDepot;
    private LocalDateTime dateRetrait;
    private LocalDateTime lastUpdateDate;
    private String qrCodePath;
}
