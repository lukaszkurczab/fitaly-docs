# Kierunek stylistyczny UI i brand

Ten dokument jest skondensowanym, roboczym zapisem kierunku marki i UI na
podstawie repo oraz zewnętrznego Brand & Marketing Direction SoT.

## Cel odczucia

Fitaly ma dawać poczucie pewności i spokoju samym swoim wyglądem.

Celem nie jest „estetyczna dashboard-like stylistyka z jasnymi mediterranean
akcentami”. Dane mają być czytelne, ale produkt nie ma wyglądać jak ładny
dashboard. Celem jest dopracowany premium-lite projekt: spokojny, ludzki, lekko
mediterranean w odczuciu, z którego od razu widać jakość, kontrolowany rytm i
brak presji.

## Fundament marki

Fitaly to prostszy i spokojniejszy sposób na dbanie o jedzenie: szybki,
wspierający i oparty na AI, które pomaga trzymać się celu bez stresu.

Core brand traits:

- friendly, not childish;
- calm, not pressuring;
- smart, not clinical;
- supportive, not moralizing;
- light, not shallow;
- non-judgmental, not indulgently cute.

Italy jest subtelną warstwą ciepła, nie kostiumem. Brand nie ma wyglądać jak
aplikacja o Włoszech, tylko jak spokojniejszy, cieplejszy i bardziej ludzki
sposób trackowania jedzenia.

## Kierunek bazowy

Approved blend:

- 80% Soft Mediterranean Minimalism;
- 20% Clean Nutrition Tech;
- Warm Food Companion tylko jako źródło detali emocjonalnych.

Interpretacja:

- Mediterranean daje ciepło, naturalne materiały, światło, spokój i premium-lite;
- Clean Nutrition Tech daje strukturę, czytelność danych i wiarygodność narzędzia;
- Warm Food Companion daje real food, codzienność i przyjazną emocję, ale nie
  przejmuje systemu.

## Antydecyzje

Nie robimy:

- fitness-green brandingu;
- stereotypowego Italy: pizza, ciao, mamma mia, pocztówkowa Italia;
- zimnego laboratoryjnego health-tech;
- enterprise dashboard clutter;
- sci-fi AI aesthetic, futurystycznych glow i neonów;
- pastelowej infantylności, cute mascot tone, baby UI;
- glassmorphismu, neumorfizmu, blobowej dekoracyjności;
- presji, shame-based coachingu, before/after transformation imagery.

## Zasady wizualne

- Warm neutrals są bazą. Olive jest primary. Terracotta jest ciepłem drugiego
  rzędu.
- Jedna powierzchnia ma jeden główny akcent. Nie zestawiamy wielu równorzędnych
  kolorów akcyjnych.
- Data-heavy surfaces są czystsze i bardziej neutralne niż onboarding, empty
  states i AI.
- Terracotta nie przejmuje roli primary CTA. Primary CTA pozostaje olive.
- Empty, loading, offline, error, premium-gated i conflict states mają wyglądać
  jak zaprojektowane stany produktu.
- Długie polskie etykiety, zwłaszcza `Węglowodany`, nie mogą się ucinać ani
  kolidować z UI.
- Jeśli trzeba wybierać między „bardziej designersko” a „bardziej spójnie”,
  wygrywa spójność.

## Kolor

Bazowe role:

| Rola | HEX | Użycie |
| --- | --- | --- |
| Background / Cream 50 | `#F7F2EA` | domyślne ciepłe tło produktu |
| Surface / Cream 0 | `#FFFDF8` | karty, sheets, modale, najczystsze powierzchnie |
| Surface Alt / Sand 100 | `#EFE7DA` | grupowanie, empty states, supportive fills |
| Border / Sand 300 | `#CFC5B8` | dividers, inactive outline |
| Primary / Olive 500 | `#4F684B` | główne CTA, active states |
| Primary Soft / Olive 400 | `#6F8A69` | selected chips, soft fills, stat accents |
| Warm Accent / Terracotta 500 | `#C77E61` | AI, celebracja, supportive emphasis |
| Warm Strong / Terracotta 700 | `#8E5A45` | mocniejszy warm text/emphasis |
| Text Primary / Ink 900 | `#2F312B` | główne copy |
| Text Secondary / Ink 700 | `#575B52` | meta, helper, secondary labels |

