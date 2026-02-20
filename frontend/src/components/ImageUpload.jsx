import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, ImagePlus } from 'lucide-react';
import axios from 'axios';

const ImageUpload = ({ onAnalysisComplete }) => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImage(null);
        setPreview(null);
    };

    const analyzeImage = async () => {
        if (!image) return;
        setLoading(true);

        const formData = new FormData();
        formData.append("file", image);

        try {
            const response = await axios.post("http://localhost:8000/api/analyze", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            onAnalysisComplete(response.data);
        } catch (error) {
            console.error("Error analyzing image:", error);
            alert("Failed to analyze image. Please ensure the backend is running on port 8000.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto animate-fade-in-up">
            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] shadow-xl dark:shadow-black/20 backdrop-blur-sm transition-colors duration-300">
                <h2 className="text-xl font-bold mb-5 text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
                        <ImagePlus className="w-4 h-4 text-white" />
                    </div>
                    Upload Leaf Image
                </h2>

                {/* Drop Zone */}
                <div
                    className={`relative w-full h-56 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${dragActive
                        ? "border-emerald-500 bg-emerald-500/[0.08]"
                        : "border-zinc-300 dark:border-white/[0.08] hover:border-emerald-500/50 dark:hover:border-white/[0.15] bg-zinc-50 dark:bg-white/[0.02]"
                        } ${preview ? "border-none p-0 overflow-hidden h-64" : ""}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !preview && inputRef.current?.click()}
                >
                    {preview ? (
                        <div className="relative w-full h-full group">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl shadow-inner" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                    className="p-2 bg-red-500/90 hover:bg-red-600 rounded-full text-white transition-all transform hover:scale-110 shadow-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center pointer-events-none p-4">
                            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] flex items-center justify-center mx-auto mb-3 shadow-sm transition-colors">
                                <Upload className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
                            </div>
                            <p className="text-zinc-700 dark:text-zinc-400 font-medium text-sm transition-colors">Drag & drop your leaf image</p>
                            <p className="text-zinc-500 dark:text-zinc-600 text-xs mt-1 transition-colors">or click to browse • JPG, PNG supported</p>
                        </div>
                    )}

                    {!preview && (
                        <input
                            ref={inputRef}
                            type="file"
                            className="hidden"
                            onChange={handleChange}
                            accept="image/*"
                        />
                    )}
                </div>

                {/* Analyze Button */}
                <button
                    onClick={analyzeImage}
                    disabled={!image || loading}
                    className={`w-full mt-5 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${!image || loading
                        ? "bg-zinc-100 dark:bg-white/[0.04] text-zinc-400 dark:text-zinc-600 cursor-not-allowed border border-zinc-200 dark:border-white/[0.04]"
                        : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]"
                        }`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analyzing with AI...
                        </>
                    ) : (
                        "Analyze Disease"
                    )}
                </button>
            </div>
        </div>
    );
};

export default ImageUpload;
