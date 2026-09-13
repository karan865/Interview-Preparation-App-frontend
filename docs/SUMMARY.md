# Master System Overview & Functionality Map

## 📌 Executive Summary

The **Technical Interview Preparation Platform** is an enterprise-grade, general-purpose interview preparation platform and engineering knowledge base. Engineered for developers across all experience levels (Junior, Intermediate, Advanced), the platform offers a streamlined, distraction-free discovery flow:

$$\textbf{Select Technology} \longrightarrow \textbf{Explore Topics} \longrightarrow \textbf{Practice Questions} \longrightarrow \textbf{Read \& Listen to Solutions}$$

The platform features an original, curated question bank covering **10 core technologies, 100 topics, and 2,133 published high-yield interview questions** (including dedicated flagship banks for JavaScript [500], React [500], Node.js [500], and TypeScript [400], with 710 high-importance items and 0 archived leaks), enriched with structured comparison matrices, code snippets, candidate-friendly spoken answers, and native text-to-speech audio.

---

## 🧭 System Capability & Feature Matrix

| Feature Domain | Backend Functionality Implemented | Frontend / Mobile UI Contract |
|---|---|---|
| **Theming & Appearance** | Client-side reactive theme engine supporting light, dark, and system modes; persistent storage via AsyncStorage (`@app_theme_mode`). | Dynamic StatusBar (`light-content` / `dark-content`), NavigationContainer theming, and dedicated Settings Screen with visual mode switcher and cache manager. |
| **Main Browse Experience** | `GET /api/technologies` with live question counts; `GET /api/topics?technology=:slug`; `GET /api/questions?technology=:slug&topic=:slug`. | Technology Explorer with category filtering, numbered sequential topic cards, and interactive question lists. |
| **Interactive Question Detail** | Detailed question schema with `answer`, `interviewAnswer`, `explanation`, `codeExamples`, `comparisons`, `importantPoints`, `interviewTips`, and `followUpQuestions`. | Screen with prominent question, "Show Answer" reveal toggle, native TTS audio reading, syntax-highlighted code with copy button, and collapsible accordion sections. |
| **Search & Discovery** | `GET /api/search?q=...` full-text search across questions, titles, answers, and tags using weighted MongoDB text indexes with compound filtering. | Instant search bar on Home with recent search chips, search result cards showing level/difficulty badges, and empty-state guidance. |
| **Multi-Level Practice** | Query filtering by preparation levels (`junior`, `intermediate`, `advanced`) and difficulties (`easy`, `medium`, `hard`). | Level practice row on Home, Level filter pills on Questions list, and level badge indicators on all question cards. |
| **Audio Learning (TTS)** | Clean speech text synthesis combining question, concise answer, and conversational interview response. | Speaker button (`expo-speech`) next to questions and interview answers with start, stop, and speaking state animations. |
| **Revision & Progress** | Lightweight `UserQuestionProgress` tracking `known`, `review`, `weak`, and `isSaved` states, review counts, and last reviewed timestamps. | Swipe actions and one-tap action buttons (Mark Weak, Need Review, Mastered, Bookmark). |
| **"Weak Questions" Revision** | `GET /api/revision/weak` filters questions marked as weak by technology, topic, and level with pagination. | Dedicated "Fix My Weak Areas" revision queue. |
| **"Quick Revision" Engine** | `GET /api/revision/quick` returns a deterministic balanced blend: 40% Weak, 30% Review, 20% High-Yield Important, 10% Unpracticed. | "Daily 10-Question Quick Revision" workout mode. |
| **"Interview Tomorrow" Rapid Prep** | `GET /api/revision/interview-prep` prioritizes high-yield items: 1. Weak → 2. Review → 3. Important → 4. Unpracticed across selected technologies. | "30-Minute Rapid Interview Prep" sprint screen before interviews. |
| **Interview Exam Mode** | `GET /api/exams/subjects`, `GET /api/exams/subject/:slug`, `GET /api/exams/mern`, `POST /api/exams/attempts`, `GET /api/exams/attempts`. Curated 25-MCQ Subject Tests across all 10 platform technologies (250 MCQs total) and balanced Full Stack & All-Subjects simulation with dynamic cross-subject distribution, immediate in-test color validation, auto-scrolling explanations, randomized options, and accurate answer preservation. | Dedicated Exam List featuring Full Stack & All-Subjects simulation alongside 10 unlocked subject tests, Active 25-Question Test Screen with instant answer reveal and explanation auto-scroll, Result Celebration Screen, and Comprehensive Review Screen. |
| **Revision Dashboard** | `GET /api/dashboard` computes total questions, completion percentages, per-technology mastery breakdown, weak topics discovery, and recent history. | Visual analytics screen with progress rings, technology mastery bars, and "Recommended Focus" topics. |
| **Admin Content Management** | Full CRUD for Technologies, Topics, Preparation Levels, and Questions; instant Publish and Archive toggles; `GET /api/admin/questions?status=draft`. | Admin portal screens for adding/editing questions and reviewing unverified drafts. |
| **Bulk Question Import & Dry-Run Preview** | `POST /api/admin/questions/import` (resilient import with per-item error reporting) and `POST /api/admin/questions/import/preview` (zero-write dry-run validation with duplicate detection). | Admin JSON file upload / raw JSON paste modal with insertion preview and reports. |
| **Content Stats & Gap Detection** | `GET /api/admin/content/stats` (questions breakdown by status, level, tech, difficulty, source) and `GET /api/admin/content/gaps` (Technology -> Topic -> Level coverage matrix). | Admin analytics dashboard with balance graphs and underrepresented topic alerts. |

