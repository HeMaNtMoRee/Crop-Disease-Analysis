import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Leaf, LayoutDashboard, Search, History as HistoryIcon, Sun, Moon } from 'lucide-react';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import History from './components/History';

function AppContent() {
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0f] text-zinc-900 dark:text-zinc-100 selection:bg-emerald-500/30 font-sans overflow-x-hidden transition-colors duration-300">
      {/* Ambient Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/[0.05] rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-purple-500/[0.04] rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-zinc-200 dark:border-white/[0.06] bg-white/70 dark:bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
              <Leaf className="w-4.5 h-4.5 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white transition-colors">
              CropGuard<span className="text-emerald-500 dark:text-emerald-400">AI</span>
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="flex gap-1 p-1 bg-zinc-100 dark:bg-white/[0.04] rounded-xl border border-zinc-200 dark:border-white/[0.06] transition-colors">
              <Link
                to="/"
                className={`px-3 md:px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${isActive('/')
                    ? "bg-white dark:bg-white/[0.1] text-zinc-900 dark:text-white shadow-sm border border-zinc-200 dark:border-white/[0.08]"
                    : "text-zinc-500 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Analyzer</span>
              </Link>
              <Link
                to="/dashboard"
                className={`px-3 md:px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${isActive('/dashboard')
                    ? "bg-white dark:bg-white/[0.1] text-zinc-900 dark:text-white shadow-sm border border-zinc-200 dark:border-white/[0.08]"
                    : "text-zinc-500 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
              <Link
                to="/history"
                className={`px-3 md:px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${isActive('/history')
                    ? "bg-white dark:bg-white/[0.1] text-zinc-900 dark:text-white shadow-sm border border-zinc-200 dark:border-white/[0.08]"
                    : "text-zinc-500 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
              >
                <HistoryIcon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">History</span>
              </Link>
            </nav>

            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06] text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 md:py-16 min-h-[calc(100vh-4rem)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