Przybliżona proporcja standardowego ekranu:

- 70–80% warm neutral background/surfaces;
- 10–15% tekst i linie;
- 5–10% olive;
- 2–5% terracotta.

## Dane, makro i wykresy

Wykresy w Fitaly nie mogą wyglądać jak losowy dashboard. Paleta makro ma być
stabilna między Today, History, Statistics, share templates i Weekly Reports.

- Protein: blue `#4A90E2`, soft `#DCEBFB`;
- Carbs: green `#66A96B`, soft `#E4F1E2`;
- Fat: warm gold `#C9A227`, soft `#F5EBC2`;
- Calories: calm olive `#5E7350`, soft `#E7ECE2`.

Nie używamy pełnej terracotty jako stałego koloru makro. Terracotta oznacza
insight, AI, streak albo celebrację.

## Typografia

Launch UI powinien używać podejścia monofamily: Inter jako baseline produkcyjny.
Drugi font może być testowany tylko w marketing hero, jeżeli wzmacnia markę bez
obniżenia spójności.

Zasady:

- priorytetem są czytelność, rytm i jakość cyfr;
- nagłówki są spokojne i mocne, nie editorialowe;
- dane liczbowe powinny być bardzo łatwe do zeskanowania;
- sentence case domyślnie; ALL CAPS tylko dla krótkich overline/mikrolabeli;
- w jednym ekranie produktowym maksymalnie cztery realne poziomy typograficzne;
- CTA używają label tokens, nigdy body copy.

Robocze role:

- H1: 24 / 30–32 / Bold;
- H2: 20 / 26–28 / SemiBold;
- H3/Title: 18 / 24 / SemiBold;
- Body L: 16 / 24 / Regular;
- Body M: 15 / 22 / Regular;
- Label L: 14 / 18 / Medium;
- Caption/Label S: 12 / 16;
- Numeric XL: 28 / 32 / Bold.

## Spacing i radius

Spacing jest jednym z głównych nośników premium-lite i spokoju. Fitaly nie
powinno wyglądać gęsto ani jak „wciśnięte w ekran”.

- Skala bazowa: 4 pt, z głównymi krokami 8, 12, 16, 20, 24, 32.
- Core screens: zewnętrzny padding 20–24, mniej tylko przy obrazie/kamerze.
- Standard cards: 16–20 internal padding.
- Hero/empty cards: 20–24 internal padding.
- Sekcja do sekcji: zwykle 24, dla cięższych bloków 32.
- Gdy ekran wygląda ciasno, najpierw uprość strukturę i hierarchię, dopiero potem
  zmniejsz spacing.

Radius launchowy:

- 16: controls, inputs, chips, primary/secondary buttons;
- 20: standard cards, list cards, stat cards;
- 24: bottom sheets, larger cards, image containers, paywall sections;
- 28: tylko wybrane hero/prominent surfaces.

Zaokrąglenia mają być miękkie, ale nie soft-cute.

## Kształty, ikony, fotografia, ilustracja

- Rounded minimalism, nie soft-cute.
- Ikony liniowe/outline o równej grubości stroke.
- Bardzo mało cieni; brak glassmorphismu, neumorfizmu i ciężkiej dekoracyjności.
- Food photography: realne jedzenie, naturalne światło, top albo lekki kąt.
- Posiłki mają wyglądać normalnie i apetycznie, nie jak kara dietetyczna, stock
  perfection, reklama suplementów ani gym-bro meal prep.
- Ilustracja jest warstwą wspierającą: onboarding, empty states, lekkie tła.
  Produkt ma być prowadzony przez UI i jedzenie, nie przez ilustracyjny styl
  marki.

