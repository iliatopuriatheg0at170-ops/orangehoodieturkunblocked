
import React, { useState, useMemo, useEffect } from 'react';
import { GAMES } from './data.ts';
import { Game, Category } from './types.ts';

const CATEGORIES: (Category | 'All')[] = ['All', 'Action', 'Adventure', 'Puzzle', 'Strategy', 'Sports', 'Arcade', 'Retro'];

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load favorites from local storage
  useEffect(() => {
    const saved = localStorage.getItem('nexus-favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load favorites", e);
      }
    }
  }, []);

  // Save favorites to local storage
  useEffect(() => {
    localStorage.setItem('nexus-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const filteredGames = useMemo(() => {
    return GAMES.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <i className={`fa-solid ${isSidebarOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
          </button>
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              setSelectedGame(null);
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition-all">
              <i className="fa-solid fa-gamepad text-white text-xl"></i>
            </div>
            <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
              NEXUS<span className="text-indigo-500">GAMES</span>
            </span>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fa-solid fa-magnifying-glass text-slate-500"></i>
          </div>
          <input
            type="text"
            placeholder="Search thousands of unblocked games..."
            className="w-full bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <i className="fa-solid fa-fire"></i>
            <span>Hot Today</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden border-2 border-slate-600">
            <img src="https://picsum.photos/seed/user/100/100" alt="User" />
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out`}>
          <div className="p-4 flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Categories</h3>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedGame(null);
                }}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <i className={`fa-solid ${
                  cat === 'All' ? 'fa-border-all' : 
                  cat === 'Action' ? 'fa-gun' : 
                  cat === 'Adventure' ? 'fa-compass' : 
                  cat === 'Puzzle' ? 'fa-puzzle-piece' : 
                  cat === 'Strategy' ? 'fa-chess' : 
                  cat === 'Sports' ? 'fa-volleyball' : 
                  cat === 'Arcade' ? 'fa-ghost' : 'fa-clock-rotate-left'
                } w-5`}></i>
                {cat}
              </button>
            ))}

            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-2 px-2">Personal</h3>
            <button 
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-slate-400 hover:bg-slate-800 hover:text-white ${favorites.length > 0 ? 'text-pink-400' : ''}`}
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSelectedGame(null);
              }}
            >
              <i className="fa-solid fa-heart w-5"></i>
              Favorites ({favorites.length})
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-8 custom-scrollbar">
          {selectedGame ? (
            <div className="max-w-6xl mx-auto flex flex-col gap-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span>Back to Games</span>
                </button>
                <div className="flex items-center gap-3">
                   <button 
                    onClick={(e) => toggleFavorite(selectedGame.id, e)}
                    className={`p-2 rounded-full border ${favorites.includes(selectedGame.id) ? 'bg-pink-500/10 border-pink-500/50 text-pink-500' : 'border-slate-700 text-slate-400 hover:text-white'}`}
                  >
                    <i className={`fa-${favorites.includes(selectedGame.id) ? 'solid' : 'regular'} fa-heart text-xl`}></i>
                  </button>
                </div>
              </div>

              <div className="relative group bg-black rounded-2xl overflow-hidden aspect-video shadow-2xl shadow-indigo-500/10 border border-slate-800">
                <iframe
                  src={selectedGame.iframeUrl}
                  title={selectedGame.title}
                  className="w-full h-full border-none"
                  allowFullScreen
                ></iframe>
                
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"
                    onClick={(e) => {
                      const iframe = e.currentTarget.parentElement?.parentElement?.querySelector('iframe');
                      iframe?.requestFullscreen();
                    }}
                  >
                    <i className="fa-solid fa-expand"></i>
                    <span>Fullscreen</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start text-white">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-4xl font-extrabold">{selectedGame.title}</h1>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold border border-slate-700">
                      {selectedGame.category.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-lg mb-8">
                    {selectedGame.description}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-12">
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 
                     selectedCategory !== 'All' ? `${selectedCategory} Games` : 
                     'Popular Games'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredGames.map(game => (
                    <GameCard 
                      key={game.id} 
                      game={game} 
                      onSelect={handleGameSelect} 
                      favorites={favorites}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

interface GameCardProps {
  game: Game;
  onSelect: (game: Game) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onSelect, favorites, onToggleFavorite }) => {
  const isFav = favorites.includes(game.id);

  return (
    <div 
      onClick={() => onSelect(game)}
      className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col h-full transform hover:-translate-y-1"
    >
      <button 
        onClick={(e) => onToggleFavorite(game.id, e)}
        className={`absolute top-2 right-2 z-10 p-2 rounded-full backdrop-blur-md transition-all ${isFav ? 'bg-pink-500 text-white' : 'bg-black/20 text-white/70 hover:bg-black/40 hover:text-white'}`}
      >
        <i className={`fa-${isFav ? 'solid' : 'regular'} fa-heart text-xs`}></i>
      </button>

      <div className="aspect-[4/3] overflow-hidden relative">
        <img 
          src={game.thumbnail} 
          alt={game.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">{game.category}</span>
        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">{game.title}</h3>
      </div>
    </div>
  );
};

export default App;
