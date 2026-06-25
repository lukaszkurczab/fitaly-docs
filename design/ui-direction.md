# Kierunek Stylistyczny UI I Brand

Ten dokument jest skondensowanym, roboczym zapisem kierunku marki i UI na podstawie repo oraz zewnetrznego SoT `Fitaly_Brand_Marketing_Direction_SoT_v1_rozszerzone_v2.docx`.

## Cel Odczucia

Fitaly ma dawac poczucie pewnosci i spokoju samym swoim wygladem.

Nie celem jest "estetyczna dashboard-like stylistyka z jasnymi mediterran akcentami". Dane maja byc czytelne, ale produkt nie ma wygladac jak ladny dashboard. Celem jest dopracowany premium-lite projekt: spokojny, ludzki, lekko mediterranean w odczuciu, z ktorego od razu widac jakosc, kontrolowany rytm i brak presji.

## Fundament Marki

Fitaly to prostszy i spokojniejszy sposob na dbanie o jedzenie: szybki, wspierajacy i oparty na AI, ktore pomaga trzymac sie celu bez stresu.

Core brand traits:

- friendly, not childish
- calm, not pressuring
- smart, not clinical
- supportive, not moralizing
- light, not shallow
- non-judgmental, not indulgently cute

Italy jest subtelna warstwa ciepla, nie kostiumem. Brand nie ma wygladac jak aplikacja o Wloszech, tylko jak spokojniejszy, cieplejszy i bardziej ludzki sposob trackowania jedzenia.

## Kierunek Bazowy

Approved blend:

- 80% Soft Mediterranean Minimalism
- 20% Clean Nutrition Tech
- Warm Food Companion tylko jako zrodlo detali emocjonalnych

Interpretacja:

- Mediterranean daje cieplo, naturalne materialy, swiatlo, spokój i premium-lite.
- Clean Nutrition Tech daje strukture, czytelnosc danych i wiarygodnosc narzedzia.
- Warm Food Companion daje real food, codziennosc i przyjazna emocje, ale nie przejmuje systemu.

## Antydecyzje

Nie robimy:

- fitness-green brandingu,
- stereotypowego Italy: pizza, ciao, mamma mia, pocztowkowa Italia,
- zimnego laboratoryjnego health-tech,
- enterprise dashboard clutter,
- sci-fi AI aesthetic, futurystycznych glow i neonow,
- pastelowej infantylnosci, cute mascot tone, baby UI,
- glassmorphismu, neumorfizmu, blobowej dekoracyjnosci,
- presji, shame-based coachingu, before/after transformation imagery.

## Zasady Wizualne

- Warm neutrals sa baza. Olive jest primary. Terracotta jest cieplem drugiego rzedu.
- Jedna powierzchnia ma jeden glowny akcent. Nie zestawiamy wielu rownorzednych kolorow akcyjnych.
- Data-heavy surfaces sa czystsze i bardziej neutralne niz onboarding, empty states i AI.
- Terracotta nie przejmuje roli primary CTA. Primary CTA pozostaje olive.
- Empty, loading, offline, error, premium-gated i conflict states maja wygladac jak zaprojektowane stany produktu.
- Dlugie polskie etykiety, zwlaszcza `Weglowodany`, nie moga sie ucinac ani kolidowac z UI.
- Jesli trzeba wybierac miedzy "bardziej designersko" a "bardziej spojnie", wygrywa spojnosc.

## Kolor

Bazowe role:

