"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import ImageUploader from '@/components/Exam/ImageUploader';

// Mock exam questions
const EXAM_QUESTIONS = [
    {
        id: 1,
        type: 'practical',
        text: "Given a system with 3 processes (P1, P2, P3) and 3 resource types (R1, R2, R3). P1 holds R1 and waits for R2. P2 holds R2 and waits for R3. P3 holds R3 and waits for R1. Draw the Resource Allocation Graph and determine if there is a deadlock. Explain your answer.",
    },
    {
        id: 2,
        type: 'practical',
        text: "Calculate the effective memory access time if the TLB hit ratio is 90%, TLB access time is 10ns, and main memory access time is 100ns.",
    }
];

export default function ExamPage() {
    const [currentQuestion, setCurrentQuestion] = useState(EXAM_QUESTIONS[0]);
    const [image, setImage] = useState<string | null>(null);
    const [textAnswer, setTextAnswer] = useState("");
    const [isGrading, setIsGrading] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    const handleGrade = async () => {
        if (!image && !textAnswer) return;

        setIsGrading(true);
        try {
            const response = await fetch('/api/grade-exam', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: currentQuestion.text,
                    image,
                    textAnswer
                }),
            });

            const data = await response.json();
            setFeedback(data.feedback);
        } catch (error) {
            console.error("Error grading exam:", error);
            setFeedback("Failed to grade. Please try again.");
        } finally {
            setIsGrading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Link>

                <header>
                    <h1 className="text-3xl font-bold text-slate-900">Exam Simulator</h1>
                    <p className="text-slate-600">Practice with real exam-style questions. Upload your handwritten solutions for AI grading.</p>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>Question {currentQuestion.id}</CardTitle>
                        <CardDescription className="text-lg font-medium text-slate-800 mt-2">
                            {currentQuestion.text}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Upload Solution (Optional)</label>
                            <ImageUploader onImageSelected={setImage} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Or Type Answer</label>
                            <Textarea
                                placeholder="Type your solution here..."
                                value={textAnswer}
                                onChange={(e) => setTextAnswer(e.target.value)}
                                className="min-h-[150px]"
                            />
                        </div>

                        {feedback && (
                            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                                <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5" />
                                    AI Feedback
                                </h3>
                                <div className="prose prose-sm max-w-none text-indigo-900/80 whitespace-pre-wrap">
                                    {feedback}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-4">
                            <Button variant="outline" onClick={() => {
                                setFeedback(null);
                                setImage(null);
                                setTextAnswer("");
                                setCurrentQuestion(EXAM_QUESTIONS[1]); // Simple toggle for demo
                            }}>
                                Skip Question
                            </Button>
                            <Button onClick={handleGrade} disabled={(!image && !textAnswer) || isGrading}>
                                {isGrading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit for Grading
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
