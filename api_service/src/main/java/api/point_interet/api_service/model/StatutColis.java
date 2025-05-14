package api.point_interet.api_service.model;

/**
 * Énumération représentant les différents états possibles d'un colis dans le système.
 */
public enum StatutColis {
    /**
     * Le colis est en attente d'être déposé au point relais
     */
    EN_ATTENTE,
    
    /**
     * Le colis a été reçu par le point relais
     */
    RECU,
    
    /**
     * Le colis a été retiré par le client
     */
    RETIRE;

    /**
     * Vérifie si la transition vers le nouveau statut est valide
     * @param nouveauStatut le statut vers lequel on veut transitionner
     * @return true si la transition est valide, false sinon
     */
    public boolean peutTransitionnerVers(StatutColis nouveauStatut) {
        switch (this) {
            case EN_ATTENTE:
                return nouveauStatut == RECU;
            case RECU:
                return nouveauStatut == RETIRE;
            case RETIRE:
                return false; // État final
            default:
                return false;
        }
    }
} 