# 05 — UI/UX Screen Audit

Status: required launch gate

## Cel

Ocenić nie tylko poprawność funkcjonalną, ale też gotowość produktu do publicznego
wydania: czytelność, spójność, jakość wizualną, copy, accessibility i emotional
fit marki.

## Jednostka audytu

Jednostką jest `surface + state + platform + locale`, nie ogólna nazwa ekranu.

Przykład:

```text
Review Meal / AI result ready / iOS / PL
Review Meal / provider error / Android / EN
```

## Kryteria

Każdy rekord ma ocenę:

- Functional readiness;
- Visual readiness;
- Information hierarchy;
- Copy i localization;
- Accessibility i touch targets;
- Keyboard/safe-area/platform behavior;
- Empty/loading/error/offline clarity;
- Brand fit: calm, supportive, non-judgmental;
- Release risk.

Użyj [template rekordu](./templates/screen-audit-record.md).

## Severity

### P0

- blokada flow, crash, data loss, niebezpieczna lub myląca akcja;
- nieczytelny purchase/delete/export consent;
- cross-platform layout uniemożliwiający działanie;
- privacy/security leak;
- ekran niegotowy do publicznego użycia.

### P1

- poważna niespójność, niejasna hierarchia, broken localization;
- CTA trudne do znalezienia lub dotknięcia;
- brak sensownego error/retry;
- mockowy/roboczy wygląd obniżający trust;
- istotny brand mismatch.

### P2

- polish po release bez wpływu na poprawność i zaufanie.

P0 i release-blocking P1 muszą być naprawione.

## Obowiązkowe przekroje

- iOS i Android;
- PL i EN;
- mały i reprezentatywny większy viewport, jeśli runner to wspiera;
- keyboard open/closed dla formularzy;
- permission granted/denied;
- online/offline;
- free/premium;
- nowe konto i konto z historią;
- wspierane systemowe ustawienia font size/contrast, o ile aplikacja je deklaruje.

## Repair loop

1. Zapisz finding z konkretnym screenshotem.
2. Wskaż root cause i acceptance criteria.
3. Napraw produkcyjny UI, nie tylko fixture/test.
4. Uruchom targeted unit/E2E.
5. Zrób nowy screenshot na obu platformach, jeśli finding jest cross-platform.
6. Independent re-review.
7. Zamknij finding dopiero po zaakceptowanym artifact.

## Finalny output

- tabela wszystkich ekranów i stanów;
- accepted screenshot set;
- zero P0;
- jawna lista waived P1 z ownerem i powodem;
- lista P2 po release;
- werdykt `visual_gate=passed|failed`.
