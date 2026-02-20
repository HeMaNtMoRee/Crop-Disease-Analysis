import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AlertTriangle, CheckCircle, Activity, ArrowLeft, ShieldAlert, HeartPulse } from 'lucide-react';

const AnalysisResult = ({ result, resetAnalysis }) => {
    if (!result) return null;

    const isHealthy = result.is_healthy;
    const confidencePercent = Math.round(result.confidence * 100);

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up">
            {/* Back Button */}
            <button
                onClick={resetAnalysis}
                className="group flex items-center gap-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors text-sm font-medium"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Analyzer
            </button>

            {/* Status Banner */}
            <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-colors ${isHealthy
                ? "bg-emerald-500/[0.06] border-emerald-500/20"
                : "bg-red-500/[0.06] border-red-500/20"
                }`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isHealthy
                    ? "bg-emerald-500/20"
                    : "bg-red-500/20"
                    }`}>
                    {isHealthy
                        ? <CheckCircle className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                        : <ShieldAlert className="w-6 h-6 text-red-500 dark:text-red-400" />
                    }
                </div>
                <div>
                    <p className={`text-lg font-bold ${isHealthy ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                        {isHealthy ? "✅ Leaf is Healthy" : "⚠️ Disease Detected — Leaf is Affected"}
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-500 text-sm">
                        {isHealthy
                            ? "No signs of disease or infection were found."
                            : `The leaf shows signs of ${result.disease_readable || result.disease_name.replace(/___/g, ' — ').replace(/_/g, ' ')}`
                        }
                    </p>
                </div>
            </div>

            {/* Info Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Image Card */}
                <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] overflow-hidden shadow-sm transition-colors">
                    <div className="aspect-square w-full bg-zinc-100 dark:bg-zinc-900">
                        <img
                            src={`http://localhost:8000/uploads/${result.filename}`}
                            alt="Analyzed leaf"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    {/* Confidence */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] flex flex-col justify-between shadow-sm transition-colors">
                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-500 text-xs font-medium uppercase tracking-wider mb-3">
                            <Activity className="w-3.5 h-3.5" />
                            Model Confidence
                        </div>
                        <div className="space-y-2">
                            <p className="text-4xl font-bold text-zinc-900 dark:text-white transition-colors">{confidencePercent}%</p>
                            <div className="w-full h-2 bg-zinc-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000"
                                    style={{ width: `${confidencePercent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] flex flex-col justify-between shadow-sm transition-colors">
                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-500 text-xs font-medium uppercase tracking-wider mb-3">
                            <HeartPulse className="w-3.5 h-3.5" />
                            Leaf Status
                        </div>
                        <div>
                            <p className={`text-2xl font-bold ${isHealthy ? "text-emerald-500 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                                {isHealthy ? "Healthy" : "Affected"}
                            </p>
                            <p className="text-zinc-500 dark:text-zinc-600 text-sm mt-1">
                                {isHealthy ? "No treatment needed" : "Treatment recommended"}
                            </p>
                        </div>
                    </div>

                    {/* Disease Name */}
                    <div className="col-span-2 p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] shadow-sm transition-colors">
                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-500 text-xs font-medium uppercase tracking-wider mb-2">
                            Detection Result
                        </div>
                        <p className="text-xl font-bold text-zinc-900 dark:text-white transition-colors">
                            {result.disease_readable || result.disease_name.replace(/___/g, ' — ').replace(/_/g, ' ')}
                        </p>
                    </div>
                </div>
            </div>

            {/* AI Reasoning Card */}
            <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] overflow-hidden shadow-sm transition-colors">
                <div className="px-6 py-4 border-b border-zinc-200 dark:border-white/[0.06] flex items-center gap-3 bg-zinc-50/50 dark:bg-white/[0.02]">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                        <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-zinc-900 dark:text-white transition-colors">AI Analysis & Recommendations</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-600">Powered by Ollama Gemma 3 4B</p>
                    </div>
                </div>
                <div className="p-6">
                    <div className="prose prose-sm max-w-none transition-colors
                        prose-headings:text-zinc-900 dark:prose-headings:text-zinc-200 prose-headings:font-bold
                        prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed
                        prose-strong:text-zinc-900 dark:prose-strong:text-zinc-200
                        prose-li:text-zinc-600 dark:prose-li:text-zinc-400
                        prose-code:text-emerald-500 dark:prose-code:text-emerald-400 prose-code:bg-emerald-500/10 dark:prose-code:bg-emerald-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                        prose-ul:list-disc prose-ol:list-decimal
                    ">
                        <ReactMarkdown>{result.reasoning}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisResult;
