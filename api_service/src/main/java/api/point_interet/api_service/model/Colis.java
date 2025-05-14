package api.point_interet.api_service.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "colis")
public class Colis {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String reference;

    @Column(name = "code_qr", nullable = false)
    private String codeQR;

    @ManyToOne
    @JoinColumn(name = "point_relais_id")
    private PointRelais pointRelais;

    @Column(name = "client_id", nullable = false)
    private String clientId;

    @Column(name = "date_depot")
    private LocalDateTime dateDepot;

    @Column(name = "date_retrait")
    private LocalDateTime dateRetrait;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutColis statut;

    // Constructeurs
    public Colis() {
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getCodeQR() {
        return codeQR;
    }

    public void setCodeQR(String codeQR) {
        this.codeQR = codeQR;
    }

    public PointRelais getPointRelais() {
        return pointRelais;
    }

    public void setPointRelais(PointRelais pointRelais) {
        this.pointRelais = pointRelais;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public LocalDateTime getDateDepot() {
        return dateDepot;
    }

    public void setDateDepot(LocalDateTime dateDepot) {
        this.dateDepot = dateDepot;
    }

    public LocalDateTime getDateRetrait() {
        return dateRetrait;
    }

    public void setDateRetrait(LocalDateTime dateRetrait) {
        this.dateRetrait = dateRetrait;
    }

    public StatutColis getStatut() {
        return statut;
    }

    public void setStatut(StatutColis statut) {
        this.statut = statut;
    }

    // Méthodes métier
    public boolean verifierCodeQR(String codeQR) {
        return this.codeQR.equals(codeQR);
    }

    public void marquerCommeRecu() {
        this.dateDepot = LocalDateTime.now();
        this.statut = StatutColis.RECU;
    }

    public void marquerCommeRetire() {
        this.dateRetrait = LocalDateTime.now();
        this.statut = StatutColis.RETIRE;
    }
} 