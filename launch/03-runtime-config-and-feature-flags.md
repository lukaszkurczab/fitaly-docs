# 03 — Runtime Config i Feature Flags

Status: launch contract

## Zasada

Production i smoke mają jawne, launch-like ustawienia. Brak wartości nie może
być interpretowany jako bezpieczny default, jeśli powierzchnia jest krytyczna.

## Mobile production expectations

W `fitaly/eas.json` potwierdź co najmniej:

| Ustawienie | Oczekiwanie |
| --- | --- |
| `EXPO_PUBLIC_API_BASE_URL` | production backend HTTPS |
| `EXPO_PUBLIC_API_VERSION` | zgodne z aktualnym mobile contract |
| `EXPO_PUBLIC_ENABLE_TELEMETRY` | `true` |
| `EXPO_PUBLIC_ENABLE_SMART_REMINDERS` | `true` tylko jeśli launch gate passed |
| `DISABLE_BILLING` | `false` |
| Sentry env/org/project | production values; DSN przez secret/env |
| RevenueCat iOS/Android keys | ustawione przez bezpieczny env/secret |

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
```

Następujące ustawienia zależą od finalnego launch scope i muszą być jawne:

```text
STATE_ENABLED=true|false
HABITS_ENABLED=true|false
SMART_REMINDERS_ENABLED=true|false
WEEKLY_REPORTS_ENABLED=true|false
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

## AI i billing

- `AI_MEAL_ANALYSIS_ENABLED=false` ma zatrzymać provider/credits work i zwrócić
  jawny disabled error.
- `AI_GATEWAY_ENABLED=false` nie jest kill switchem Add Meal AI; nie używaj go
  jako takiego.
- Missing OpenAI/Firebase/RevenueCat/Sentry production secrets muszą failować
  launch-readiness albo startup tam, gdzie wymagane.
- Billing nie może być cicho wyłączony w production build.

## Verification

```bash
cd fitaly
npm run check:runtime-config
npm run check:launch-readiness:android
npm run check:launch-readiness:ios
```

Dodatkowo wykonaj runtime test disabled behavior:

- UI entrypoint;
- direct navigation/deep link;
- API request suppression;
- background sync/task suppression;
- backend route response;
- brak legacy fallbacku;
- brak telemetry sugerującej użycie wyłączonej funkcji.

## Drift policy

Zmiana config po zbudowaniu RC unieważnia odpowiednie runtime evidence. Zapisz
hash/wersję configu w finalnym release artifact.
