"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
    onImageSelected: (base64: string | null) => void;
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setPreview(base64);
                onImageSelected(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setPreview(null);
        onImageSelected(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            {!preview ? (
                <div
                    className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <ImageIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <p className="text-sm text-slate-600 font-medium">Click to upload an image of your solution</p>
                    <p className="text-xs text-slate-400 mt-2">Supports JPG, PNG</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
            ) : (
                <div className="relative border rounded-lg overflow-hidden bg-slate-100">
                    <img src={preview} alt="Solution preview" className="max-h-[300px] mx-auto object-contain" />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full"
                        onClick={clearImage}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
