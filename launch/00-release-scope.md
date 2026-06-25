# 00 — Release Scope

Status: frozen for Launch 1.0
Owner: release owner
Last reconciled with repo evidence: 2026-06-25

## Launch objective

Wydać stabilny core Fitaly: spokojne, szybkie i kontrolowalne logowanie jedzenia
z działającym kontem, historią, statystykami, AI, premium i operacyjną możliwością
wykrycia oraz odwrócenia problemu.

## Jawna macierz scope

| Surface | Launch 1.0 | Zakres akceptacji |
| --- | --- | --- |
| Register/login/logout/reset/session restore | IN | Auth, bootstrap, błędy, izolacja użytkownika |
| Onboarding i profil żywieniowy | IN | Completion, persistence, ponowne wejście |
| Settings, export i account deletion | IN | Kompletność, idempotencja, privacy |
| Add Meal manual | IN | Review, edit, save, cancel |
| Add Meal text AI | IN | Provider wiring, credits, błędy, Review/save |
| Add Meal photo AI | IN | Permission, provider wiring, credits, Review/save |
| Barcode | IN | Aktualnie wystawiony flow, not-found i manual fallback |
| Saved meal/template path | IN | Odczyt, Review, save |
| Local-first save/sync | IN | Pending, failed, retry, brak data loss |
| Home, History, Meal Details, Statistics | IN | Spójny local read model i edit/delete propagation |
| AI Chat v2 | IN | Consent, thread/history, credits, provider failure |
| Notifications i Smart Reminders | IN | Preferences, permission, disabled/degraded behavior |
| Weekly Reports | IN | Premium boundary, entry/open/unavailable state, kill switch |
| Premium/paywall/purchase/restore | IN | Realny sandbox na iOS i Androidzie, entitlement consistency |
| Share Composer | IN | Istniejący saved-meal-with-photo flow, Quick/Customize, save/share, błędy |
| Telemetry i Sentry | IN | Privacy-safe payload, environment, observability |
| Backend health/version/flow contracts | IN | Deployed SHA i smoke runtime |
| Backup/restore, rollback, store artifacts | IN | Operacyjna gotowość release |
| Food Library production autocomplete | OUT | Production-off do osobnej decyzji po launchu |
| Smart Memory capture/apply/Memory Center | OUT | Production-off do osobnej decyzji po launchu |
| Known Patterns | OUT | Production-off |
| Recipe Catalog | OUT | Production-off |
| Planned Meals / Planning | OUT | Production-off |
| Home Next Action | OUT | Production-off |
| Review Memory Explanation | OUT | Production-off |
| Meal Companion, Week Plan, szerszy Continuity System | OUT | Po launchu |

## Core meal loop

Launchowy meal loop obejmuje:

1. wybór istniejącej metody Add Meal;
2. zebranie danych lub wynik AI;
3. jawny Review;
4. możliwość korekty;
5. zapis lokal-first;
6. propagację do Home, History, Details i Statistics;
7. przewidywalny pending/failed/retry;
8. brak silent save i brak data loss.

## AI contract

- Add Meal photo/text i AI Chat v2 są częścią Launch 1.0.
- Provider secrets pozostają wyłącznie na backendzie.
- Credits, limits, structured provider errors i cost controls są wymagane.
- Bounded real-provider smoke jest wymagany dla wiring, ale nie ocenia
  semantycznej jakości pojedynczej odpowiedzi żywieniowej.
- Kill switch musi zwracać jawny disabled/degraded state bez legacy fallbacku.

## Retention i premium contract

- Smart Reminders, notifications i Weekly Reports są częścią Launch 1.0.
- Weekly Reports wymagają prawidłowego premium denial/success lub jawnego
  unavailable state zgodnego z kontraktem.
- Purchase i restore muszą być sprawdzone realnie w sandboxie na obu platformach.
- Free core meal logging nie może być przypadkowo zablokowany paywallem.

## Share contract

Launch obejmuje istniejący Share Composer dla zapisanego posiłku ze zdjęciem:
Quick/Customize, save to gallery, system share i bezpieczne error states.
Nie rozszerzamy przed launch bibliotek efektów, integracji per social platform ani
nowych rodzin edytora.

## Policy dla kodu out-of-scope

Kod może pozostać w branchach tylko jeśli:

- production flags są `false`;
- route/service/UI failują jawnie i przewidywalnie;
- mobile nie wykonuje requestów ani background work;
- entrypointy są ukryte lub pokazują jawny disabled state;
- export/delete obejmuje dane, które mogły powstać w testach lub wcześniejszych
  buildach;
- obecność kodu nie komplikuje core release bez uzasadnienia.

## Change control

Każda propozycja dodania funkcji do scope wymaga:

1. jawnej decyzji ownera;
2. opisu wartości launchowej;
3. wskazania nowych P0 gate'ów;
4. potwierdzenia obu platform;
5. aktualizacji tego dokumentu przed implementacją.

Domyślna odpowiedź na scope expansion brzmi: po launchu.
