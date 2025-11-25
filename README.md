# 🎓 ACSO Final Prep

<div align="center">

**AI-Powered Study Application for Operating Systems Final Exam Preparation**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.5%20Flash-orange?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Features](#-features) • [Demo](#-demo) • [Getting Started](#-getting-started) • [User Guide](#-user-guide) • [Roadmap](#-development-roadmap) • [Documentation](#-documentation)

</div>

---

## 🌟 Overview

**ACSO Final Prep** is a cutting-edge study application that leverages Google's Gemini AI to transform Operating Systems course materials into an interactive, personalized learning experience. From AI-generated summaries and concept maps to multimodal exam grading, this app is your comprehensive companion for acing your ACSO final.

### Why ACSO Prep?

- 🤖 **AI-Powered Learning**: Gemini 2.5 Flash generates summaries, quizzes, and provides intelligent feedback
- 🗺️ **Visual Learning**: Interactive concept maps help you understand topic relationships
- 📝 **Smart Practice**: Adaptive quizzes with detailed explanations for every answer
- 📸 **Multimodal Grading**: Upload handwritten solutions and get AI feedback on your work
- 📊 **Progress Tracking**: Monitor your learning journey across all topics
- 🎯 **Exam Ready**: Realistic exam simulator prepares you for the real thing

---

## ✨ Features

### 🎯 Core Features (Current)

#### 📚 **12 Comprehensive Class Modules**
Study modules covering the complete ACSO curriculum:
- **Clase 16**: Introduction to Operating Systems (Booting, BIOS/UEFI, File Systems)
- **Clase 17**: Processes
- **Clase 18**: Threads
- **Clase 19**: CPU Scheduling
- **Clase 20**: Synchronization
- **Clase 21**: Deadlocks
- **Clase 22**: Memory Management
- **Clase 23**: Paging
- **Clase 24**: Virtual Memory
- **Clase 25**: File Systems
- **Clase 26**: I/O Systems
- **Clase 27**: VM Farms & Cloud

#### 🧠 **Interactive Study Experience**
- **AI-Generated Summaries**: Concise, well-structured overviews of key concepts
- **Concept Maps**: ReactFlow-powered visualizations showing relationships between topics
- **Practice Quizzes**: Multiple-choice questions with instant feedback and explanations

#### 🎓 **Exam Simulator**
- Real exam-style questions
- Text or image answer submission
- **Multimodal AI Grading**: Upload photos of handwritten solutions
- Detailed feedback on your performance

#### 🔄 **Automated Content Pipeline**
- Process raw lecture notes with AI
- Generate structured study materials automatically
- Consistent, high-quality content across all classes

---

## 🎬 Demo

### Dashboard
<div align="center">
<img src="https://via.placeholder.com/800x450/4F46E5/FFFFFF?text=Dashboard+Preview" alt="Dashboard Preview" width="600"/>
<p><em>Browse all 12 classes and track your progress</em></p>
</div>

### Class Study Page
<div align="center">
<img src="https://via.placeholder.com/800x450/059669/FFFFFF?text=Class+Study+Preview" alt="Class Study Preview" width="600"/>
<p><em>AI-generated summaries, interactive concept maps, and practice quizzes</em></p>
</div>

### Exam Simulator
<div align="center">
<img src="https://via.placeholder.com/800x450/DC2626/FFFFFF?text=Exam+Simulator+Preview" alt="Exam Simulator Preview" width="600"/>
<p><em>Upload handwritten solutions for AI-powered grading</em></p>
</div>

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or compatible package manager
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gciclon68/acso-prep-app.git
   cd acso-prep-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```

4. **Generate content for all classes** (Optional - Class 16 already included)
   ```bash
   node scripts/generate-content.mjs
   ```
   This processes the raw lecture notes and generates structured JSON files for all classes.

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 📖 User Guide

### Navigating the Dashboard

1. **Home Page**: View all 12 class modules and your overall progress
2. **Class Selection**: Click any class card to access its study materials
3. **Exam Simulator**: Click "Start Exam" to practice with realistic questions

### Studying a Class

Each class page has two main tabs:

#### **Concepts & Mind Map Tab**
- **Summary Section**: Read AI-generated overviews of key concepts
- **Concept Map**: Explore interactive visualizations of topic relationships
  - Pan and zoom to navigate
  - Click nodes to focus on specific concepts

#### **Quiz Tab**
- Answer multiple-choice practice questions
- Get instant feedback on your answers
- Read detailed explanations for correct answers
- Track your progress (e.g., "Question 3 of 5")

### Using the Exam Simulator

1. **Read the Question**: Realistic exam-style problems
2. **Submit Your Answer**:
   - **Option A**: Type your answer in the text box
   - **Option B**: Upload a photo of your handwritten solution
   - **Option C**: Combine both for comprehensive grading
3. **Get AI Feedback**: Receive detailed grading and suggestions
4. **Next Question**: Continue to build exam confidence

### Tips for Best Results

- 📝 **Complete all quizzes** before taking the exam simulator
- 🗺️ **Study concept maps** to understand how topics connect
- 📸 **Practice handwriting** solutions for multimodal grading feedback
- 🔄 **Review explanations** even when you answer correctly
- 📊 **Track progress** to identify weak areas

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Visualizations**: ReactFlow

### AI & Backend
- **AI Provider**: Google Gemini 2.5 Flash
- **API Routes**: Next.js Serverless Functions
- **State Management**: Zustand

### Development
- **Linting**: ESLint
- **Package Manager**: npm

---

## 📈 Development Roadmap

### ✅ Phase 1: Core Application (COMPLETED)
- [x] Interactive dashboard with 12 class modules
- [x] AI-powered content generation pipeline
- [x] Class study pages with summaries and concept maps
- [x] Practice quizzes with explanations
- [x] Exam simulator with multimodal grading
- [x] Responsive UI design
- [x] Class 16 fully implemented

### 🔄 Phase 2: Complete Content Library (IN PROGRESS)
- [x] Raw content prepared for Classes 17-27
- [ ] Generate AI content for remaining 11 classes
- [ ] Quality assurance and testing
- [ ] Deploy all 12 classes

**Status**: Ready to run content generation script

### 🔮 Phase 3: Advanced Document Processing (PLANNED)
**[Docling Integration](https://github.com/DS4SD/docling)**
- [ ] Install and configure Docling
- [ ] Enhanced PDF/document parsing
- [ ] Extract images, tables, and diagrams
- [ ] Preserve document structure in summaries
- [ ] Image-enriched concept maps

**Benefits**: Better content extraction, visual learning aids, table support

### 🎯 Phase 4: RAG Knowledge Base (PLANNED)
**Hybrid Text + Visual Embeddings**
- [ ] Set up PostgreSQL with pgvector
- [ ] Generate text embeddings (OpenAI/Google)
- [ ] Generate visual embeddings (CLIP for images)
- [ ] Implement hybrid semantic search
- [ ] Build retrieval API

**Benefits**: Intelligent content retrieval, context-aware responses, multimodal search

### 🤖 Phase 5: AI Tutor Agent (PLANNED)
**Personalized Learning Assistant**
- [ ] Conversational chat interface
- [ ] RAG-powered question answering
- [ ] Dynamic quiz generation on any topic
- [ ] Weak area identification
- [ ] Personalized study plans
- [ ] Performance analytics dashboard

**Benefits**: 24/7 personalized tutoring, adaptive learning, targeted practice

### 🚀 Phase 6: Polish & Advanced Features (PLANNED)
- [ ] Spaced repetition system
- [ ] Progress analytics dashboard
- [ ] Mobile PWA optimization
- [ ] Export to PDF functionality
- [ ] Collaborative features (optional)

**Timeline**: See [NEXT-STEPS-PLAN.md](NEXT-STEPS-PLAN.md) for detailed roadmap

---

## 📊 Current Development Status

### What's Working Now ✅
- ✅ Full application infrastructure
- ✅ AI content generation pipeline
- ✅ Dashboard and navigation
- ✅ Class 16 complete (summary, concept map, 5 quiz questions)
- ✅ Exam simulator with text and image upload
- ✅ Multimodal AI grading
- ✅ Responsive design across devices

### Next Immediate Steps 🎯
1. **Run content generation** for Classes 17-27 (~2 hours)
2. **Quality check** all generated content
3. **Deploy** complete 12-class application

### Future Enhancements 🚀
- **Docling integration** for richer content (Week 2-3)
- **RAG knowledge base** with hybrid embeddings (Week 4-5)
- **AI Tutor Agent** with personalized learning (Week 6-10)

---

## 📚 Documentation

### Comprehensive Guides
- **[PROJECT-Description.md](PROJECT-Description.md)**: Complete technical documentation
- **[GIT.md](GIT.md)**: Detailed change log and implementation notes
- **[NEXT-STEPS-PLAN.md](NEXT-STEPS-PLAN.md)**: Full development roadmap with phases

### Quick Links
- [API Endpoints](PROJECT-Description.md#api-endpoints)
- [Project Structure](PROJECT-Description.md#project-structure)
- [Content Generation Pipeline](PROJECT-Description.md#content-generation-pipeline)
- [Future Features](NEXT-STEPS-PLAN.md)

---

## 🎓 About ACSO

**ACSO** (Arquitectura y Conceptos de Sistemas Operativos) is an Operating Systems course covering fundamental concepts including:
- System architecture and booting
- Process and thread management
- CPU scheduling algorithms
- Synchronization and deadlocks
- Memory management and virtual memory
- File systems and I/O

This application is designed to help students master these concepts and excel in their final exams.

---

## 🤝 Contributing

This is an educational project. Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is for educational purposes. Please use responsibly.

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful content generation and grading
- **Next.js Team** for an amazing framework
- **Radix UI** and **shadcn/ui** for beautiful, accessible components
- **ReactFlow** for interactive visualizations
- **Docling** (planned) for advanced document processing

---

## 📧 Contact

**Project Maintainer**: gciclon68

**Repository**: [https://github.com/gciclon68/acso-prep-app](https://github.com/gciclon68/acso-prep-app)

---

<div align="center">

**Made with ❤️ for ACSO students**

⭐ Star this repo if it helps you ace your exam! ⭐

</div>
