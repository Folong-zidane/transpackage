// Utilitaires pour le dashboard Point Relais

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Fonction utilitaire pour combiner des classes CSS conditionnellement

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
