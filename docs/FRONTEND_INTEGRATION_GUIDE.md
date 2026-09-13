# Frontend & Mobile Integration Guide (React Native / Web)

This guide provides the complete blueprint, screen specifications, UX flows, and client-side architecture for building the **React Native** (or React/Next.js Web) client that consumes this backend.

---

## 1. Client Architecture & Recommended Tech Stack

- **Mobile Framework**: React Native (Expo SDK 51+ or Bare Workflow)
- **Web Framework**: React (Vite) or Next.js
- **Server State & Caching**: **TanStack Query (React Query v5)** (Crucial for offline caching, background re-fetching, and optimistic updates)
- **Client State**: **Zustand** (Auth tokens, active technology filters, theme)
- **Navigation**: React Navigation (Bottom Tabs + Native Stack)
- **Styling**: Tailwind CSS (NativeWind for React Native / Tailwind for Web)
- **Icons**: Lucide Icons or Expo Vector Icons
- **Syntax Highlighting**: `react-native-syntax-highlighter` / `prismjs`

---

## 2. Screen Breakdown & UI Specifications

```
Main App Flow:
├── (Auth Stack)
│   ├── LoginScreen
│   ├── RegisterScreen
│   └── OnboardingPreferencesScreen
└── (Main Bottom Tabs)
    ├── Tab 1: DashboardScreen (Overview, Mastery Rings, Weak Topics)
    ├── Tab 2: BrowseScreen (Technologies, Topics, Question Explorer)
    ├── Tab 3: RevisionHubScreen (Quick Revision, "Interview Tomorrow", Weak List)
    ├── Tab 4: SavedScreen (Bookmarked questions)
    └── Tab 5: ProfileScreen (Stats, Level selector, Admin panel if role=admin)
```

---

### Screen 1: Dashboard (`DashboardScreen`)
**Backend API**: `GET /api/dashboard`
- **Header**: User welcome, current preparation level badge (e.g. `Intermediate`).
- **Hero Card**: Overall readiness score circular progress (e.g. `45% Completed`).
- **Action Buttons**:
  - ⚡ **"Quick Revision"** (Triggers 10-question smart workout).
  - 🚨 **"Interview Tomorrow"** (Select target technologies and launch 30-min sprint).
  - ⚠️ **"Review Weak Areas"** (Direct link to weak questions).
- **Technology Mastery List**:
  - Horizontal cards or vertical bars for each technology (React, Node.js, MongoDB, Docker, etc.).
  - Shows total questions vs known/weak counts with a completion percentage bar.
- **Weak Topics Spotlight**:
  - Lists top topics where user struggled (e.g. *"React - Hooks (3 weak)"*, *"JavaScript - Event Loop (2 weak)"*).
- **Recent Revision Activity**:
  - Last 5 practiced questions with status badges and relative time (e.g. *"2 hours ago"*).

---

### Screen 2: Question Browse & Filtering (`BrowseScreen`)
**Backend API**: `GET /api/questions`, `GET /api/technologies`, `GET /api/topics`
- **Filter Row**: Horizontal scrollable chips for Technologies (`All`, `React`, `Node.js`, `MongoDB`, `Docker`...)
- **Level Selector**: Dropdown or chips (`Foundation`, `Junior`, `Intermediate`, `Advanced`, `Expert`).
- **Question Card Item**:
  - Title/Question text.
  - Badges: Difficulty (`Easy` green, `Medium` yellow, `Hard` red), Question Type (`Comparison`, `Architecture`, `Conceptual`).
  - Star / Bookmark toggle icon (hits `POST /api/questions/:id/save`).
  - User Status Pill: Displays `Weak` (Red), `Review` (Yellow), or `Known` (Green) if practiced.
- **Pull-to-Refresh & Infinite Scroll Pagination**: Powered by React Query's `useInfiniteQuery`.

---

### Screen 3: Question Detail & Study Screen (`QuestionDetailScreen`)
**Backend API**: `GET /api/questions/:id`, `POST /api/progress/:id`
The core learning interface of the application. Renders structured, dynamic technical interview content with speech and interactive dropdowns:

