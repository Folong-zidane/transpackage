package api.point_interet.api_service.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import api.point_interet.api_service.model.Client;


public interface ClientRepository extends JpaRepository<Client, UUID> {

    Optional<Client> findByEmail(String email);
    Boolean existsByEmail(String email);
}
