# Backend Architecture & Technical Design

This document details the internal design, database modeling, algorithmic workflows, and security architecture of the **Developer Interview Revision Backend**.

---

## 1. Architectural Philosophy

1. **Structured Note Preservation**: Standard interview systems force all content into a generic `body` string. This system models real engineering notes by preserving distinct fields: `comparisons`, `steps`, `codeExamples`, `interviewAnswer`, `interviewTips`, `commonMistakes`, and `analogy`.
2. **Deterministic, Transparent Algorithms**: Instead of opaque machine learning or noisy heuristics, revision queues use predictable rules (priority ordering, percentage distributions) that give developers direct control over their revision time.
3. **Normalized Taxonomy**: Technologies, topics, and preparation levels are stored as independent entities. Questions reference these entities, allowing levels and technologies to be added or modified dynamically without changing database schemas.
4. **Decoupled User Progress**: User interactions (`known`, `review`, `weak`, `isSaved`, review counts, timestamps) live in a dedicated `UserQuestionProgress` collection rather than mutating the core `Question` documents.

---

## 2. Directory & Component Structure

```
src/
├── config/
│   ├── env.ts             # Environment variables loaded and typed via dotenv
│   └── database.ts        # Mongoose connection with automatic MongoMemoryServer fallback
├── models/
│   ├── Technology.ts      # Categories: frontend, backend, database, devops, other
│   ├── Topic.ts           # Subtopics tied to technologyId
│   ├── PreparationLevel.ts# Foundation, Junior, Intermediate, Advanced, Expert
│   ├── Question.ts        # Flexible questions with comparisons, steps, tips
│   ├── User.ts            # Users, bcrypt passwords, roles (user, admin)
│   └── UserQuestionProgress.ts # Progress records (userId + questionId)
├── middleware/
│   ├── auth.middleware.ts # requireAuth (401 guard) & optionalAuth (guest/user)
│   ├── admin.middleware.ts# requireAdmin (403 guard)
│   ├── validate.ts        # Express middleware executing Zod schema validation
│   └── error.middleware.ts# Centralized error handler converting all errors to standard JSON
├── validators/
│   ├── auth.validator.ts  # Registration, login, preferences schemas
│   ├── question.validator.ts # Question filters and CRUD schemas
│   ├── progress.validator.ts # Progress updates and revision query schemas
│   └── admin.validator.ts # Bulk import and administrative schemas
├── services/
│   ├── auth.service.ts        # Hashing, token generation, profile management
│   ├── question.service.ts    # Filtering, lean queries, user progress enrichment
│   ├── progress.service.ts    # Status updates, bookmarks, and progress reset
│   ├── revision.service.ts    # Weak, Quick, and Interview Tomorrow prep algorithms
│   ├── dashboard.service.ts   # Aggregation pipelines for mastery analytics
│   ├── import.service.ts      # Resilient bulk JSON parsing, ID resolution, dry-run preview
│   └── contentStats.service.ts# Content distribution statistics and gap analysis
├── controllers/
│   └── ...                    # Thin controller layer translating HTTP to service calls
├── routes/
│   ├── index.ts               # Root router mounting /api/* modules
│   └── ...                    # Domain-specific route definitions
├── seed/
│   ├── content/               # Domain-specific question banks (JS, TS, React, HTML, CSS, Node, Express, MongoDB, SQL, Git)
│   │   ├── types.ts           # Canonical SeedQuestion interface
│   │   ├── javascript.questions.ts
│   │   ├── ...
│   │   └── index.ts           # Combined allSeedQuestions array (327 curated items)
│   ├── seedData.ts            # Canonical taxonomy (10 technologies, 100 topics, preparation levels)
│   └── seeder.ts              # Seeder with duplicate detection, normalization, and breakdown reporting
└── utils/
    ├── apiResponse.ts         # Standardized JSON response helpers
    ├── apiError.ts            # Operational error class
    ├── pagination.ts          # Pagination math and response packaging
    ├── questionNormalizer.ts  # Deterministic normalization and duplicate key generation
    └── slugify.ts             # URL-friendly slug generator
```

---

## 3. Database Models & Schema Design

### 3.1 Technology (`Technology.ts`)
Stores developer technologies categorized by domain:
- `name`: string (e.g. `"React"`)
- `slug`: string, unique, indexed (e.g. `"react"`)
- `category`: enum (`frontend` | `backend` | `database` | `devops` | `other`)
- `description`: string
- `icon`: string (optional icon name or URL)
- `order`: number (for custom display sorting)
- `isActive`: boolean (default: `true`)

