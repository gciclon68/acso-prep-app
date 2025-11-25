import fs from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ConceptMap from '@/components/ConceptMap';
import QuizCard from '@/components/Quiz/QuizCard';
import ClassClientPage from './ClassClientPage';

// This is a server component
export default async function ClassPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const filePath = path.join(process.cwd(), 'src/data/processed', `${decodedId}.json`);

    let data;
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        data = JSON.parse(fileContent);
    } catch (e) {
        // If file doesn't exist, we might want to show a "Processing..." state or 404
        // For now, let's return 404 but in a real app we'd handle this better
        console.error(`Could not load data for ${decodedId}`, e);
        return notFound();
    }

    return (
        <ClassClientPage data={data} />
    );
}
