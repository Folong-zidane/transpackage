package api.point_interet.api_service.model.embeddable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable // Important pour indiquer que c'est un type composant
public class Address{
    @Column(name = "street_number")
    private String streetNumber;

    @Column(name = "street_name")
    private String rue;

    private String city;

    @Column(name = "postal_code")
    private String postalCode;

    private String pays;

    @Column(name = "informal_address")
    private String complement;
}