# Complete API Reference & Documentation

Base URL: `http://localhost:5000/api`

All requests should set `Content-Type: application/json`.
Protected endpoints require the header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Endpoints

### 1.1 Register User
- **Method / Path**: `POST /auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!",
  "role": "user",
  "selectedTechnologies": [],
  "selectedPreparationLevel": "intermediate"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "67cebe...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "selectedTechnologies": [],
      "selectedPreparationLevel": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.2 Login User
- **Method / Path**: `POST /auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "UserPassword123!"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "67cebe...",
      "name": "Alex User",
      "email": "user@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOi..."
  }
}
```

---

### 1.3 Get Current Profile
- **Method / Path**: `GET /auth/me`
- **Access**: Authenticated User
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "_id": "67cebe...",
    "name": "Alex User",
    "email": "user@example.com",
    "role": "user",
    "selectedTechnologies": [
      {
        "_id": "67cebe...",
        "name": "React",
        "slug": "react",
        "category": "frontend",
        "icon": ""
      }
    ],
    "selectedPreparationLevel": {
      "_id": "67cebe...",
      "name": "Intermediate",
      "slug": "intermediate",
      "order": 3
    }
  }
}
```

---

### 1.4 Update User Preferences
- **Method / Path**: `PUT /auth/preferences`
- **Access**: Authenticated User
- **Request Body**:
```json
{
  "selectedTechnologies": ["67cebe..."],
  "selectedPreparationLevel": "67cebe..."
}
```
- **Response (200 OK)**: Returns updated user profile.

---

## 2. Taxonomy & Metadata Endpoints

### 2.1 Get All Technologies
- **Method / Path**: `GET /technologies`
- **Access**: Public
- **Query Parameters**:
  - `category` (optional): `frontend` | `backend` | `database` | `devops` | `other`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "67cebe...",
      "name": "React",
      "slug": "react",
      "category": "frontend",
      "description": "Virtual DOM, component lifecycle, hooks, context API",
      "order": 2,
      "isActive": true,
      "questionCount": 44
    }
  ]
}
```

---

### 2.2 Get Technology by Slug or ID
- **Method / Path**: `GET /technologies/:idOrSlug` (e.g. `/technologies/react`)
- **Access**: Public

---

### 2.3 Get All Topics
- **Method / Path**: `GET /topics`
- **Access**: Public
- **Query Parameters**:
  - `technology` (optional): Technology slug or ObjectId (e.g. `?technology=react`)
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "67cebe...",
      "name": "Hooks",
      "slug": "hooks",
      "description": "useState, useEffect, useRef, useMemo, useCallback",
      "order": 1,
      "isActive": true,
      "questionCount": 15,
      "technologyId": {
        "_id": "67cebe...",
        "name": "React",
        "slug": "react",
        "category": "frontend"
      }
    }
  ]
}
```

---

### 2.4 Get Preparation Levels
- **Method / Path**: `GET /preparation-levels`
- **Access**: Public
- **Response (200 OK)**: Returns Foundation, Junior, Intermediate, Advanced, and Expert levels sorted by `order`.

---

## 3. Questions Endpoints