| Rola | HEX | Uzycie |
| --- | --- | --- |
| Background / Cream 50 | `#F7F2EA` | domyslne cieple tlo produktu |
| Surface / Cream 0 | `#FFFDF8` | karty, sheets, modale, najczystsze powierzchnie |
| Surface Alt / Sand 100 | `#EFE7DA` | grupowanie, empty states, supportive fills |
| Border / Sand 300 | `#CFC5B8` | dividers, inactive outline |
| Primary / Olive 500 | `#4F684B` | glowne CTA, active states |
| Primary Soft / Olive 400 | `#6F8A69` | selected chips, soft fills, stat accents |
| Warm Accent / Terracotta 500 | `#C77E61` | AI, celebracja, supportive emphasis |
| Warm Strong / Terracotta 700 | `#8E5A45` | mocniejszy warm text/emphasis |
| Text Primary / Ink 900 | `#2F312B` | glowne copy |
| Text Secondary / Ink 700 | `#575B52` | meta, helper, secondary labels |

Przyblizona proporcja standardowego ekranu:

- 70-80% warm neutral background/surfaces
- 10-15% tekst i linie
- 5-10% olive
- 2-5% terracotta

## Dane, Makro I Wykresy

Wykresy w Fitaly nie moga wygladac jak losowy dashboard. Paleta makro ma byc stabilna miedzy Today, History, Statistics, share templates i weekly reports.

- Protein: blue `#4A90E2`, soft `#DCEBFB`
- Carbs: green `#66A96B`, soft `#E4F1E2`
- Fat: warm gold `#C9A227`, soft `#F5EBC2`
- Calories: calm olive `#5E7350`, soft `#E7ECE2`

Nie uzywamy pelnej terracotty jako stalego koloru makro. Terracotta oznacza insight, AI, streak albo celebracje.

## Typografia

Launch UI powinien uzywac podejscia monofamily: Inter jako baseline produkcyjny. Drugi font moze byc testowany tylko w marketing hero, jezeli wzmacnia marke bez obnizenia spojnosci.

Zasady:

- Priorytetem sa czytelnosc, rytm i jakosc cyfr.
- Naglowki sa spokojne i mocne, nie editorialowe.
- Dane liczbowe powinny byc bardzo latwe do zeskanowania.
- Sentence case domyslnie. ALL CAPS tylko dla krotkich overline/mikrolabeli.
- W jednym ekranie produktowym maksymalnie 4 realne poziomy typograficzne.
- CTA uzywaja label tokens, nigdy body copy.

Robocze role:

- H1: 24 / 30-32 / Bold
- H2: 20 / 26-28 / SemiBold
- H3/Title: 18 / 24 / SemiBold
- Body L: 16 / 24 / Regular
- Body M: 15 / 22 / Regular
- Label L: 14 / 18 / Medium
- Caption/Label S: 12 / 16
- Numeric XL: 28 / 32 / Bold

## Spacing I Radius

Spacing jest jednym z glownych nosnikow premium-lite i spokoju. Fitaly nie powinno wygladac gesto ani jak "wcisniete w ekran".

- Skala bazowa: 4 pt, z glownymi krokami 8, 12, 16, 20, 24, 32.
- Core screens: zewnetrzny padding 20-24, mniej tylko przy obrazie/kamerze.
- Standard cards: 16-20 internal padding.
- Hero/empty cards: 20-24 internal padding.
- Sekcja do sekcji: zwykle 24, dla ciezszych blokow 32.
- Gdy ekran wyglada ciasno, najpierw uprosc strukture i hierarchie, dopiero potem zmniejsz spacing.

Radius launchowy:

- 16: controls, inputs, chips, primary/secondary buttons
- 20: standard cards, list cards, stat cards
- 24: bottom sheets, larger cards, image containers, paywall sections
- 28: tylko wybrane hero/prominent surfaces

Zaokraglenia maja byc miekkie, ale nie soft-cute.

## Ksztalty, Ikony, Fotografia, Ilustracja

