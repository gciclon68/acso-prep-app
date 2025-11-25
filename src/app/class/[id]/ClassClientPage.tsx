"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Brain, FileText } from 'lucide-react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuizCard from '@/components/Quiz/QuizCard';

// Dynamic import to prevent SSR hydration issues with ReactFlow
const ConceptMap = dynamic(() => import('@/components/ConceptMap'), {
    ssr: false,
    loading: () => (
        <div className="h-[500px] w-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-slate-400">
            Loading Map...
        </div>
    )
});

export default function ClassClientPage({ data }: { data: any }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'concepts' | 'quiz'>('concepts');

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Link>

                <header>
                    <h1 className="text-4xl font-bold text-slate-900">{data.title}</h1>
                </header>

                <div className="w-full">
                    <div className="grid w-full grid-cols-2 max-w-[400px] bg-slate-200 p-1 rounded-lg mb-6">
                        <button
                            onClick={() => setActiveTab('concepts')}
                            className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'concepts'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            Concepts & Mind Map
                        </button>
                        <button
                            onClick={() => setActiveTab('quiz')}
                            className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'quiz'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            Quiz
                        </button>
                    </div>

                    {activeTab === 'concepts' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-indigo-600" />
                                    Summary
                                </h2>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{data.summary}</p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Brain className="h-5 w-5 text-indigo-600" />
                                    Concept Map
                                </h2>
                                <ConceptMap initialNodes={data.mindMap.nodes} initialEdges={data.mindMap.edges} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'quiz' && (
                        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {currentQuestionIndex < data.quiz.length ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm text-slate-500">
                                        <span>Question {currentQuestionIndex + 1} of {data.quiz.length}</span>
                                        <span>{Math.round(((currentQuestionIndex) / data.quiz.length) * 100)}% Complete</span>
                                    </div>
                                    <QuizCard
                                        question={data.quiz[currentQuestionIndex]}
                                        onNext={() => setCurrentQuestionIndex(prev => prev + 1)}
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Quiz Completed!</h2>
                                    <p className="text-slate-600 mb-6">Great job reviewing {data.title}.</p>
                                    <Link href="/" className="inline-block bg-indigo-600 text-white font-bold py-2 px-6 rounded hover:bg-indigo-700 transition-colors">
                                        Back to Dashboard
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