### 3.1 List Questions (Filtered & Paginated)
- **Method / Path**: `GET /questions`
- **Access**: Public (Optional Auth: if token provided, enriches questions with user's progress)
- **Query Parameters**:
  - `technology`: slug or ObjectId (e.g. `react`)
  - `topic`: slug or ObjectId (e.g. `hooks`)
  - `level`: slug or ObjectId (e.g. `junior`, `intermediate`, `advanced`). `junior` automatically matches `junior` + `foundation`; `advanced` matches `advanced` + `expert`.
  - `difficulty`: `easy` | `medium` | `hard`
  - `questionType`: `Conceptual` | `Practical` | `Comparison` | `Architecture` | `Implementation` | etc.
  - `isImportant`: `true` | `false`
  - `page`: integer (default: 1)
  - `limit`: integer (default: 20)
- **Response (200 OK)**:
```json
{
  "success": true,
  "questions": [
    {
      "_id": "67cebe...",
      "question": "What is the difference between useState and useRef in React?",
      "title": "Difference between useState and useRef",
      "technologyId": {
        "_id": "67cebe...",
        "name": "React",
        "slug": "react",
        "category": "frontend"
      },
      "topicId": {
        "_id": "67cebe...",
        "name": "Hooks",
        "slug": "hooks"
      },
      "preparationLevels": [ ... ],
      "difficulty": "medium",
      "questionType": "Comparison",
      "answer": "useState triggers a component re-render...",
      "isImportant": true,
      "comparisons": [
        {
          "aspect": "Triggers Re-render",
          "useState": "Yes, whenever state is updated",
          "useRef": "No, mutating .current is completely silent"
        }
      ],
      "userProgress": {
        "status": "weak",
        "isSaved": true,
        "reviewCount": 2,
        "lastReviewedAt": "2026-09-07T12:00:00.000Z"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### 3.2 Get Question Details by ID
- **Method / Path**: `GET /questions/:id`
- **Access**: Public (Optional Auth)
- **Response (200 OK)**: Returns complete question document including `comparisons`, `steps`, `codeExamples`, `interviewAnswer`, `interviewTips`, `commonMistakes`, `followUpQuestions`, and `userProgress`.

---

### 3.3 Save / Bookmark Question
- **Method / Path**: `POST /questions/:questionId/save`
- **Access**: Authenticated User
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "questionId": "67cebe...",
    "isSaved": true,
    "message": "Question saved successfully"
  }
}
```

---

### 3.4 Unsave Question
- **Method / Path**: `DELETE /questions/:questionId/save`
- **Access**: Authenticated User
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "questionId": "67cebe...",
    "isSaved": false,
    "message": "Question removed from saved"
  }
}
```

---

### 3.5 Get All Saved Questions
- **Method / Path**: `GET /questions/saved?page=1&limit=20`
- **Access**: Authenticated User

---

## 4. User Progress Endpoints

### 4.1 Update Question Revision Status
- **Method / Path**: `POST /progress/:questionId`
- **Access**: Authenticated User
- **Request Body**:
```json
{
  "status": "weak" // "known" | "review" | "weak"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "questionId": "67cebe...",
    "status": "weak",
    "reviewCount": 3,
    "lastReviewedAt": "2026-09-08T16:00:00.000Z"
  }
}
```

---

### 4.2 Reset Question Progress
- **Method / Path**: `DELETE /progress/:questionId`
- **Access**: Authenticated User
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "message": "Progress reset successfully for this question"
  }
}
```

---

## 5. Revision Suite Endpoints

### 5.1 Revise Weak Questions
- **Method / Path**: `GET /revision/weak`
- **Access**: Authenticated User
- **Query Parameters**:
  - `technology` (optional)
  - `topic` (optional)
  - `preparationLevel` (optional)
  - `page` (default: 1)
  - `limit` (default: 20)

---

