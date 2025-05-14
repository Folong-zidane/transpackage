package api.point_interet.api_service.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "proprietaires")
public class Proprietaire {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "proprietaire", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PointRelais> pointsRelais = new ArrayList<>();

    // Constructeurs
    public Proprietaire() {
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<PointRelais> getPointsRelais() {
        return pointsRelais;
    }

    public void setPointsRelais(List<PointRelais> pointsRelais) {
        this.pointsRelais = pointsRelais;
    }

    // Méthodes utilitaires pour gérer la relation bidirectionnelle
    public void addPointRelais(PointRelais pointRelais) {
        pointsRelais.add(pointRelais);
        pointRelais.setProprietaire(this);
    }

    public void removePointRelais(PointRelais pointRelais) {
        pointsRelais.remove(pointRelais);
        pointRelais.setProprietaire(null);
    }
}
