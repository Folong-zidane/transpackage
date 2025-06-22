# Documentation de l'API Spring Boot

## Endpoints Clients

### Base URL: `/api/clients`

#### POST /api/clients
- **Description**: Créer un nouveau client
- **Requête**: `Client` object
- **Réponse**: `200 OK` avec le client créé
- **Exemple**:
```json
{
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@email.com"
}
```

#### GET /api/clients
- **Description**: Obtenir la liste de tous les clients
- **Réponse**: `200 OK` avec une liste de clients

#### GET /api/clients/{id}
- **Description**: Obtenir un client par ID
- **Paramètres**: `id` (UUID)
- **Réponse**: `200 OK` avec le client ou `404 Not Found`

#### PUT /api/clients/{id}
- **Description**: Mettre à jour un client
- **Paramètres**: `id` (UUID)
- **Requête**: `Client` object
- **Réponse**: `200 OK` avec le client mis à jour

#### DELETE /api/clients/{id}
- **Description**: Supprimer un client
- **Paramètres**: `id` (UUID)
- **Réponse**: `204 No Content`

## Endpoints Colis

### Base URL: `/api/colis`

#### POST /api/colis
- **Description**: Créer un nouveau colis
- **Requête**: `ColisDTO` object
- **Réponse**: `200 OK` avec le colis créé

#### GET /api/colis/{id}
- **Description**: Obtenir un colis par ID
- **Paramètres**: `id` (UUID)
- **Réponse**: `200 OK` avec le colis

#### GET /api/colis/search
- **Description**: Rechercher des colis par expéditeur et destinataire
- **Paramètres**:
  - `senderId`: UUID
  - `recipientId`: UUID
- **Réponse**: `200 OK` avec la liste des colis

#### GET /api/colis/search/by-status
- **Description**: Rechercher des colis par statut
- **Paramètres**: `statut` (ColisStatus)
- **Réponse**: `200 OK` avec la liste des colis

#### GET /api/colis/search/by-date-depot
- **Description**: Rechercher des colis par date de dépôt
- **Paramètres**: `date` (LocalDate)
- **Réponse**: `200 OK` avec la liste des colis

#### GET /api/colis
- **Description**: Obtenir la liste de tous les colis
- **Réponse**: `200 OK` avec la liste des colis

#### PUT /api/colis/{id}
- **Description**: Mettre à jour le statut d'un colis
- **Paramètres**: `id` (UUID)
- **Requête**: `colisStatus` (ColisStatus)
- **Réponse**: `200 OK` avec le colis mis à jour

#### DELETE /api/colis/{id}
- **Description**: Supprimer un colis
- **Paramètres**: `id` (UUID)
- **Réponse**: `204 No Content`

#### POST /api/colis/{id}/generate-qr
- **Description**: Générer un QR code pour un colis
- **Paramètres**: `id` (UUID)
- **Réponse**: `200 OK` avec le chemin du QR code

#### GET /api/colis/qr/{qrCodePath}
- **Description**: Obtenir un colis par QR code
- **Paramètres**: `qrCodePath` (String)
- **Réponse**: `200 OK` avec le colis

#### POST /api/colis/{id}/update-status/{newStatus}
- **Description**: Mettre à jour le statut d'un colis
- **Paramètres**:
  - `id` (UUID)
  - `newStatus` (ColisStatus)
- **Réponse**: `200 OK` avec le colis mis à jour

## Endpoints Points Relais

### Base URL: `/api/points-relais`

#### GET /api/points-relais/recherche/ville/{ville}
- **Description**: Rechercher des points relais par ville
- **Paramètres**: `ville` (String)
- **Réponse**: `200 OK` avec la liste des points relais

#### GET /api/points-relais/recherche/code-postal/{codePostal}
- **Description**: Rechercher des points relais par code postal
- **Paramètres**: `codePostal` (String)
- **Réponse**: `200 OK` avec la liste des points relais

#### GET /api/points-relais/recherche/disponibles
- **Description**: Rechercher les points relais disponibles
- **Réponse**: `200 OK` avec la liste des points relais disponibles

#### GET /api/points-relais/recherche/proches
- **Description**: Rechercher les points relais proches d'une localisation
- **Paramètres**:
  - `latitude`: double
  - `longitude`: double
  - `rayonKm`: double (optionnel, défaut: 5.0)
- **Réponse**: `200 OK` avec la liste des points relais proches

#### POST /api/points-relais
- **Description**: Créer un nouveau point relais
- **Requête**: `PointRelais` object
- **Réponse**: `201 Created` avec le point relais créé

#### PUT /api/points-relais/{pointRelaisId}/horaires
- **Description**: Modifier les horaires d'un point relais
- **Paramètres**: `pointRelaisId` (Long)
- **Requête**: Nouveaux horaires (String)
- **Réponse**: `200 OK` ou `400 Bad Request`

## Endpoints Propriétaires

### Base URL: `/api/proprietaires`

#### GET /api/proprietaires
- **Description**: Obtenir la liste de tous les propriétaires
- **Réponse**: `200 OK` avec la liste des propriétaires

#### GET /api/proprietaires/{id}
- **Description**: Obtenir un propriétaire par ID
- **Paramètres**: `id` (Long)
- **Réponse**: `200 OK` avec le propriétaire ou `404 Not Found`

#### POST /api/proprietaires
- **Description**: Créer un nouveau propriétaire
- **Requête**: `Proprietaire` object
- **Réponse**: `200 OK` avec le propriétaire créé

#### PUT /api/proprietaires/{id}
- **Description**: Mettre à jour un propriétaire
- **Paramètres**: `id` (Long)
- **Requête**: `Proprietaire` object
- **Réponse**: `200 OK` avec le propriétaire mis à jour ou `404 Not Found`

#### DELETE /api/proprietaires/{id}
- **Description**: Supprimer un propriétaire
- **Paramètres**: `id` (Long)
- **Réponse**: `200 OK` avec succès ou `404 Not Found`