## Mapowanie ekranów

- Onboarding: najcieplejszy punkt systemu, ale bez przesłodzenia.
- Home / Today: calm premium-lite, duży top KPI, prosta sekcja makro, wyraźna
  akcja; dane czytelniejsze niż brandowy ornament.
- Add Meal: klarowność i szybka akcja ponad emocjonalność.
- Camera / AI analysis: ciemniejszy neutral wokół obrazu; brand schodzi na drugi
  plan wobec zdjęcia.
- Review Meal: funkcja + ciepło; AI suggestions jako pomoc, nie magia.
- Statistics: najbliżej Clean Nutrition Tech, ale nadal nie enterprise dashboard.
- AI Chat: warm neutral surfaces + terracotta jako znak AI; osobowość wysoka, ale
  nie infantylna.
- Settings/legal/billing: prawie neutralne, klarowne, mało persony.
- Paywall: bez złota i luksusowych tropów; primary CTA olive.

## Tone of voice i AI persony

Tone of voice ma upraszczać, uspokajać, prowadzić i nie osądzać.

Zakazane:

- agresywna motywacja typu no excuses;
- fit-przemoc i moralizowanie jedzenia;
- „cheat meal”, „bad food”, „you failed”;
- przesłodzony bestie/yummy/oopsie ton;
- memiczna włoskość;
- pseudo-medyczny ton tam, gdzie produkt ma po prostu pomóc wykonać zadanie.

AI persona moduluje ekspresję, nie filozofię produktu. Brand core pozostaje
stały. Największa modulacja jest w AI Chat; settings, legal, billing, privacy,
payments, errors i health-sensitive messaging pozostają neutralne i
odpowiedzialne.

## Marketing

Marketing jest product-first.

- Produkt jest bohaterem; lifestyle i jedzenie wspierają, nie przykrywają.
- Jeden screen = jedna korzyść.
- UI mockup ma pozostać czytelny.
- Copy ma być benefit-led, krótkie, bez hype'u.
- Komunikacja akcentuje mniejsze tarcie i spokojniejszą relację z jedzeniem.
- AI jest komunikowane jako pomoc i inteligentne wsparcie, nie futurystyczna
  technologia dla samej technologii.

## Artefakty wizualne

`fitaly/` nie ma first-party katalogu `docs/` z sample designs ani final screens.
Nie traktuj dawnych mobilnych ścieżek docs dla sample/final screens jako
aktywnego źródła.

Aktualne visual evidence potwierdzaj z repo, przede wszystkim z
`fitaly/e2e/artifacts/**`, screenshotów wygenerowanych przez aktywny task albo
plików wskazanych w bieżącym wątku. Nie przepisuj artefaktów wizualnych do
narracyjnej dokumentacji bez wyraźnego celu.

Kanoniczny proces akceptacji ekranów opisują:

- [Biblioteka artefaktów Maestro](../launch/04-maestro-artifact-library.md);
- [UI/UX Screen Audit](../launch/05-ui-ux-screen-audit.md).

## Share Composer

Share Composer pozostaje launchowym feature'em dla zapisanego posiłku ze
zdjęciem. Tryby Quick/Customize, export i error states powinny być rozwijane
zgodnie z istniejącym modułem `fitaly/src/feature/Meals/shareComposer/*` i
zamrożonym [release scope](../launch/00-release-scope.md). Przed launch nie
rozszerzamy go o nowe rodziny efektów lub integracje per platforma social.

## Release / post-release copy context

Przed release acceptance obowiązuje spokojny, konkretny język ekranów.
Po release acceptance kolejne prace mogą rozszerzać kontrolowane warianty copy
zależne od stylu asystenta wybranego w onboardingu, ale rozwój 1.1 pozostaje
zawieszony zgodnie z [notą zawieszenia](../archive/2026-06-1-1-suspended.md).
Każda wznowiona zmiana musi zaczynać się od aktualnego repo evidence i nowego,
małego planu z własnymi gate'ami.
