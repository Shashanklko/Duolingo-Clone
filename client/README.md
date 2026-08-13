# ⚛️ Frontend Architecture - Duolingo Clone Client

Pixel-perfect Next.js 16 (React 19, TypeScript) client replicating Duolingo's serpentine learning path, multi-exercise lesson player, Web Audio sound synthesis, and real-time gamification stats.

---

## 🛠️ Tech Stack & Key Libraries

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16 (App Router)** | React Framework with Server & Client Components |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Custom Duolingo color palette & dark mode system |
| **Lucide React** | Scalable UI icons |
| **Lottie React** | Duo the Owl animated mascot flourishes |
| **Zustand & Context API** | State management for user progress & course selection |

---

## 📁 Modular Component Architecture (`client/`)

The frontend follows a clean, domain-driven modular architecture:

```text
client/
├── app/
│   ├── (main)/
│   │   ├── learn/            # Serpentine S-Curve Path with Strict Level Locking
│   │   ├── leaderboards/     # Real-Time Ranked Leaderboard
│   │   ├── profile/          # Learner Profile & Stats
│   │   ├── quests/           # Real-Time Daily Quests & Claimable Gems
│   │   ├── settings/         # Site Language & Theme Switcher
│   │   └── shop/             # Heart Refills & Power-Up Store
│   ├── (marketing)/
│   │   ├── courses/all/      # All Courses & Add Unlisted Course Modal
│   ├── lesson/[id]/          # Interactive 5-Question Lesson Engine
│   └── globals.css           # CSS Variable Tokens & Dark Mode Setup
├── components/
│   ├── 🌐 shared/            # Shared components used across all pages
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── HeaderStats.tsx
│   │   ├── CourseDropdown.tsx
│   │   ├── MobileNav.tsx
│   │   ├── I18nProvider.tsx
│   │   └── AnimatedLottie.tsx
│   ├── 🏠 home/              # Homepage & Landing page components
│   │   ├── HeroSection.tsx
│   │   ├── FeatureSection.tsx
│   │   ├── LanguageRibbon.tsx
│   │   ├── SuperDuolingoSection.tsx
│   │   ├── BottomCtaSection.tsx
│   │   ├── EnglishTestSection.tsx
│   │   └── LearnAnytimeSection.tsx
│   ├── 📊 dashboard/         # Learning Path & Main Dashboard components
│   │   ├── UnitHeader.tsx
│   │   ├── SkillNode.tsx
│   │   └── RightSidebar.tsx
│   ├── 🎮 lesson/            # Lesson Player components
│   │   ├── LessonHeader.tsx
│   │   ├── LessonFooter.tsx
│   │   └── Exercise.tsx
│   └── 🪟 modals/            # Modal Dialogs
│       ├── AuthModal.tsx
│       ├── GuidebookModal.tsx
│       └── OutOfHeartsModal.tsx
├── contexts/
│   └── UserContext.tsx       # Real-Time User Progress State & LocalStorage Persistence
└── lib/
    ├── sounds.ts             # Web Audio API Synthesized SFX & BCP-47 Speech Synthesis
    └── store.ts              # Zustand Course Picker & Unlisted Course Store
```

---

## 🌟 Key Frontend Systems

### 1. Serpentine Learning Path (`/learn`)
- Rendered using an S-curve position formula (`position <= 0 ? left : right`).
- Enforces **strict sequential level locking**: Future levels remain locked until previous levels are completed.
- Displays high z-index level badges (`Level 1 • Title`) on hover.

### 2. Interactive Lesson Player (`/lesson/[id]`)
- Supports 5 distinct exercise formats:
  - 🖼️ **Image Choice**: Select image cards matching target words.
  - 🧩 **Word Bank / Sentence Builder**: Tap tokens to assemble target sentences.
  - ❓ **Select Translation**: Choose correct text translation options.
  - 🔊 **Listen & Type**: Native TTS speech synthesis challenge.
  - 🏆 **Mastery Exam**: Section completion challenge.
- Features signature animated green/red feedback bar with celebratory audio SFX.

### 3. Audio & Speech Synthesis Engine (`client/lib/sounds.ts`)
- **Synthesized Web Audio API SFX**: Custom oscillators for correct chime, error buzz, button tap, and level finish fanfare.
- **Native BCP-47 Voice Lookup**: Automatically selects native voice actors for BCP-47 tags (`hi-IN`, `es-ES`, `ja-JP`, `ar-SA`, `fr-FR`, etc.) with Google Translate TTS audio fallback.

---

## 🚀 Running Frontend Client

```bash
# 1. Install dependencies
npm install

# 2. Start Next.js Development Server
npm run dev
```
*Frontend runs on `http://localhost:3000`.*