---

## 🏗 High-Level Architectural Flow

```
┌────────────────────────────────────────────────────────┐
│             Mobile App (React Native) / Web UI          │
│  - Browse Flow: Technologies -> Topics -> Questions    │
│  - TTS Audio Playback (expo-speech)                   │
│  - Code Highlighting & Native Clipboard Copy           │
│  - Search & Level-Based Discovery                     │
└────────────────────────────┬───────────────────────────┘
                             │
                             │ HTTPS / JSON (REST API)
                             ▼
┌────────────────────────────────────────────────────────┐
│                   Express.js Server                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Security: Helmet, CORS, Rate Limit & Body Parsers│  │
│  └─────────────────────────┬────────────────────────┘  │
│                            │                           │
│  ┌─────────────────────────▼────────────────────────┐  │
│  │ Middleware: JWT Auth, Role Guard, Zod Validator  │  │
│  └─────────────────────────┬────────────────────────┘  │
│                            │                           │
│  ┌─────────────────────────▼────────────────────────┐  │
│  │ Controllers & Business Services Layer            │  │
│  │ - Question & Search Service                      │  │
│  │ - Smart Revision Service (Weak, Quick, Prep)     │  │
│  │ - User Progress & Dashboard Analytics Service    │  │
│  │ - Bulk Import & Duplicate Detection Service      │  │
│  └─────────────────────────┬────────────────────────┘  │
│                            │ Mongoose ODM              │
│  ┌─────────────────────────▼────────────────────────┐  │
│  │ MongoDB Database (Dual-Mode: Local / Embedded)   │  │
│  │ Collections: Technologies, Topics, Levels,       │  │
│  │ Questions, Users, UserQuestionProgress          │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

---

## 📚 Documentation Index

1. **[Canonical Question Format (`CANONICAL_QUESTION_FORMAT.md`)](./CANONICAL_QUESTION_FORMAT.md)**: Full canonical JSON specification for platform questions, comparisons, implementation flows, and code examples.
2. **[Backend Architecture & Data Models (`BACKEND_ARCHITECTURE.md`)](./BACKEND_ARCHITECTURE.md)**: Deep dive into schema designs, indexes, business rules, revision algorithms, security, and error handling.
3. **[Complete API Reference (`API_DOCUMENTATION.md`)](./API_DOCUMENTATION.md)**: Detailed endpoints, request/response JSON payloads, status codes, query filters, and test examples.
4. **[Frontend & Mobile Integration Guide (`FRONTEND_INTEGRATION_GUIDE.md`)](./FRONTEND_INTEGRATION_GUIDE.md)**: React Native / Web client blueprint, recommended screens, state management patterns, and UI component specifications.
5. **[Recent Changes Log (`RECENT_CHANGES.md`)](./RECENT_CHANGES.md)**: Comprehensive changelog tracking feature developments, architectural shifts, and verified milestones across releases.

---

## 🧪 Automated Testing & Backend Stabilization Layer

The backend includes a comprehensive, isolated automated testing suite built with Jest, Supertest, and MongoMemoryServer:

- **Total Test Suites**: 14 suites
- **Total Tests**: 131 automated unit & integration tests (100% pass rate)
- **Database Strategy**: In-memory ephemeral `MongoMemoryServer` guaranteeing zero pollution of development or production databases.
- **Test Organization**:
  - `tests/setup/`: Isolated database lifecycles (`setupTestDB`, `clearTestDB`, `teardownTestDB`) and deterministic fixtures.
  - `tests/auth/`: Register, login, profile, user preferences, validation, and token verification.
  - `tests/technologies/`: Active status filtering, slug & ObjectId lookups, 404 responses.
  - `tests/topics/`: Active status filtering, technology filtering, slug & ObjectId lookups.
  - `tests/questions/`: Public vs draft/archived visibility, multi-field filtering, pagination, user progress enrichment.
  - `tests/progress/`: Bookmark/save idempotency, status transitions (known, review, weak), review count increments, user isolation.
  - `tests/revision/`: Quick Revision deterministic distribution (40% weak, 30% review, 20% important, 10% unpracticed) and Interview Prep priority sequencing.
  - `tests/dashboard/`: Exact calculation verification for completion percentages, technology progress, and weak topic identification.
  - `tests/search/`: Full-text MongoDB search across titles, questions, and tags with compound filtering.
  - `tests/admin/`: RBAC enforcement (401/403), draft review queues, question CRUD, publish/archive lifecycles.
  - `tests/import/`: Dry-run preview verification (zero DB writes), intra-batch & database duplicate detection, error localization.
  - `tests/admin/contentStats.test.ts`: Cross-dimensional content stats and gap detection.
  - `tests/security/`: JWT token expiration, invalid signatures, malformed ObjectIds, and password hash leakage prevention.

### Test Execution Commands
```bash
# Run all automated tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with code coverage report
npm run test:coverage
```

---

## 📱 Interview Prep Mobile Application

The mobile client is configured as **Interview Prep** in `/mobile`:

- **Framework**: Expo SDK 57 / React Native 0.86 / React 19.2 (TypeScript strict mode)
- **Audio & Clipboard**: `expo-speech` for natural text-to-speech audio and `expo-clipboard` for one-tap code copying.
- **State Management**: **Redux Toolkit (`@reduxjs/toolkit` & `react-redux`)** with centralized store (`store/index.ts`), `authSlice.ts`, `progressSlice.ts`, and typed hooks (`useAppDispatch`, `useAppSelector`).
- **Guest-First Mode**: Opens directly into the main browse experience without login barriers (`isGuest: true`).
- **Local Revision Progress**: Modular on-device persistence layer with `AsyncStorage` and Redux Toolkit managing:
  - `known`, `review`, and `weak` understanding markers with optimistic state updates
  - Saved/bookmarked questions
  - Recently viewed questions
  - Aggregated progress counters and revision history
- **Self-Healing Network Connectivity**: Evaluates candidate endpoints (explicit `EXPO_PUBLIC_API_URL`, Metro bundle host, workstation LAN IP, USB ADB reverse `5000:5000`, and emulator alias `10.0.2.2`).

---

## 📚 Question Bank & Content Validation Report

All platform interview questions are authored as original, curated interview preparation content structured in domain modules (`backend/src/seed/content/`):

```
==================================================
INTERVIEW PREPARATION CONTENT SUMMARY
==================================================
Technology   | Topics | Questions
-------------+--------+----------
JavaScript   |     10 |       500
TypeScript   |     10 |        35
React        |     10 |       500
HTML         |      9 |        25
CSS          |     10 |        25
Node.js      |     10 |        35
Express.js   |     10 |        30
MongoDB      |     10 |        35
SQL          |     10 |        35
Git          |     10 |        25
-------------+--------+----------
Total        |    100 |      1245
==================================================