### 5.2 Quick Revision
- **Method / Path**: `GET /revision/quick`
- **Access**: Authenticated User
- **Query Parameters**:
  - `technology` (optional)
  - `preparationLevel` (optional)
  - `limit` (default: 10)
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "count": 10,
    "limit": 10,
    "questions": [ ... ]
  }
}
```

---

### 5.3 "Interview Tomorrow" Rapid Prep
- **Method / Path**: `GET /revision/interview-prep`
- **Access**: Authenticated User
- **Query Parameters**:
  - `technologies` (optional): Comma-separated or array (e.g. `react,nodejs,mongodb`)
  - `preparationLevel` (optional): slug or ID
  - `limit` (default: 20)
- **Response (200 OK)**: Returns prioritized queue (Weak → Review → Important → Unpracticed).

---

## 6. Dashboard & Search Endpoints

### 6.1 User Dashboard Analytics
- **Method / Path**: `GET /dashboard`
- **Access**: Authenticated User
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "totalQuestions": 45,
    "completedQuestions": 18,
    "savedQuestions": 6,
    "weakQuestions": 5,
    "reviewQuestions": 7,
    "overallProgressPercentage": 40,
    "technologyProgress": [
      {
        "technologyId": "67cebe...",
        "name": "React",
        "slug": "react",
        "category": "frontend",
        "icon": "",
        "totalQuestions": 12,
        "known": 6,
        "weak": 2,
        "review": 3,
        "completionPercentage": 50
      }
    ],
    "weakTopics": [
      {
        "topicId": "67cebe...",
        "topicName": "Hooks",
        "topicSlug": "hooks",
        "technologyName": "React",
        "technologySlug": "react",
        "weakCount": 2
      }
    ],
    "recentQuestions": [
      {
        "questionId": "67cebe...",
        "question": "What is the difference between useState and useRef?",
        "technology": "React",
        "topic": "Hooks",
        "status": "weak",
        "isSaved": true,
        "difficulty": "medium",
        "isImportant": true,
        "lastReviewedAt": "2026-09-08T15:00:00.000Z"
      }
    ]
  }
}
```

---

### 6.2 Full-Text Search
- **Method / Path**: `GET /search`
- **Access**: Public (Optional Auth)
- **Query Parameters**:
  - `q`: Search query string (required)
  - `technology` (optional)
  - `topic` (optional)
  - `level` (optional)
  - `page`, `limit`

---

## 7. Admin & Content Management Endpoints

All admin endpoints require `Authorization: Bearer <admin_token>`.

### 7.1 Dry-Run Import Preview
Validates all questions, resolves taxonomy, and detects duplicates without writing to MongoDB.
- **Method / Path**: `POST /admin/questions/import/preview`
- **Access**: Admin
- **Request Body**:
```json
{
  "questions": [
    {
      "technology": "React",
      "topic": "Hooks",
      "preparationLevels": ["Intermediate"],
      "difficulty": "medium",
      "questionType": "Conceptual",
      "question": "What is useMemo in React?",
      "answer": "useMemo memoizes calculation results.",
      "source": "ai-generated",
      "status": "published"
    }
  ]
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "total": 1,
    "valid": 1,
    "duplicates": 0,
    "errors": 0,
    "newTechnologies": [],
    "newTopics": [],
    "errorDetails": [],
    "questions": [
      {
        "index": 0,
        "technology": "React",
        "topic": "Hooks",
        "question": "What is useMemo in React?",
        "difficulty": "medium",
        "questionType": "Conceptual",
        "isImportant": false,
        "status": "published",
        "source": "ai-generated",
        "hasCodeExamples": false,
        "hasComparisons": false,
        "hasSteps": false
      }
    ]
  }
}
```

---

