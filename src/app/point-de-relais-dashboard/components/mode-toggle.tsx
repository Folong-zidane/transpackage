'use client'; // Directive pour indiquer que ce composant s'exécute côté client

import { Moon, Sun } from 'lucide-react'; // Icônes pour les thèmes clair et sombre
import { useTheme } from 'next-themes'; // Hook pour gérer le thème

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Composant de bascule de thème
 *
 * Ce composant permet à l'utilisateur de:
 * 1. Voir le thème actuel (icône soleil/lune)
 * 2. Changer le thème via un menu déroulant
 *
 * Choix techniques:
 * - useTheme hook: Pour accéder et modifier le thème
 * - DropdownMenu: Pour offrir plusieurs options de thème
 * - Animation CSS: Pour la transition entre les icônes soleil/lune
 *
 * @returns {JSX.Element} Le composant de bascule de thème
 */
export function ModeToggle() {
  // Utiliser le hook useTheme pour accéder à la fonction setTheme
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      {/* Bouton déclencheur avec animation d'icône */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {/* Icône soleil avec animation pour le mode clair */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          {/* Icône lune avec animation pour le mode sombre */}
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      {/* Menu déroulant avec options de thème */}
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