### 3.2 Topic (`Topic.ts`)
Sub-areas within a specific technology:
- `technologyId`: ObjectId ref `Technology`
- `name`: string (e.g. `"Hooks"`)
- `slug`: string (e.g. `"hooks"`)
- `description`: string
- `order`: number
- `isActive`: boolean
- **Compound Index**: `{ technologyId: 1, slug: 1 }` (unique constraint prevents duplicate topics under the same technology).

### 3.3 PreparationLevel (`PreparationLevel.ts`)
Configurable readiness levels:
- `name`: string (`Foundation`, `Junior`, `Intermediate`, `Advanced`, `Expert`)
- `slug`: string, unique (`foundation`, `junior`, `intermediate`, `advanced`, `expert`)
- `description`: string
- `order`: number (1 to 5)

### 3.4 Question (`Question.ts`)
The central knowledge document:
- `question`: string (Primary question text)
- `title`: string (Short title, defaults to `question` if omitted)
- `technologyId`: ObjectId ref `Technology` (indexed)
- `topicId`: ObjectId ref `Topic` (indexed)
- `preparationLevels`: Array of ObjectId ref `PreparationLevel` (indexed)
- `difficulty`: enum (`easy` | `medium` | `hard`)
- `questionType`: string (e.g. `Conceptual`, `Practical`, `Scenario Based`, `Coding`, `Comparison`, `Architecture`, `Implementation`, `Troubleshooting`)
- `answer`: string (Concise explanation)
- `explanation`: string (Detailed deep-dive)
- `analogy`: string (Real-world mental model)
- `importantPoints`: Array of string (Bullet points)
- `codeExamples`: Array of `{ language, title, code, explanation }`
- `comparisons`: Array of `Schema.Types.Mixed` (e.g. `[{ aspect: "Re-render", useState: "...", useRef: "..." }]`)
- `examples`: Array of string
- `steps`: Array of `{ stepNumber, title, description }`
- `interviewAnswer`: string ("How to verbalize this directly to the interviewer")
- `interviewTips`: Array of string (High-impact cues to remember)
- `commonMistakes`: Array of string (Traps and anti-patterns)
- `followUpQuestions`: Array of string
- `relatedQuestions`: Array of ObjectId ref `Question`
- `tags`: Array of string (indexed)
- `isImportant`: boolean (indexed)
- `source`: enum (`ai-generated` | `curated` | `web-research` | `manually-added` | `imported`)
- `sourceReference`: string (Curriculum reference, URL, or standard documentation)
- `status`: enum (`draft` | `published` | `archived`) (indexed)

#### Indexes on `Question`:
1. **Compound Filter Indexes**:
   - `{ technologyId: 1, status: 1 }`
   - `{ technologyId: 1, topicId: 1, status: 1 }`
   - `{ technologyId: 1, preparationLevels: 1, status: 1 }`
   - `{ status: 1, isImportant: 1 }`
2. **Text Index**:
   - Text search on `question` (weight: 10), `title` (weight: 8), `tags` (weight: 5), `answer` (weight: 3), and `explanation` (weight: 1).

### 3.5 User (`User.ts`)
- `name`: string
- `email`: string, unique, indexed, lowercase
- `passwordHash`: string (configured with `select: false` so it is never returned in queries)
- `role`: enum (`user` | `admin`, default `user`)
- `selectedTechnologies`: Array of ObjectId ref `Technology`
- `selectedPreparationLevel`: ObjectId ref `PreparationLevel`

### 3.6 UserQuestionProgress (`UserQuestionProgress.ts`)
- `userId`: ObjectId ref `User`
- `questionId`: ObjectId ref `Question`
- `status`: enum (`known` | `review` | `weak` | `null`)
- `isSaved`: boolean (default `false`)
- `reviewCount`: number (default `0`, increments on review)
- `lastReviewedAt`: Date
- **Compound Unique Index**: `{ userId: 1, questionId: 1 }` (guarantees one progress record per user per question).
- **Secondary Indexes**: `{ userId: 1, status: 1 }`, `{ userId: 1, isSaved: 1 }`.

---

## 4. Revision Algorithms & Business Logic

### 4.1 "Weak Questions" Algorithm (`RevisionService.getWeakQuestions`)
- Locates all `questionId`s in `UserQuestionProgress` where `userId = user._id` and `status = 'weak'`.
- Queries the `Question` collection for published questions matching those IDs.
- Applies optional filters: `technology`, `topic`, `preparationLevel`.
- Supports pagination (`page`, `limit`).

