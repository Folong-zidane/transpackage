package api.point_interet.api_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "adresse")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Adresse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String rue;
    private String ville;
    private String codePostal;
    private String pays;
    private String complement;
    
    // Méthode utilitaire pour formater l'adresse complète
    public String getAdresseFormatee() {
        return rue + ", " + 
               (complement != null && !complement.isEmpty() ? complement + ", " : "") +
               codePostal + " " + ville + ", " + pays;
    }
}
