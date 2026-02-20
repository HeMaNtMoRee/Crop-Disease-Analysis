import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import AnalysisResult from './AnalysisResult';
import { Sparkles, Zap, Shield } from 'lucide-react';

const Home = () => {
    const [analysisResult, setAnalysisResult] = useState(null);

    return (
        <div className="w-full">
            {!analysisResult ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-10 animate-fade-in">
                    {/* Hero Section */}
                    <div className="text-center max-w-3xl mx-auto space-y-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium mb-2 transition-colors">
                            <Sparkles className="w-3 h-3" />
                            Powered by Ollama (Gemma 3 4B)
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-zinc-900 dark:text-white transition-colors">
                            <span className="bg-gradient-to-r from-zinc-700 via-zinc-900 to-zinc-700 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                                Intelligent Crop
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                                Disease Detection
                            </span>
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed transition-colors">
                            Upload a leaf image to instantly detect disease, assess severity, and get AI-powered treatment recommendations.
                        </p>
                    </div>

                    {/* Upload Component */}
                    <ImageUpload onAnalysisComplete={setAnalysisResult} />

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mt-6">
                        {[
                            { icon: Zap, label: "Instant Analysis", desc: "Results in seconds using advanced AI inference", color: "from-amber-500 to-orange-500" },
                            { icon: Shield, label: "High Accuracy", desc: "Precise identification of leaf type and health status", color: "from-emerald-500 to-cyan-500" },
                            { icon: Sparkles, label: "Detailed Insights", desc: "Severity estimation and tailored care advice", color: "from-purple-500 to-pink-500" }
                        ].map((item, i) => (
                            <div key={i} className="group p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] hover:border-emerald-500/30 dark:hover:border-white/[0.12] shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300">
                                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className="w-4.5 h-4.5 text-white" />
                                </div>
                                <div className="font-semibold text-zinc-900 dark:text-zinc-200 text-sm transition-colors">{item.label}</div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed transition-colors">{item.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <AnalysisResult
                    result={analysisResult}
                    resetAnalysis={() => setAnalysisResult(null)}
                />
            )}
        </div>
    );
};

export default Home;