- Rounded minimalism, nie soft-cute.
- Ikony liniowe/outline o rownej grubosci stroke.
- Bardzo malo cieni; brak glassmorphismu, neumorfizmu i ciezkiej dekoracyjnosci.
- Food photography: realne jedzenie, naturalne swiatlo, top albo lekki kat.
- Posiłki maja wygladac normalnie i apetycznie, nie jak kara dietetyczna, stock perfection, reklama suplementow ani gym-bro meal prep.
- Ilustracja jest warstwa wspierajaca: onboarding, empty states, lekkie tla. Produkt ma byc prowadzony przez UI i jedzenie, nie przez ilustracyjny styl marki.

## Mapowanie Ekranow

- Onboarding: najcieplejszy punkt systemu, ale bez przeslodzenia.
- Home / Today: calm premium-lite, duzy top KPI, prosta sekcja makro, wyrazna akcja; dane czytelniejsze niz brandowy ornament.
- Add Meal: klarownosc i szybka akcja ponad emocjonalnosc.
- Camera / AI analysis: ciemniejszy neutral wokol obrazu; brand schodzi na drugi plan wobec zdjecia.
- Review Meal: funkcja + cieplo; AI suggestions jako pomoc, nie magia.
- Statistics: najblizej Clean Nutrition Tech, ale nadal nie enterprise dashboard.
- AI Chat: warm neutral surfaces + terracotta jako znak AI; osobowosc wysoka, ale nie infantylna.
- Settings/legal/billing: prawie neutralne, klarowne, malo persony.
- Paywall: bez zlota i luksusowych tropow; primary CTA olive.

## Tone Of Voice I AI Persony

Tone of voice ma upraszczac, uspokajac, prowadzic i nie osadzac.

Zakazane:

- agresywna motywacja typu no excuses,
- fit-przemoc i moralizowanie jedzenia,
- "cheat meal", "bad food", "you failed",
- przeslodzony bestie/yummy/oopsie ton,
- memiczna wloskosc,
- pseudo-medyczny ton tam, gdzie produkt ma po prostu pomoc wykonac zadanie.

AI persona moduluje ekspresje, nie filozofie produktu. Brand core pozostaje staly. Najwieksza modulacja jest w AI chat; settings, legal, billing, privacy, payments, errors i health-sensitive messaging pozostaja neutralne i odpowiedzialne.

## Marketing

Marketing jest product-first.

- Produkt jest bohaterem; lifestyle i jedzenie wspieraja, nie przykrywaja.
- Jeden screen = jedna korzysc.
- UI mockup ma pozostac czytelny.
- Copy ma byc benefit-led, krotkie, bez hype'u.
- Komunikacja akcentuje mniejsze tarcie i spokojniejsza relacje z jedzeniem.
- AI jest komunikowane jako pomoc i inteligentne wsparcie, nie futurystyczna technologia dla samej technologii.

## Artefakty Wizualne

`fitaly/` nie ma obecnie first-party katalogu `docs/` z sample designs ani final screens. Nie traktuj dawnych mobilnych docs sciezek dla sample/final screens jako aktywnego zrodla.

Aktualne visual evidence potwierdzaj z repo przed uzyciem, przede wszystkim z `fitaly/e2e/artifacts/**`, screenshotow wygenerowanych przez aktywny task albo plikow wskazanych w biezacym watku. Nie przepisuj artefaktow wizualnych do narracyjnej dokumentacji bez wyraznego celu.

## Share Composer

Share Composer pozostaje featurem dla zapisanego posilku ze zdjeciem. Tryby Quick/Customize, export i error states powinny byc rozwijane zgodnie z istniejacym modulem `fitaly/src/feature/Meals/shareComposer/*` oraz osobnymi post-release follow-ups.

## Release / Post-Release Copy Context

Przed release acceptance nadal obowiazuje spokojny, konkretny jezyk ekranow.
Po release acceptance kolejne prace moga rozszerzac kontrolowane warianty copy
zalezne od stylu asystenta wybranego w onboardingu. Strategiczny kierunek jest
w [Post Release Intelligence](../Fitaly_Post_Release_Intelligence.md), ale nowe
zmiany nadal musza startowac od aktualnego repo evidence.
