# Kierunek Rozwoju Aplikacji

Status: aktywny dokument orientacyjny
Data aktualizacji: 2026-06-19

Ten dokument jest krotkim wejsciem dla czlowieka i asystenta AI. Mowi, co
chronimy przed release, jak traktowac zamkniety etap Smart Memory i gdzie
szukac aktualnych guardraili.

Nie zastepuje:

- [stack technologiczny](./stack.md),
- [decyzje techniczne](./architecture/decisions.md),
- [frontend architecture](./architecture/frontend.md),
- [backend architecture](./architecture/backend.md),
- [UI direction](./design/ui-direction.md),
- [E2E/testing runbook](./runbooks/e2e-testing.md),
- [Runtime config](./runbooks/runtime-config.md),
- [Smart Memory implementation closure](./planning/smart-memory-core-release-acceptance-packet.md).

## Obecny Cel Produktowy

Fitaly nadal jest traktowane jako pre-launch / release-hardening. Domyslny cel
prac to stabilizacja core loopu, zaufanie, aktywacja, premium clarity i release
safety.

Smart Memory implementation pass `00-09` jest zamkniety. Kolejne prace wokol
Smart Memory powinny byc traktowane jako bugfixy, hardening albo nowe male
iteracje z wlasnymi acceptance criteria, nie jako kontynuacja starych planow.

## Core Loop Do Ochrony

Najwazniejszy runtime:

1. Auth/session/user bootstrap.
2. Onboarding/profile/preferences.
3. Add Meal photo/text/manual/review.
4. Local-first save/edit/delete.
5. Home/Today, History i Statistics spojne z lokalnym read modelem.
6. AI surfaces z jawnym consent, credits i backend-owned provider access.
7. Premium/paywall/restore bez niejasnego access state.
8. Reminders, weekly reports, coach i telemetry jako jawne backend-owned albo
   runtime-config-owned surfaces.
9. Export/delete/account trust paths.
10. Smart Memory surfaces: Review memory, Memory Center, recipe catalog, known
    pattern confirmation, light planning handoff, and Home Next Action.

Zmiana, ktora dotyka tych obszarow, nie jest "tylko UI" bez sprawdzenia
kontraktow, state ownership i weryfikacji.

## Guardraile Rozwoju

- No silent save: recipes, planned meals, known patterns i Home actions zawsze
  przechodza przez minimalny Review albo confirm step przed utworzeniem
  logged meal.
- Barcode nie jest top-level Add Meal path. Ma byc product/ingredient utility
  w Review/Edit Meal.
- Wspolna baza produktow i skladnikow jest osobna domena. Nie rozszerzaj
  logged `Meal` o pola przepisu, produktu, katalogu albo listy zakupow.
- Recipe filtering, onboarding-derived filters, known pattern matching i Home
  Next Action musza pozostac deterministyczne. Runtime AI nie moze decydowac o
  eligibility, dietary compliance ani durable catalog truth.
- Unknown flags maja dawac unknown/reveal states, nie "safe" copy ani ciche
  wykluczenie.
- `chronicDiseases`, `allergiesOther` free text i lifestyle nie moga sterowac
  eligibility.
- Smart Memory musi pozostac widoczne, edytowalne, wyciszalne, usuwalne i
  mozliwe do wylaczenia.
- Correction / Portion Memory pozostaje core/free, bo poprawia jakosc
  podstawowego produktu.
- Nie dodawaj nowych kolekcji albo query shapes bez Firestore index inventory,
  testu albo emulator evidence i decyzji, czy path jest release-critical.
- Nie dodawaj hidden fallbackow do legacy endpointow, starych read modeli albo
  backend refetchu jako naprawy local UI consistency.

## Kierunek Stylistyczny W Pracy Produktowej

Kierunek UI pozostaje premium-lite, calm, supportive i lekko Mediterranean.
Produkt ma wygladac spokojnie i pewnie, nie jak generyczny dashboard fitness.

Praktyczne zasady:

- Olive jest primary CTA. Terracotta wspiera AI, insight i celebracje, ale nie
  przejmuje roli primary action.
- Data-heavy screens sa bardziej neutralne niz onboarding i empty states.
- Dlugie polskie etykiety musza miescic sie w UI bez ucinania.
- Copy jest spokojne, konkretne i nieoceniajace.
- Settings, billing, privacy, export/delete i hard errors pozostaja neutralne
  i odpowiedzialne, nawet jesli AI persona ma bardziej ekspresyjny styl.

Kanoniczny dokument: [UI direction](./design/ui-direction.md).

## Jak Pracowac Nad Nowa Zmiana

1. Zacznij od `docs/README.md`, tego pliku i
   [decyzji technicznych](./architecture/decisions.md).
2. Potwierdz aktualny stan w repo: manifesty, route/service files, tests,
   fixtures, runtime config i scripts.
3. Ustal ownership: mobile feature, mobile global layer, backend route/service,
   backend domain/db layer, persistence boundary.
4. Zdefiniuj acceptance criteria dla poprawki albo malej iteracji.
5. Wybierz najmniejsza zmiane, ktora wzmacnia core loop albo release safety bez
   wprowadzania martwej kompatybilnosci.
6. Dobierz weryfikacje proporcjonalnie do ryzyka: docs-only nie wymaga E2E,
   critical flow wymaga targeted testow albo Maestro wedlug runbooka.

## Stop Conditions

Zatrzymaj sie i przeplanuj, jesli:

- dokumentacja i repo evidence konfliktuja,
- brakuje decyzji potrzebnej do napisania testu e2e,
- zmiana wymaga produkcyjnych danych, sekretow albo provider-cost smoke poza
  bounded runbookiem,
- ownership miedzy mobile/backend jest niejasny,
- proponowana zmiana utrwala legacy path zamiast usuwac ambiguity,
- praca rozszerza roadmap scope przed release acceptance bez wyraznego powodu.
