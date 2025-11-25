# ACSO Prep - Next Steps Development Plan

## Overview

This document outlines the roadmap for expanding the ACSO Final Prep application with advanced AI-powered features, comprehensive documentation processing, and an intelligent tutor agent system.

---

## Phase 1: Content Generation for Classes 17-27

### Objective
Complete the content generation for all remaining operating systems classes using the existing Gemini-based pipeline.

### Tasks
1. **Prepare Raw Content**
   - ✅ Ensure all class transcripts/notes are in `src/data/raw/` as `.txt` files
   - Format: `Clase 17.txt`, `Clase 18.txt`, etc.

2. **Run Content Generation Pipeline**
   ```bash
   node scripts/generate-content.mjs
   ```
   - Process all 11 remaining classes (17-27)
   - Generate structured JSON files with:
     - Concise summaries
     - Interactive mind map structures
     - 5 quiz questions per class with explanations

3. **Quality Assurance**
   - Review generated summaries for accuracy
   - Verify mind map node relationships
   - Test quiz questions for correctness
   - Ensure all JSON files are valid

4. **Deploy Updated Content**
   - Verify all classes display correctly
   - Test navigation between classes
   - Confirm quiz functionality for each class

### Expected Outcome
- All 12 classes (16-27) fully functional with AI-generated content
- Complete study coverage for ACSO final exam

### Estimated Timeline
- Content processing: 1-2 hours (including API rate limits)
- QA and testing: 2-3 hours
- **Total**: 3-5 hours

---

## Phase 2: Docling Integration for Advanced Document Processing