1. **Header Area**:
   - Technology & Topic breadcrumb (`React • Hooks`) with `< Back` button.
   - Question number badge (`Question 01`) and badges: Level (`[Junior]`, `[Intermediate]`, `[Advanced]`) & Difficulty (`[Easy]`, `[Medium]`, `[Hard]`).
   - Bookmark button (top right) with instant toggle via `useProgress`.
2. **Prominent Question Card & Speaker**:
   - Clear, elevated question card serving as the primary visual anchor.
   - Primary `🔊 Listen` / `⏹ Stop` button reading Question + Concise Answer. Accessible labels (`"Listen to answer"`, `"Stop reading"`).
   - Audio cleanly terminates when navigating away or unmounting.
3. **Immediately Visible Answer**:
   - Concise summary answer card directly below the question (never hidden behind clicks or tabs).
4. **Adaptive Collapsible Dropdowns (Independently Expandable)**:
   - Evaluates data dynamically: empty sections are strictly omitted.
   - 📖 **▼ Explanation**: Formatted multi-paragraph technical breakdown.
   - 📑 **▼ Examples**: Sequenced real-world examples (`Example 1`, `Example 2`, ...).
   - 💻 **▼ Code Example**: Monospaced code box with `<ScrollView horizontal>` to prevent layout breaking, language pill, and native `Copy` / `Copied` button (`expo-clipboard`).
   - ✅ **▼ Important Points**: Bullet list of essential takeaways (`• Causes re-render`).
   - ✨ **▼ Analogy**: Warm amber callout box explaining the concept with a real-world parallel.
   - 📊 **▼ Comparison**: Mobile-friendly stacked comparison cards with horizontal scroll support.
   - 🗣 **▼ How to Answer in an Interview**: Distinct emerald styling with candidate-ready phrasing and a **dedicated `🔊 Listen` button** so users can hear how the conversational answer sounds.
   - 💡 **▼ Interview Tips**: Pro interview tips with `•` bullet markers.
   - ⚠️ **▼ Common Mistakes**: Pitfall warnings highlighted with `⚠️` markers.
   - 🔄 **▼ Follow-up Questions**: Sequenced follow-up questions clickable to instantly launch a global search for deep-dive exploration.
5. **Sticky Bottom Session Navigation & Progress Bar**:
   ```
   ┌────────────────────────────────────────────────────────┐
   │ Question 3 of 20    [━━━●━━━━━━━━━━━━━━━━━━━━━━━━]     │
   │ [ < Previous ]                             [ Next > ]  │
   └────────────────────────────────────────────────────────┘
   ```
   - **`[ < Previous ]`**: Seamlessly moves to the previous question in the active session queue.
   - **Progress Indicator**: `Question X of Y` with subtle progress track.
   - **`[ Next > ]`**: Advances to the next question in the active session queue without re-fetching.
   - Completing the set triggers a celebratory completion dialog (`"Done with this set 🎉"`).

---

### Screen 4: Revision Hub & Workout Modes (`RevisionHubScreen`)

#### Mode A: "Quick Revision" (10 Questions Daily Workout)
- **API**: `GET /api/revision/quick?technology=react&limit=10`
- Presents a card-stack or swipeable carousel of 10 deterministically balanced questions (40% weak, 30% review, 20% high-yield, 10% unpracticed).
- After finishing all 10 cards, shows a completion summary screen (*"Workout Complete! 6 Known, 2 Weak, 2 Review"*).

#### Mode B: "Interview Tomorrow" Rapid Revision Sprint
- **API**: `GET /api/revision/interview-prep?technologies=react,nodejs,mongodb&limit=20`
- Multi-select modal allowing user to check which technologies they are being interviewed on tomorrow.
- Launches a timer-assisted rapid review prioritizing their weakest questions first.

---

