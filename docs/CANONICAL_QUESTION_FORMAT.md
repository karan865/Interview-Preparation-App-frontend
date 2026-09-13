# Canonical Question JSON Specification

This document defines the single, official **Canonical JSON Format** for importing and storing interview questions, handwritten notes, comparisons, code examples, and practical engineering knowledge in the system.

---

## 1. Core Design Principle: Dynamic & Flexible Structure

> [!IMPORTANT]
> **DO NOT force every question to have the same rigid structure.**
> 
> A question should only include the fields relevant to the concept:
> - A quick syntax question might only need `question` + `answer`.
> - A tricky hook question might include `question` + `answer` + `comparisons` + `codeExamples` + `interviewAnswer`.
> - An architecture flow question might include `question` + `answer` + `steps` + `interviewTips`.
>
> All fields except `technology`, `topic`, `question`, and `answer` are **optional**.

---

## 2. Full Field Schema Specification

| Field | Type | Required? | Description & Allowed Values |
|---|---|---|---|
| `technology` | string | **Yes** | Technology name or ID (e.g. `"React"`, `"Node.js"`, `"Docker"`). Automatically resolved. |
| `topic` | string | **Yes** | Topic name or ID under that technology (e.g. `"Hooks"`, `"Event Loop"`). Automatically resolved. |
| `question` | string | **Yes** | Primary question text (minimum 3 characters). |
| `answer` | string | **Yes** | Direct, concise answer explaining the concept. |
| `title` | string | No | Short title for listings. Defaults to `question` if omitted. |
| `preparationLevels` | string[] | No | Target levels: `["Foundation"]`, `["Junior"]`, `["Intermediate"]`, `["Advanced"]`, `["Expert"]`. |
| `difficulty` | string | No | `"easy"` \| `"medium"` \| `"hard"` (default: `"medium"`). |
| `questionType` | string | No | `"Conceptual"`, `"Practical"`, `"Scenario Based"`, `"Coding"`, `"Comparison"`, `"Architecture"`, `"Implementation"`, `"Troubleshooting"`. |
| `explanation` | string | No | In-depth technical explanation, internals, and deep-dive mechanics. |
| `analogy` | string | No | Real-world metaphor or mental model simplifying the concept. |
| `importantPoints` | string[] | No | Key bullet points and takeaways. |
| `codeExamples` | object[] | No | Array of `{ language: string, title?: string, code: string, explanation?: string }`. |
| `comparisons` | object[] | No | Comparison rows: `[{ aspect: string, [techOrOption: string]: any }]`. |
| `examples` | string[] | No | Concrete production use cases or real-world scenarios. |
| `steps` | object[] | No | Sequential steps: `[{ stepNumber?: number, title: string, description?: string }]`. |
| `interviewAnswer` | string | No | Exact phrasing recommendation for verbalizing to an interviewer. |
| `interviewTips` | string[] | No | Senior tips, high-impact cues, and discussion points. |
| `commonMistakes` | string[] | No | Anti-patterns, common bugs, and interview pitfalls to avoid. |
| `followUpQuestions`| string[] | No | Typical follow-up questions asked by senior interviewers. |
| `tags` | string[] | No | Keywords and searchable tags (normalized automatically to lowercase slugs). |
| `isImportant` | boolean | No | Flag marking high-yield, frequently asked questions (default: `false`). |
| `mcq` | object | No | Multiple Choice subdocument: `{ enabled: boolean, options: [{ id: 'A'\|'B'\|'C'\|'D', text: string }], correctOption: 'A'\|'B'\|'C'\|'D', explanation?: string }`. |
| `source` | string | No | `"ai-generated"` \| `"curated"` \| `"web-research"` \| `"manually-added"` \| `"imported"` (default: `"ai-generated"`). |
| `sourceReference` | string | No | Curated curriculum reference, documentation link, or generation context (e.g. `"Curated interview preparation content"`). |
| `status` | string | No | `"draft"` \| `"published"` \| `"archived"` (default: `"published"`). |

