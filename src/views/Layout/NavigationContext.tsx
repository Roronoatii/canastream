import { createContext } from 'react';

/**
 * * drawerSubState et handleDrawerSubStateToggle représentent l'état et la gestion d'état du menu drawer de gauche
 * * mobileDrawerOpen et handleMobileDrawerToggle représentent l'état et la gestion d'état de ce menu en version mobile
 */

export interface INavigationContext {
  mobileDrawerOpen: boolean;
  drawerSubState: 'normal' | 'minified';
  handleDrawerSubStateToggle: () => void;
  handleMobileDrawerToggle: () => void;
}

export const defaultNavigationContext = {
  mobileDrawerOpen: false,
  drawerSubState: 'normal' as const,
  handleDrawerSubStateToggle: () => {},
  handleMobileDrawerToggle: () => {},
};

export const NavigationContext = createContext<INavigationContext>(
  defaultNavigationContext,
);
