package api.point_interet.api_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.ArrayList;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "points_relais")
public class PointRelais {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @OneToOne(cascade = CascadeType.ALL)
    private Coordonnees coordonnees;

    @OneToOne(cascade = CascadeType.ALL)
    private Adresse adresse;

    @ManyToOne
    @JoinColumn(name = "proprietaire_id")
    private Proprietaire proprietaire;

    @Column(nullable = false)
    private Integer capaciteMaximale;

    @Column(nullable = false)
    private String horairesOuverture;

    @Column(nullable = false)
    private Integer stockActuel;

    @Column(length = 1000)
    private String description;

    @Column
    private Double note;

    @OneToMany(mappedBy = "pointRelais", cascade = CascadeType.ALL)
    private List<Colis> colis = new ArrayList<>();


    // Méthodes métier
    public boolean peutRecevoirColis() {
        return stockActuel < capaciteMaximale;
    }

    public void recevoirColis(Colis colis) {
        if (!peutRecevoirColis()) {
            throw new IllegalStateException("Le point relais est plein");
        }
        this.colis.add(colis);
        this.stockActuel++;
        // TODO: Implémenter la notification au client
    }

    public void retirerColis(Colis colis, String codeQR) {
        if (!colis.verifierCodeQR(codeQR)) {
            throw new IllegalArgumentException("Code QR invalide");
        }
        if (this.colis.remove(colis)) {
            this.stockActuel--;
        } else {
            throw new IllegalStateException("Colis non trouvé dans ce point relais");
        }
    }

    public void mettreAJourStock() {
        this.stockActuel = this.colis.size();
    }

    public void modifierHoraires(String nouveauxHoraires) {
        this.horairesOuverture = nouveauxHoraires;
    }

    public void notifierClient(String clientId, String message) {
        // TODO: Implémenter le système de notification
    }

}