### 7.2 Bulk Question Import
Imports valid questions and skips duplicates. Individual errors are returned without breaking the entire batch.
- **Method / Path**: `POST /admin/questions/import`
- **Access**: Admin
- **Request Body**: Array of canonical questions (see [CANONICAL_QUESTION_FORMAT.md](./CANONICAL_QUESTION_FORMAT.md)).
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "inserted": 25,
    "skipped": 2,
    "errors": [
      {
        "index": 4,
        "field": "answer",
        "message": "Answer is required",
        "question": "Question without answer"
      }
    ]
  }
}
```

---

### 7.3 Admin Question Review & Listing
Allows admins to list and filter all questions in the bank, including draft and archived content.
- **Method / Path**: `GET /admin/questions`
- **Access**: Admin
- **Query Parameters**:
  - `status`: `"draft"` | `"published"` | `"archived"` | `"all"` (default: `"all"`)
  - `technology`: slug or ObjectId
  - `topic`: slug or ObjectId
  - `level`: slug or ObjectId
  - `difficulty`: `"easy"` | `"medium"` | `"hard"`
  - `questionType`: string
  - `source`: `"ai-generated"` | `"curated"` | `"web-research"` | `"manually-added"` | `"imported"`
  - `page`, `limit`

---

### 7.4 Content Statistics
Generates comprehensive question distribution analytics.
- **Method / Path**: `GET /admin/content/stats`
- **Access**: Admin
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "totalQuestions": 500,
    "published": 420,
    "draft": 65,
    "archived": 15,
    "byTechnology": [
      {
        "technologyId": "...",
        "name": "React",
        "slug": "react",
        "category": "frontend",
        "total": 60,
        "published": 50,
        "draft": 8,
        "archived": 2
      }
    ],
    "byPreparationLevel": [
      {
        "levelId": "...",
        "name": "Intermediate",
        "slug": "intermediate",
        "order": 3,
        "count": 210
      }
    ],
    "byDifficulty": [
      { "difficulty": "medium", "count": 280 },
      { "difficulty": "hard", "count": 130 },
      { "difficulty": "easy", "count": 90 }
    ],
    "bySource": [
      { "source": "ai-generated", "count": 275 },
      { "source": "curated", "count": 125 },
      { "source": "web-research", "count": 100 }
    ],
    "byQuestionType": [
      { "questionType": "Conceptual", "count": 200 },
      { "questionType": "Practical", "count": 150 },
      { "questionType": "Comparison", "count": 70 },
      { "questionType": "Architecture", "count": 80 }
    ]
  }
}
```

---

### 7.5 Content Gap Analysis
Maps content across Technology → Topic → Preparation Level to spotlight underrepresented levels.
- **Method / Path**: `GET /admin/content/gaps`
- **Access**: Admin
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "totalTechnologies": 21,
    "totalTopics": 16,
    "preparationLevels": ["foundation", "junior", "intermediate", "advanced", "expert"],
    "technologies": [
      {
        "technologyId": "...",
        "technology": "React",
        "slug": "react",
        "category": "frontend",
        "topicsCount": 4,
        "topics": [
          {
            "topicId": "...",
            "topic": "Hooks",
            "slug": "hooks",
            "totalQuestions": 36,
            "byLevel": {
              "foundation": 12,
              "junior": 15,
              "intermediate": 8,
              "advanced": 1,
              "expert": 0
            },
            "gaps": ["advanced", "expert"]
          }
        ]
      }
    ]
  }
}
```

---

### 7.6 Administrative Question Lifecycle
- **Publish Question**: `PATCH /admin/questions/:id/publish`
- **Archive Question**: `PATCH /admin/questions/:id/archive`
- **Update Question**: `PUT /admin/questions/:id`
- **Delete Question**: `DELETE /admin/questions/:id`

---

### 7.7 Taxonomy Management
- **Create Technology**: `POST /admin/technologies`
- **Update Technology**: `PUT /admin/technologies/:id`
- **Delete Technology**: `DELETE /admin/technologies/:id`
- **Create Topic**: `POST /admin/topics`
- **Update Topic**: `PUT /admin/topics/:id`
- **Delete Topic**: `DELETE /admin/topics/:id`
- **Create Preparation Level**: `POST /admin/preparation-levels`
- **Update Preparation Level**: `PUT /admin/preparation-levels/:id`

---

## 8. Interview Exam Mode Endpoints (`/exams`)

The Exam Mode enables candidates to test real technical interview readiness through timed simulations with 25 curated MCQs, scoring, and comprehensive explanations.

### 8.1 Get Available Exam Subjects
- **Method / Path**: `GET /exams/subjects`
- **Access**: Public
- **Description**: Returns all active technologies with their count of available MCQs, indicating if they meet the minimum threshold of 25 questions to be unlocked (`isAvailable: true`).
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "technologyId": "65f1a2b3c4d5e6f7a8b9c0d1",
      "slug": "react",
      "name": "React",
      "availableQuestions": 25,
      "requiredQuestions": 25,
      "isAvailable": true
    },
    {
      "technologyId": "65f1a2b3c4d5e6f7a8b9c0d2",
      "slug": "typescript",
      "name": "TypeScript",
      "availableQuestions": 0,
      "requiredQuestions": 25,
      "isAvailable": false
    }
  ]
}
```