### Screen 5: Admin Management & Bulk Question Import (`AdminImportScreen`)
**Backend API**: `POST /api/admin/questions/import`, `POST /api/admin/questions/import/preview`
- For admins only (`user.role === 'admin'`).
- Allows pasting JSON directly or uploading `.json` files.
- **Dry-Run Preview Flow**:
  - Tapping **"Preview Import"** triggers `POST /api/admin/questions/import/preview`.
  - Shows simulated statistics: Total, Valid, Duplicates, Malformed Errors, New Technologies to be created, and New Topics to be created.
  - Review table displaying questions with color-coded tags (Valid in green, Duplicate in yellow, Error in red).
  - Tapping **"Confirm & Ingest"** sends the batch to `POST /api/admin/questions/import`.

---

### Screen 6: Admin Content Review & Drafts (`AdminReviewScreen`)
**Backend API**: `GET /api/admin/questions?status=draft`, `PATCH /api/admin/questions/:id/publish`
- Dedicated moderation queue for reviewing draft or AI-assisted questions.
- Filters by `source` (`personal-notes`, `ai-generated`, `web-research`) and `technology`.
- One-tap action: **"Approve & Publish"** or **"Edit & Refine"**.

---

### Screen 7: Content Statistics & Gap Visualizer (`AdminGapsScreen`)
**Backend API**: `GET /api/admin/content/stats`, `GET /api/admin/content/gaps`
- **Stats Card Grid**: Total Questions, Published, Draft, and Archived counts.
- **Coverage Matrix**: Visual heatmap table showing Technologies on the Y-axis and Preparation Levels (Foundation to Expert) on the X-axis.
- **"Gaps Spotlight" Alert**: Highlights topics having 0 or low question counts (e.g. *"React > Hooks > Advanced: 0 questions"*).

---

## 3. Client-Side TypeScript Data Contracts

Create `src/types/api.ts` in your frontend project:

```typescript
export interface Technology {
  _id: string;
  name: string;
  slug: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'other';
  icon?: string;
  order: number;
}

export interface Topic {
  _id: string;
  technologyId: string | Technology;
  name: string;
  slug: string;
  description?: string;
}

export interface PreparationLevel {
  _id: string;
  name: string;
  slug: string;
  order: number;
}

export interface CodeExample {
  language: string;
  title?: string;
  code: string;
  explanation?: string;
}

export interface StepItem {
  stepNumber?: number;
  title: string;
  description?: string;
}

export interface UserProgressState {
  status: 'known' | 'review' | 'weak' | null;
  isSaved: boolean;
  reviewCount: number;
  lastReviewedAt: string | null;
}

export interface Question {
  _id: string;
  question: string;
  title?: string;
  technologyId: Technology;
  topicId: Topic;
  preparationLevels: PreparationLevel[];
  difficulty: 'easy' | 'medium' | 'hard';
  questionType: string;
  answer: string;
  explanation?: string;
  analogy?: string;
  importantPoints: string[];
  codeExamples: CodeExample[];
  comparisons: Array<Record<string, any>>;
  examples: string[];
  steps: StepItem[];
  interviewAnswer?: string;
  interviewTips: string[];
  commonMistakes: string[];
  followUpQuestions: string[];
  tags: string[];
  isImportant: boolean;
  source: string;
  sourceReference?: string;
  status: 'draft' | 'published' | 'archived';
  userProgress?: UserProgressState;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  totalQuestions: number;
  completedQuestions: number;
  savedQuestions: number;
  weakQuestions: number;
  reviewQuestions: number;
  overallProgressPercentage: number;
  technologyProgress: Array<{
    technologyId: string;
    name: string;
    slug: string;
    category: string;
    totalQuestions: number;
    known: number;
    weak: number;
    review: number;
    completionPercentage: number;
  }>;
  weakTopics: Array<{
    topicId: string;
    topicName: string;
    topicSlug: string;
    technologyName: string;
    technologySlug: string;
    weakCount: number;
  }>;
  recentQuestions: Array<any>;
}

export interface ImportPreviewResult {
  total: number;
  valid: number;
  duplicates: number;
  errors: number;
  newTechnologies: string[];
  newTopics: string[];
  errorDetails: Array<{
    index: number;
    field: string;
    message: string;
    question?: string;
  }>;
  questions: Array<{
    index: number;
    technology: string;
    topic: string;
    question: string;
    difficulty: string;
    questionType: string;
    isImportant: boolean;
    status: string;
    source: string;
    hasCodeExamples: boolean;
    hasComparisons: boolean;
    hasSteps: boolean;
  }>;
}

export interface ContentStats {
  totalQuestions: number;
  published: number;
  draft: number;
  archived: number;
  byTechnology: Array<{
    technologyId: string;
    name: string;
    slug: string;
    category: string;
    total: number;
    published: number;
    draft: number;
    archived: number;
  }>;
  byPreparationLevel: Array<{
    levelId: string;
    name: string;
    slug: string;
    order: number;
    count: number;
  }>;
  byDifficulty: Array<{ difficulty: string; count: number }>;
  bySource: Array<{ source: string; count: number }>;
  byQuestionType: Array<{ questionType: string; count: number }>;
}

export interface ContentGaps {
  totalTechnologies: number;
  totalTopics: number;
  preparationLevels: string[];
  technologies: Array<{
    technologyId: string;
    technology: string;
    slug: string;
    category: string;
    topicsCount: number;
    topics: Array<{
      topicId: string;
      topic: string;
      slug: string;
      totalQuestions: number;
      byLevel: Record<string, number>;
      gaps: string[];
    }>;
  }>;
}
```

