import { create } from 'zustand';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface AppState {
  sidebarCollapsed: boolean;
  darkMode: boolean;
  language: Language;
  direction: Direction;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  toggleLanguage: () => void;
}

function getDirection(lang: Language): Direction {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

function applyDirection(direction: Direction) {
  document.documentElement.dir = direction;
  document.documentElement.lang = direction === 'rtl' ? 'ar' : 'en';
}

function applyDarkMode(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

const savedSidebar = localStorage.getItem('medaxis_sidebarCollapsed');
const savedDarkMode = localStorage.getItem('medaxis_darkMode');
const savedLanguage = localStorage.getItem('medaxis_language') as Language | null;

const initialDarkMode = savedDarkMode === 'true';
const initialSidebar = savedSidebar === 'true';
const initialLanguage: Language = savedLanguage === 'ar' ? 'ar' : 'en';
const initialDirection = getDirection(initialLanguage);

applyDarkMode(initialDarkMode);
applyDirection(initialDirection);

export const useAppStore = create<AppState>((set, get) => ({
  sidebarCollapsed: initialSidebar,
  darkMode: initialDarkMode,
  language: initialLanguage,
  direction: initialDirection,

  toggleSidebar: () => {
    const next = !get().sidebarCollapsed;
    localStorage.setItem('medaxis_sidebarCollapsed', String(next));
    set({ sidebarCollapsed: next });
  },

  toggleDarkMode: () => {
    const next = !get().darkMode;
    localStorage.setItem('medaxis_darkMode', String(next));
    applyDarkMode(next);
    set({ darkMode: next });
  },

  toggleLanguage: () => {
    const next: Language = get().language === 'en' ? 'ar' : 'en';
    const direction = getDirection(next);
    localStorage.setItem('medaxis_language', next);
    applyDirection(direction);
    set({ language: next, direction });
  },
}));
