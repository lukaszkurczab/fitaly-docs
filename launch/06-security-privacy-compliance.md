# 06 — Security, Privacy i Compliance

Status: required launch gate

## Cel

Udowodnić, że Fitaly chroni konto, dane żywieniowe, zdjęcia, treść AI, płatności
i dane operacyjne oraz że użytkownik może wyeksportować i usunąć swoje dane.

## 1. Auth i authorization

- user A nie czyta ani nie modyfikuje danych user B;
- brak IDOR przez meal/thread/export/delete identifiers;
- wszystkie chronione endpointy wymagają ważnego Firebase tokenu;
- expired/revoked/malformed token daje przewidywalny reject;
- logout i account switch czyszczą lokalne dane oraz cache poprzedniego usera;
- E2E seed/deep links są fail-closed poza `E2E=true`.

## 2. Firestore i Storage

- aktualne rules emulator tests;
- cross-user negative tests;
- zakaz publicznego list/read/write;
- zdjęcia i eksporty mają właściwy owner scope;
- delete obejmuje Storage oraz Firestore;
- indexes i queries nie wymagają osłabienia reguł.

## 3. Mobile local security

- tokeny i wrażliwe credentials wyłącznie w bezpiecznym storage;
- brak sekretów providerów w bundle;
- debug logs nie zawierają tokenów, promptów, receiptów ani danych profilu;
- account switch/reinstall/restore nie odsłania danych innego konta;
- screenshot/share/export nie dołącza niezamierzonych danych.

## 4. API i abuse controls

- Pydantic/schema validation dla rozmiaru, typu i enumów;
- rate/credit/cost enforcement dla AI;
- bounded uploads i typy plików;
- przewidywalne provider timeout/retry/error mapping;
- webhook secret verification;
- brak stack trace i raw provider response w odpowiedzi klienta;
- `X-Request-ID` umożliwia korelację bez ujawniania PII.

## 5. AI privacy

- mobile nie komunikuje się bezpośrednio z OpenAI;
- privacy policy opisuje transfer i cel przetwarzania;
- evidence nie zawiera promptów, odpowiedzi ani zdjęć użytkownika;
- telemetry nie zapisuje meal names, ingredients free text, chat content,
  allergies/chronic conditions ani obrazów;
- prompt injection nie może uzyskać sekretów, danych innych użytkowników lub
  obejść authorization.

## 6. Telemetry, logs i Sentry

- allowlist eventów i bounded props;
- PII/content redaction przed wysłaniem;
- brak email, auth token, raw request/response, receipt, provider payload;
- production DSN/environment poprawne;
- sample event/crash widoczny w Sentry i zredagowany;
- telemetry disabled state jest jawny i nie fallbackuje.

## 7. Export i delete

- export jest kompletny, paginated i ma manifest/counts;
- brak silent truncation;
- delete jest idempotentny;
- delete obejmuje konto, posiłki, chat, zdjęcia, telemetry wymagające usunięcia,
  preferences oraz istniejące dane 1.1;
- partial failure jest obserwowalny i możliwy do retry/reconcile;
- username/reservation oraz entitlement state mają jawne zachowanie;
- po delete nie można zalogować się do pozostawionego profilu.

## 8. Legal i store disclosures

- publiczne HTTPS Terms i Privacy URLs;
- deklaracje App Store/Play odpowiadają realnemu zbieraniu danych;
- opis account deletion jest prawdziwy;
- permissions mają cel i poprawne copy;
- support/contact i privacy incident process są gotowe.

## Tooling

Wymagane są repo-native testy. Dodatkowe dependency/secret scanning można dodać,
ale brak skonfigurowanego narzędzia nie może zostać oznaczony jako pass.

Dla każdego obszaru użyj
[security check record](./templates/security-check-record.md).

## Acceptance

- zero nierozwiązanych P0/P1 security/privacy;
- testy pozytywne i negatywne są powtarzalne;
- evidence jest zredagowane;
- delete/export przeszły runtime;
- release owner zatwierdził store/legal disclosures.
