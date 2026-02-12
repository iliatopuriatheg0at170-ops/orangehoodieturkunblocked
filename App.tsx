
import React, { useState, useMemo, useEffect } from 'react';
import { GAMES } from './data';
import { Game, Category } from './types';

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

  const featuredGames = useMemo(() => GAMES.filter(g => g.featured), []);

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
                // Simple logic to show only favorites would go here if we had a "Favorites" filter
              }}
            >
              <i className="fa-solid fa-heart w-5"></i>
              Favorites ({favorites.length})
            </button>
          </div>

          <div className="mt-auto p-4 border-t border-slate-800">
            <div className="bg-slate-800 rounded-xl p-4 flex flex-col gap-3">
              <p className="text-xs text-slate-400 text-center font-medium">Enjoying Nexus Games?</p>
              <button className="bg-white text-slate-900 text-xs font-bold py-2 rounded-lg hover:bg-slate-200 transition-colors">
                SHARE PORTAL
              </button>
            </div>
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
                  <button className="p-2 rounded-full border border-slate-700 text-slate-400 hover:text-white">
                    <i className="fa-solid fa-share-nodes text-xl"></i>
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
                
                {/* Fullscreen Overlay Control */}
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

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-4xl font-extrabold text-white">{selectedGame.title}</h1>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold border border-slate-700">
                      {selectedGame.category.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-400 mb-4">
                    <i className="fa-solid fa-star"></i>
                    <span className="font-bold">{selectedGame.rating}</span>
                    <span className="text-slate-500 text-sm font-normal">• 12k+ Plays</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-lg mb-8">
                    {selectedGame.description}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <button className="flex-1 min-w-[200px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105">
                      <i className="fa-solid fa-play text-xl"></i>
                      RESTART GAME
                    </button>
                    <button className="flex-1 min-w-[200px] bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all">
                      <i className="fa-solid fa-flag text-xl text-red-500"></i>
                      REPORT ISSUE
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-80 bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-circle-info text-indigo-500"></i>
                    How to play
                  </h4>
                  <ul className="space-y-4 text-slate-400 text-sm">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0">W</div>
                      <span>Move forward or upward in most games.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0">A</div>
                      <span>Move left or rotate counter-clockwise.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0">S</div>
                      <span>Move backward or crouch.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0">D</div>
                      <span>Move right or rotate clockwise.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0">
                        <i className="fa-solid fa-arrow-pointer text-[10px]"></i>
                      </div>
                      <span>Click to interact or shoot.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-2xl font-bold text-white mb-6">Similar Games</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {GAMES.filter(g => g.category === selectedGame.category && g.id !== selectedGame.id).slice(0, 6).map(game => (
                    <GameCard key={game.id} game={game} onSelect={handleGameSelect} favorites={favorites} onToggleFavorite={toggleFavorite} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-12">
              {/* Hero Banner (Only if search/category is default) */}
              {selectedCategory === 'All' && searchQuery === '' && (
                <div className="relative rounded-3xl overflow-hidden bg-indigo-600 p-8 md:p-12 min-h-[350px] flex flex-col justify-center">
                  <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover scale-150 rotate-12" />
                  </div>
                  <div className="relative z-10 max-w-xl">
                    <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block tracking-widest uppercase">
                      New Experience
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                      Bored at school? We've got you <span className="underline decoration-indigo-300">covered</span>.
                    </h2>
                    <p className="text-indigo-100 text-lg mb-8 max-w-md">
                      Access hundreds of premium, high-quality unblocked games instantly. No downloads, no lag, just pure fun.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={() => handleGameSelect(GAMES[4])}
                        className="bg-white text-indigo-600 hover:bg-slate-100 font-bold px-8 py-3 rounded-xl transition-all shadow-xl"
                      >
                        PLAY SLOPE NOW
                      </button>
                      <button className="bg-indigo-700/50 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition-all border border-indigo-400/30">
                        BROWSE RECENT
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Game Grid Section */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold text-white">
                      {searchQuery ? `Search Results for "${searchQuery}"` : 
                       selectedCategory !== 'All' ? `${selectedCategory} Games` : 
                       'Popular Games'}
                    </h2>
                    <p className="text-slate-500 text-sm">Showing {filteredGames.length} awesome titles</p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button className="p-2 bg-slate-800 text-white rounded-md shadow-sm">
                      <i className="fa-solid fa-grip"></i>
                    </button>
                    <button className="p-2 text-slate-500 hover:text-slate-300">
                      <i className="fa-solid fa-list"></i>
                    </button>
                  </div>
                </div>

                {filteredGames.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredGames.map(game => (
                      <GameCard 
                        key={game.id} 
                        game={game} 
                        onSelect={handleGameSelect} 
                        isFeatured={game.featured}
                        favorites={favorites}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                      <i className="fa-solid fa-ghost text-4xl text-slate-600"></i>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No games found!</h3>
                    <p className="text-slate-500 max-w-xs">We couldn't find anything matching your search. Try another category or check your spelling.</p>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                      }}
                      className="mt-6 text-indigo-500 font-bold hover:text-indigo-400 underline underline-offset-4"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </section>

              {/* Newsletter/CTA */}
              <section className="bg-gradient-to-r from-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-md">
                  <h3 className="text-3xl font-bold text-white mb-4">Request a Game!</h3>
                  <p className="text-slate-400">Can't find your favorite game? Let us know and we'll add it to our unblocked database within 24 hours.</p>
                </div>
                <div className="flex-1 w-full max-w-md flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    placeholder="Enter game title..." 
                    className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl whitespace-nowrap transition-all">
                    SUBMIT REQUEST
                  </button>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>

      <footer className="bg-slate-900 border-t border-slate-800 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                <i className="fa-solid fa-gamepad text-white"></i>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                NEXUS<span className="text-indigo-500">GAMES</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              The premium destination for unblocked web entertainment. High performance, zero bloat, and a massive library of vetted unblocked games.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                <i className="fa-brands fa-discord"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                <i className="fa-brands fa-github"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Categories</h4>
            <ul className="space-y-3 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Action Games</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Puzzle Challenges</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Sports & Racing</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Arcade Classics</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Strategy Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-3 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Report Broken Game</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">DMCA Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-6">
            <h4 className="text-white font-bold mb-4">Status</h4>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-emerald-500 text-sm font-medium">All systems operational</span>
            </div>
            <p className="text-slate-500 text-xs mb-4">Last update: Oct 2023</p>
            <div className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
              Powered by Nexus Engine
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs text-center md:text-left">
            &copy; 2023 Nexus Unblocked Games. All games are properties of their respective creators. 
            This portal is for educational and entertainment purposes.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-slate-600 text-xs cursor-pointer hover:text-slate-400">Cookie Settings</span>
            <span className="text-slate-600 text-xs cursor-pointer hover:text-slate-400">Accessibility</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface GameCardProps {
  game: Game;
  onSelect: (game: Game) => void;
  isFeatured?: boolean;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onSelect, isFeatured, favorites, onToggleFavorite }) => {
  const isFav = favorites.includes(game.id);

  return (
    <div 
      onClick={() => onSelect(game)}
      className={`group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col h-full transform hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 ${isFeatured ? 'ring-2 ring-indigo-500/20' : ''}`}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-2 left-2 z-10 bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-lg">
          <i className="fa-solid fa-fire text-[8px]"></i>
          HOT
        </div>
      )}

      {/* Favorite Button */}
      <button 
        onClick={(e) => onToggleFavorite(game.id, e)}
        className={`absolute top-2 right-2 z-10 p-2 rounded-full backdrop-blur-md transition-all ${isFav ? 'bg-pink-500 text-white' : 'bg-black/20 text-white/70 hover:bg-black/40 hover:text-white'}`}
      >
        <i className={`fa-${isFav ? 'solid' : 'regular'} fa-heart text-xs`}></i>
      </button>

      {/* Thumbnail Container */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <img 
          src={game.thumbnail} 
          alt={game.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-indigo-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
            <i className="fa-solid fa-play text-indigo-600 ml-1"></i>
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{game.category}</span>
          <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
            <i className="fa-solid fa-star text-[10px]"></i>
            {game.rating}
          </div>
        </div>
        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">{game.title}</h3>
        <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mt-auto">{game.description}</p>
      </div>

      {/* Hover Status Bar */}
      <div className="h-1 bg-slate-800 w-full overflow-hidden">
        <div className="h-full bg-indigo-500 w-0 group-hover:w-full transition-all duration-300 ease-out"></div>
      </div>
    </div>
  );
};

export default App;