Total Questions:                     1245
Total Published:                     1245
Total Draft / Archived:              0
Broken References:                   0
==================================================
```

---

## 🟨 Production Question Pack: Complete JavaScript 500 Question Bank (Task 10)

The JavaScript question bank is the flagship core language question set (`backend/src/seed/content/javascript/`), providing **exactly 500 original, curated interview questions** across all 10 JavaScript topics with a heavy emphasis on **Output Prediction, Code Tracing, and Logical Reasoning**:

| # | Topic | Slug | Question Count | Level Breakdown | Primary Content Focus |
|---|---|---|:---:|---|---|
| 1 | **Fundamentals** | `fundamentals` | **35** | 16 Junior, 15 Intermediate, 4 Advanced | Data types, primitives vs objects, equality `==` vs `===`, type coercion, BigInt, Symbol, NaN gotchas |
| 2 | **Variables & Scope** | `variables-scope` | **50** | 18 Junior, 22 Intermediate, 10 Advanced | `var` vs `let` vs `const`, Hoisting, TDZ, Lexical scope, Scope chain, Closures, Memory retention |
| 3 | **Functions** | `functions` | **50** | 17 Junior, 23 Intermediate, 10 Advanced | `this` binding rules, Arrow functions, `call/apply/bind`, Currying, Higher-order functions, IIFEs |
| 4 | **Objects & Arrays** | `objects-arrays` | **45** | 15 Junior, 20 Intermediate, 10 Advanced | Prototypes, Descriptors, Shallow/Deep copy, Array mutating vs ES2023 non-mutating (`toSorted`, `toReversed`, `with`) |
| 5 | **Async JavaScript** | `asynchronous-javascript` | **70** | 20 Junior, 32 Intermediate, 18 Advanced | Single thread, Web APIs, Callbacks, Timers, Debounce, Throttle, AbortController, Web Workers, Time-slicing |
| 6 | **Promises & Async/Await** | `promises-async-await` | **55** | 18 Junior, 25 Intermediate, 12 Advanced | States, Chaining, `Promise.all`, `allSettled`, `race`, `any`, `withResolvers`, async/await, `return await` |
| 7 | **Event Loop** | `event-loop` | **55** | 16 Junior, 24 Intermediate, 15 Advanced | Call Stack, Microtasks vs Macrotasks, `queueMicrotask`, `process.nextTick`, `requestAnimationFrame`, Starvation |
| 8 | **DOM & Browser** | `dom-browser` | **35** | 14 Junior, 15 Intermediate, 6 Advanced | Bubbling, Capturing, Delegation, `MutationObserver`, `IntersectionObserver`, `ResizeObserver` |
| 9 | **ES6+ Features** | `es6-features` | **45** | 15 Junior, 20 Intermediate, 10 Advanced | Destructuring, Rest/Spread, Nullish coalescing `??`, Optional chaining `?.`, Top-level await |
| 10 | **Advanced JavaScript** | `advanced-javascript` | **60** | 12 Junior, 26 Intermediate, 22 Advanced | Classes, Private `#`, Symbols, Generators, Proxies, V8 Hidden Classes/Shapes, Mark-and-Sweep GC |
| | **TOTAL** | | **500** | **161 Junior, 222 Intermediate, 117 Advanced** | **100% Verified, 0 Duplicates** |