### Objective
Integrate [Docling](https://github.com/DS4SD/docling) for sophisticated document understanding, enabling extraction of complex layouts, tables, images, and maintaining document structure.

### Why Docling?
- **Advanced PDF/Document Parsing**: Handles complex layouts better than simple text extraction
- **Structure Preservation**: Maintains headings, lists, tables, and hierarchies
- **Multi-Format Support**: PDF, DOCX, HTML, images, etc.
- **Table Extraction**: Accurately extracts tabular data
- **Image Extraction**: Preserves diagrams, charts, and visual content
- **Markdown Export**: Clean, structured markdown output

### Implementation Steps

#### 2.1 Environment Setup
```bash
# Install Docling
pip install docling

# Or use Docker for isolation
docker pull dsaidocker/docling:latest
```

#### 2.2 Create Docling Processing Pipeline
**New Script**: `scripts/process-with-docling.py`

```python
from docling.document_converter import DocumentConverter
import json
import os

def process_class_document(pdf_path, class_id):
    """
    Process a class PDF with Docling
    Returns structured data including:
    - Full markdown text
    - Extracted images
    - Tables
    - Document structure
    """
    converter = DocumentConverter()
    result = converter.convert(pdf_path)

    return {
        'id': class_id,
        'markdown': result.markdown,
        'images': result.images,
        'tables': result.tables,
        'structure': result.document.structure
    }
```

#### 2.3 Enhanced Content Generation
**Update**: `scripts/generate-enhanced-content.mjs`
- Use Docling-processed markdown as input
- Include image references in summaries
- Extract and process tables separately
- Maintain document structure in mind maps

#### 2.4 Image Handling
- Store extracted images in `public/class-assets/[class-id]/`
- Reference images in summaries with proper paths
- Use images in concept maps where appropriate
- Enable image-based quiz questions

### Expected Outcome
- Richer, more accurate content extraction
- Preservation of visual elements (diagrams, charts)
- Better understanding of document structure
- Enhanced learning materials with visual aids

### Estimated Timeline
- Setup and integration: 4-6 hours
- Testing and refinement: 3-4 hours
- **Total**: 7-10 hours

---

## Phase 3: RAG Knowledge Base with Vector Embeddings

### Objective
Build a Retrieval Augmented Generation (RAG) system to enable intelligent, context-aware responses from the tutor agent.

### Architecture

#### 3.1 Database Selection
**Recommended**: PostgreSQL with pgvector extension

**Alternative Options**:
- Pinecone (managed vector DB)
- Weaviate (open-source)
- Qdrant (high-performance)

**Rationale for PostgreSQL + pgvector**:
- Free and self-hosted
- Familiar SQL interface
- Hybrid queries (metadata + vector similarity)
- Good performance for small-to-medium datasets

#### 3.2 Embedding Strategy: Hybrid Approach

##### Text Embeddings
**Model**: `text-embedding-3-small` (OpenAI) or `textembedding-gecko` (Google)
- Embed all text content (summaries, quiz questions, explanations)
- Chunk size: ~512 tokens with 50-token overlap
- Store in `text_embeddings` table

##### Visual Embeddings (Pixel Maps)
**Model**: CLIP (OpenAI) or similar multimodal model
- Embed extracted images, diagrams, charts
- Use for visual similarity search
- Store in `image_embeddings` table

##### Hybrid Search
Combine text and visual embeddings for comprehensive retrieval:
```sql
SELECT * FROM knowledge_base
WHERE text_similarity(query_embedding, text_embedding) > 0.7
   OR image_similarity(query_embedding, image_embedding) > 0.6
ORDER BY combined_score DESC
LIMIT 10
```

#### 3.3 Database Schema

```sql
-- Text content and embeddings
CREATE TABLE knowledge_chunks (
  id SERIAL PRIMARY KEY,
  class_id VARCHAR(20),
  chunk_text TEXT,
  chunk_type VARCHAR(50), -- 'summary', 'quiz', 'explanation', 'table'
  metadata JSONB,
  text_embedding vector(1536),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Image content and embeddings
CREATE TABLE image_assets (
  id SERIAL PRIMARY KEY,
  class_id VARCHAR(20),
  image_path TEXT,
  image_description TEXT,
  image_type VARCHAR(50), -- 'diagram', 'chart', 'screenshot', etc.
  metadata JSONB,
  image_embedding vector(512), -- CLIP embeddings
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for fast similarity search
CREATE INDEX ON knowledge_chunks USING ivfflat (text_embedding vector_cosine_ops);
CREATE INDEX ON image_assets USING ivfflat (image_embedding vector_cosine_ops);
```

#### 3.4 Embedding Pipeline
**New Script**: `scripts/generate-embeddings.mjs`

```javascript
import { OpenAI } from 'openai';
import { Pool } from 'pg';

const openai = new OpenAI();
const db = new Pool({ connectionString: process.env.DATABASE_URL });

async function embedClassContent(classData) {
  // 1. Chunk text content
  const chunks = chunkText(classData.summary, 512, 50);

  // 2. Generate embeddings
  for (const chunk of chunks) {
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: chunk.text
    });

    // 3. Store in database
    await db.query(
      'INSERT INTO knowledge_chunks (class_id, chunk_text, text_embedding, metadata) VALUES ($1, $2, $3, $4)',
      [classData.id, chunk.text, embedding.data[0].embedding, chunk.metadata]
    );
  }

  // 4. Process images separately
  await embedImages(classData.images);
}
```

#### 3.5 Retrieval API
**New Endpoint**: `/api/retrieve`

```typescript
// Semantic search endpoint
export async function POST(request: Request) {
  const { query, topK = 5, includeImages = true } = await request.json();

  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query);

  // Retrieve relevant text chunks
  const textResults = await searchTextEmbeddings(queryEmbedding, topK);

  // Optionally retrieve relevant images
  const imageResults = includeImages
    ? await searchImageEmbeddings(queryEmbedding, topK)
    : [];

  return { textResults, imageResults };
}
```

### Expected Outcome
- Fast semantic search across all class materials
- Context-aware retrieval for tutor agent
- Support for both text and visual content
- Scalable knowledge base for future content

### Estimated Timeline
- Database setup: 2-3 hours
- Embedding pipeline: 6-8 hours
- Retrieval API: 4-5 hours
- Testing and optimization: 4-5 hours
- **Total**: 16-21 hours

---

## Phase 4: AI Tutor Agent

### Objective
Create an intelligent tutoring agent that can answer questions, generate quizzes, and provide personalized learning assistance.

### Features

#### 4.1 Conversational Interface
- **Chat UI**: Real-time chat interface in the application
- **Context Awareness**: Maintains conversation history
- **Class-Specific Mode**: Can focus on specific classes or cover all material

#### 4.2 RAG-Powered Responses
```javascript
async function generateTutorResponse(userQuery, conversationHistory) {
  // 1. Retrieve relevant context from knowledge base
  const relevantContext = await retrieveContext(userQuery, {
    topK: 5,
    includeImages: true,
    classFilter: getCurrentClass()
  });

  // 2. Build prompt with context
  const prompt = `
    You are an expert ACSO (Operating Systems) tutor.

    User Question: ${userQuery}

    Relevant Context:
    ${relevantContext.textChunks.join('\n\n')}

    ${relevantContext.images.length > 0 ? 'Relevant Diagrams Available' : ''}

    Previous Conversation:
    ${conversationHistory.slice(-3).join('\n')}

    Provide a clear, educational response that helps the student understand the concept.
  `;

  // 3. Generate response with Gemini
  const response = await gemini.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  });

  return response.text();
}
```

#### 4.3 Dynamic Quiz Generation
**Endpoint**: `/api/tutor/generate-quiz`

```typescript
export async function POST(request: Request) {
  const { topic, difficulty, questionCount } = await request.json();

  // Retrieve relevant content about the topic
  const context = await retrieveContext(topic, { topK: 10 });

  // Generate quiz with Gemini
  const quiz = await generateQuiz({
    context,
    difficulty,
    questionCount,
    format: 'multiple-choice'
  });

  return { quiz };
}
```

Features:
- Topic-specific quiz generation
- Adjustable difficulty levels
- Mixed question types (multiple choice, true/false, short answer)
- Explanation generation for each answer

#### 4.4 Exam Preparation Assistant
- **Weak Area Identification**: Analyze quiz performance to identify struggling topics
- **Personalized Study Plans**: Generate study recommendations based on performance
- **Practice Problem Generation**: Create exam-style questions on weak areas

#### 4.5 Visual Learning Support
- **Diagram Explanation**: Explain diagrams and charts using multimodal AI
- **Concept Visualization**: Generate simple diagrams for complex concepts
- **Mermaid Diagram Generation**: Create flowcharts and diagrams programmatically

### Tutor Agent Capabilities

1. **Question Answering**
   - "Explain how process scheduling works"
   - "What's the difference between deadlock prevention and avoidance?"

2. **Concept Clarification**
   - "I don't understand virtual memory - can you explain it differently?"
   - "Show me an example of a deadlock scenario"

3. **Quiz Generation**
   - "Generate 5 questions about threads"
   - "Create a hard quiz on memory paging"

4. **Study Planning**
   - "I have 3 days to study - create a study plan"
   - "What are the most important topics for the final?"

5. **Code Examples** (if applicable)
   - "Show me a semaphore implementation in C"
   - "Explain this context switching code"

### Implementation Structure

**New Components**:
- `src/components/Tutor/ChatInterface.tsx` - Chat UI
- `src/components/Tutor/MessageBubble.tsx` - Message display
- `src/components/Tutor/QuizGenerator.tsx` - Dynamic quiz interface
- `src/components/Tutor/StudyPlan.tsx` - Personalized study planner

**New Pages**:
- `src/app/tutor/page.tsx` - Main tutor interface

**New API Routes**:
- `/api/tutor/chat` - Chat completions with RAG
- `/api/tutor/generate-quiz` - Dynamic quiz generation
- `/api/tutor/study-plan` - Study plan generation
- `/api/tutor/analyze-performance` - Performance analytics

### Expected Outcome
- Intelligent, context-aware tutoring system
- Personalized learning assistance
- Dynamic content generation based on student needs
- Improved exam preparation outcomes

### Estimated Timeline
- Chat interface: 6-8 hours
- RAG integration: 4-6 hours
- Quiz generation: 4-5 hours
- Study planning: 3-4 hours
- Performance analytics: 3-4 hours
- Testing and refinement: 6-8 hours
- **Total**: 26-35 hours

---

## Phase 5: Advanced Features & Polish

### 5.1 Performance Analytics Dashboard
- Track quiz scores over time
- Visualize progress by topic
- Identify weak areas with heatmaps
- Export study reports

### 5.2 Spaced Repetition System
- Implement SM-2 algorithm for optimal review timing
- Automatically schedule review sessions
- Notify users of due reviews

### 5.3 Collaborative Features (Optional)
- Share quiz results with peers
- Study group formation
- Leaderboards (optional, gamification)

### 5.4 Mobile Optimization
- Progressive Web App (PWA) setup
- Offline mode for studying without internet
- Mobile-optimized UI components

### 5.5 Export & Print Features
- Export summaries as PDF
- Print-friendly quiz formats
- Flashcard generation

### Estimated Timeline
- Analytics: 8-10 hours
- Spaced repetition: 6-8 hours
- Mobile optimization: 10-12 hours
- Export features: 4-6 hours
- **Total**: 28-36 hours

---

## Technical Stack Evolution

### Current Stack
- Next.js 16, React 19, TypeScript
- Tailwind CSS v4
- Google Gemini AI
- Zustand state management
- ReactFlow for visualizations

### Additions for Future Phases

**Phase 2 (Docling)**:
- Python 3.9+ (for Docling)
- Docling library

**Phase 3 (RAG)**:
- PostgreSQL 15+ with pgvector
- OpenAI Embeddings API or Google Text Embeddings
- CLIP (for visual embeddings)
- Node.js pg driver

**Phase 4 (Tutor Agent)**:
- WebSocket support (for real-time chat)
- Additional Gemini API usage
- Conversation memory storage

**Phase 5 (Advanced)**:
- Chart.js or Recharts (analytics)
- Next PWA (mobile)
- PDF generation library (jsPDF or similar)

---

## Development Roadmap Timeline

### Sprint 1: Complete Class Content (Week 1)
- Phase 1: Classes 17-27 content generation
- **Deliverable**: All classes functional

### Sprint 2: Document Processing (Week 2-3)
- Phase 2: Docling integration
- **Deliverable**: Enhanced content with images and tables

### Sprint 3: Knowledge Base (Week 4-5)
- Phase 3: RAG system implementation
- **Deliverable**: Semantic search and retrieval working

### Sprint 4: Tutor Agent Core (Week 6-8)
- Phase 4: Tutor agent chat and quiz generation
- **Deliverable**: Basic tutor functionality

### Sprint 5: Tutor Agent Enhancement (Week 9-10)
- Phase 4 (cont.): Study planning and analytics
- **Deliverable**: Full tutor feature set

### Sprint 6: Polish & Advanced Features (Week 11-12)
- Phase 5: Performance dashboard, PWA, exports
- **Deliverable**: Production-ready application

**Total Estimated Time**: 12 weeks (part-time) or 6 weeks (full-time)

---

## Success Metrics

### Phase 1
- ✅ 12/12 classes with generated content
- ✅ 60+ quiz questions total
- ✅ 12 interactive concept maps

### Phase 2
- ✅ All PDFs processed with Docling
- ✅ Images extracted and displayed
- ✅ Tables properly formatted

### Phase 3
- ✅ 500+ embedded text chunks
- ✅ 100+ embedded images
- ✅ <200ms average retrieval time
- ✅ >0.8 relevance score for top results

### Phase 4
- ✅ <2s response time for tutor queries
- ✅ Contextually relevant answers in >90% of cases
- ✅ Dynamic quiz generation working
- ✅ Personalized study plans generated

### Phase 5
- ✅ Mobile-responsive on all devices
- ✅ PWA installable
- ✅ Performance score >90 (Lighthouse)

---

## Risk Mitigation

### Technical Risks
1. **API Rate Limits** (Gemini)
   - Mitigation: Implement caching, rate limiting, queue systems
2. **Vector DB Performance**
   - Mitigation: Proper indexing, query optimization, caching
3. **Image Processing Complexity**
   - Mitigation: Start with simple extraction, iterate

### Resource Risks
1. **API Costs** (Embeddings, Gemini)
   - Mitigation: Monitor usage, set budgets, use caching
2. **Database Hosting**
   - Mitigation: Use free tier (Railway, Supabase), optimize storage

### Scope Risks
1. **Feature Creep**
   - Mitigation: Stick to phases, MVP approach for each phase
2. **Time Overruns**
   - Mitigation: Buffer time in estimates, prioritize core features

---

## Conclusion

This comprehensive plan transforms the ACSO Prep application from a static study tool into an intelligent, adaptive learning system powered by cutting-edge AI technologies. By following this phased approach, we ensure steady progress while maintaining quality and functionality at each stage.

The combination of Docling for document understanding, RAG for intelligent retrieval, and Gemini for generation creates a powerful ecosystem that can significantly enhance student learning outcomes.

---

**Document Version**: 1.0
**Created**: November 24, 2025
**Last Updated**: November 24, 2025
**Status**: Ready for Implementation
