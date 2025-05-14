package api.point_interet.api_service.model;

import jakarta.persistence.*;

@Entity
@Table(name = "coordonnees")
public class Coordonnees {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    // Constructeurs
    public Coordonnees() {
    }

    public Coordonnees(Double latitude, Double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    // Méthode utilitaire pour calculer la distance avec un autre point
    public double calculerDistance(Coordonnees autre) {
        final int R = 6371; // Rayon de la Terre en kilomètres

        double latDistance = Math.toRadians(autre.getLatitude() - this.latitude);
        double lonDistance = Math.toRadians(autre.getLongitude() - this.longitude);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(this.latitude)) * Math.cos(Math.toRadians(autre.getLatitude()))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c; // Distance en kilomètres
    }
}
