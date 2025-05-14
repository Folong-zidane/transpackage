package api.point_interet.api_service.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
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
    @JoinColumn(name = "proprietaire_id", nullable = false)
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

    // Constructeur par défaut
    public PointRelais() {
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Coordonnees getCoordonnees() {
        return coordonnees;
    }

    public void setCoordonnees(Coordonnees coordonnees) {
        this.coordonnees = coordonnees;
    }

    public Adresse getAdresse() {
        return adresse;
    }

    public void setAdresse(Adresse adresse) {
        this.adresse = adresse;
    }

    public Proprietaire getProprietaire() {
        return proprietaire;
    }

    public void setProprietaire(Proprietaire proprietaire) {
        this.proprietaire = proprietaire;
    }

    public Integer getCapaciteMaximale() {
        return capaciteMaximale;
    }

    public void setCapaciteMaximale(Integer capaciteMaximale) {
        this.capaciteMaximale = capaciteMaximale;
    }

    public String getHorairesOuverture() {
        return horairesOuverture;
    }

    public void setHorairesOuverture(String horairesOuverture) {
        this.horairesOuverture = horairesOuverture;
    }

    public Integer getStockActuel() {
        return stockActuel;
    }

    public void setStockActuel(Integer stockActuel) {
        this.stockActuel = stockActuel;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getNote() {
        return note;
    }

    public void setNote(Double note) {
        this.note = note;
    }

    public List<Colis> getColis() {
        return colis;
    }

    public void setColis(List<Colis> colis) {
        this.colis = colis;
    }

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
