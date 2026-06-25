# Stack Technologiczny

Stan potwierdzony 2026-06-12 z manifestow, README i skryptow repozytoriow.

## Mobile (`fitaly/`)

Zrodlo: `fitaly/package.json`.

- Expo SDK 55 (`expo ~55.0.23`)
- React Native 0.83.6
- React 19.2.0
- TypeScript 5.9.3
- Firebase mobile SDK (`@react-native-firebase/app`, `auth`)
- Expo SQLite
- RevenueCat (`react-native-purchases`)
- Sentry React Native
- i18next / react-i18next
- Jest, Testing Library React Native, ESLint
- Maestro E2E przez skrypty `scripts/e2e/run-suite.mjs`

## Backend (`fitaly-backend/`)

Zrodla: `fitaly-backend/README.md`, `fitaly-backend/requirements.txt`, `fitaly-backend/package.json`.

- Python 3.11+
- FastAPI 0.133.1, Starlette 1.0.1
- Uvicorn 0.44.0 + Gunicorn 23.0.0
- Firestore Python client 2.26.0 i Firebase Admin SDK 6.9.0
- OpenAI SDK 1.109.1
- Pydantic Settings 2.13.1 + python-dotenv 1.2.2
- Sentry SDK 2.57.0
- pytest 9.0.3, pytest-asyncio 1.3.0, pytest-cov 6.3.0, HTTPX 0.28.1
- Ruff 0.15.10
- Pyright 1.1.397
- pip-audit
- Node.js >=22 local tooling for Firebase emulator/evidence scripts
- firebase-tools 15.19.0 via `fitaly-backend/package.json`

## Runtime I Integracje

- Mobile komunikuje sie z backendem przez `EXPO_PUBLIC_API_BASE_URL` i `EXPO_PUBLIC_API_VERSION`.
- Mobile nadal ma domyslny publiczny prefix v1, ale wybrane powierzchnie uzywaja jawnych sciezek v2 (`/api/v2/...`), m.in. AI Chat, telemetry, NutritionState, Smart Reminders i weekly reports.
- OpenAI API key zyje tylko na backendzie.
- RevenueCat dziala na mobile jako purchase/restore SDK, a backend potwierdza access/credits.
- Sentry i telemetry maja osobne ustawienia dla smoke/prod.
- Firebase config files i sekrety nie sa dokumentowane wartosciami w repo.

## Aktualizacja

Przy zmianie wersji zaleznosci aktualizuj ten plik z manifestow, nie z pamieci ani starszych README.