---

## 3. Canonical Examples for Different Types of Content

### Example A: Technical Comparison Question (`useState` vs `useRef`)
```json
{
  "technology": "React",
  "topic": "Hooks",
  "preparationLevels": ["Junior", "Intermediate"],
  "difficulty": "medium",
  "questionType": "Comparison",
  "question": "What is the difference between useState and useRef in React?",
  "title": "useState vs useRef: State vs Mutable References",
  "answer": "useState causes a re-render when state updates to reflect changes in the UI. useRef returns a mutable object with a .current property that persists across renders without triggering a re-render.",
  "comparisons": [
    {
      "aspect": "Causes Re-render",
      "useState": "Yes, triggers re-render on state setter invocation",
      "useRef": "No, updating .current does not trigger re-render"
    },
    {
      "aspect": "Primary Use Case",
      "useState": "UI-driving data and dynamic component state",
      "useRef": "DOM access, timer IDs, or mutable values independent of rendering"
    },
    {
      "aspect": "Update Timing",
      "useState": "Asynchronous / batched by React scheduler",
      "useRef": "Synchronous immediate mutation of .current"
    }
  ],
  "codeExamples": [
    {
      "language": "tsx",
      "title": "Timer ref vs counter state",
      "code": "const timerRef = useRef<NodeJS.Timeout | null>(null);\nconst [count, setCount] = useState(0);\n\nconst startTimer = () => {\n  if (!timerRef.current) {\n    timerRef.current = setInterval(() => setCount(c => c + 1), 1000);\n  }\n};\n\nconst stopTimer = () => {\n  if (timerRef.current) {\n    clearInterval(timerRef.current);\n    timerRef.current = null;\n  }\n};"
    }
  ],
  "interviewAnswer": "I choose useState when changing the value must update the UI. I choose useRef when I need data to persist between renders without triggering unnecessary re-renders, such as storing a timer ID or directly referencing a DOM node.",
  "interviewTips": [
    "Never mutate ref.current during the render phase; only mutate it inside event handlers or useEffect."
  ],
  "commonMistakes": [
    "Using useState to hold interval IDs, which causes unintended re-renders during setup."
  ],
  "tags": ["react", "hooks", "usestate", "useref", "performance"],
  "isImportant": true,
  "source": "curated",
  "sourceReference": "React Interview Preparation Curriculum",
  "status": "published"
}
```

---

### Example B: Multi-Step Implementation Flow (JWT Refresh Token Rotation)
```json
{
  "technology": "Express.js",
  "topic": "Authentication & Security",
  "preparationLevels": ["Intermediate", "Advanced"],
  "difficulty": "hard",
  "questionType": "Implementation",
  "question": "How do you implement a secure JWT Refresh Token rotation flow in Express?",
  "answer": "Issue a short-lived Access Token (15 mins) and a long-lived Refresh Token stored in an httpOnly, Secure cookie. Upon refresh, verify the refresh token against the database, revoke it, and issue a brand-new access and refresh token pair.",
  "steps": [
    {
      "stepNumber": 1,
      "title": "Initial Authentication",
      "description": "User submits credentials; server validates bcrypt password hash."
    },
    {
      "stepNumber": 2,
      "title": "Dual Token Issuance",
      "description": "Generate short-lived access token and store hashed refresh token in MongoDB with user reference."
    },
    {
      "stepNumber": 3,
      "title": "Cookie Storage",
      "description": "Deliver refresh token in an httpOnly, Secure, SameSite=Strict cookie to prevent client script access (XSS defense)."
    },
    {
      "stepNumber": 4,
      "title": "Rotation on Refresh",
      "description": "On /api/auth/refresh, check DB. If token was already consumed, terminate all sessions for that family (token reuse detection). Otherwise, delete old token and issue new pair."
    }
  ],
  "interviewAnswer": "In production, I separate tokens: access tokens are short-lived and kept in memory, while refresh tokens reside in httpOnly, SameSite cookies. Each refresh rotates the token. If an already-rotated token is reused, the system detects theft and revokes all active sessions for that user family.",
  "tags": ["express", "jwt", "auth", "security", "refresh-tokens"],
  "isImportant": true,
  "source": "curated",
  "sourceReference": "Express.js Production Security Architecture",
  "status": "published"
}
```