---

### 8.2 Generate Subject Exam
- **Method / Path**: `GET /exams/subject/:slug`
- **Access**: Public
- **Description**: Generates a 25-question MCQ exam strictly focused on the requested subject slug (e.g. `react`, `nodejs`, `express`, `mongodb`, `javascript`). Option choices (A, B, C, D) are randomized while strictly preserving correct answer mapping.
- **Query Parameters**:
  - `mode` (`practice` | `exam`, default: `exam`):
    - `exam`: **Anti-cheat enabled**. Omits `correctOption` and `explanation` from questions payload until official submission.
    - `practice`: Includes `correctOption` and `explanation` for real-time candidate feedback.
  - `difficulty` (`easy` | `medium` | `hard` | `mixed`, default: `mixed`):
    - `easy` / `medium` / `hard`: Filters questions by selected difficulty level. If a technology has fewer than 25 questions at the requested difficulty, gracefully fills remaining slots from available published questions without duplicates.
    - `mixed`: Creates a balanced interview distribution (~8 Easy, 9 Medium, 8 Hard).
- **Response (200 OK — Exam Mode Sample)**:
```json
{
  "success": true,
  "data": {
    "isAvailable": true,
    "examType": "subject",
    "mode": "exam",
    "difficulty": "hard",
    "technologyId": "65f1a2b3c4d5e6f7a8b9c0d1",
    "technologySlug": "react",
    "technologyName": "React",
    "title": "React Interview Test",
    "totalQuestions": 25,
    "questions": [
      {
        "_id": "67cd1234abcd...",
        "questionIndex": 1,
        "question": "What is the primary reason why React component render functions should remain pure?",
        "title": "Why render functions should be pure",
        "difficulty": "hard",
        "questionType": "Conceptual",
        "technologyId": "65f1a2b3c4d5e6f7a8b9c0d1",
        "technologySlug": "react",
        "technologyName": "React",
        "options": [
          { "id": "A", "text": "It guarantees that JSX can be parsed by Babel at compile time" },
          { "id": "B", "text": "It enables React to safely pause, abort, or re-run renders in Concurrent Mode without unpredictable side effects" },
          { "id": "C", "text": "Pure functions prevent child components from ever re-rendering" },
          { "id": "D", "text": "It forces state mutations to happen synchronously before the browser paints" }
        ]
      }
    ]
  }
}
```

---

### 8.3 Generate Full Stack & All-Subjects Exam
- **Method / Path**: `GET /exams/mern`
- **Access**: Public
- **Description**: Generates a 25-question comprehensive assessment distributed across all 10 technologies (HTML, CSS, JavaScript, TypeScript, React, Node.js, Express.js, MongoDB, SQL, Git). Questions are mixed in randomized order.
- **Query Parameters**:
  - `mode` (`practice` | `exam`, default: `exam`): Practice mode includes `correctOption` and `explanation`; Exam mode omits them for security.
  - `difficulty` (`easy` | `medium` | `hard` | `mixed`, default: `mixed`): Filters MCQs by target difficulty across all subjects with balanced representation and graceful fallback.