---

## 4. API Client Setup with Axios & Token Interceptor

Create `src/api/client.ts` in your frontend project:

```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // or localStorage for Web

const API_BASE_URL = 'http://localhost:5000/api'; // Replace with server IP or production URL

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach JWT token automatically
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response unwrapper
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);
```

---

## 5. Optimistic Progress Updates (React Query Example)

When the user taps **"Weak"**, **"Review"**, or **"Mastered"**, update the UI instantly before the network request completes:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export const useUpdateProgress = (questionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: 'known' | 'review' | 'weak') => {
      return apiClient.post(`/progress/${questionId}`, { status });
    },
    onMutate: async (newStatus) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['question', questionId] });

      // Snapshot previous value
      const previousQuestion = queryClient.getQueryData(['question', questionId]);

      // Optimistically update
      queryClient.setQueryData(['question', questionId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          userProgress: {
            ...old.userProgress,
            status: newStatus,
            reviewCount: (old.userProgress?.reviewCount || 0) + 1,
            lastReviewedAt: new Date().toISOString(),
          },
        };
      });

      return { previousQuestion };
    },
    onError: (err, newStatus, context) => {
      // Rollback on error
      if (context?.previousQuestion) {
        queryClient.setQueryData(['question', questionId], context.previousQuestion);
      }
    },
    onSettled: () => {
      // Invalidate dashboard and questions lists to sync stats
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
};
```

---

## 6. Implemented Mobile Architecture & Developer Mode (Phase 1)

The mobile client implementation lives in `/mobile` and is configured with Expo SDK 57 (React Native 0.86 / React 19.2):

### 6.1 Directory Structure
```
mobile/
├── App.tsx                          # App root with SafeAreaProvider, AuthProvider, RootNavigator
├── src/
│   ├── api/                         # Centralized REST client & endpoint modules
│   │   ├── client.ts                # Base client (configurable URL, auto-auth, timeout)
│   │   ├── auth.api.ts
│   │   ├── technology.api.ts
│   │   ├── topic.api.ts
│   │   ├── question.api.ts
│   │   ├── progress.api.ts
│   │   ├── revision.api.ts
│   │   ├── dashboard.api.ts
│   │   └── search.api.ts
│   ├── components/common/           # Button, TextInput, Card, ScreenContainer, LoadingView, ErrorView, EmptyView
│   ├── constants/                   # config.ts, theme.ts
│   ├── hooks/                       # useAuth.ts
│   ├── navigation/                  # RootNavigator, AuthNavigator, AppNavigator
│   ├── screens/                     # Home, Technology, Saved, Question, RevisionWorkout, Search
│   ├── store/                       # Redux Toolkit store & slices
│   │   ├── index.ts                 # configureStore, RootState, AppDispatch
│   │   ├── hooks.ts                 # Typed useAppDispatch & useAppSelector
│   │   ├── auth/authSlice.ts        # Redux slice: user, token, status (guest mode default)
│   │   └── progress/progressSlice.ts# Redux slice: async thunks, local storage, bookmarks, status
│   ├── types/                       # Exact TypeScript models matching backend
│   └── utils/                       # storage.ts (SecureStore), error.ts (human-friendly parser)
```

### Guest Mode & State Management (Redux Toolkit)
- **Store Architecture**: Built with `@reduxjs/toolkit` and `react-redux` in [mobile/src/store/index.ts](file:///d:/1.%20programmins/2/mobile/src/store/index.ts).
- **`authSlice.ts`**: Supports genuine guest browsing by default, initializing with `user: null`, `token: null`, `isAuthenticated: false`, and `isGuest: true`. When user credentials are provided via Login/Register, it establishes an authenticated session.
- **`progressSlice.ts`**: Handles question status (`known`, `review`, `weak`), bookmarks, recently viewed questions, and revision queues with automatic `AsyncStorage` persistence and optimistic UI updates.

### 6.3 Self-Healing Network & Live Cloud Backend Integration
The mobile frontend seamlessly supports both live deployed cloud backends (e.g. Render) and multi-environment local development (physical phones over USB, Wi-Fi LAN, and emulators).

#### Live Cloud Backend URL
- **Production Render URL**: `https://interview-preparation-app-w3l5.onrender.com/api`
- Configured in [mobile/.env](file:///d:/1.%20programmins/2/mobile/.env) via `EXPO_PUBLIC_API_URL` and `VITE_API_URL`.

#### Candidate Priority List ([config.ts](file:///d:/1.%20programmins/2/mobile/src/constants/config.ts))
1. **`process.env.EXPO_PUBLIC_API_URL` / `VITE_API_URL`**: Explicit target defined in `mobile/.env` (default: `https://interview-preparation-app-w3l5.onrender.com/api`).
2. **Live Cloud Backend Default**: `https://interview-preparation-app-w3l5.onrender.com/api`.
3. **Metro Script Host (`NativeModules.SourceCode.scriptURL`)**: Automatically extracts the IP address where the active JavaScript bundle was downloaded from.
4. **Expo Host URI (`Constants.expoConfig?.hostUri`)**: Debugger host provided by Expo Go.
5. **Workstation LAN IP (`http://192.168.0.105:5000/api`)**: Direct Wi-Fi route to the development PC.
6. **Localhost (`http://localhost:5000/api`)**: Direct local socket used when USB port forwarding is active via `adb reverse tcp:5000 tcp:5000`.
7. **Android Emulator Alias (`http://10.0.2.2:5000/api`)**: Used strictly on emulators (physical hardware will never attempt this first).

#### Smart Health Probe & Cloud Resilience ([client.ts](file:///d:/1.%20programmins/2/mobile/src/api/client.ts))
- If configured with an `https://` remote URL (e.g. Render live cloud), `ApiClient.resolveWorkingBaseUrl()` verifies the cloud backend first with a generous 10-second timeout to smoothly accommodate free-tier cold starts / spin-ups.
- For local dev, candidate endpoints are pinged with 4-second timeout using `Promise.any()`.
- Request timeout is configured to 20 seconds (`CONFIG.REQUEST_TIMEOUT_MS`).
- If a request fails due to a network drop, `ApiClient` triggers candidate re-discovery and retries automatically.

#### USB Port Forwarding for Physical Devices
When developing with a physical Android device connected via USB cable:
```bash
adb reverse tcp:5000 tcp:5000   # Routes localhost:5000 to PC backend
adb reverse tcp:8081 tcp:8081   # Routes Metro bundler port
```

### 6.4 Running Commands from Project Root
A root `package.json` proxies scripts directly to the mobile or backend projects:
- `npm start` or `npm run mobile`: Starts Expo Metro bundler
- `npm run android`: Starts Android development runner with USB port reverse
- `npm run web`: Starts Web preview
- `npm run backend`: Starts the Node.js Express server in dev mode
- `npm run mobile:typecheck`: Runs strict TypeScript check across the mobile app

---

### 6.5 Dynamic Dark & Light Mode Theming System

The mobile application includes a complete, production-ready theming architecture with light, dark, and system-adaptive modes.

#### Core Components & Structure
- **Theme Tokens ([theme.ts](file:///d:/1.%20programmins/2/mobile/src/constants/theme.ts))**:
  - `LIGHT_COLORS`: Modern off-white canvas (`#F8F9FE`), clean white surfaces (`#FFFFFF`), dark slate text (`#0F172A`), and indigo primary accents (`#4F46E5`).
  - `DARK_COLORS`: Deep navy canvas (`#0B0F19`), elevated card surfaces (`#151D30`), bright slate text (`#F8FAFC`), muted slate secondary text (`#94A3B8`), and vibrant violet-indigo accents (`#6366F1`).
  - Shared semantic tokens: `card`, `surface`, `border`, `text`, `textSecondary`, `textTertiary`, `tabBarBg`, and `tabBarActiveBg`.
- **Global Theme Provider ([ThemeContext.tsx](file:///d:/1.%20programmins/2/mobile/src/context/ThemeContext.tsx))**:
  - Exposes `useTheme()` with `{ mode, isDark, theme, colors, setMode, toggleTheme }`.
  - Supports three user modes: `'light'`, `'dark'`, and `'system'`.
  - In `'system'` mode, listens to device OS appearance in real-time via React Native's `useColorScheme()`.
  - Persists preference locally using `@react-native-async-storage/async-storage` under key `@app_theme_mode`.
- **Dedicated Settings Screen ([SettingsScreen.tsx](file:///d:/1.%20programmins/2/mobile/src/screens/settings/SettingsScreen.tsx))**:
  - Visual selection cards for Light, Dark, and System Default appearance.
  - Interactive Cache Clearing tool and real-time Question Bank diagnostics.
  - Accessible via the top-right settings gear icon across all screens.
- **Dynamic Navigation Integration ([RootNavigator.tsx](file:///d:/1.%20programmins/2/mobile/src/navigation/RootNavigator.tsx) & [MainTabNavigator.tsx](file:///d:/1.%20programmins/2/mobile/src/navigation/MainTabNavigator.tsx))**:
  - Dynamic `customNavTheme` applied to React Navigation `NavigationContainer`.
  - Dynamic Expo `<StatusBar style={isDark ? 'light' : 'dark'} />`.
  - Dynamic tab bar styling with active pill highlighting.

---

### 6.6 Interview Exam Mode (Feature 1 Architecture)

The mobile client includes a dedicated, full-featured **Interview Exam Mode** designed for technical interview preparation with customizable **Mode** and **Difficulty** selection.

#### Screen Flow & Navigation
```
HomeScreen (Interview Exam Mode Banner)
  └── ExamListScreen (Available Tests & Subject Cards)
        └── 2-Step Setup Modal (Step 1: Practice/Exam Mode ➔ Step 2: Difficulty Selection)
              └── ExamScreen (Active 25-Question Test)
                    └── ExamResultScreen (Score Breakdown, Category, Retake)
                          └── ExamReviewScreen (Filter by Correct / Incorrect)
```

#### Dual Mode Architecture:
- 🧠 **Practice Mode**: Tailored for guided learning. Selecting an option instantly displays Green/Red correctness styling, locks the question, renders the authoritative technical explanation card (`💡 Explanation`), and auto-scrolls down.
- 📝 **Exam Mode**: Simulates authentic interview conditions. Options use neutral radio buttons (`○`/`●`), candidates can change their answers freely before submission, and correctness and explanations remain concealed until submitted (with server-side anti-cheat enforcement).

#### Difficulty Selection (Task 24):
- 🟢 **Easy**: "Build your fundamentals"
- 🟡 **Medium**: "Interview-ready practice"
- 🔴 **Hard**: "Challenge yourself"
- 🎯 **Mixed** (Default): "Realistic interview mix" (~8 Easy, 9 Medium, 8 Hard)

#### Screens Implemented:
1. **`ExamListScreen.tsx`**:
   - **All-Subjects Test Card**: Vibrant gradient card launching the full-stack simulation test across all 10 technologies.
   - **Subject Test List**: Individual cards for each technology (React, Node.js, Express.js, MongoDB, JavaScript, TypeScript, HTML, CSS, SQL, Git).
   - **2-Step Setup Modal**: Clean modal guiding candidates through Step 1 (Mode) and Step 2 (Difficulty) before launch.
2. **`ExamScreen.tsx`**:
   - **Top Header**: Close `✕` prompt (with confirmation modal so in-progress tests are not lost accidentally), exam title, Mode badge (e.g. `📝 Exam`), Difficulty badge (e.g. `🔴 Hard`), question index counter (`Q 1/25`), and `Submit` button.
   - **Progress Bar**: Vibrant accent indicator reflecting progress through the 25 questions.
   - **Question Card**: Technology badge, difficulty level pill, and code-styled question statement.
   - **Mode-Specific Interaction**:
     - *Practice Mode*: Instant green/red highlights, checkmark/cross icons, answer locking, and authoritative explanation card.
     - *Exam Mode*: Neutral radio buttons (`○`/`●`), answer switching supported, zero feedback/explanations exposed.
   - **Bottom Controls**: `< Previous` and `Next >` navigation buttons.
   - **Exit Confirmation**: Hardware back and header 'X' triggers an alert to prevent losing answers.
   - **Submit Confirmation**: Modal displays answered count ("You have answered X of 25 questions.") and warns if unanswered questions remain.
3. **`ExamResultScreen.tsx`**:
   - **Mode & Difficulty Badges**: Displays contextual tags (e.g. `📝 Exam Mode` / `🧠 Practice Mode`, `🔴 Hard` / `🎯 Mixed Difficulty`).
   - **Score Celebration Hero**: Circular progress percentage and performance category (`Excellent` ≥ 80%, `Good` ≥ 60%, `Needs Practice` ≥ 40%, `Needs Revision` < 40%).
   - **Performance Summary Grid**: 4-card metric grid displaying **Correct** (green), **Incorrect** (red), **Unanswered** (slate/amber), and overall **Accuracy %** (primary brand color).
   - **Difficulty Performance Breakdown**: Visual progress bars and metrics for Easy, Medium, and Hard tiers, displaying questions correct out of total and percentage score per tier.
   - **Subject Performance Card**: Technology-by-technology breakdown showing score badge (e.g. `3/3`) and tinted percentage bar for each subject tested.
   - **🎯 Focus Next (Weak Topics Card)**:
     - Prominently highlights up to 3 topics where the candidate struggled most.
     - Each item displays the topic name, parent technology pill, accuracy percentage badge, and mistake count (e.g., `2 incorrect`).
   - **Recommended Action Card**:
     - Dynamic recommendations box tailored to test results.
     - When mistakes are present, displays recommendation message and a primary `[ Review Weak Areas ]` CTA button that navigates directly to `ExamReviewScreen` with `{ filter: 'incorrect' }`.
     - On a 100% perfect attempt, displays celebratory messaging and a `[ Take Another Test ]` CTA.
   - **Footer Action Buttons**:
     - **"Review Answers"**: Navigates to full review view (`filter: 'all'`).
     - **"Retake Test"**: Automatically relaunches a fresh 25-question test preserving the selected Mode and Difficulty.
     - **"Back to Exams"**: Returns to the subject selection menu.
4. **`ExamReviewScreen.tsx`**:
   - Header badge indicates active context: `[Difficulty] • [Mode]` (e.g., `"Hard • Exam Mode"`).
   - Route Parameter Support: Accepts `{ filter?: 'all' | 'incorrect' | 'correct' }`. When opened via `"Review Weak Areas"`, automatically pre-selects the **Incorrect** tab.
   - Filter chips: `All (25)`, `Incorrect (X)`, and `Correct (Y)`.
   - Comprehensive explanation cards displaying the question, the candidate's chosen answer, the correct answer, and detailed technical rationale.

#### State Management:
- Managed via Redux Toolkit (`mobile/src/store/slices/examSlice.ts`):
  - `startExam`: Initializes test session with randomized questions, mode (`'practice' | 'exam'`), and difficulty (`'easy' | 'medium' | 'hard' | 'mixed'`).
  - `selectOption`: Updates candidate's answer for a given question.
  - `nextQuestion` / `prevQuestion`: Handles question index changes.
  - `setExamResult`: Stores calculated score, metadata, review items, and performance `analysis` breakdown.
  - `resetExamSession`: Cleans up state when exiting or restarting.

---

### 11. Daily Interview Challenge System (Task 26)

**Backend APIs**:
- `GET /api/questions/daily-challenge`: Retrieves balanced questions for today's daily task (learning questions + test MCQs) according to user's configured counts and technologies without authentication.
- `GET /api/questions/daily-challenge/retry-test`: Fetches fresh test MCQs excluding previously tested question IDs (`excludeIds`).

**Core Learning Loop**:
`Learn → Practice → Test → Fail → Review Mistakes → Retry → Pass → Complete Day → Streak`

#### Screens & Modals Implemented:
1. **`DailyChallengeScreen.tsx`**:
   - **Header**: Back arrow, Day X pill, Today's local date (`Today, Sep 12`), Streak pill (`🔥 X`), and Settings cog button.
   - **Active Focus Bar**: Shows technology pills included in today's challenge.
   - **Multi-Phase Tabs**:
     - `📚 Learn (X/Y)`: Interactive question cards with syntax highlighting, revealable authoritative answers, key interview points, technical deep dives, and native TTS audio synthesis (`expo-speech`). Advances to next question and automatically tracks learned status.
     - `🧠 Practice (X/Y)`: Deliberate practice with immediate green/red feedback upon option selection and instant technical explanation display.
     - `📝 Daily Test (X MCQs)`: Neutral exam testing (no answers revealed during test), warning confirmation modal for unanswered items, and server-authoritative scoring.
     - `❌/🎉 Results & Review`: Comprehensive score metrics (Score, Accuracy %, Attempts count, Best Score %). For failed tests, provides mistake breakdown (User Answer vs Correct Answer + Explanation) and unlimited `[ Retry Test (Fresh Questions) ]` CTA. For passed tests, displays celebration banner, streak badge, and review controls.
2. **`DailyChallengeSettingsModal.tsx`**:
   - Configures Daily Learning Questions (10, 20 [Default], 30), Daily Test MCQs (10 [Default], 20, 30), Passing Score (70%, 80% [Default]), and multi-select technologies.
   - Preserves active daily challenge: Changes automatically take effect starting from the next daily challenge.
3. **`DailyHistoryModal.tsx`**:
   - Modal displaying Current Streak, Longest Streak, Total Completed Days, and scrollable day-by-day logs with score and technology tags.
4. **Home Dashboard Integration (`HomeScreen.tsx`)**:
   - Prominent card showing `🔥 DAY X CHALLENGE`, `🔥 X Day Streak`, progress bar, and dynamic CTA (`Start Challenge`, `Continue Challenge`, or `Review Today's Challenge ✔`).
5. **Settings Screen Integration (`SettingsScreen.tsx`)**:
   - Routine configuration row linking directly to `DailyChallengeSettingsModal`.

#### Local Storage & Redux Architecture:
- Local storage managed via versioned AsyncStorage keys (`@daily_challenge_settings_v1`, `@daily_challenge_state_v1`, `@daily_challenge_streak_v1`, `@daily_challenge_history_v1`).
- Redux slice (`mobile/src/store/slices/dailyChallengeSlice.ts`):
  - `initDailyChallenge`: Loads settings, streak, history, and today's state, generating a new daily challenge if a new calendar day has started.
  - `saveDailyChallengeSettings`: Persists configuration for tomorrow's challenge.
  - `submitDailyTest`: Evaluates test submission, updates attempt count, records best score, extends streak if passed, and logs to local history.
  - `retryDailyTest`: Pulls a fresh set of unseen test MCQs and resets test answers for immediate retry.
  - `markQuestionLearned`: Tracks educational progress through today's learning set.
  - `setPracticeAnswer`: Stores practice responses locally.
