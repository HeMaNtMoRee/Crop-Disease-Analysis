import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { History, LayoutDashboard, CheckCircle, ShieldAlert, TrendingUp, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState([]);
    const [healthStats, setHealthStats] = useState({ healthy: 0, affected: 0 });

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/history");
            setHistory(res.data);
            processStats(res.data);
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    };

    const processStats = (data) => {
        const counts = {};
        let healthy = 0, affected = 0;

        data.forEach(item => {
            const name = (item.disease_readable || item.disease_name).replace(/___/g, ' ').replace(/_/g, ' ');
            counts[name] = (counts[name] || 0) + 1;
            if (item.is_healthy) healthy++;
            else affected++;
        });

        setHealthStats({ healthy, affected });
        setStats(Object.keys(counts).map(key => ({ name: key, count: counts[key] })));
    };

    const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#6366f1'];

    const pieData = [
        { name: 'Healthy', value: healthStats.healthy },
        { name: 'Affected', value: healthStats.affected }
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-[#1a1a2e] border border-zinc-200 dark:border-white/10 p-3 rounded-xl shadow-xl">
                    <p className="font-medium text-zinc-900 dark:text-white text-sm">{label || payload[0]?.name}</p>
                    <p className="text-emerald-500 dark:text-emerald-400 text-xs mt-1">Count: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    Activity Dashboard
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm transition-colors">Overview of all crop analyses performed</p>
            </div>

            {/* Summary Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Analyses", value: history.length, icon: TrendingUp, color: "from-blue-500 to-indigo-500" },
                    { label: "Healthy Leaves", value: healthStats.healthy, icon: CheckCircle, color: "from-emerald-500 to-green-500" },
                    { label: "Diseased Leaves", value: healthStats.affected, icon: ShieldAlert, color: "from-red-500 to-rose-500" },
                    { label: "Disease Types", value: stats.length, icon: LayoutDashboard, color: "from-purple-500 to-pink-500" },
                ].map((stat, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] group hover:border-emerald-500/30 dark:hover:border-white/[0.12] shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider transition-colors">{stat.label}</p>
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity shadow-sm`}>
                                <stat.icon className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-zinc-900 dark:text-white transition-colors">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar Chart */}
                <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] p-6 shadow-sm transition-colors">
                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-300 mb-6 uppercase tracking-wider">Disease Distribution</h3>
                    <div className="h-[350px] w-full">
                        {stats.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats} margin={{ bottom: 60 }}>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#71717a"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        angle={-35}
                                        textAnchor="end"
                                    />
                                    <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }} />
                                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                        {stats.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
                                No data available yet. Analyze some images first.
                            </div>
                        )}
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] p-6 shadow-sm transition-colors">
                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-300 mb-6 uppercase tracking-wider">Health Ratio</h3>
                    <div className="h-[220px] w-full">
                        {history.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        dataKey="value"
                                        strokeWidth={0}
                                        paddingAngle={5}
                                    >
                                        <Cell fill="#10b981" />
                                        <Cell fill="#ef4444" />
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
                                No data yet
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2 text-xs">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-zinc-600 dark:text-zinc-400">Healthy ({healthStats.healthy})</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-zinc-600 dark:text-zinc-400">Affected ({healthStats.affected})</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent History List */}
            <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] overflow-hidden shadow-sm transition-colors">
                <div className="px-6 py-4 border-b border-zinc-200 dark:border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-zinc-500" />
                        <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">Recent Analyses</h3>
                    </div>
                    <Link to="/history" className="text-xs font-medium text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                        View All
                    </Link>
                </div>
                <div className="divide-y divide-zinc-100 dark:divide-white/[0.04]">
                    {history.length > 0 ? history.slice(0, 5).map((item, idx) => (
                        <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${item.is_healthy ? "bg-emerald-500" : "bg-red-500"}`} />
                                <div>
                                    <p className="font-medium text-zinc-900 dark:text-zinc-200 text-sm">
                                        {item.disease_readable || item.disease_name.replace(/___/g, ' — ').replace(/_/g, ' ')}
                                    </p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-600 mt-0.5">
                                        {new Date(item.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {item.severity && (
                                    <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                        <AlertTriangle className="w-3 h-3" />
                                        {item.severity}
                                    </div>
                                )}
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.is_healthy
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                    : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                                    }`}>
                                    {item.is_healthy ? "Healthy" : "Affected"}
                                </span>
                            </div>
                        </div>
                    )) : (
                        <div className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-600 text-sm">
                            No analyses performed yet. Upload a leaf image to get started.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