### 4.2 "Quick Revision" Algorithm (`RevisionService.getQuickRevisionQuestions`)
Designed for daily 10-minute micro-learning sessions:
- Input parameters: `technology`, `preparationLevel`, `limit` (default: 10).
- Calculates target proportions:
  - **40% Weak Questions**: Questions marked `status = 'weak'`.
  - **30% Review Questions**: Questions marked `status = 'review'`.
  - **20% High-Yield Important**: Questions with `isImportant = true` that are not yet marked `known`.
  - **10% Unpracticed / General**: Fills remaining slots with questions the user has not yet practiced or least recently reviewed.
- Eliminates duplicates using a persistent `Set` of selected IDs.

### 4.3 "Interview Tomorrow / Rapid Prep" Algorithm (`RevisionService.getInterviewPrepQuestions`)
Designed for a 30-minute rapid review sprint prior to a technical interview:
- Input parameters: `technologies[]`, `preparationLevel`, `limit` (default: 20).
- Strict priority queue:
  1. **Priority 1**: All questions marked `weak` under the selected technologies.
  2. **Priority 2**: Questions marked `review`.
  3. **Priority 3**: High-yield questions (`isImportant: true`).
  4. **Priority 4**: Unpracticed questions up to the requested `limit`.

---

## 5. Admin Bulk Question Import & Dry-Run Preview Engine

