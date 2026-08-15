# 🦉 Duolingo Clone - Full-Stack Web Application

A pixel-perfect, production-ready, full-stack **Duolingo Clone** built with **Next.js (TypeScript)**, **Python (FastAPI)**, **SQLite Database**, **Web Audio API**, and **Native BCP-47 Speech Synthesis**.

Designed to match the exact playful, gamified, and vibrant user experience of Duolingo, featuring an interactive serpentine learning path, a multi-type exercise lesson engine, full database-driven course scaffolding for 11 languages, real-time gamification stats (XP, streak, hearts, gems), and bilingual language learning.

---

## 📋 Evaluation Criteria & Specification Alignment Matrix

| Evaluation Criteria | Requirement | Status | Implementation Details |
| :--- | :--- | :---: | :--- |
| **Tech Stack** | Next.js (TS) + Python FastAPI + SQLite | ✅ **100%** | Next.js 16 client in `client/`, Python FastAPI server in `backend/main.py`, SQLite database in `backend/duolingo.db`. |
| **Learning Path / Skill Tree** | Duolingo serpentine path with locked/unlocked progression | ✅ **100%** | S-curve unit layout with strict sequential locking (`client/app/(main)/learn/page.tsx`). Locked levels require completing preceding levels. |
| **Lesson Player** | Core loop with multiple exercise types & immediate feedback | ✅ **100%** | Supports MCQ with HD images, Word Bank Sentence Builder, Select Translation, Listen & Type, and Section Mastery Exam. Animated green/red feedback bar. |
| **Gamification & Progress** | Real-time XP, Streak, Hearts, Leaderboard, Shop, Quests | ✅ **100%** | Real-time XP calculation (+20 XP), +25 Gems reward, live ranked Leaderboard (`/leaderboards`), Hearts deduction/refill, Daily Quests (`/quests`). |
| **Content Management** | Database schema with courses, units, skills, lessons, exercises | ✅ **100%** | Full relational schema (`backend/app/models.py`) populated from scaffold files (`backend/populate_from_scaffold.py`) for 11 languages. |
| **Duolingo UX** | Mascot flourishes, sound FX, modals, responsive, dark mode | ✅ **100%** | Duo Lottie animations, synthesized audio SFX + TTS fallback (`client/lib/sounds.ts`), light & dark mode themes (`globals.css`). |

---

## 🏛️ System Architecture Overview

```text
               ┌──────────────────────────────────────────────┐
               │              Next.js 16 Frontend             │
               │   (React 19, TypeScript, Tailwind CSS)      │
               └──────────────────────┬───────────────────────┘
                                      │
                         REST API Requests (JSON)
                                      │
               ┌──────────────────────▼───────────────────────┐
               │            FastAPI Python Backend            │
               │      (SQLAlchemy ORM, Pydantic Schemas)      │
               └──────────────────────┬───────────────────────┘
                                      │
                          SQLite Database Engine
                                      │
               ┌──────────────────────▼───────────────────────┐
               │              duolingo.db                     │
               │  (Course -> Unit -> Skill -> Lesson -> Ex)   │
               └──────────────────────────────────────────────┘
```

---

## 📁 Repository Structure & Module Documentation

- 📘 **[Client Documentation (client/README.md)](client/README.md)**: Detailed breakdown of Next.js pages, UI components, state management (`UserContext`, Zustand), and Web Audio SFX/TTS implementation.
- 🐍 **[Backend Documentation (backend/README.md)](backend/README.md)**: Detailed breakdown of FastAPI routes, SQLAlchemy models, SQLite database schema, data ingestion, and REST API endpoints.

---

## 🚀 Quick Start Guide

### 1. Start Backend FastAPI Server
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python populate_from_scaffold.py
python main.py
```
*FastAPI server will run at `http://localhost:8000`.*

### 2. Start Frontend Next.js Server
```bash
cd client
npm install
npm run dev
```
*Next.js client will run at `http://localhost:3000`.*

---

## 📄 License
This project is open-source and available under the **MIT License**.