---

## ⚛️ Production Question Pack: Complete React 500 Question Bank (Task 9)

The React question bank is now the complete production-grade flagship question set (`backend/src/seed/content/react/`), providing **exactly 500 original, curated interview questions** across all 10 React topics with a rich mix of conceptual, output prediction, implementation, troubleshooting, performance, architecture, and production engineering questions:

### 1. Topic & Level Distribution Matrix
| # | Topic Name | Topic Slug | Questions | Junior | Intermediate | Advanced | Difficulty (E / M / H) |
|---|:---|:---|:---:|:---:|:---:|:---:|:---:|
| 1 | **React Fundamentals** | `react-fundamentals` | 40 | 18 | 15 | 7 | 15 / 17 / 8 |
| 2 | **Components & JSX** | `components-jsx` | 55 | 19 | 22 | 14 | 18 / 23 / 14 |
| 3 | **Props & State** | `props-state` | 60 | 20 | 25 | 15 | 19 / 26 / 15 |
| 4 | **Hooks** | `hooks` | 80 | 24 | 32 | 24 | 22 / 34 / 24 |
| 5 | **Rendering** | `rendering` | 60 | 18 | 24 | 18 | 17 / 25 / 18 |
| 6 | **Performance** | `performance` | 60 | 16 | 26 | 18 | 15 / 27 / 18 |
| 7 | **Forms** | `forms` | 30 | 12 | 12 | 6 | 12 / 12 / 6 |
| 8 | **Context API** | `context-api` | 35 | 12 | 14 | 9 | 11 / 15 / 9 |
| 9 | **State Management** | `state-management` | 40 | 12 | 18 | 10 | 14 / 16 / 10 |
| 10 | **Advanced React** | `advanced-react` | 40 | 13 | 15 | 12 | 16 / 10 / 14 |
| **Total** | **All 10 React Topics** | | **500** | **164** | **203** | **133** | **159 / 205 / 136** |

### 2. Verified REST Filter Endpoints (Live on Port 5000)
- `GET /api/questions?technology=react` &rarr; `200 OK` (500 questions, `total: 500`)
- `GET /api/questions?technology=react&level=junior` &rarr; `200 OK` (164 questions, `total: 164`)
- `GET /api/questions?technology=react&level=intermediate` &rarr; `200 OK` (203 questions, `total: 203`)
- `GET /api/questions?technology=react&level=advanced` &rarr; `200 OK` (133 questions, `total: 133`)
- `GET /api/questions?technology=react&topic=hooks` &rarr; `200 OK` (80 questions, `total: 80`)
- `GET /api/questions?technology=react&topic=performance` &rarr; `200 OK` (60 questions, `total: 60`)
- `GET /api/questions/:id` &rarr; `200 OK` (Full detail payload with title, answer, explanation, codeExamples, comparisons, importantPoints, interviewAnswer, tags, and interviewer followUpQuestions).

---

## 🟨 Production Question Pack: JavaScript & TypeScript (Task 5A)

### 1. JavaScript Distribution (40 Questions across 10 Topics)
- **Junior:** 16 (40%) | **Intermediate:** 16 (40%) | **Advanced:** 8 (20%)
- **Topics Covered (4 each):** Fundamentals, Variables & Scope, Functions, Objects & Arrays, Asynchronous JavaScript, Promises & Async/Await, Event Loop, DOM & Browser, ES6+ Features, Advanced JavaScript.

### 2. TypeScript Distribution (35 Questions across 10 Topics)
- **Junior:** 14 (40%) | **Intermediate:** 14 (40%) | **Advanced:** 7 (20%)
- **Topics Covered:** TypeScript Basics (3), Types (4), Interfaces & Type Aliases (4), Functions (3), Generics (4), Utility Types (4), Narrowing & Type Guards (4), Classes (3), Modules (3), Advanced TypeScript (3).

---

## 🟩 Production Question Pack: Node.js & Express.js (Task 5B)

### 1. Node.js Distribution (35 Questions across 10 Topics)
- **Junior:** 14 (40%) | **Intermediate:** 14 (40%) | **Advanced:** 7 (20%)
- **Topics Covered:** Node.js Fundamentals (4), Modules (3), npm & Packages (3), File System (3), Event Loop (4), Streams (4), Buffers (3), HTTP (3), Error Handling (4), Performance (4).

