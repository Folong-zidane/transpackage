package api.point_interet.api_service.service;

import api.point_interet.api_service.model.Client;
import api.point_interet.api_service.repository.ClientRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    public Client createClient(Client client) {
        client.setDateInscription(LocalDate.now());
        return clientRepository.save(client);
    }

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Client getClientById(UUID id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'ID : " + id));
    }

    public Client updateClient(UUID id, Client updated) {
        Client existing = getClientById(id);
        existing.setName(updated.getName());
        existing.setSurname(updated.getSurname());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setPassword(updated.getPassword());
        existing.setClientAddress(updated.getClientAddress());
        return clientRepository.save(existing);
    }

    public void deleteClient(UUID id) {
        clientRepository.deleteById(id);
    }
}