- **Response (200 OK — Practice Mode Sample)**:
```json
{
  "success": true,
  "data": {
    "isAvailable": true,
    "examType": "mern",
    "mode": "practice",
    "difficulty": "mixed",
    "title": "Full Stack & All-Subjects Test",
    "technologies": ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Node.js", "Express.js", "MongoDB", "SQL", "Git"],
    "totalQuestions": 25,
    "questions": [
      {
        "_id": "67cd5678efab...",
        "questionIndex": 1,
        "question": "What is the difference between app.use('/api', fn) and app.all('/api', fn)?",
        "technologyName": "Express.js",
        "technologySlug": "express",
        "difficulty": "medium",
        "options": [
          { "id": "A", "text": "app.use matches path prefixes and sub-paths, while app.all matches the exact route path for all HTTP verbs" },
          { "id": "B", "text": "app.all runs asynchronously in a web worker thread" },
          { "id": "C", "text": "app.use only handles GET requests" },
          { "id": "D", "text": "app.use executes after routes while app.all executes before" }
        ],
        "correctOption": "A",
        "explanation": "app.use matches any path starting with /api (prefix matching), whereas app.all matches only the exact path /api across all HTTP verbs."
      }
    ]
  }
}
```

---

### 8.4 Submit / Record Exam Attempt
- **Method / Path**: `POST /exams/attempts`
- **Access**: Public (Optional JWT Authentication; supports guest attempts)
- **Description**: Server-authoritative scoring. Evaluates candidate answers against database questions, calculates score and percentage, records attempt, and returns complete review items (with correct answers and explanations).
- **Request Body**:
```json
{
  "examType": "mern",
  "mode": "exam",
  "difficulty": "hard",
  "technologySlug": null,
  "technologyName": "Full Stack & All-Subjects",
  "examTitle": "Full Stack & All-Subjects Test",
  "totalQuestions": 25,
  "answers": [
    {
      "questionId": "67cd1234abcd...",
      "selectedOption": "A"
    }
  ]
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "attemptId": "67cd9876feed...",
    "mode": "exam",
    "difficulty": "hard",
    "score": 21,
    "totalQuestions": 25,
    "percentage": 84,
    "performanceCategory": "Excellent",
    "saved": true,
    "analysis": {
      "overall": {
        "totalQuestions": 25,
        "correct": 21,
        "incorrect": 4,
        "unanswered": 0,
        "percentage": 84,
        "performanceCategory": "Excellent"
      },
      "difficulty": [
        { "difficulty": "easy", "correct": 8, "total": 8, "percentage": 100 },
        { "difficulty": "medium", "correct": 8, "total": 9, "percentage": 89 },
        { "difficulty": "hard", "correct": 5, "total": 8, "percentage": 63 }
      ],
      "technologies": [
        { "technologyName": "React", "technologySlug": "react", "correct": 3, "total": 3, "percentage": 100 },
        { "technologyName": "Node.js", "technologySlug": "nodejs", "correct": 2, "total": 3, "percentage": 67 }
      ],
      "weakTopics": [
        {
          "topicName": "Event Loop",
          "technologyName": "Node.js",
          "technologySlug": "nodejs",
          "correct": 1,
          "total": 3,
          "incorrect": 2,
          "accuracy": 33
        }
      ],
      "recommendation": {
        "type": "review_weak",
        "message": "Review your weak areas before taking another test.",
        "buttonText": "Review Weak Areas"
      }
    },
    "reviewItems": [
      {
        "questionId": "67cd1234abcd...",
        "questionText": "What is the difference between app.use('/api', fn) and app.all('/api', fn)?",
        "technologyName": "Express.js",
        "selectedOption": "A",
        "correctOption": "A",
        "isCorrect": true,
        "explanation": "app.use matches path prefixes..."
      }
    ]
  }
}
```

---

### 8.5 Get User Exam Attempts
- **Method / Path**: `GET /exams/attempts`
- **Access**: Protected (`Authorization: Bearer <token>`)
- **Query Parameters**:
  - `limit` (number, default: 20)
  - `page` (number, default: 1)
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "attempts": [
      {
        "_id": "67cd9876feed...",
        "examType": "mern",
        "mode": "exam",
        "difficulty": "hard",
        "examTitle": "Full Stack & All-Subjects Test",
        "score": 21,
        "totalQuestions": 25,
        "percentage": 84,
        "performanceCategory": "Excellent",
        "createdAt": "2026-09-11T16:15:22.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1
    }
  }
}
```