### 2. Express.js Distribution (30 Questions across 10 Topics, 3 Each)
- **Junior:** 12 (40%) | **Intermediate:** 12 (40%) | **Advanced:** 6 (20%)
- **Topics Covered:** Express Fundamentals (3), Routing (3), Middleware (3), Request & Response (3), Error Handling (3), Authentication (3), Authorization (3), Validation (3), API Design (3), Security (3).

### 3. Verified Live Filter Endpoints
- `GET /api/questions?technology=nodejs` &rarr; `200 OK` (35 questions)
- `GET /api/questions?technology=nodejs&level=junior` &rarr; `200 OK` (14 questions)
- `GET /api/questions?technology=nodejs&level=intermediate` &rarr; `200 OK` (14 questions)
- `GET /api/questions?technology=nodejs&level=advanced` &rarr; `200 OK` (7 questions)
- `GET /api/questions?technology=expressjs` &rarr; `200 OK` (30 questions)
- `GET /api/questions?technology=expressjs&level=junior` &rarr; `200 OK` (12 questions)
- `GET /api/questions?technology=expressjs&level=intermediate` &rarr; `200 OK` (12 questions)
- `GET /api/questions?technology=expressjs&level=advanced` &rarr; `200 OK` (6 questions)

---

## 🍃 Production Question Pack: MongoDB & SQL (Task 5C)

### 1. MongoDB Distribution (35 Questions across 10 Topics)
- **Junior:** 14 (40%) | **Intermediate:** 14 (40%) | **Advanced:** 7 (20%)
- **Topics Covered (10):**
  - **MongoDB Fundamentals (4):** Document model vs relational, BSON architecture & types, WiredTiger storage engine & journaling, Write & Read Concerns (`w: "majority"`).
  - **Documents & Collections (3):** ObjectId internal composition, 16MB BSON limit & Bucket Pattern, Capped Collections vs TTL Indexes.
  - **CRUD (3):** updateOne vs replaceOne vs updateMany, atomic array operators (`$push`, `$addToSet`, `$pull`, `$`), bulkWrite ordered vs unordered execution.
  - **Query Operators (3):** Subdocument matching with `$elemMatch`, `$in` vs `$or` index utilization, Regex performance pitfalls vs text indexes.
  - **Indexes (4):** B-Tree indexes & ESR rule, Covered queries (`totalDocsExamined: 0`), Compound index sorting directions, Partial vs Sparse vs Multikey indexes.
  - **Aggregation (4):** `$lookup` join mechanics, array deconstruction with `$unwind`, 100MB RAM limit & `allowDiskUse`, Faceted search with `$facet`.
  - **Schema Design (4):** Embedding vs Referencing decision framework, 1:Few / 1:Many / 1:Squillions modeling, Subset Pattern, Schema Versioning Pattern.
  - **Relationships (3):** Mongoose `populate()` vs aggregation `$lookup`, Parent Referencing vs Child Referencing in trees, Cascading deletes & referential integrity.
  - **Transactions (3):** Multi-document ACID transactions with Client Sessions, Single-document atomicity vs multi-document transactions, Write conflicts & retry logic.
  - **Performance (4):** `explain("executionStats")` COLLSCAN vs IXSCAN diagnosis, Database profiler & slow query logging, Working Set sizing & WiredTiger RAM, Shard Key selection criteria.

### 2. SQL Distribution (35 Questions across 10 Topics)
- **Junior:** 14 (40%) | **Intermediate:** 14 (40%) | **Advanced:** 7 (20%)
- **Topics Covered (10):**
  - **SQL Fundamentals (3):** DDL vs DML vs DCL vs TCL, Primary vs Composite vs Surrogate keys, Three-Valued Logic & NULL handling.
  - **SELECT & Filtering (3):** Logical query execution order (FROM to LIMIT), WHERE vs HAVING, Leading wildcards & SARGability.
  - **Joins (4):** INNER vs LEFT vs RIGHT vs FULL OUTER joins, Cartesian explosions & prevention, Self Joins, Physical join algorithms (Nested Loop, Hash Join, Merge Join).
  - **Aggregations (3):** `COUNT(*)` vs `COUNT(column)` vs `COUNT(DISTINCT)`, GROUP BY with ROLLUP and CUBE, Window functions (`ROW_NUMBER`, `RANK`, `DENSE_RANK`).
  - **Subqueries (4):** Window frames (running totals & moving averages), CTEs vs Temp Tables vs Subqueries, Correlated Subqueries & `EXISTS` vs `IN`, Recursive CTEs for hierarchy traversal.
  - **Constraints (3):** FOREIGN KEY constraints & cascading delete/update actions, UNIQUE constraint vs UNIQUE index, CHECK constraints & data integrity.
  - **Indexes (4):** B-Tree leaf node mechanics, Composite index Leftmost Prefix Rule, Covering Indexes & `INCLUDE` clause, Partial & Expression/Functional indexes.
  - **Transactions (4):** ACID properties & relational database enforcement, 4 ANSI Isolation Levels & concurrency anomalies, Optimistic vs Pessimistic locking (`FOR UPDATE`), Deadlock detection & Wait-For graphs.
  - **Normalization (3):** 1NF, 2NF, 3NF & transitive dependencies, Intentional denormalization for OLTP/OLAP, Normalization vs Denormalization tradeoffs.
  - **Query Optimization (4):** `EXPLAIN ANALYZE` (Seq Scan vs Index Scan vs Bitmap Scan), Keyset (Seek) Pagination vs OFFSET, Avoiding `SELECT *` & N+1 queries, Table bloat, VACUUM, and ANALYZE.

