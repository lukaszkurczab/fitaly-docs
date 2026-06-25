# 03 — Runtime Config i Feature Flags

Status: launch contract
Last reconciled: 2026-06-25

## Zasada

Production i smoke mają jawne, launch-like ustawienia. Brak wartości nie może
być interpretowany jako bezpieczny default, jeśli powierzchnia jest krytyczna.
Scope 1.0 jest zamrożony, dlatego aktywne flagi nie są już opisane jako
warunkowe.

## Mobile production expectations

W `fitaly/eas.json` potwierdź co najmniej:

| Ustawienie | Oczekiwanie |
| --- | --- |
| `EXPO_PUBLIC_API_BASE_URL` | `https://fitaly-backend-production.up.railway.app` |
| `EXPO_PUBLIC_API_VERSION` | `v1`, przy jawnych ścieżkach v2 używanych przez ich clients |
| `EXPO_PUBLIC_ENABLE_BACKEND_LOGGING` | `false` |
| `EXPO_PUBLIC_ENABLE_TELEMETRY` | `true` |
| `EXPO_PUBLIC_ENABLE_SMART_REMINDERS` | `true` |
| `DISABLE_BILLING` | `false` |
| Sentry env/org/project | production values; DSN przez secret/env |
| RevenueCat iOS/Android keys | ustawione przez bezpieczny env/secret |
| Terms i Privacy URLs | publiczne, nie-placeholderowe HTTPS |

Production-off 1.1:

```text
EXPO_PUBLIC_ENABLE_FOOD_LIBRARY=false
EXPO_PUBLIC_ENABLE_SMART_MEMORY=false
EXPO_PUBLIC_ENABLE_KNOWN_PATTERNS=false
EXPO_PUBLIC_ENABLE_RECIPE_CATALOG=false
EXPO_PUBLIC_ENABLE_PLANNING=false
EXPO_PUBLIC_ENABLE_HOME_NEXT_ACTION=false
EXPO_PUBLIC_ENABLE_REVIEW_MEMORY_EXPLANATION=false
```

## Backend production expectations

Launch-critical:

```text
ENVIRONMENT=production
TELEMETRY_ENABLED=true
AI_CHAT_ENABLED=true
AI_MEAL_ANALYSIS_ENABLED=true
AI_GATEWAY_ENABLED=true
STATE_ENABLED=true
HABITS_ENABLED=true
SMART_REMINDERS_ENABLED=true
WEEKLY_REPORTS_ENABLED=true
```

Production-off 1.1:

```text
FOOD_LIBRARY_ENABLED=false
SMART_MEMORY_ENABLED=false
SMART_MEMORY_CAPTURE_ENABLED=false
SMART_MEMORY_APPLY_ENABLED=false
KNOWN_PATTERNS_ENABLED=false
RECIPE_CATALOG_ENABLED=false
RECIPE_CATALOG_CONTENT_APPROVED=false
PLANNED_MEALS_ENABLED=false
```

## Smoke expectations

Smoke ma zachowywać się jak launch-like runtime:

- telemetry, AI, Smart Reminders, Weekly Reports i billing są aktywne;
- używa smoke backendu, smoke Firebase/Firestore i sandbox/ograniczonych provider
  credentials;
- wszystkie domeny 1.1 pozostają wyłączone, chyba że osobny nie-release test
  jawnie nadpisuje flagę;
- taki override nie może być przedstawiany jako core release evidence.

## AI

- `AI_MEAL_ANALYSIS_ENABLED=false` ma zatrzymać provider/credits work i zwrócić
  jawny disabled error.
- `AI_CHAT_ENABLED=false` ma wyłączyć Chat bez mobile/provider fallbacku.
- `AI_GATEWAY_ENABLED=false` nie jest kill switchem Add Meal AI; nie używaj go
  jako takiego.
- Missing OpenAI/Firebase/Sentry production secrets muszą failować
  launch-readiness albo startup tam, gdzie są wymagane.
- Bounded provider smoke jest obowiązkowy dla release, ponieważ Add Meal AI i AI
  Chat pozostają w scope.

## Billing

- Billing nie może być cicho wyłączony w production build.
- RevenueCat keys, offerings, products i entitlement `premium` muszą odpowiadać
  właściwym aplikacjom i środowisku.
- Unit/Maestro provider-fake nie zastępuje realnego sandbox purchase/restore na
  iOS i Androidzie.
- Brak dostępu do sandboxu należy oznaczyć jako blocker, nie jako passed.

## Verification

```bash
cd fitaly
npm run check:runtime-config
npm run check:launch-readiness:android
npm run check:launch-readiness:ios
```

Dodatkowo wykonaj runtime test disabled behavior dla każdej domeny 1.1:

- UI entrypoint;
- direct navigation/deep link;
- API request suppression;
- background sync/task suppression;
- backend route response;
- brak legacy fallbacku;
- brak telemetry sugerującej użycie wyłączonej funkcji.

## Evidence

Finalny release artifact zapisuje:

- profil mobile;
- niesekretne wartości krytycznych flag;
- backend environment/deployment id;
- hash lub wersję konfiguracji;
- FE SHA i BE SHA;
- timestamp pobrania configu.

Nie zapisuj sekretów ani pełnych environment dumpów.

## Drift policy

Zmiana config po zbudowaniu RC unieważnia odpowiednie runtime evidence. Dotyczy
to zwłaszcza API URL, AI, billing, telemetry, reminders, weekly reports, Sentry
i wszystkich flag 1.1.
