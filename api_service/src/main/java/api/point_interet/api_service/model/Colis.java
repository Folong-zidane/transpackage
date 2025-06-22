package api.point_interet.api_service.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Colis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @NotNull(message = "L'expéditeur ne peut pas être nul")
    private Client sender;

    @ManyToOne(optional = false)
    @NotNull(message = "Le destinataire ne peut pas être nul")
    private Client recipient;

    @NotNull
    @ManyToOne(optional = false)
    private PointRelais pointRelais;

    @NotBlank(message = "La description ne peut pas être vide")
    private String description;

    @NotNull(message = "Le poids ne peut pas être nul")
    @Positive(message = "Le poids doit être positif")
    private Double weight;

    private Double dimensions;

    @Enumerated(EnumType.STRING)
    private ColisStatus status = ColisStatus.EN_ATTENTE;

    @Column(name = "date_depot")
    private LocalDateTime dateDepot = LocalDateTime.now();

    @Column(name = "date_retrait")
    private LocalDateTime dateRetrait;

    private LocalDateTime lastUpdateDate;

    private String qrCodePath;

    public enum ColisStatus {
        RECU("Colis reçu par au point de livraison"),
        EN_ATTENTE("En attente"),
        EN_TRANSIT("En transit"),
        LIVRE("Livré"),
        RETIRE("Colis Retiré");

        private final String displayName;

        ColisStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }


    // Méthodes métier
    public void marquerCommeRecu() {
        this.status = ColisStatus.RECU;
        this.dateDepot = LocalDateTime.now();
        this.lastUpdateDate = LocalDateTime.now();
    }

    public boolean verifierCodeQR(String qrCodePath) {
        return this.qrCodePath.equals(qrCodePath);
    }


    public void marquerCommeRetire() {
        this.dateRetrait = LocalDateTime.now();
        this.status = ColisStatus.RETIRE;
    }

}
