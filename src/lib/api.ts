// Récupère l'URL de base de l'API depuis les variables d'environnement.
// Assurez-vous d'avoir un fichier .env.local avec NEXT_PUBLIC_API_URL=https://...
// URL de l'API Principale (Authentification, Colis, etc.)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE_URL) {
  throw new Error("La variable d'environnement NEXT_PUBLIC_API_URL n'est pas définie.");
}

// NOUVEAU: URL de l'API de Tarification
const PRICING_API_URL = process.env.NEXT_PUBLIC_PRICING_API_URL;
if (!PRICING_API_URL) {
  throw new Error("La variable d'environnement NEXT_PUBLIC_PRICING_API_URL n'est pas définie.");
}

// --- Interfaces de Types ---

// Correspond à AuthResponse dans la doc OpenAPI
export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: 'CLIENT' | 'RELAY_POINT' | 'ADMIN' | 'ENTERPRISE';
    active: boolean;
  };
}

// Correspond à RelayPointResponse
export interface RelayPointResponse {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  active: boolean;
  openingHours: string;
  // Ajoutez d'autres champs si nécessaire
}

// Correspond à CreateRelayPointRequest
export interface CreateRelayPointRequest {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  openingHours?: string;
  managerId?: number;
}

// Interface pour la requête de tarification
export interface PricingRequest {
  packageInfo: {
    weight: number;
    dimensions: { length: number; width: number; height: number; };
    declaredValue: number;
  };
  route: {
    origin: { lat: number; lng: number; };
    destination: { lat: number; lng: number; };
  };
  service: {
    speed: 'STANDARD' | 'EXPRESS' | 'URGENT';
    insurance: 'BASIC' | 'STANDARD' | 'PREMIUM';
  };
  customer?: {
    loyaltyPoints?: number;
    tier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  };
}

// Interface pour la réponse de tarification
export interface PricingResponse {
  pricing: {
    basePrice: number;
    geographicCost: number;
    temporalMultiplier: number;
    relayPointCost: number;
    insuranceCost: number;
    dynamicAdjustment: number;
    loyaltyDiscount: number;
    finalPrice: number;
  };
  breakdown: Record<string, any>;
  metadata: {
    calculationTime: string;
    version: string;
  };
}


// --- Fonction fetcher centrale ---

/**
 * Gère toutes les requêtes fetch vers l'API.
 * Ajoute automatiquement le token JWT et gère les erreurs.
 */
async function fetcher(url: string, options: RequestInit = {}): Promise<any> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `Erreur HTTP ${response.status}` }));
    throw new Error(errorData.message || 'Une erreur est survenue lors de la requête API.');
  }

  // Gère le cas des réponses sans contenu (ex: DELETE)
  if (response.status === 204) {
    return {};
  }

  return response.json();
}

async function pricingFetcher(url: string, options: RequestInit = {}): Promise<any> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Utilise l'URL de l'API de tarification
  const response = await fetch(`${PRICING_API_URL}${url}`, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `Erreur HTTP ${response.status}` }));
    throw new Error(errorData.message || 'Erreur lors de la requête de tarification.');
  }
  
  if (response.status === 204) return {};
  return response.json();
}


// --- Exposition des services API ---

export const api = {
  // Service d'Authentification
  auth: {
    register: (data: any): Promise<AuthResponse> => fetcher('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: any): Promise<AuthResponse> => fetcher('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: (): Promise<any> => fetcher('/auth/logout', { method: 'POST' }),
    // Ajoutez ici forgotPassword, resetPassword, etc. si nécessaire
  },

  // Service des Points Relais
  relayPoints: {
    getAll: (): Promise<RelayPointResponse[]> => fetcher('/relay-points'),
    getById: (id: number): Promise<RelayPointResponse> => fetcher(`/relay-points/${id}`),
    create: (payload: CreateRelayPointRequest): Promise<RelayPointResponse> => fetcher('/relay-points', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: number, payload: Partial<CreateRelayPointRequest>): Promise<RelayPointResponse> => fetcher(`/relay-points/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id: number | string): Promise<void> => fetcher(`/relay-points/${id}`, { method: 'DELETE' }),
    getNearby: (lat: number, lng: number, radius: number = 5): Promise<RelayPointResponse[]> => fetcher(`/relay-points/nearby?latitude=${lat}&longitude=${lng}&radius=${radius}`),
    getPackages: (id: number, page: number = 0, size: number = 10): Promise<any> => fetcher(`/relay-points/${id}/packages?page=${page}&size=${size}`),
  },


  // NOUVEAU: Service de Tarification
  pricing: {
    /**
     * Calcule le prix d'un envoi en utilisant l'API de tarification.
     * @param payload Les données de la requête de tarification.
     * @returns Une promesse avec la réponse de la tarification.
     */
    calculate: (payload: PricingRequest): Promise<PricingResponse> => {
      // NOTE: Si votre API de tarification est sur un autre serveur/port (ex: localhost:8080),
      // vous devrez ajuster l'URL ici ou utiliser une autre fonction fetcher.
      // Exemple : return fetcher('http://localhost:8080/api/v1/pricing/calculate', { ... });
      
      return fetcher('/pricing/calculate', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  },

  // Service des Colis
  packages: {
    create: (payload: any): Promise<any> => fetcher('/packages', { method: 'POST', body: JSON.stringify(payload) }),
    track: (trackingNumber: string): Promise<any> => fetcher(`/packages/${trackingNumber}`),
    getById: (id: number): Promise<any> => fetcher(`/packages/${id}`),
    updateStatus: (id: number, payload: { status: string, location?: string, description?: string }): Promise<any> => fetcher(`/packages/${id}/status`, { method: 'PUT', body: JSON.stringify(payload) }),
    cancel: (id: number): Promise<any> => fetcher(`/packages/${id}/cancel`, { method: 'POST' }),
    getMyPackages: (page: number = 0, size: number = 20): Promise<any> => fetcher(`/packages/my-packages?page=${page}&size=${size}`),
  },

  // Service de Paiement
  payments: {
    createIntent: (payload: { packageId: number, paymentMethod: string, returnUrl?: string }): Promise<any> => fetcher('/payments/create-intent', { method: 'POST', body: JSON.stringify(payload) }),
    confirm: (payload: { paymentIntentId: string, paymentMethodId: string }): Promise<any> => fetcher('/payments/confirm', { method: 'POST', body: JSON.stringify(payload) }),
    getById: (id: number): Promise<any> => fetcher(`/payments/${id}`),
  },

  // Service des Notifications
  notifications: {
    getAll: (page: number = 0, size: number = 20): Promise<any> => fetcher(`/notifications?page=${page}&size=${size}`),
    getUnreadCount: (): Promise<number> => fetcher('/notifications/unread-count'),
    markAsRead: (id: number): Promise<any> => fetcher(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllAsRead: (): Promise<any> => fetcher('/notifications/mark-all-read', { method: 'PUT' }),
    delete: (id: number): Promise<void> => fetcher(`/notifications/${id}`, { method: 'DELETE' }),
  },

  // Service d'Analytics
  analytics: {
    getDashboardData: (): Promise<any> => fetcher('/analytics/dashboard'),
    generateReport: (params: { startDate: string, endDate: string, type?: string }): Promise<any> => {
      const query = new URLSearchParams(params as any).toString();
      return fetcher(`/analytics/reports?${query}`);
    },
  },
};