Located in [import.service.ts](file:///d:/1.%20programmins/2/src/services/import.service.ts) and [questionNormalizer.ts](file:///d:/1.%20programmins/2/src/utils/questionNormalizer.ts):
- **Per-Item Validation (`validateQuestionItem`)**: Validates required fields (`technology`, `topic`, `question`, `answer`), checks enum constraints, and verifies nested arrays (`codeExamples`, `steps`, `comparisons`). Returns developer-friendly `{ index, field, message }` errors.
- **Deterministic Normalization**: Trims and collapses multiple spaces, normalizes tags to lowercase slugs, and generates duplicate keys (`createDuplicateKey`) by stripping trailing punctuation and lowercasing without risky fuzzy matching.
- **Dry-Run Import Simulation (`previewImport`)**:
  - Validates all questions without modifying MongoDB.
  - Resolves technology and topic names/slugs, categorizing existing vs `newTechnologies` and `newTopics`.
  - Detects duplicates against database records and intra-batch items.
  - Returns preview metrics `{ total, valid, duplicates, errors, newTechnologies, newTopics, errorDetails, questions }`.
- **Resilient Bulk Import (`importQuestions`)**:
  - Inserts valid questions into MongoDB.
  - Skips duplicates automatically.
  - Collects individual malformed item errors without failing the valid items in the batch.
  - Automatically resolves or creates missing Technologies, Topics, and Preparation Levels.

---

## 6. Content Quality, Draft Review & Gap Analysis Engine

Located in [contentStats.service.ts](file:///d:/1.%20programmins/2/src/services/contentStats.service.ts):
- **Draft Question Review (`GET /api/admin/questions?status=draft`)**: Allows administrators to review imported or AI-generated questions before publishing them. Normal public endpoints (`GET /api/questions`) filter for `status: "published"`.
- **Content Statistics (`getContentStats`)**:
  - Aggregates overall totals and status counts (`published`, `draft`, `archived`).
  - Provides distributions `byTechnology`, `byPreparationLevel`, `byDifficulty`, `bySource`, and `byQuestionType`.
- **Content Gap Analysis (`getContentGaps`)**:
  - Computes a transparent matrix across Technology → Topic → Preparation Level.
  - Automatically flags preparation levels with zero or low question counts (`gaps: ["advanced", "expert"]`) so developers know exactly where more questions need to be ingested.

---

## 7. Error Handling & Security Architecture

### 7.1 Centralized Error Handling
All errors (Zod validation, Mongoose CastError, Mongoose E11000 duplicate keys, JWT expiration, and custom `ApiError` instances) are intercepted by [error.middleware.ts](file:///d:/1.%20programmins/2/src/middleware/error.middleware.ts). Responses always conform to:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Invalid email address" }]
}
```

### 7.2 Security Layer
- **Helmet**: Adds security headers to all HTTP responses.
- **CORS**: Configured via `CORS_ORIGIN` environment variable.
- **Password Protection**: Salted hash via `bcryptjs` with cost factor 10.
- **Password Leak Prevention**: `passwordHash` has `select: false` in Mongoose; explicitly excluded from JSON serialization.
- **Role-Based Access Control**: `requireAuth` validates JWT and attaches `req.user`. `requireAdmin` blocks non-admin users with HTTP 403.
- **Optional Authentication**: `optionalAuth` gracefully detects if a token is present to enrich public listings with user progress, but allows guests to browse unauthenticated.

---

## 8. Automated Testing & Stabilization Layer

### 8.1 Testing Architecture
- **Framework**: Jest (`ts-jest`) with Supertest and MongoMemoryServer.
- **Isolation**: Each test suite initializes an isolated, zero-footprint in-memory MongoDB replica, executing without dependencies on local external MongoDB instances or polluting production databases.
- **Test Matrix (13 Suites, 126 Tests, 100% Passing)**:
  - `tests/auth/auth.test.ts`: Register, login, profile retrieval, preference updating, validation, and token verification.
  - `tests/technologies/technologies.test.ts`: Active status filtering, slug & ID lookups, category filtering, 404 responses.
  - `tests/topics/topics.test.ts`: Active topic filtering, technology association filtering, slug & ID lookups, 404 responses.
  - `tests/questions/questions.test.ts`: Public visibility enforcement (drafts & archives hidden), multi-criteria filtering, pagination, userProgress enrichment.
  - `tests/progress/bookmark.test.ts`: Bookmark/save idempotency, unsave idempotency, saved list pagination, user isolation.
  - `tests/progress/progress.test.ts`: Status transitions (`known`, `review`, `weak`), reviewCount increments, lastReviewedAt updates, reset.
  - `tests/revision/revision.test.ts`: Deterministic Quick Revision distribution (40% weak, 30% review, 20% important, 10% unpracticed) and Interview Prep priority sequencing.
  - `tests/dashboard/dashboard.test.ts`: Strict calculation verification for totalQuestions, completion percentages, per-technology mastery, and weak topics.
  - `tests/search/search.test.ts`: MongoDB full-text search with compound filtering and pagination.
  - `tests/admin/admin.test.ts`: RBAC enforcement (401/403), draft review queue, question CRUD, publish/archive lifecycles.
  - `tests/import/import.test.ts`: Zero-write dry-run preview verification, duplicate detection (both intra-batch and database), resilient import error reporting.
  - `tests/admin/contentStats.test.ts`: Cross-dimensional statistics aggregation and topic/level gap detection.
  - `tests/security/security.test.ts`: JWT expiration, invalid signatures, malformed ObjectIds, and password hash leakage prevention.

### 8.2 Bug Fixes & Stabilization
- **Revision Query Merging Fix**:
  - *Issue Discovered*: In `RevisionService.ts`, when filtering questions for Quick Revision and Interview Prep, object spreading `{ ...query, _id: { $nin: selectedIds } }` was overwriting criteria inside `query._id` (such as `{ _id: { $in: weakIds } }` and `{ _id: { $nin: practicedIds } }`).
  - *Resolution*: Updated `fetchAndAdd` and `fetchPhase` in `RevisionService.ts` to cleanly merge `_id` filters, ensuring `$in` filters intersect with non-selected IDs and `$nin` filters combine with non-selected IDs.

---

## 9. Interview Exam Mode Architecture (Feature 1)

### 9.1 Data Models & Schema Design
- **`Question.mcq` Subdocument**:
  - Embedded inside `QuestionSchema`:
    - `enabled`: Boolean flag determining whether the question can be served in MCQ exams.
    - `options`: Array of exactly 4 choices (`IMCQOption`): `{ id: 'A' | 'B' | 'C' | 'D', text: string }`.
    - `correctOption`: `'A' | 'B' | 'C' | 'D'` pointing to the single correct option.
    - `explanation`: Optional MCQ-specific explanation detailing why the option is correct and why distractors are wrong.
  - **Index**: Compound index `{ 'mcq.enabled': 1, technologyId: 1, status: 1 }` enables sub-millisecond retrieval of exam pools.
- **`ExamAttempt` Model**:
  - Stores exam completion sessions:
    - `userId`: Optional ObjectId referencing `User` (null for guest attempts).
    - `examType`: `'subject' | 'mern'`.
    - `mode`: `'practice' | 'exam'` (default: `'exam'`).
    - `difficulty`: `'easy' | 'medium' | 'hard' | 'mixed'` (default: `'mixed'`).
    - `technologyId` / `technologySlug` / `technologyName`.
    - `examTitle`: Display name (e.g. `"React Interview Test"` or `"Full Stack & All-Subjects Test"`).
    - `score`, `totalQuestions` (25), `percentage`, `performanceCategory` (`'Excellent' | 'Good' | 'Needs Practice' | 'Needs Revision'`).
    - `answers`: Array recording candidate answers with question text, chosen option, correct option, correctness boolean, and explanation.
    - `analysis` (`IExamAnalysis`): Complete breakdown subdocument persisted on each attempt:
      - `overall`: `{ totalQuestions, correct, incorrect, unanswered, percentage, performanceCategory }`.
      - `difficulty`: Array of `IDifficultyPerformance` (`easy`, `medium`, `hard` with correct, total, percentage).
      - `technologies`: Array of `ITechnologyPerformance` (subject name, slug, correct, total, percentage).
      - `weakTopics`: Array of `IWeakTopic` (topic name, slug, technology, correct, incorrect, total, accuracy).
      - `recommendation`: `IExamRecommendation` (`type: 'review_weak' | 'take_another'`, `message`, `buttonText`).

### 9.2 Exam Generation & Business Logic (`exam.service.ts`)
1. **Dynamic Subject Availability**:
   - Aggregates active technologies with their count of published MCQs (`mcq.enabled: true`).
   - Flags subjects as `isAvailable: true` only if they meet or exceed the required 25 questions.
2. **Subject Exam Generation**:
   - Pulls 25 MCQs strictly filtered to the subject technology.
   - Applies difficulty filtering (`easy`, `medium`, `hard`, `mixed`). For `mixed`, targets balanced ~8 Easy, 9 Medium, 8 Hard distribution.
   - **Graceful Fallback**: If a subject has fewer than 25 MCQs at the requested difficulty, gathers all available at that difficulty and backfills remaining slots from the broader pool without duplicates.
   - For every question, shuffles the 4 options and updates `correctOption` so that the correct answer is never predictably tied to option position, while guaranteeing 100% answer mapping accuracy.
3. **Full Stack & All-Subjects Exam**:
   - Curates a balanced 25-question interview assessment across all 10 active technologies (HTML, CSS, JavaScript, TypeScript, React, Node.js, Express.js, MongoDB, SQL, Git).
   - Applies difficulty filtering across subjects without allowing one technology to dominate.
4. **Anti-Cheat Payload Security**:
   - When `mode === 'exam'`, the endpoint strictly strips `correctOption` and `explanation` from the payload sent to the client.
   - When `mode === 'practice'`, includes `correctOption` and `explanation` for real-time candidate guidance.
5. **Server-Authoritative Scoring & Submission**:
   - Evaluates submitted answers against MongoDB database questions.
   - Recalculates candidate accuracy, score, percentage, and performance category.
   - Computes candidate performance analysis (`calculateExamAnalysis`) covering overall metrics, difficulty tiers, technologies, and weak topics.
   - Returns full `reviewItems` (with correct answers and explanations) alongside `analysis` for results and review screens.
   - Accepts exam attempt submissions from guests without requiring authentication.
   - If an authenticated JWT token is present, binds the attempt to `userId` for persistence in the user's personal test history.
6. **Exam Performance Analysis Engine (`calculateExamAnalysis`)**:
   - **Overall Stats**: Derives accurate `totalQuestions`, `correct`, `incorrect`, `unanswered` (`total - answeredCount`), `percentage`, and `performanceCategory`.
   - **Difficulty Breakdown**: Aggregates performance across Easy, Medium, and Hard tiers, computing per-difficulty accuracy percentage.
   - **Technology Breakdown**: Groups answers by subject to provide clear mastery percentages across all tested technologies.
   - **Weak Topic Identification**: Groups mistakes by topic name, filters to topics with `incorrect > 0`, ranks by lowest accuracy ascending and highest incorrect count descending, and selects the top 3 weak areas.
   - **Dynamic Recommendation**: Suggests reviewing weak areas when mistakes exist (`review_weak`), or tackling a new challenge on a 100% perfect attempt (`take_another`).
   - **Zero Side-Effects**: Operates purely on exam attempt data without mutating `UserQuestionProgress`, ensuring daily practice and exam histories remain clean and distinct.

### 9.3 Exam Test Suite Verification
- **Total Backend Suites**: **15 / 15 Passed** (100%)
- **Total Backend Tests**: **167 / 167 Passed** (100%)
- **Exam Test Coverage (`tests/exams/exams.test.ts`)**: **36 / 36 Passed**
  - Availability aggregation and 25-question threshold enforcement.
  - Subject exam generation with randomized option shuffling.
  - Practice mode payload verification (correctOption & explanation included).
  - Exam mode anti-cheat sanitization (correctOption & explanation stripped).
  - Difficulty selection & distribution (Easy, Medium, Hard, Mixed) with graceful fallback backfilling.
  - All-Subjects balanced technology distribution.
  - Server-authoritative scoring, percentage calculation, and category assignment.
  - Task 25 Performance Analysis verification: overall stats, difficulty breakdown, technology breakdown, top weak topic ranking, and dynamic recommendation payloads.