### 3. Verified Live Filter Endpoints
- `GET /api/questions?technology=mongodb` &rarr; `200 OK` (35 questions, `total: 35`)
- `GET /api/questions?technology=mongodb&level=junior` &rarr; `200 OK` (14 questions, `total: 14`)
- `GET /api/questions?technology=mongodb&level=intermediate` &rarr; `200 OK` (14 questions, `total: 14`)
- `GET /api/questions?technology=mongodb&level=advanced` &rarr; `200 OK` (7 questions, `total: 7`)
- `GET /api/questions?technology=sql` &rarr; `200 OK` (35 questions, `total: 35`)
- `GET /api/questions?technology=sql&level=junior` &rarr; `200 OK` (14 questions, `total: 14`)
- `GET /api/questions?technology=sql&level=intermediate` &rarr; `200 OK` (14 questions, `total: 14`)
- `GET /api/questions?technology=sql&level=advanced` &rarr; `200 OK` (7 questions, `total: 7`)
- `GET /api/questions/:id` &rarr; `200 OK` (Verified full question detail payload with TTS audio answer and references).

---

## 🎨 Production Question Pack: HTML, CSS & Git (Task 5D)

### 1. HTML Distribution (25 Questions across 9 Topics)
- **Junior:** 10 (40%) | **Intermediate:** 10 (40%) | **Advanced:** 5 (20%)
- **Topics Covered (9):** HTML Fundamentals (3), Semantic HTML (3), Forms (3), Accessibility (3), Tables & Lists (2), Media (3), SEO Basics (3), Browser APIs (2), HTML5 Features (3).

### 2. CSS Distribution (25 Questions across 10 Topics)
- **Junior:** 10 (40%) | **Intermediate:** 10 (40%) | **Advanced:** 5 (20%)
- **Topics Covered (10):** CSS Fundamentals (2), Selectors (2), Box Model (3), Flexbox (3), Grid (3), Positioning (3), Responsive Design (2), Animations & Transitions (2), Specificity (2), Modern CSS (3).

### 3. Git Distribution (25 Questions across 10 Topics)
- **Junior:** 10 (40%) | **Intermediate:** 10 (40%) | **Advanced:** 5 (20%)
- **Topics Covered (10):** Git Fundamentals (3), Commits (2), Branches (2), Merging (3), Rebasing (3), Remote Repositories (2), Conflict Resolution (2), Stashing (2), Reset & Revert (3), Git Best Practices (3).

### 4. Verified Live Filter Endpoints
- `GET /api/questions?technology=html` &rarr; `200 OK` (25 questions, `total: 25`)
- `GET /api/questions?technology=html&level=junior` &rarr; `200 OK` (10 questions, `total: 10`)
- `GET /api/questions?technology=html&level=intermediate` &rarr; `200 OK` (10 questions, `total: 10`)
- `GET /api/questions?technology=html&level=advanced` &rarr; `200 OK` (5 questions, `total: 5`)
- `GET /api/questions?technology=css` &rarr; `200 OK` (25 questions, `total: 25`)
- `GET /api/questions?technology=css&level=junior` &rarr; `200 OK` (10 questions, `total: 10`)
- `GET /api/questions?technology=css&level=intermediate` &rarr; `200 OK` (10 questions, `total: 10`)
- `GET /api/questions?technology=css&level=advanced` &rarr; `200 OK` (5 questions, `total: 5`)
- `GET /api/questions?technology=git` &rarr; `200 OK` (25 questions, `total: 25`)
- `GET /api/questions?technology=git&level=junior` &rarr; `200 OK` (10 questions, `total: 10`)
- `GET /api/questions?technology=git&level=intermediate` &rarr; `200 OK` (10 questions, `total: 10`)
- `GET /api/questions?technology=git&level=advanced` &rarr; `200 OK` (5 questions, `total: 5`)
- `GET /api/questions/:id` &rarr; `200 OK` (Verified full question detail payload with TTS audio answer and references).

---

## 🧹 Repository Audit & Platform Standardization (Task 6)

