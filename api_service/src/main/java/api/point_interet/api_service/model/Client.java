package api.point_interet.api_service.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import api.point_interet.api_service.model.embeddable.Address;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Le nom ne peut pas être vide")

    private String name;

    private String surname;

    @NotBlank(message = "L'email ne peut pas être vide")
    private String email;

    @NotBlank(message = "Le mot de passe ne peut pas être vide")
    private String password;

    @NotBlank(message = "Le numéro de téléphone ne peut pas être vide")
    private String phone;

    @Column(name = "date_inscription")
    private LocalDate dateInscription;

    @Embedded
    @Column(name = "client_address")
    private Address clientAddress; 

    // Colis envoyés
    @OneToMany(mappedBy = "sender")
    @Column(name = "colis_envoyes")
    private List<Colis> colisEnvoyes;

    // Colis reçus
    @OneToMany(mappedBy = "recipient")
    @Column(name = "colis_recus")
    private List<Colis> colisRecus;

}
