# Developer Interview Preparation & Revision Platform (Mobile Frontend)

A modern, high-performance React Native & Expo mobile application for mastering technical developer interviews. Built with rich aesthetics, full dark/light theme support, self-healing network discovery, and integrated with a live cloud backend.

---

## 🚀 Live Backend Integration

The mobile application is pre-configured to communicate with the live production backend deployed on Render:

- **Live Backend API**: `https://interview-preparation-app-w3l5.onrender.com/api`
- **Backend GitHub Repo**: [karan865/Interview-Preparation-App](https://github.com/karan865/Interview-Preparation-App)

---

## ✨ Features

- **Rich Question Library**: Over 3,275+ verified questions across 10 essential technologies:
  - Frontend: **JavaScript**, **TypeScript**, **React**, **HTML**, **CSS**
  - Backend: **Node.js**, **Express.js**
  - Database: **MongoDB**, **SQL**
  - DevOps & Tools: **Git**
- **Structured Preparation Levels**: Junior, Intermediate, and Advanced paths.
- **Daily Challenge Engine**: Daily rotating learning & test MCQs with custom streak tracking and passing criteria.
- **Exam & Assessment Mode**: Timed mock interviews with instant scoring, comprehensive review, and answer explanations.
- **Progress Tracking & Bookmarks**: Categorize questions into *Known*, *Needs Review*, and *Weak* areas with offline `AsyncStorage` persistence.
- **Self-Healing Network Client**: Resilient multi-tier endpoint probing with automatic cloud spin-up tolerance (20s timeout) and local fallback.
- **Dark & Light Mode**: Curated theme tokens with high-contrast UI elements.

---

## 🛠 Tech Stack

- **Framework**: [React Native 0.86](https://reactnative.dev/) with [Expo SDK 57](https://expo.dev/)
- **Language**: TypeScript 5.9+
- **Navigation**: React Navigation v7 (Native Stack & Bottom Tabs)
- **State Management**: Redux Toolkit & React-Redux
- **Local Persistence**: `@react-native-async-storage/async-storage` & `expo-secure-store`
- **Styling**: Vanilla React Native StyleSheet with custom design tokens

---

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/karan865/Interview-Preparation-App-frontend.git
   cd Interview-Preparation-App-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *`.env` contents:*
   ```env
   EXPO_PUBLIC_API_URL=https://interview-preparation-app-w3l5.onrender.com/api
   VITE_API_URL=https://interview-preparation-app-w3l5.onrender.com/api
   ```

---

## 📱 Running the App

Start the Metro bundler:
```bash
npm start
```

Target specific platforms:
```bash
# Run on Android emulator / physical USB device
npm run android

# Run in Web browser
npm run web

# Run on iOS simulator (macOS required)
npm run ios
```

---

## 📁 Project Architecture

```text
mobile/
├── assets/                 # App icons, splash screens, and favicon
├── docs/                   # Full system design and integration specs
├── src/
│   ├── api/                # API client with health-check fallback
│   ├── components/         # Reusable UI components
│   ├── constants/          # Theme tokens, configs, branding
│   ├── context/            # ThemeContext & global providers
│   ├── hooks/              # Custom hooks (useAuth, useProgress)
│   ├── navigation/         # Navigators and route typing
│   ├── screens/            # App screens (Home, Browse, Exam, Daily, etc.)
│   ├── store/              # Redux slices (auth, exam, progress, daily)
│   ├── types/              # Comprehensive TypeScript interfaces
│   └── utils/              # Storage, cache manager, error handling
├── App.tsx                 # Root entry component
└── package.json            # Project dependencies & scripts
```

---

## 📄 Documentation

Check the [`docs/`](./docs) folder for in-depth architecture and API guides:
- [`API_DOCUMENTATION.md`](./docs/API_DOCUMENTATION.md)
- [`FRONTEND_INTEGRATION_GUIDE.md`](./docs/FRONTEND_INTEGRATION_GUIDE.md)
- [`BACKEND_ARCHITECTURE.md`](./docs/BACKEND_ARCHITECTURE.md)
- [`CANONICAL_QUESTION_FORMAT.md`](./docs/CANONICAL_QUESTION_FORMAT.md)
