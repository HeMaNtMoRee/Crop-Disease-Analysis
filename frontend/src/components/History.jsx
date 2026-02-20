import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { History as HistoryIcon, Search, Calendar, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/history");
            setHistory(res.data);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = async () => {
        if (!window.confirm("Are you sure you want to clear all history? This action cannot be undone.")) {
            return;
        }

        try {
            await axios.delete("http://localhost:8000/api/history");
            setHistory([]);
        } catch (error) {
            console.error("Error clearing history:", error);
        }
    };

    const filteredHistory = history.filter(item =>
        (item.disease_readable || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.filename || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <HistoryIcon className="w-5 h-5 text-white" />
                        </div>
                        Analysis History
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm transition-colors">
                        Archive of all processed crop images and reports
                    </p>
                </div>

                <div className="flex items-center gap-3">
                     <button
                        onClick={clearHistory}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        Clear History
                    </button>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search history..."
                            className="pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 w-full md:w-64 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-zinc-500">Loading history...</p>
                </div>
            ) : filteredHistory.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {filteredHistory.map((item) => (
                        <div key={item.id} className="group bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] rounded-2xl p-4 flex flex-col md:flex-row gap-6 hover:border-emerald-500/30 dark:hover:border-white/[0.12] hover:shadow-md dark:hover:bg-white/[0.04] transition-all duration-300">
                            {/* Image Thumbnail */}
                            <div className="relative w-full md:w-48 h-48 md:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-900">
                                <img
                                    src={`http://localhost:8000/uploads/${item.filename}`}
                                    alt={item.disease_readable}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                                <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${item.is_healthy
                                        ? "bg-emerald-500/80 text-white"
                                        : "bg-red-500/80 text-white"
                                    }`}>
                                    {item.is_healthy ? "Healthy" : "Affected"}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col justify-center gap-2">
                                <div className="flex items-start justify-between">
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                                        {item.disease_readable}
                                    </h3>
                                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(item.timestamp).toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-3 mt-1">
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-white/[0.05] px-2.5 py-1 rounded-lg">
                                        <Activity className="w-3.5 h-3.5 text-blue-400" />
                                        <span>Confidence: {Math.round(item.confidence * 100)}%</span>
                                    </div>
                                    {!item.is_healthy && item.severity && (
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-white/[0.05] px-2.5 py-1 rounded-lg">
                                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                            <span>Severity: {item.severity}</span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
                                    {item.reasoning.replace(/\*\*/g, '').replace(/#+/g, '')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                    <HistoryIcon className="w-12 h-12 mb-4 opacity-20" />
                    <p>No history found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default History;
