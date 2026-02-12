
export type Category = 'Action' | 'Adventure' | 'Puzzle' | 'Strategy' | 'Sports' | 'Arcade' | 'Retro';

export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  iframeUrl: string;
  category: Category;
  rating: number;
  featured?: boolean;
}

export interface AppState {
  searchQuery: string;
  selectedCategory: Category | 'All';
  selectedGame: Game | null;
  favorites: string[];
}