### 1. Complete Content & Architecture Modernization
- **Total Production Questions**: **325 questions** across 10 core technologies and 99 topics (100% original, curated, and interviewer-tested).
- **Source Governance**: All questions governed by `source: "ai-generated"` or `source: "curated"`, with zero legacy notebook OCR or resume-specific tags.
- **Genuine Guest Browsing**: Mobile app boots into authentic guest mode (`user: null`, `isGuest: true`) allowing full public browsing, searching, reading solutions, and audio playback without any fake default developer account or login barriers.
- **Full Backend Platform Retained**: User authentication, JWT sessions, admin portal controls, question progress, bookmarking, smart revision queues, full-text search, and dashboard analytics remain 100% operational.
- **Verification Gates**:
  - Backend TypeScript Check: `0 errors` (`npx tsc --noEmit`)
  - Mobile TypeScript Check: `0 errors` (`npx tsc --noEmit`)
  - Test Suite: **13/13 suites passed, 126/126 tests passed**
  - Live API Endpoints: Public browsing, search, and question detail verified live on port 5000.

---

## ⚡ Cache Management & Dynamic Revalidation Architecture (Task 7)

### 1. Robust In-Memory Cache Lifecycle
To guarantee that refreshed backend content instantly propagates to mobile users without requiring app reinstallations or encountering stale data:
- **Centralized `MemoryCache<T>`**: Replaced unmanaged module-level variables with a typed, TTL-managed cache engine with a 3-minute sliding window (`DEFAULT_CACHE_TTL_MS`).
- **Reactive Navigation Synchronization**:
  - `BrowseTopicsScreen` immediately synchronizes topic state upon `techKey` change to prevent flashing stale topics from prior technologies.
  - `BrowseQuestionsScreen` reacts dynamically to technology and level route parameter changes and clears stale question queues before fetching.
- **Granular Prefix & Global Invalidation**:
  - `handleRefresh` on `BrowseQuestionsScreen` purges all paginated query keys (`deletePrefix`) for the active filter set.
  - Pull-to-refresh on `HomeScreen` triggers `invalidateAllContentCaches()`, purging all screen caches globally in a single action.
  - `SearchScreen` includes pull-to-refresh directly on the results `FlatList`.

---

## 🏆 Final Production Readiness & Integrity Certification (Task 8)

### 1. Production Content Metrics
- **Technologies Active**: **10** (JavaScript, TypeScript, React, HTML, CSS, Node.js, Express.js, MongoDB, SQL, Git)
- **Topics Total**: **99**
- **Questions Total**: **325** (100% Published, 0 Draft, 0 Archived)
- **Zero Invalids**: 0 Duplicate questions, 0 Orphan topics, 0 Orphan questions, 0 Missing required fields, 0 Legacy personal/resume references.
- **Level Distribution**:
  - Junior: **130** (40.0%)
  - Intermediate: **130** (40.0%)
  - Advanced: **65** (20.0%)
- **Test Suite Status**: **13/13 Suites Passed, 126/126 Tests Passed** (100% Passing Core Content)
- **TypeScript Integrity**: Backend `0 errors` | Mobile `0 errors`

---

## 📝 Interview Exam System (Tasks 23 – 25)

### 1. Task 23: Core 25-Question Simulation & Exam vs. Practice Modes
- **Dual Exam Types**:
  - **Subject Tests**: 25-question focused assessments on individual technologies (React, Node.js, Express.js, MongoDB, JavaScript, TypeScript, HTML, CSS, SQL, Git). Unlocked when a subject reaches 25+ published MCQs.
  - **Full Stack & All-Subjects Test**: 25-question comprehensive simulation balanced evenly across all 10 core technologies.
- **Dual Interaction Modes**:
  - **Practice Mode (Learning Engine)**: Instant answer feedback upon selection (green/red highlights), disabled options to prevent double-guessing, and an immediate expandable explanation card for deliberate practice.
  - **Exam Mode (Realistic Assessment)**: Neutral selection styling (`○` / `●`), option switching supported, timer/progress visibility, zero explanations exposed during the test, and full anti-cheat payload sanitization on the server.
- **Server-Authoritative Scoring**:
  - Validates submissions against database records, preventing client-side spoofing.
  - Supports guest attempts seamlessly while storing authenticated attempts to user history.

### 2. Task 24: Exam Difficulty Selection
- **Supported Difficulty Tiers**:
  - 🟢 **Easy**: Foundational concepts & syntax.
  - 🟡 **Medium**: Practical application & interview-standard questions.
  - 🔴 **Hard**: Complex internals, edge cases, and performance tradeoffs.
  - 🎯 **Mixed (Default)**: Realistic interview mix targeting ~8 Easy, 9 Medium, and 8 Hard questions.
- **Adaptive Fallback Algorithm**:
  - If a specific technology has fewer than 25 questions at the requested difficulty level, all available questions at that level are selected first, and the remaining slots are gracefully backfilled from the broader pool without duplicates.
- **2-Step Launch Modal**:
  - Streamlined UI on `ExamListScreen` guiding candidates through Step 1 (Practice vs Exam Mode) and Step 2 (Easy, Medium, Hard, Mixed) with instant launch.

