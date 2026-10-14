# JobFit — AI-Powered CV Tailoring

JobFit helps job seekers tailor their CV to specific job descriptions and maximize their chances of getting interviews.

![JobFit Dashboard](https://img.shields.io/badge/Status-Active-green) ![Python](https://img.shields.io/badge/Python-3.10-blue) ![React](https://img.shields.io/badge/React-18-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-latest-green)

---

## What it does

Upload your CV once — then for every job you apply to, JobFit tells you exactly how well you match, what's missing, and rewrites your CV to fit that specific job.

- **CV Analysis** — match score, ATS score, missing keywords, strengths and skill gaps
- **CV Tailoring** — AI rewrites your bullet points to match the job description
- **Cover Letter Generator** — personalized cover letters with adjustable tone
- **Interview Prep** — likely questions with suggested answers based on your actual CV
- **Job Tracker** — track applications through saved → applied → interview → offer → rejected
- **CV Version Manager** — manage multiple CV versions and track which performs best

---

## Tech Stack

**Frontend**
- React 18 + TypeScript + Vite
- Tailwind CSS v4
- React Query — server state management
- Zustand — client state management
- React Hook Form — form handling
- React Router v6

**Backend**
- FastAPI + Python 3.10
- PostgreSQL — primary database
- ChromaDB — vector database for semantic search
- SQLAlchemy + Alembic — ORM and migrations
- Groq (openai/gpt-oss-120b) — LLM for analysis
- PyMuPDF — PDF text extraction
- JWT authentication

**Architecture**
- RAG (Retrieval Augmented Generation) — CV indexed in ChromaDB for semantic search
- Soft delete — CV data preserved with deleted_at timestamps
- Self-healing vector index — auto re-indexes from PostgreSQL if ChromaDB is empty

---

## Running locally

### Prerequisites

- Python 3.10
- Node.js 18+
- PostgreSQL
- Groq API key (free at console.groq.com)

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create databases
createdb jobfit
createdb jobfit_test

# Set up environment variables
cp .env.example .env
# Fill in: DATABASE_URL, SECRET_KEY, GROQ_API_KEY

# Run migrations
alembic upgrade head

# Start server
make run
# → http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## Project Structure

```
jobfit/
├── backend/
│   ├── app/
│   │   ├── models/       # SQLAlchemy models
│   │   ├── routes/       # FastAPI route handlers
│   │   ├── schemas/      # Pydantic request/response schemas
│   │   ├── services/     # Business logic (AI, RAG, PDF)
│   │   └── middleware/   # JWT authentication
│   ├── alembic/          # Database migrations
│   └── uploads/          # PDF storage (local dev)
└── frontend/
    └── src/
        ├── api/          # Typed API layer
        ├── components/   # Reusable UI components
        ├── hooks/        # Custom React hooks
        ├── layouts/      # Page layout wrappers
        ├── pages/        # Route-level components
        ├── stores/       # Zustand state stores
        └── types/        # TypeScript interfaces
```

---

## Environment Variables

```bash
# Backend (.env)
DATABASE_URL=postgresql://localhost:5432/jobfit
SECRET_KEY=your_secret_key        # openssl rand -hex 32
GROQ_API_KEY=your_groq_api_key
ALLOWED_ORIGINS=http://localhost:5173
```

---

## API Documentation

FastAPI auto-generates interactive API docs at `http://localhost:3001/docs`

---

## Planned improvements

- [ ] Cloudflare R2 for PDF storage in production
- [ ] Pinecone for vector storage in production
- [ ] Audit log — track all AI actions per user
- [ ] CV restore — recover soft-deleted CVs
- [ ] Job URL scraping — auto-extract job descriptions from URLs
- [ ] Email notifications for application deadlines

---

## Author

Built by [Mona](https://github.com/Mona95) as part of an AI engineering portfolio.

## Live Demo
[https://jobfit-blue.vercel.app/dashboard](https://jobfit-blue.vercel.app/dashboard)
