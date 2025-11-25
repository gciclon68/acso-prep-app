# ACSO Final Prep Application

## Project Overview

**ACSO Final Prep** is an AI-powered study application designed to help students prepare for their Operating Systems (Arquitectura y Conceptos de Sistemas Operativos - ACSO) final exam. The application leverages Google's Gemini AI to provide intelligent study materials, interactive quizzes, concept maps, and an exam simulator with AI-powered grading capabilities.

## Key Features

### 1. Class-by-Class Learning Modules (Classes 16-27)
- **Interactive Dashboard**: Browse through 12 operating systems classes
- **AI-Generated Summaries**: Concise, structured summaries of key concepts for each class
- **Visual Concept Maps**: Interactive mind maps built with ReactFlow showing relationships between topics
- **Practice Quizzes**: Multiple-choice questions with explanations for each class

### 2. Exam Simulator
- **Realistic Practice**: Practice with exam-style questions
- **Multi-Modal Input**: Support for both text answers and handwritten solution uploads
- **AI Grading**: Automated grading and feedback using Google Gemini's multimodal capabilities
- **Image Recognition**: Upload photos of handwritten solutions for AI analysis

### 3. Progress Tracking
- Visual progress indicators showing completion status across all classes
- Track quiz performance and study progress

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **React**: Version 19.2.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with PostCSS
- **UI Components**:
  - Radix UI primitives (tabs, radio groups, labels, slots)
  - Custom UI components with shadcn/ui structure
  - Lucide React for icons
- **Animations**: Framer Motion for smooth transitions
- **Visualization**: ReactFlow for interactive concept maps
- **State Management**: Zustand for global state

### Backend & AI
- **AI Provider**: Google Generative AI (Gemini)
- **Model**: Gemini 2.5 Flash (configurable)
- **API**: Next.js API Routes for serverless functions
- **Content Generation**: Automated processing pipeline using Gemini API

### Development Tools
- **Linting**: ESLint with Next.js configuration
- **Type Checking**: TypeScript with strict configuration
- **Package Manager**: npm

## Project Structure

```
acso-prep-app/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── api/                  # API routes
│   │   │   ├── grade/           # Quiz grading endpoint
│   │   │   └── grade-exam/      # Exam grading endpoint
│   │   ├── class/               # Individual class pages
│   │   │   └── [id]/           # Dynamic class route
│   │   │       ├── page.tsx    # Server component wrapper
│   │   │       └── ClassClientPage.tsx  # Client component
│   │   ├── exam/               # Exam simulator page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home/Dashboard page
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── label.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── textarea.tsx
│   │   ├── Exam/             # Exam-specific components
│   │   │   └── ImageUploader.tsx
│   │   ├── Quiz/             # Quiz components
│   │   │   └── QuizCard.tsx
│   │   └── ConceptMap.tsx    # Interactive mind map component
│   ├── data/                  # Application data
│   │   ├── raw/              # Raw text files (class transcripts)
│   │   └── processed/        # AI-generated JSON data
│   ├── lib/                   # Utility libraries
│   │   ├── gemini.ts         # Gemini AI integration
│   │   └── utils.ts          # Helper functions
│   └── store/                 # State management
│       └── useStore.ts       # Zustand store
├── scripts/                   # Utility scripts
│   ├── generate-content.mjs  # AI content generation pipeline
│   └── list-models.mjs       # List available Gemini models
├── public/                    # Static assets
├── .env.local                # Environment variables (API keys)
├── components.json           # shadcn/ui configuration
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── eslint.config.mjs        # ESLint configuration
├── postcss.config.mjs       # PostCSS configuration
└── package.json             # Dependencies and scripts
```

## How It Works

### Content Generation Pipeline

1. **Raw Data**: Class transcripts or lecture notes are stored as `.txt` files in `src/data/raw/`
2. **AI Processing**: The `generate-content.mjs` script processes each file using Gemini AI
3. **Structured Output**: AI generates JSON files with:
   - Concise summaries
   - Mind map nodes and edges (ReactFlow format)
   - Quiz questions with multiple-choice options and explanations
4. **Storage**: Processed JSON files are saved to `src/data/processed/`

### Application Flow

1. **Dashboard** (`/`): Users see all 12 classes and can navigate to individual classes or the exam simulator
2. **Class View** (`/class/[id]`):
   - Displays AI-generated summary
   - Shows interactive concept map
   - Provides practice quiz with immediate feedback
3. **Exam Simulator** (`/exam`):
   - Presents realistic exam questions
   - Accepts handwritten solutions (image upload) or text input
   - Uses Gemini's multimodal capabilities to grade and provide feedback

## Environment Setup

### Prerequisites
- Node.js 20+
- npm or compatible package manager
- Google Gemini API key

### Environment Variables

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_api_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

## Installation & Running

### Install Dependencies
```bash
npm install
```

### Generate Content (First Time Setup)
```bash
# List available Gemini models
node scripts/list-models.mjs

# Process raw content files with AI
node scripts/generate-content.mjs
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## API Endpoints

### POST `/api/grade`
Grades quiz answers using Gemini AI.

**Request Body:**
```json
{
  "question": "string",
  "selectedAnswer": "string",
  "correctAnswer": "string"
}
```

### POST `/api/grade-exam`
Grades exam submissions with optional image input.

**Request Body:**
```json
{
  "question": "string",
  "image": "string (base64) | null",
  "textAnswer": "string"
}
```

## Features by Class

Currently implemented:
- **Clase 16**: Intro to Operating Systems - Booting, BIOS/UEFI, File Systems, Security

Classes to be implemented (17-27):
- Clase 17: Procesos
- Clase 18: Threads
- Clase 19: Scheduling
- Clase 20: Sincronización
- Clase 21: Deadlocks
- Clase 22: Memoria
- Clase 23: Paginación
- Clase 24: Memoria Virtual
- Clase 25: File Systems
- Clase 26: I/O
- Clase 27: VM Farms

## Design Philosophy

- **AI-First**: Leverages Google Gemini for content generation and grading
- **Student-Centric**: Designed for efficient exam preparation
- **Interactive**: Visual and engaging learning experience
- **Multimodal**: Supports text and image inputs for realistic exam practice
- **Responsive**: Works across desktop and mobile devices

## Current Status

**Version**: 0.1.0

**Implemented**:
- Core application structure
- Class 16 full implementation (summary, concept map, quiz)
- Exam simulator with image upload
- AI grading for both quizzes and exams
- Content generation pipeline
- Responsive UI with Tailwind CSS

**In Progress**:
- Processing content for classes 17-27

## Future Enhancements

See [NEXT-STEPS-PLAN.md](NEXT-STEPS-PLAN.md) for detailed roadmap including:
- Docling integration for advanced document processing
- RAG (Retrieval Augmented Generation) knowledge base with embeddings
- Hybrid text + pixel-map embeddings for image-heavy content
- AI Tutor Agent for personalized learning assistance
- Enhanced quiz and exam generation

## License

Private - Educational Use Only

## Contributors

This project was developed as a study tool for ACSO (Arquitectura y Conceptos de Sistemas Operativos) students.

---

**Last Updated**: November 24, 2025
