# 00 — Release Scope

Status: frozen for Launch 1.0
Owner: release owner

## Launch objective

Wydać stabilny core Fitaly: spokojne, szybkie i kontrolowalne logowanie jedzenia
z działającym kontem, historią, statystykami, AI, premium i operacyjną możliwością
wykrycia oraz odwrócenia problemu.

## In scope

### Account i onboarding

- register/login/logout/reset i session restore;
- onboarding oraz wymagany profil żywieniowy;
- account settings;
- data export i account deletion.

### Core meal loop

- wejścia Add Meal rzeczywiście obecne w produkcie;
- photo/text/manual/barcode zgodnie z aktualnym repo behavior;
- Review, edit, save i cancel;
- local-first zapis oraz jawny pending/failed/retry;
- History, Meal Details i Statistics;
- offline/degraded behavior bez data loss.

### AI

- Add Meal photo/text analysis;
- AI Chat v2, jeżeli pozostaje launchowym surface'em;
- credits, limits, provider error mapping i cost controls;
- brak mobile provider secrets.

### Retention i premium

- aktywne launchowe reminders/notifications;
- weekly reports tylko jeśli ich premium boundary i runtime przejdą gate;
- paywall, purchase, restore i entitlement;
- Share tylko w zakresie istniejącego launchowego flow.

### Operations

- telemetry i Sentry z privacy-safe payloadem;
- production/smoke backend health, version i flow contracts;
- backup/restore;
- EAS/store artifacts;
- rollback i monitoring Day0-Day7.

## Out of scope do czasu launchu

- Food Library production autocomplete;
- Smart Memory capture/apply/Memory Center jako aktywna produkcyjna funkcja;
- Known Patterns;
- Recipe Catalog;
- Planned Meals / Planning;
- Home Next Action;
- Review Memory Explanation;
- Meal Companion, Week Plan i szerszy Continuity System.

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
