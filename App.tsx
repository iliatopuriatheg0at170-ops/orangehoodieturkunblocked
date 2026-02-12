import React, { useState, useMemo, useEffect } from 'react';
import { GAMES } from './data.ts';

const CATEGORIES = ['All', 'Action', 'Arcade', 'Puzzle', 'Strategy', 'Sports', 'Retro'];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('nexus-favs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('nexus-favs', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const filteredGames = useMemo(() => {
    return GAMES.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar */}
      <nav className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
            <i className={`fa-solid ${isSidebarOpen ? 'fa-indent' : 'fa-outdent'} text-xl`}></i>
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setSelectedGame(null); setSelectedCategory('All'); setSearchQuery('');}}>
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <i className="fa-solid fa-bolt text-white"></i>
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white hidden sm:block">NEXUS<span className="text-indigo-500 underline decoration-2 underline-offset-4">GAMES</span></h1>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-8">
          <div className="relative group">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors"></i>
            <input 
              type="text" 
              placeholder="Search unblocked titles..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-full py-2 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-indigo-600/10 border border-indigo-500/20 rounded-full hidden md:block">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{GAMES.length} GAMES ONLINE</span>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-slate-900 border-r border-slate-800 transition-all duration-300 overflow-hidden flex flex-col shrink-0`}>
          <div className="p-4 space-y-1">
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-3">Browse Categories</h2>
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => { setSelectedCategory(cat); setSelectedGame(null); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  selectedCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <i className={`fa-solid ${cat === 'All' ? 'fa-th-large' : 'fa-gamepad'} w-5`}></i>
                {cat}
              </button>
            ))}
            <div className="h-px bg-slate-800 my-6"></div>
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-3">Personal</h2>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800">
              <i className="fa-solid fa-heart text-pink-500 w-5"></i>
              Favorites ({favorites.length})
            </button>
          </div>
          
          <div className="mt-auto p-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">Stable, fast, and completely unblocked for school.</p>
              <button className="text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300 tracking-widest transition-colors">V 2.0 Stable</button>
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="flex-1 bg-slate-950 overflow-y-auto custom-scrollbar p-6">
          {selectedGame ? (
            <div className="max-w-6xl mx-auto flex flex-col gap-6 animate-in slide-in-from-bottom duration-500">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 text-slate-400 hover:text-white font-bold transition-colors group"
                >
                  <i className="fa-solid fa-chevron-left group-hover:-translate-x-1 transition-transform"></i>
                  BACK TO BROWSE
                </button>
                <div className="flex gap-3">
                  <button onClick={(e) => toggleFavorite(selectedGame.id, e)} className={`w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center ${favorites.includes(selectedGame.id) ? 'bg-pink-600 border-pink-500 text-white' : 'bg-slate-900 text-slate-400'}`}>
                    <i className="fa-solid fa-heart"></i>
                  </button>
                  <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors" onClick={() => document.querySelector('iframe').requestFullscreen()}>
                    <i className="fa-solid fa-expand mr-2"></i> FULLSCREEN
                  </button>
                </div>
              </div>

              <div className="aspect-video bg-black rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl shadow-indigo-500/5">
                <iframe src={selectedGame.iframeUrl} className="w-full h-full border-none" allowFullScreen></iframe>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-white">{selectedGame.title}</h2>
                  <span className="px-3 py-1 bg-slate-900 rounded-full text-xs font-black text-slate-500 border border-slate-800">{selectedGame.category}</span>
                </div>
                <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">{selectedGame.description}</p>
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  {searchQuery ? `Searching: ${searchQuery}` : selectedCategory === 'All' ? 'Trending Games' : `${selectedCategory} Collection`}
                </h2>
                <div className="w-20 h-1 bg-indigo-500 rounded-full"></div>
              </div>

              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredGames.map(game => (
                    <div 
                      key={game.id}
                      onClick={() => setSelectedGame(game)}
                      className="group cursor-pointer flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10"
                    >
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img src={game.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={game.title} />
                        <div className="absolute inset-0 bg-indigo-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-xl transform scale-50 group-hover:scale-100 transition-transform">
                            <i className="fa-solid fa-play ml-1"></i>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => toggleFavorite(game.id, e)}
                          className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${favorites.includes(game.id) ? 'bg-pink-500 text-white' : 'bg-black/40 text-white/70 hover:bg-pink-500'}`}
                        >
                          <i className="fa-solid fa-heart text-xs"></i>
                        </button>
                      </div>
                      <div className="p-4 flex flex-col gap-1">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{game.category}</span>
                        <h3 className="text-white font-bold group-hover:text-indigo-400 transition-colors">{game.title}</h3>
                        <div className="flex items-center gap-1 text-yellow-500 text-[10px] font-bold mt-1">
                           <i className="fa-solid fa-star"></i>
                           <span>{game.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6">
                    <i className="fa-solid fa-ghost text-3xl text-slate-700"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Games Found</h3>
                  <p className="text-slate-500">We couldn't find any games matching your request.</p>
                  <button onClick={() => {setSearchQuery(''); setSelectedCategory('All');}} className="mt-4 text-indigo-500 font-bold hover:underline">Reset Filters</button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