### 3. Task 25: Exam Performance Analysis & Weak-Area Insights
- **Calculation Engine (`calculateExamAnalysis`)**:
  - Generates multi-dimensional performance statistics without mutating or side-effecting `UserQuestionProgress`.
  - **Overall Metrics**: Accurately computes `totalQuestions`, `correct`, `incorrect`, `unanswered` (`total - answered`), `percentage`, and `performanceCategory`.
  - **Difficulty Breakdown**: Isolates candidate accuracy across Easy, Medium, and Hard tiers with score progress bars.
  - **Subject Breakdown**: Groups candidate answers by technology, spotlighting individual subject mastery.
  - **Weak Areas Spotlight (🎯 Focus Next)**: Aggregates mistakes by topic, ranks topics by lowest accuracy ascending and highest incorrect count descending, highlighting up to the top 3 weak topics.
  - **Dynamic Actionable Recommendations**: Generates tailored next steps (`review_weak` or `take_another`) with a direct `[ Review Weak Areas ]` CTA.
- **Mobile Result & Review UX**:
  - `ExamResultScreen`: Features Performance Summary grid, Difficulty Progress cards, Subject Performance breakdown, Focus Next weak topic cards, and dynamic recommendation CTA.
  - `ExamReviewScreen`: Extended with route parameter `{ filter: 'incorrect' }` so candidates tapping `[ Review Weak Areas ]` land immediately on their mistakes.

### 4. Task 26: Configurable Daily Interview Challenge System
- **Core Learning Loop**:
  - `Learn → Practice → Test → Fail → Review Mistakes → Retry → Pass → Complete Day → Streak`.
- **Guest-First & Local Storage Architecture**:
  - Works 100% offline and for guest users with zero authentication required.
  - User-specific daily progress, streak counter, attempt logs, and settings stored locally using versioned AsyncStorage keys (`@daily_challenge_settings`, `@daily_challenge_state`, `@daily_challenge_streak`, `@daily_challenge_history`).
  - Safe settings preservation: If user modifies settings mid-day, active challenge remains intact and changes take effect starting tomorrow.
- **Configurable Routine**:
  - **Learning Questions**: 10, 20 (Default), 30 questions.
  - **Daily Test Questions**: 10 (Default), 20, 30 MCQs.
  - **Passing Score**: 70%, 80% (Default). Reliable integer percentage calculation (`correct / total * 100`).
  - **Technologies**: Multi-select across all 10 active subjects (JavaScript, TypeScript, React, HTML, CSS, Node.js, Express.js, MongoDB, SQL, Git). Defaults to all active technologies if none selected.
- **Interactive Daily Challenge Experience**:
  - **📚 Learn**: Question cards with revealable authoritative answers, key interview points, technical deep dives, and native TTS audio synthesis (`expo-speech`).
  - **🧠 Practice**: Deliberate practice with instant answer validation (green/red feedback) and immediate technical explanations.
  - **📝 Daily Test**: Neutral exam-style multiple-choice testing with unanswered count warning modal, no answers exposed during test, and server-authoritative question pools.
  - **❌/🎉 Results & Mistakes Review**: Shows score, accuracy, attempt counter, and best score. Failed tests highlight incorrect items with candidate answer vs correct answer and technical explanations, with unlimited `[ Retry Test (Fresh Questions) ]` pulling unseen MCQs.
- **Streak & History System**:
  - Completing today's test (score $\ge$ passing threshold) extends candidate streak (`🔥 X Day Streak Active!`).
  - Prevents multiple increments on the same day.
  - Tracks `currentStreak`, `longestStreak`, and `lastCompletedDate`.
  - Daily History modal displays calendar history, scores, attempts, and technology tags.
- **Home & Settings Integration**:
  - Prominent Home dashboard card showing Day X, progress bar, streak pill, and dynamic CTA (`Start Challenge`, `Continue Challenge`, or `Review Today's Challenge ✔`).
  - Settings screen routine row launching `DailyChallengeSettingsModal`.

---

## 🏆 Current Production Readiness & Test Suite Certification (Post Task 26)

### Content & Question Bank Metrics
- **Core Interview Questions**: **325** (100% Published)
- **MCQ Exam Question Bank**: **250** Curated Questions with randomized 4-option structures and technical explanations across all 10 technologies.
- **Active Technologies**: **10**
- **Active Topics**: **99**

### Automated Test Suite Status
- **Total Backend Test Suites**: **16 / 16 Passed** (100%)
- **Total Backend Tests**: **171 / 171 Passed** (100%)
- **Daily Challenge Test Coverage**: **4 / 4 Passed** (`tests/dailyChallenge/dailyChallenge.test.ts`)
- **Exam Test Coverage**: **36 / 36 Passed** (`tests/exams/exams.test.ts`)
- **TypeScript Compilation**:
  - Backend: `npx tsc --noEmit` $\rightarrow$ **0 errors**
  - Mobile: `npm run typecheck` $\rightarrow$ **0 errors**
- **Physical Device Validation**: Tested and certified on real Android hardware (`RMX5264`) across Learn, Practice, Test, Failure State, Mistake Review, Retry with fresh questions, Passing flow, Streak update, App Cold Restart persistence, Settings configuration, and Daily History view.

