"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number; // Index
    explanation: string;
}

interface QuizCardProps {
    question: QuizQuestion;
    onNext: () => void;
}

export default function QuizCard({ question, onNext }: QuizCardProps) {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isExcellent, setIsExcellent] = useState<boolean>(false);
    const chatContainerRef = React.useRef<HTMLDivElement>(null);

    // Reset state when question changes
    React.useEffect(() => {
        setSelectedOption(null);
        setMessages([]);
        setInputValue("");
        setIsCorrect(null);
        setIsExcellent(false);
    }, [question.id]);

    React.useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleHint = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/grade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'hint',
                    question: question.question
                }),
            });
            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: `💡 Hint: ${data.message}` }]);
        } catch (error) {
            console.error("Error getting hint:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = inputValue;
        setInputValue("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsSubmitting(true);

        try {
            // Determine action: if first time submitting (no isCorrect set), treat as grading.
            // Otherwise treat as chat.
            const isGrading = isCorrect === null;

            const payload: any = {
                question: question.question,
                correctOption: question.options[question.correctAnswer],
                explanation: question.explanation,
            };

            if (isGrading) {
                if (selectedOption === null) {
                    setMessages(prev => [...prev, { role: 'assistant', content: "Please select an option first!" }]);
                    setIsSubmitting(false);
                    return;
                }
                payload.action = 'grade';
                payload.selectedOption = question.options[selectedOption];
                payload.reasoning = userMsg;
            } else {
                payload.action = 'chat';
                payload.history = messages;
                payload.userMessage = userMsg;
            }

            const response = await fetch('/api/grade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (isGrading) {
                // Verificar si hay error en la respuesta
                if (!response.ok || data.error) {
                    throw new Error(data.error || "Failed to process request");
                }

                // Validar que tenemos los datos necesarios
                if (typeof data.isCorrect === 'undefined') {
                    throw new Error("Invalid response from server");
                }

                setIsCorrect(data.isCorrect);
                setIsExcellent(data.isExcellent || false);

                const status = data.isCorrect
                    ? (data.isExcellent ? "Excellent! 🌟" : "Correct, but...")
                    : "Incorrect ❌";

                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `**${status}**\n\n${data.feedback || "No feedback available."}`
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.message || "No response available."
                }]);
            }

        } catch (error: any) {
            console.error("Error:", error);
            const errorMsg = error.message.includes("AI response")
                ? "⚠️ The AI had trouble understanding the response format. Please try again."
                : error.message.includes("Invalid response")
                ? "⚠️ Received invalid data from server. Please try again."
                : `⚠️ ${error.message}`;
            setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <RadioGroup
                    value={selectedOption?.toString()}
                    onValueChange={(v) => {
                        if (!isExcellent) setSelectedOption(parseInt(v));
                    }}
                    disabled={isExcellent || isCorrect !== null} // Lock selection after first submit
                >
                    {question.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 rounded hover:bg-slate-50">
                            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">{option}</Label>
                        </div>
                    ))}
                </RadioGroup>

                <div className="border rounded-md p-4 h-[300px] overflow-y-auto bg-slate-50 space-y-4" ref={chatContainerRef}>
                    {messages.length === 0 && (
                        <p className="text-center text-slate-400 text-sm mt-10">
                            Select an answer and explain your reasoning to start.
                            <br />
                            Or ask for a hint!
                        </p>
                    )}
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-wrap ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isSubmitting && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-slate-200 p-3 rounded-lg rounded-bl-none shadow-sm flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                                <span className="text-sm text-slate-600">Thinking...</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleHint} disabled={isSubmitting || isExcellent}>
                        💡 Hint
                    </Button>
                    <Textarea
                        placeholder={isCorrect === null ? "Explain your reasoning..." : "Ask a follow-up question..."}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="min-h-[50px] flex-grow"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        disabled={isExcellent}
                    />
                    <Button onClick={handleSend} disabled={!inputValue.trim() || isSubmitting || isExcellent}>
                        Send
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                {isExcellent && (
                    <Button onClick={onNext} className="bg-green-600 hover:bg-green-700 w-full">
                        Next Question
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