---

### Example C: Concise Conceptual Question
```json
{
  "technology": "JavaScript",
  "topic": "Closures & Scope",
  "preparationLevels": ["Junior", "Intermediate"],
  "difficulty": "medium",
  "questionType": "Conceptual",
  "question": "What is a closure in JavaScript?",
  "answer": "A closure is the combination of a function bundled together with references to its lexical environment, allowing an inner function to access variables from an enclosing outer function even after the outer function has executed.",
  "tags": ["javascript", "closures", "scope"],
  "source": "manually-added",
  "status": "published"
}
```

---

### Example D: Web Research / AI-Assisted Draft Question
```json
{
  "technology": "RabbitMQ",
  "topic": "Queues & Exchanges",
  "preparationLevels": ["Advanced", "Expert"],
  "difficulty": "hard",
  "questionType": "Architecture",
  "question": "What is a Dead Letter Exchange (DLX) in RabbitMQ and when should you use it?",
  "answer": "A Dead Letter Exchange is an exchange where messages that cannot be processed successfully (rejected with nack without requeue, expired via TTL, or dropped due to queue length) are automatically rerouted for inspection or retry.",
  "tags": ["rabbitmq", "message-queue", "dlx", "microservices"],
  "source": "web-research",
  "sourceReference": "https://www.rabbitmq.com/dlx.html",
  "status": "draft"
}
```

### Example D: Curated MCQ Question for Interview Exam Mode
```json
{
  "technology": "React",
  "topic": "Rendering & Lifecycle",
  "preparationLevels": ["Intermediate", "Advanced"],
  "difficulty": "medium",
  "questionType": "Conceptual",
  "question": "What is the primary reason why React component render functions should remain pure?",
  "title": "Why render functions should be pure",
  "answer": "Pure render functions enable React to safely pause, abort, or re-run renders in Concurrent Mode without producing side effects or inconsistent state.",
  "explanation": "Concurrent rendering allows React to interrupt rendering to handle higher-priority user events. If a render function contains side effects, those side effects would execute unpredictably during interrupted or discarded render passes.",
  "tags": ["react", "rendering", "pure-functions", "concurrent-mode"],
  "mcq": {
    "enabled": true,
    "options": [
      { "id": "A", "text": "It guarantees that JSX can be parsed by Babel at compile time" },
      { "id": "B", "text": "It enables React to safely pause, abort, or re-run renders in Concurrent Mode without unpredictable side effects" },
      { "id": "C", "text": "Pure functions prevent child components from ever re-rendering" },
      { "id": "D", "text": "It forces state mutations to happen synchronously before the browser paints" }
    ],
    "correctOption": "B",
    "explanation": "Concurrent rendering allows React to pause or abandon in-progress renders. Pure functions guarantee no unwanted side effects occur during aborted renders."
  },
  "source": "curated",
  "sourceReference": "React Official Documentation - Keeping Components Pure",
  "status": "published"
}
```

---

## 4. Ingestion Normalization Rules

When questions are ingested via `POST /api/admin/questions/import` or previewed via `POST /api/admin/questions/import/preview`:
1. **Whitespace Normalization**: Multiple consecutive whitespace characters are collapsed into a single space; leading/trailing whitespace is trimmed.
2. **Duplicate Key Normalization**: Trailing punctuation (`?`, `!`, `.`) and casing differences are normalized so variants like `"What is useMemo in React?"` and `"what is useMemo in react"` are caught deterministically as duplicates.
3. **Tags Normalization**: Tags are lowercased, slugified, and deduplicated automatically.
4. **Enums Normalization**: `difficulty` defaults to `"medium"`, `status` defaults to `"published"`, and `source` defaults to `"imported"` if invalid or omitted.
