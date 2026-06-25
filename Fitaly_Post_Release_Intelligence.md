# FITALY
## Post-release product intelligence roadmap
### Smart Memory, Meal Companion, Week Plan i domknięcia tarć

**Status:** verified working roadmap / strategic product spec
**Wersja:** v0.2
**Data:** 2026-06-12
**Zakres:** post-release / pierwsze większe iteracje po launchu 1.0
**Rola dokumentu:** zapisać kierunek wyróżnienia Fitaly po launchu oraz przełożyć go na roadmapę, architekturę danych, UX, metryki i kolejność egzekucji.

---

## Nota wykonawcza 2026-06-19

Ten dokument pozostaje strategia nadrzedna, nie aktywnym planem wykonawczym.
Smart Memory implementation pass `00-09` zostal zamkniety, a historyczne plany
i handoffy usunieto z dokumentacji. Krotki status zamkniecia jest w
[`planning/smart-memory-core-release-acceptance-packet.md`](./planning/smart-memory-core-release-acceptance-packet.md).

W razie konfliktu miedzy roadmapa a repo evidence, aktualny kod, testy,
kontrakty i runbooki wygrywaja. Nowe prace powinny byc traktowane jako bugfixy,
hardening albo nowe male iteracje z wlasnymi acceptance criteria.

## 0. Decyzja do zapamiętania

Do roadmapy Fitaly należy dodać kierunek roboczo nazwany:

> **Fitaly Continuity System**
> czyli system, który pomaga użytkownikowi ogarniać jedzenie przed posiłkiem, w trakcie dnia i po fakcie — bez perfect trackingu.

Publicznie lub marketingowo ten kierunek może zostać nazwany później **Fitaly Rhythm**. Inne nazwy, takie jak Smart Food Rhythm, Your Food Rhythm albo Week Flow, zostają na razie poza główną narracją. Wewnętrznie najbezpieczniejsza nazwa to **Continuity System**, bo trafnie opisuje istotę: nie chodzi o jedną funkcję, tylko o spójność między pamięcią, planowaniem, logowaniem i domykaniem dnia.

Ten kierunek składa się z czterech filarów:

1. **Smart Memory** — Fitaly pamięta powtarzalne posiłki, porcje, korekty, rytm dnia, preferencje, plan-vs-actual i tarcia użytkownika.
2. **Friction Closures** — good-enough review, catch-up, close day, planned-to-confirm, change-of-plan, smart reminders i recovery states amortyzują niedoskonały tracking.
3. **Planned Meals / Week Plan** — użytkownik może lekko zaplanować kilka najbliższych decyzji żywieniowych i później zamienić plan w szybki log przez **Lightweight Review / Confirm Sheet**.
4. **Meal Companion** — Fitaly prowadzi użytkownika przez dzień przez deterministyczne next-best-actions, a nie przez chat jako główną powierzchnię.

Najważniejsza decyzja produktowa:

> **Smart Memory musi zostać rozbudowane przed pełnym Meal Companion i pełnym Week Plan.**
> Bez mocniejszej warstwy danych i pamięci Meal Companion będzie generycznym surface’em z podpowiedziami, a Week Plan będzie zwykłym plannerem. Z pamięcią stają się wyróżnikiem Fitaly.

### 0.1 Decyzje zamknięte w v0.2

| Obszar | Decyzja |
|---|---|
| Plan-to-confirm / usual log | Nie ma silent save. Każdy zapis z planu albo usual meal przechodzi przez minimalny **Lightweight Review / Confirm Sheet**. |
| Kolejność roadmapy | Po Smart Memory i Friction Closures wchodzi **Planned Meals Lite**, potem Meal Companion Foundation, potem szerszy Week Plan / Grocery. |
| Smart Memory consent | Smart Memory jest domyślnie włączone z pełną możliwością wyłączenia, edycji i usunięcia pamięci w Settings. |
| Correction Memory | Podstawowa Correction / Portion Memory jest częścią jakości core produktu i powinna być dostępna w free. Premium może rozszerzać głębokość i użycie cross-surface. |
| Meal Companion v1 | v1 działa bez AI: deterministic rules engine, ranking, obiekty domenowe i jasne fallbacki. AI może wejść później tylko jako cienka warstwa wzbogacająca. |
| Barcode | Barcode nie jest domyślną formą dodawania całego posiłku. Barcode zostaje przeniesiony do **dodawania produktu/składnika** w Review / Edit Meal / Ingredient Add. |

### 0.2 Konsekwencja dla Add Meal

W tym dokumencie barcode traktujemy jako **ingredient-level input**, nie jako równorzędne wejście Add Meal obok photo/text/saved/planned. To wymaga późniejszej aktualizacji Add Meal spec, bo dotychczasowa launchowa architektura Add Meal v2.2 nadal opisuje barcode jako osobną ścieżkę dodania posiłku.

Nowy model:

- Add Meal tworzy posiłek przez photo, text, saved/usual, planned albo catch-up.
- Barcode dodaje lub doprecyzowuje pojedynczy produkt/składnik w istniejącym lub tworzonym posiłku.
- Barcode lookup success prowadzi do dodania itemu do Review/Edit Meal, nie do osobnego „barcode meal”.
- Brak barcode matcha jest recovery dla produktu/składnika, nie dla całego posiłku.

## 1. Executive summary

Dotychczasowy kierunek Fitaly jest właściwy: nie budować kolejnego trackera kalorii z AI jako gadżetem, tylko spokojniejszy system ogarniania jedzenia. Problemem jest to, że dotychczasowe dane zbierane przez aplikację mogą wystarczać do launchowej analityki i podstawowej personalizacji, ale nie wystarczą do pełnego Smart Memory, Meal Companion i Week Plan.

To rozróżnienie jest krytyczne:

- **Telemetry** odpowiada na pytanie: „co się wydarzyło w produkcie i czy flow działa?”.
- **Smart Memory** odpowiada na pytanie: „co Fitaly wie o tym konkretnym użytkowniku i jak może mu teraz skrócić drogę?”.

Fitaly potrzebuje więc rozszerzenia z warstwy eventów do warstwy pamięci domenowej. Nie chodzi o zbieranie wszystkiego. Chodzi o zbieranie małej liczby sygnałów, które faktycznie zmniejszają przyszły wysiłek użytkownika.

Rekomendowana kolejność:

1. **Po launchu:** audyt danych i eventów pod Smart Memory.
2. **Najpierw:** Smart Memory Foundation — dane, modele, default-on memory, widoczna kontrola, pamięć korekt, meal routines.
3. **Potem:** Friction Closures Lite — good-enough review, close day, catch-up, quick usuals i recovery bez zawstydzania.
4. **Następnie:** Planned Meals Lite — proste planned meals, planned-to-confirm, change-of-plan; bez pełnej Recipe Base i bez pełnej grocery layer.
5. **Potem:** Meal Companion Foundation — Home jako deterministic next-best-action surface, nie chat i nie AI-first assistant.
6. **Następnie:** Week Plan Expansion — forecast, grocery v1, plan-vs-actual i templates dopiero po stabilizacji planned meals.
7. **Dopiero po tym:** duży publiczny update spinający to jako jedną nową wartość.

Rekomendacja wykonawcza:

> Budować etapami pod feature flagami, ale komunikować jako jeden większy post-release update dopiero wtedy, gdy Smart Memory ma realne dane, plan-to-confirm skraca pracę, a Home prowadzi do mierzalnych downstream actions.

Najważniejsze zabezpieczenie architektoniczne:

> **Szybkość nie może oznaczać braku kontroli.**
> Planned meals, usuals i catch-up mogą być bardzo szybkie, ale zawsze muszą mieć minimalną powierzchnię potwierdzenia: Lightweight Review / Confirm Sheet albo Bulk Catch-up Review.

## 2. Teza strategiczna

Fitaly powinno przejść z kategorii:

> „AI meal tracker”

do kategorii:

> **„Calm food continuity system”**

czyli produktu, który pomaga użytkownikowi utrzymać orientację w jedzeniu mimo chaosu dnia, niedoskonałego logowania, jedzenia poza domem, pominiętych wpisów i zmieniających się planów.

Najważniejsza obietnica:

> **Fitaly remembers what matters, helps you plan lightly, and turns food tracking into small confirmations instead of manual work.**

Wersja polska:

> **Fitaly pamięta to, co się powtarza, pomaga lekko zaplanować jedzenie i zamienia tracking w krótkie potwierdzenia oraz drobne korekty zamiast ręcznej pracy.**

To jest mocniejsze niż „robimy skan zdjęcia”, bo przesuwa przewagę z pojedynczej funkcji na system codziennej obsługi.

---

## 3. Dlaczego obecny zakres danych może być niewystarczający

### 3.1 Obecna warstwa launchowa

Obecne dokumenty Fitaly mocno akcentują activation, time-to-first-log, AI correction rate, D1/D7, ALD/AU, paywall conversion, reminder/report utility i stabilność core loopu. To jest właściwe dla launchu.

Jednak metryki launchowe nie są automatycznie pamięcią produktu. Mogą powiedzieć, że użytkownik poprawił meal review, ale niekoniecznie:

- co dokładnie poprawił,
- czy była to powtarzalna korekta,
- czy warto ją zapamiętać,
- czy użytkownik chce, żeby Fitaly używało tej wiedzy,
- czy ta korekta dotyczy porcji, składnika, marki, stylu jedzenia czy pory dnia,
- czy powinna wpłynąć na planowanie tygodnia, sugestie zakupowe albo reminder timing.

### 3.2 Różnica między analytics a memory

| Warstwa | Cel | Przykład | Ograniczenie |
|---|---|---|---|
| Analytics event | Pomiar produktu | `domain.meal.edited` | Wie, że edycja była, ale nie zawsze wie, czego się nauczyć. |
| Diagnostic metric | Ocena jakości flow | AI correction rate | Mierzy problem, ale nie skraca przyszłej pracy użytkownika. |
| Domain memory | Personalizacja działania | „Użytkownik zwykle zmienia porcję ryżu na 180 g” | Wymaga trwałego, kontrolowanego modelu pamięci. |
| User-visible memory | Zaufanie i kontrola | „Fitaly pamięta Twoją zwykłą owsiankę” | Wymaga UI do podglądu, edycji i usuwania pamięci. |

Wniosek:

> **Smart Memory nie może być tylko zbiorem eventów. Musi być osobnym produktem i osobną warstwą domenową.**

### 3.3 Jakie informacje są potrzebne, żeby spiąć cały system

Fitaly potrzebuje pamięci w sześciu obszarach:

1. **Food memory** — co użytkownik często je.
2. **Portion memory** — jakie porcje są dla niego typowe.
3. **Correction memory** — co często poprawia po AI.
4. **Rhythm memory** — kiedy zwykle je, loguje, nadrabia i planuje.
5. **Preference memory** — czego nie lubi, nie je, unika, preferuje.
6. **Plan memory** — co planował, co faktycznie zjadł i jak często zmienia plan.

Dopiero połączenie tych sześciu warstw pozwala zbudować Meal Companion i Week Plan, które nie są generyczne.

---

## 4. Produktowy system docelowy

### 4.1 Before / During / After

Fitaly powinno obsługiwać cały cykl jedzenia:

| Moment | Dzisiejszy typowy produkt | Docelowy kierunek Fitaly |
|---|---|---|
| Before | Użytkownik sam decyduje, co jeść. | Fitaly pomaga lekko zaplanować kilka decyzji i zakupy. |
| During | Użytkownik robi zdjęcie, wpisuje opis albo wraca do zaplanowanego/typowego posiłku. | Fitaly podsuwa najkrótszą ścieżkę: plan, usual meal, photo, text, saved, catch-up. Barcode działa jako dodanie produktu/składnika, nie jako główny sposób dodania posiłku. |
| After | Użytkownik patrzy na kalorie albo historię. | Fitaly pomaga domknąć dzień, nadrobić brakujące wpisy i wyciągnąć mały wniosek. |

### 4.2 Cztery filary systemu

| Filar | Rola | Główna wartość |
|---|---|---|
| Smart Memory | Pamięta powtarzalne wzorce i korekty. | Mniej wpisywania z każdym tygodniem. |
| Friction Closures | Amortyzuje niedokładność i chaos. | Mniej poczucia porażki i mniej porzuconych dni. |
| Planned Meals / Week Plan | Pozwala zaplanować kilka decyzji i później potwierdzić je szybciej niż ręczne logowanie. | Mniej decyzji w trudnych momentach tygodnia. |
| Meal Companion | Prowadzi przez dzień i wybiera next best action. | Mniej zastanawiania się, co zrobić teraz. |

### 4.3 Zasada integracyjna

Każdy filar musi korzystać z tej samej pamięci i tych samych obiektów domenowych.

Nie budować:

- osobnego planera,
- osobnego chatu,
- osobnego reminder systemu,
- osobnego saved meals systemu,
- osobnego „AI insights” systemu,
- osobnego barcode-meal flow, który tworzy dziwny „posiłek” z pojedynczego produktu.

Budować:

> **jedną warstwę user food intelligence, która zasila różne powierzchnie produktu.**

### 4.4 Zasada kontroli przed zapisem

Fitaly może skracać logowanie, ale nie powinno zapisywać posiłków po cichu.

Obowiązują trzy tryby kontroli:

| Tryb | Kiedy | Co widzi użytkownik |
|---|---|---|
| Full Review Meal | photo/text/AI estimate, niepewne posiłki, nowe posiłki | pełny ekran Review Meal z edycją składników i porcji |
| Lightweight Review / Confirm Sheet | planned meals, usual meals, znane porcje | krótki sheet: co zapisujemy, porcja mniej/podobnie/więcej, CTA „Potwierdź i zapisz” |
| Bulk Catch-up Review | nadrabianie kilku rzeczy jednym opisem | lista wykrytych pozycji, estimate labels, usunięcie/edycja największej niepewności, zapis zbiorczy |

## 5. Smart Memory — definicja i zakres

### 5.1 Definicja

**Smart Memory** to kontrolowana, użytkowo widoczna warstwa pamięci Fitaly, która zapisuje tylko te informacje o zachowaniu żywieniowym użytkownika, które mogą zmniejszyć przyszłe tarcie, poprawić trafność sugestii albo ułatwić planowanie.

Smart Memory nie jest:

- pełną historią wszystkiego,
- ukrytym profilowaniem,
- generycznym „AI remembers you”,
- magazynem nieograniczonego kontekstu dla LLM,
- czymś, czego użytkownik nie może zobaczyć lub usunąć.

Smart Memory jest:

- ograniczone domenowo,
- edytowalne,
- wyjaśnialne,
- przydatne,
- mierzalne,
- zgodne z zasadą minimalnego tarcia.

### 5.2 Poziomy pamięci

| Poziom | Nazwa | Przykład | Kto zatwierdza |
|---|---|---|---|
| L0 | Raw events | Meal saved, edit made, reminder opened | System |
| L1 | Observed pattern | 3 razy owsianka w dni robocze rano | System |
| L2 | Memory candidate | „Wygląda na Twoje typowe śniadanie” | System proponuje |
| L3 | Confirmed memory | „Moja owsianka robocza” | Użytkownik albo wysoka pewność + brak sprzeciwu |
| L4 | Active personalization | Home sugeruje owsiankę rano | System używa |
| L5 | Decayed / muted | Nie sugerować więcej | Użytkownik lub decay logic |

Najważniejsze: Fitaly nie powinno od razu zamieniać każdego wzorca w aktywną sugestię. Najpierw obserwuje, potem proponuje, potem używa.

### 5.3 Typy pamięci

#### A. Food Memory

Pamięta posiłki, produkty i kombinacje składników.

Przykłady:

- „owsianka z bananem i jogurtem”
- „latte z mlekiem owsianym”
- „kurczak + ryż + warzywa”
- „jogurt proteinowy po treningu”
- „kanapka z indykiem w pracy”

Użycie:

- quick add,
- saved meals,
- prefill Week Plan,
- Home next action,
- grocery list.

#### B. Portion Memory

Pamięta typowe porcje użytkownika.

Przykłady:

- ryż zwykle 180 g po ugotowaniu,
- kawa zwykle z 200 ml mleka,
- jajka zwykle 2 sztuki,
- oliwa w sałatce zwykle 1 łyżka,
- jogurt zwykle 150 g, nie 100 g.

Użycie:

- AI review defaults,
- korekta porcji jednym tapnięciem,
- plan forecast,
- „zjadłem mniej / podobnie / więcej”.

#### C. Correction Memory

Pamięta powtarzalne korekty użytkownika po AI.

Przykłady:

- AI często pomija oliwę w sałatkach.
- Użytkownik zmienia „kawa z mlekiem” na „latte z mlekiem owsianym”.
- Użytkownik często zwiększa porcję makaronu.
- Użytkownik usuwa sos, którego AI się domyśliło.
- Użytkownik dodaje dressing do bowlów.

Użycie:

- lepszy review,
- pytanie tylko o jedną istotną rzecz,
- prompt context,
- confidence UX,
- future default.

#### D. Rhythm Memory

Pamięta rytm dnia i tygodnia.

Przykłady:

- śniadanie najczęściej 8:00–10:00,
- lunch w pracy około 13:00,
- kolacja często po 20:00,
- użytkownik nadrabia logi wieczorem,
- niedziela wieczorem to dobry moment na planowanie,
- w weekendy użytkownik je później i mniej regularnie.

Użycie:

- smart reminders,
- Home next action,
- Close Day,
- Week Plan prompts,
- timing Meal Companion.

#### E. Preference Memory

Pamięta jawne preferencje i ograniczenia.

Przykłady:

- nie jem wieprzowiny,
- unikam laktozy,
- lubię szybkie śniadania,
- nie chcę przypomnień rano,
- wolę luźne planowanie niż dokładne przepisy,
- chcę więcej białka bez liczenia każdego składnika.

Użycie:

- Week Plan,
- grocery list,
- AI suggestions,
- reminder suppression,
- premium guidance.

#### F. Plan Memory

Pamięta relację między planem a rzeczywistością.

Przykłady:

- planowane lunche są często realizowane,
- planowane kolacje często się zmieniają,
- lista zakupów jest otwierana, ale mało odhaczana,
- użytkownik częściej realizuje plany 3-dniowe niż 7-dniowe,
- użytkownik preferuje placeholdery typu „coś z kurczakiem” nad konkretnymi przepisami.

Użycie:

- lepszy Week Plan,
- mniej ambicjonalne sugestie,
- plan-to-confirm,
- „plan się zmienił” zamiast „nie trzymasz planu”.

### 5.4 Jawne dane do zebrania w onboardingu lub ustawieniach

Nie wszystko musi wejść do pierwszego onboardingu. Część może być progressive profilingiem, czyli pytaniami zadawanymi dopiero wtedy, gdy realnie pomagają.

| Dane | Kiedy pytać | Po co |
|---|---|---|
| Cel użytkownika | onboarding | Ogólna interpretacja dnia i guidance. |
| Preferowany styl trackingu | onboarding | Czy user chce dokładności, czy „good enough”. |
| Typowy układ dnia | onboarding lub po kilku dniach | Bazowy rhythm model. |
| Liczba posiłków dziennie | onboarding | Meal slots i reminders. |
| Godziny, w których nie przypominać | onboarding / settings | Suppression i zaufanie. |
| Diet style / ograniczenia | onboarding / plan setup | Week Plan i grocery. |
| Disliked foods | plan setup | Unikanie błędnych sugestii. |
| Cooking frequency | Week Plan intro | Realistyczne planowanie. |
| Shopping day | Week Plan intro | Moment listy zakupów. |
| Household servings | Week Plan v2 | Lista zakupów i porcje. |
| Preferowany styl planu | Week Plan intro | Luźny plan vs przepisy. |
| AI support style | onboarding | Meal Companion tone. |

### 5.5 Dane zbierane w użyciu

| Sygnał | Źródło | Jak używać |
|---|---|---|
| Meal saved | Add Meal / Planned / Saved | Podstawa food memory i ALD/AU. |
| Input mode | photo/text/saved/planned/catchup/usual + ingredient barcode | Najkrótsza ścieżka dla podobnej sytuacji; barcode dotyczy składnika, nie całego posiłku. |
| Meal time | user provided / inferred from log time | Rhythm memory. |
| Review edits | S05/S06 | Correction memory i AI quality. |
| Portion change | review diff | Portion memory. |
| Ingredient added/removed | review diff | Correction memory. |
| Save latency | capture -> saved | Friction scoring. |
| Abandon after analysis | AI flow | Trust issue. |
| Reminder opened -> meal saved | reminders | Timing usefulness. |
| Reminder suppressed | system | Bounded behavior i preferred window. |
| Planned meal confirmed | Planned Meals / Week Plan | Plan-to-Confirm Rate. |
| Planned meal changed | Week Plan / Add Meal | Plan realism. |
| Grocery item checked | Grocery list | Shopping utility. |
| Close Day used | Home / Evening | Settlement behavior. |
| Catch-up used | Home / History | Recovery behavior. |
| Memory accepted / rejected | Smart Memory UI | Confidence calibration. |

### 5.6 Memory candidate logic

Rekomendowana logika tworzenia pamięci:

| Typ pamięci | Kandydat powstaje, gdy | Automatyczne użycie |
|---|---|---|
| Food Memory | podobny posiłek pojawi się 3 razy w 21 dni albo user zapisze jako „usual” | Po potwierdzeniu lub wysokiej pewności. |
| Portion Memory | user powtórzy podobną korektę porcji 2–3 razy | Po potwierdzeniu. |
| Correction Memory | ten sam typ korekty pojawi się 2 razy dla podobnego jedzenia | Najpierw jako suggestion w review. |
| Rhythm Memory | slot czasowy powtarza się przez 5+ dni aktywnych | Może działać bez jawnego potwierdzenia, ale widoczne w ustawieniach. |
| Preference Memory | user poda jawnie albo wielokrotnie odrzuci sugestię | Tylko explicit lub mocne implicit + możliwość edycji. |
| Plan Memory | plan-vs-actual jest widoczny przez 2+ tygodnie | Najpierw w Week Plan suggestions. |

### 5.7 Pamięć musi być widoczna

Smart Memory wymaga powierzchni kontrolnej:

**Settings → Smart Memory**

Sekcje:

- Typowe posiłki
- Typowe porcje
- Częste korekty
- Rytm dnia
- Preferencje jedzenia
- Planowanie i zakupy
- Przypomnienia i spokojne godziny

Akcje:

- edytuj,
- usuń,
- nie używaj do sugestii,
- zapomnij tę rzecz,
- pauzuj Smart Memory,
- wyczyść Smart Memory,
- eksportuj / pokaż dane w ramach polityki prywatności, jeśli wymagane przez finalny model compliance.

Przykładowy tekst:

> Fitaly zapamiętuje tylko rzeczy, które mogą skrócić Twoje logowanie lub pomóc w planowaniu. Możesz wszystko edytować albo usunąć.

### 5.8 Prywatność i granice

Zasady:

1. Nie zbierać lokalizacji GPS jako warunku Smart Memory.
2. Nie robić ukrytych inferencji medycznych.
3. Nie wysyłać pełnej historii do LLM, jeśli wystarczy skrócony kontekst.
4. Użytkownik musi rozumieć, co Fitaly pamięta.
5. Pamięć musi dać się wyłączyć i usunąć.
6. Wrażliwe preferencje zdrowotne powinny być opcjonalne i jasno oznaczone.
7. Pamięć powinna być budowana z danych domenowych, nie z przypadkowych screen clicków.

### 5.9 Smart Memory — default-on, ale kontrolowane

Decyzja v0.2:

> **Smart Memory jest domyślnie włączone, ale musi być widoczne, edytowalne i wyłączalne.**

Uzasadnienie:

- pamięć jest częścią jakości core produktu, nie dodatkiem,
- bez pamięci Fitaly nie będzie realnie skracać pracy użytkownika,
- opt-in dla każdej najmniejszej obserwacji byłby ciężki i mógłby zabić wartość produktu,
- kontrola użytkownika musi być przeniesiona do przejrzystego Settings → Smart Memory oraz do kontekstowych akcji mute/delete/edit.

Zasady wykonawcze:

1. Smart Memory działa default-on po zaakceptowaniu standardowych warunków produktu i polityki prywatności.
2. Użytkownik widzi w Settings, co Fitaly pamięta i gdzie ta pamięć jest używana.
3. Każdy MemoryItem można edytować, usunąć, wyciszyć albo wyłączyć dla sugestii.
4. Użytkownik może wyłączyć całą Smart Memory.
5. Po wyłączeniu Smart Memory Fitaly nie powinno używać memory items do personalizacji, a UI musi jasno pokazać konsekwencję: mniej trafne shortcuty i mniej automatycznych defaultów.
6. Dane szczególnie wrażliwe albo mogące wyglądać jak inferencja zdrowotna nie powinny być tworzone jako ukryta pamięć bez jasnego źródła i kontroli.

### 5.10 Smart Memory jako premium

Nie blokować podstawowej pamięci, bo bez niej produkt traci jakość. Można jednak różnicować głębokość i zakres użycia.

| Free | Premium |
|---|---|
| Ostatnie i zapisane posiłki | Zaawansowane usual meals i meal rhythm templates |
| Podstawowe porcje | Głębsze personal defaults i cross-surface portion defaults |
| Podstawowa Correction / Portion Memory | Zaawansowane Correction Memory i future correction reduction across surfaces |
| Proste sugestie Home | Next-best-action Companion z pełniejszym rankingiem |
| Ograniczone Planned Meals | Pełniejszy Week Plan + grocery + plan-vs-actual |
| Podstawowy Close Day | Głębsze weekly insights i smart adjustments |

Premium powinno sprzedawać:

> **Mniej wpisywania, lepsze sugestie, spokojniejsze domykanie tygodnia.**

Nie sprzedawać:

> „więcej AI”.

## 6. Meal Companion — definicja i zakres

### 6.1 Definicja

**Meal Companion** to nie-chatowa warstwa prowadzenia użytkownika przez dzień. Korzysta ze Smart Memory, stanu dnia, planu, historii i tarć, aby proponować najkrótszy sensowny następny krok.

Meal Companion odpowiada na pytania:

- Co użytkownik prawdopodobnie chce teraz zrobić?
- Czy jest planowany posiłek do potwierdzenia?
- Czy jest typowy posiłek, który można szybko potwierdzić?
- Czy warto zaproponować catch-up albo close day?
- Czy warto o coś zapytać, czy lepiej nie przeszkadzać?
- Jak pomóc bez presji i bez udawania pewności?

### 6.2 Meal Companion v1 nie używa AI

Decyzja v0.2:

> **Meal Companion v1 jest deterministic rules engine.**

AI nie jest centrum tej funkcji i nie powinno być używane jako fallback do generowania porad w v1.

Powody:

- deterministic engine jest tańszy, bardziej testowalny i przewidywalny,
- większość wartości wynika z dobrego uporządkowania danych, nie z generowania tekstu,
- AI fallback mógłby zmienić Companion w chat albo coachingowy surface,
- launch/post-launch ryzyko powinno być ograniczone przez jasne reguły i mierzalny ranking.

AI może wejść później tylko wtedy, gdy:

- skraca decyzję,
- poprawia trafność krótkiego uzasadnienia,
- nie zastępuje rules engine,
- nie zmienia Meal Companion w chat.

### 6.3 Companion nie jest chatem

Chat pozostaje osobnym surface’em. Może w przyszłości korzystać z tych samych danych domenowych, ale nie jest centrum Meal Companion.

| Powierzchnia | Rola Meal Companion |
|---|---|
| Home / Today | Next best food action. |
| Review / Confirm Sheet | Szybkie potwierdzenie planu/usual albo jedna istotna korekta. |
| Reminders | Przypomnienie tylko wtedy, gdy zmniejsza tarcie. |
| Planned Meals / Week Plan | Pomoc w realistycznym planie i potwierdzaniu planu. |
| Close Day | Spokojne domknięcie dnia. |
| Weekly Report | Jeden wzorzec i jeden mały eksperyment, jeśli wspiera powrót. |
| Chat | Poza v1 Companion: pytania użytkownika i głębsze wyjaśnienia. |

### 6.4 Next Best Food Action

Home powinien odpowiadać na pytanie:

> „Co warto teraz zrobić z jedzeniem?”

Przykłady akcji:

| Stan | Akcja |
|---|---|
| Jest planowany posiłek w tym slocie | „Potwierdź lunch z planu”. |
| Jest typowy posiłek o tej porze | „Sprawdzić i zapisać Twoją zwykłą owsiankę?” |
| Użytkownik często loguje tekstem wieczorem | „Uzupełnij dzień jednym opisem”. |
| AI scan był porzucony | „Dokończyć ostatni posiłek?” |
| Dzień ma lukę, ale bilans jest wystarczający | „Zamknij dzień jako wystarczająco zapisany”. |
| Użytkownik przekroczył cel | „Dzień zapisany. Jutro wróćmy prostym śniadaniem.” |
| Brak danych | „Dodaj pierwszy posiłek”. |

### 6.5 Model decyzyjny

Meal Companion v1 działa jako ranked rules engine z pamięcią.

Proponowany ranking:

1. **Blocked recovery** — dokończ przerwany log, zapis nieudany, brakujące entitlementy.
2. **Planned meal due** — zaplanowany posiłek do potwierdzenia przez Confirm Sheet.
3. **Likely usual meal** — typowy posiłek dla tej pory do szybkiego sprawdzenia i zapisu.
4. **Missed meal catch-up** — prawdopodobnie pominięty slot.
5. **Close day** — wieczorne domknięcie.
6. **Plan prompt** — niedziela / shopping day / pusty tydzień.
7. **Insight** — mały wniosek, jeśli nie ma zadania.
8. **Fallback Add Meal** — photo/text/saved/planned/catch-up/usual. Barcode nie jest fallbackiem dla całego posiłku; służy do dodania produktu/składnika.

### 6.6 Companion copy examples

Rano:

> Dzisiaj wygląda prosto: typowe śniadanie, lunch z planu i kolacja do decyzji. Sprawdzić Twoją owsiankę?

Przed lunchem:

> W planie masz kurczaka z ryżem. Po posiłku możesz go szybko potwierdzić i zapisać.

Po zmianie planu:

> Plan się zmienił — normalne. Zalogować to zdjęciem albo opisać krótko?

Wieczorem:

> Dzień jest prawie zapisany. Możesz uzupełnić brakujący lunch jednym zdaniem albo zamknąć dzień jako wystarczająco dobry.

Po pominiętym dniu:

> Wczoraj zostały luki. Możesz je zostawić — albo uzupełnić tylko najważniejsze rzeczy w 30 sekund.

### 6.7 Guardraile Meal Companion

Meal Companion nie może:

- moralizować,
- oceniać jedzenia jako „złe”,
- karać za zmianę planu,
- wymuszać pełnej precyzji,
- udawać pewności tam, gdzie jej nie ma,
- zastępować medycznej porady,
- zapisywać posiłku bez minimalnej kontroli użytkownika,
- stać się generatorem długich porad zamiast skracać akcję,
- używać AI w v1 jako domyślnego mechanizmu sugestii.

Meal Companion ma:

- proponować najmniejszy sensowny krok,
- mówić konkretnie,
- tłumaczyć niepewność,
- szanować brak danych,
- usuwać tarcie,
- wzmacniać poczucie kontroli.

## 7. Planned Meals / Week Plan — definicja i zakres

### 7.1 Definicja

**Planned Meals / Week Plan** to lekki system planowania jedzenia, który pozwala użytkownikowi w spokojnym momencie zaplanować kilka najważniejszych decyzji żywieniowych na najbliższe dni, zobaczyć prosty forecast, a później zamienić plan w log przez szybkie potwierdzenie.

Najważniejsza zasada:

> **Planowany posiłek jest przyszłym logiem, ale nie jest silent save.**

To oznacza, że Week Plan nie jest dodatkiem obok Add Meal. To kolejne wejście do systemu zapisu posiłku, ale zapis przechodzi przez **Lightweight Review / Confirm Sheet**.

### 7.2 Czym Week Plan nie jest

Na start Week Plan nie powinien być:

- pełnym recipe engine,
- konkurencją dla aplikacji meal-prep,
- skomplikowanym grocery plannerem,
- systemem pantry inventory,
- marketplace’em przepisów,
- dietetycznym ERP.

Fitaly ma nie wygrać liczbą przepisów, tylko tym, że planowanie skraca późniejsze logowanie i zmniejsza liczbę decyzji w ciągu dnia.

### 7.3 Rozróżnienie: Planned Meals Lite vs Week Plan Expansion

Decyzja v0.2:

> **Planned Meals Lite może wejść przed Meal Companion Foundation, ale tylko jako bardzo ograniczony system planowanych posiłków.**

| Etap | Zakres | Czego nie zawiera |
|---|---|---|
| Planned Meals Lite | 1–3 dni, lunch/kolacja, usual/manual planned meals, Confirm Sheet, change-of-plan | pełnej Recipe Base, pełnej grocery list, 7-dniowego planu, plan-vs-actual intelligence |
| Week Plan v1 / Expansion | 3–5 dni, prosty forecast, grocery v1, fuzzy placeholders, lepsze planowanie tygodnia | pełnego meal-prep ERP, pantry inventory, marketplace przepisów |
| Week Plan Premium Expansion | 7 dni, templates, plan-vs-actual, advanced grocery, rhythm templates | clinical diet programs, household pantry, delivery integrations |

### 7.4 Typy planowanych posiłków

Week Plan musi wspierać soft planning.

| Typ | Przykład | Zachowanie systemu |
|---|---|---|
| Exact planned meal | „owsianka z bananem i jogurtem” | Forecast i szybki Confirm Sheet. |
| Usual meal | „moja zwykła owsianka” | Smart Memory podstawia typowy skład i porcję; użytkownik potwierdza przed zapisem. |
| Fuzzy meal | „coś z kurczakiem” | Forecast jako zakres / estimate, bez udawania precyzji. |
| Eating out | „lunch na mieście” | Slot planu bez szczegółów, później photo/text. |
| Placeholder | „kolacja do decyzji” | Rezerwuje slot, nie generuje zakupów. |
| Recipe meal | „chili con carne 4 porcje” | Dopiero v2/v3, jeśli warto. |

### 7.5 Niedzielny flow

Wejście:

> Masz chwilę na kilka dni? Ułóż prosty plan jedzenia i później tylko potwierdzaj albo lekko poprawiaj.

Opcje startowe:

- Zaplanuj 3 dni
- Tylko obiady i kolacje
- Użyj moich typowych posiłków
- Zacznij od pustego planu

Dopiero w rozszerzeniu:

- Zaplanuj tydzień
- Wygeneruj listę zakupów
- Użyj meal rhythm template

Domyślny MVP:

> 1–3 dni, głównie lunch/kolacja, śniadania z Smart Memory, wolne sloty dopuszczalne.

Nie zmuszać użytkownika do pełnego 7 × 4 meal grid.

### 7.6 Forecast dnia i tygodnia

Forecast nie powinien być czerwonym raportem zgodności. Ma być spokojnym preview.

Przykłady:

- „Dzień wygląda lekko — możesz dodać większy lunch.”
- „Białko raczej ok, kolacja niepewna.”
- „Ten dzień ma dużo niewiadomych, ale plan jest wystarczający.”
- „Jeśli zjesz lunch z planu, dzień będzie blisko celu.”

Forecast musi rozróżniać:

- dane pewne,
- dane z pamięci,
- dane szacowane,
- placeholdery.

Fuzzy planned meals nie mogą wyglądać jak precyzyjna liczba. Jeśli wpływają na forecast, powinny wejść jako zakres albo jakościowy sygnał.

### 7.7 Lista zakupów

Lista zakupów nie wchodzi do Planned Meals Lite jako twardy wymóg. Wchodzi dopiero wtedy, gdy planned meals mają wystarczająco konkretne składniki.

Zakres grocery v1:

- generowana z konkretnych i usual planned meals,
- grupowana kategoriami,
- możliwość odhaczania,
- możliwość usuwania,
- możliwość dodania własnej pozycji,
- możliwość skopiowania / udostępnienia jako tekst,
- sekcja „niepewne” dla fuzzy meals.

Nie wchodzi do v1:

- integracja ze sklepami,
- pantry inventory,
- ceny,
- koszyki zakupowe,
- automatyczne przepisywanie domowych zapasów,
- współdzielenie household list,
- zaawansowane porcje rodzinne.

Proponowany podział:

- **Do kupienia**
- **Sprawdź, czy masz**
- **Niepewne / zależy od wyboru**

### 7.8 Plan-to-confirm

Najważniejszy flow w tygodniu:

Home:

> Planowany lunch: kurczak + ryż. Zjadłeś?

CTA:

- Sprawdź i zapisz jak zaplanowano
- Zjadłem podobnie
- Zjadłem coś innego
- Pomiń

Dla „Sprawdź i zapisz jak zaplanowano”:

- otwórz Lightweight Review / Confirm Sheet,
- pokaż posiłek, porcję i najważniejsze makro,
- CTA: „Potwierdź i zapisz”,
- opcje: mniejsza porcja / podobnie / większa porcja / edytuj szczegóły.

Dla „Zjadłem podobnie”:

- mniejsza porcja / podobnie / większa porcja,
- dodano coś?,
- zamieniono składnik?,
- zapisz po potwierdzeniu.

Zasada:

> **Plan-to-confirm nigdy nie zapisuje posiłku bez minimalnego Review / Confirm Sheet.**

### 7.9 Change-of-plan

Week Plan musi traktować zmianę planu jako normalny stan, nie porażkę.

Copy:

> Plan się zmienił. Zaktualizujmy dzień.

Akcje:

- loguj zdjęciem,
- opisz krótko,
- zostaw plan jako niezrealizowany,
- przesuń posiłek na inny dzień,
- zaktualizuj listę zakupów, jeśli grocery jest aktywne.

### 7.10 Week Plan jako premium

| Free | Premium |
|---|---|
| Planned Meals Lite 1–2 dni | Pełniejszy Week Plan 3–7 dni |
| Ręczne planned meals | Auto-prefill z Smart Memory i templates |
| Szybki Confirm Sheet ograniczony | Plan-to-confirm z korektami porcji i plan-vs-actual |
| Prosty forecast dnia | Forecast tygodnia i plan-vs-actual |
| Lista zakupów podstawowa, jeśli aktywna | Grupowanie, sumowanie, eksport, „sprawdź czy masz” |
| Kilka usual meals | Meal rhythm templates |

## 8. Domknięcia tarć

### 8.1 Definicja

**Domknięcia tarć** to małe mechaniki, które sprawiają, że użytkownik nie odpada, gdy tracking nie jest idealny.

To nie są „ładne dodatki”. To są najważniejsze elementy retencji w kategorii, w której użytkownik bardzo łatwo czuje, że „zepsuł dzień” i przestaje wracać.

### 8.2 Good-enough review

Problem:

AI review może zamienić się w ręczne logowanie, jeśli użytkownik ma poprawiać wszystko.

Rozwiązanie:

Fitaly rozróżnia trzy poziomy:

| Poziom | Zachowanie |
|---|---|
| Good enough | „To wystarczy do obrazu dnia. Zapisz.” |
| One key question | „Największa niepewność: porcja makaronu. Mała / średnia / duża?” |
| Detailed mode | Pełna edycja tylko na żądanie. |

Copy:

> Szacunek jest wystarczający do dziennego obrazu. Doprecyzuj tylko, jeśli liczysz dokładnie.

### 8.3 Correction-to-memory

Problem:

Każda korekta jest kosztem.

Rozwiązanie:

Każda powtarzalna korekta może stać się inwestycją.

Przykłady:

- „Często dodajesz oliwę do sałatek. Pytać o nią następnym razem?”
- „Używać 180 g ryżu jako Twojej typowej porcji?”
- „Zapamiętać to latte jako Twoje zwykłe?”

Metryka:

- Correction-to-Memory Conversion
- Future Correction Reduction

### 8.4 Catch-up Mode

Problem:

Użytkownik często nie loguje w momencie jedzenia.

Rozwiązanie:

Zamiast wymagać pełnego Add Meal dla każdego brakującego posiłku, Fitaly oferuje szybkie nadrabianie.

Flow:

> Uzupełnij brakujące rzeczy jednym opisem.

Użytkownik wpisuje:

> lunch: makaron z kurczakiem, potem kawa i baton

Fitaly dzieli to na wpisy, oznacza jako estimate i prowadzi do **Bulk Catch-up Review**.

Bulk Catch-up Review pokazuje:

- wykryte posiłki / produkty,
- estimate labels,
- największą niepewność,
- możliwość usunięcia elementu,
- możliwość doprecyzowania tylko najważniejszej rzeczy,
- CTA: „Zapisz jako szacunek”.

Zasada:

> Catch-up nie wymaga pełnego Review Meal dla każdego elementu, ale nie zapisuje automatycznie w tle. Zapis przechodzi przez zbiorczy Bulk Review.

### 8.5 Close Day

Problem:

Wieczorem użytkownik nie chce robić księgowości żywieniowej.

Rozwiązanie:

Tryb domknięcia dnia.

Stany:

| Stan dnia | Zachowanie |
|---|---|
| Pełny dzień | „Dzień zapisany. Jutro najłatwiej wrócić przez…” |
| Częściowy dzień | „Brakuje lunchu. Uzupełnij jednym opisem albo zostaw.” |
| Brak logów | „Możesz zacząć od jutra. Bez nadrabiania na siłę.” |
| Planowany, ale niepotwierdzony | „Z planu zostały 2 posiłki. Potwierdzić, zmienić lub pominąć?” |

Najważniejszy stan:

> **Settled Day**
> dzień, który jest wystarczająco zapisany, nawet jeśli nie jest perfekcyjny.

Metryka:

- Settled Day Rate
- Close Day Completion Rate
- Next-Day Return after Close Day

### 8.6 Quick usuals

Problem:

Powtarzalne posiłki nadal wymagają wejścia w flow.

Rozwiązanie:

Home i Add Meal pokazują „usuals” według pory dnia.

Przykłady:

- „Sprawdzić i zapisać Twoją zwykłą owsiankę?”
- „Kawa jak zwykle?”
- „Lunch z pracy?”
- „Kolacja z wczoraj?”

Akcje:

- sprawdź i zapisz,
- zapisz z mniejszą / podobną / większą porcją,
- nie pokazuj więcej,
- edytuj usual.

Zasada:

> Usual meal może być bardzo szybki, ale nadal powinien pokazać minimalny Confirm Sheet przed zapisem.

### 8.7 Reminder suppression

Problem:

Reminder może zwiększyć poczucie winy.

Rozwiązanie:

Reminder wysyłany tylko wtedy, gdy jest sensowny next action.

Nie wysyłać, gdy:

- użytkownik już zalogował meal slot,
- jest quiet hours,
- użytkownik ignorował podobne remindery,
- plan jest pusty i reminder nie ma konkretnej akcji,
- użytkownik zamknął dzień jako settled,
- reminder nie może prowadzić do meal_saved, planned_confirmed, close_day lub innego wartościowego działania.

Metryka:

- Reminder helpfulness = reminder open → meal_saved / planned_confirmed / close_day
- Suppression quality
- Reminder irritation proxy: opt-out, disable, immediate dismiss

### 8.8 Recovery states

Domknięcia tarć obejmują też techniczne edge cases.

Zasady:

- offline nie może oznaczać utraty posiłku,
- długi processing nie może udawać znanego progressu,
- błąd AI musi prowadzić do text/manual fallback,
- brak barcode matcha dotyczy lookupu produktu/składnika i nie może być mylony z brakiem odczytu kodu,
- brak kredytów nie powinien blokować lekkich, darmowych alternatyw,
- żaden recovery flow nie powinien kończyć się cichym zapisem bez kontroli użytkownika.

## 9. Architektura domenowa

### 9.1 Główne obiekty

#### UserFoodProfile

Stały profil żywieniowy i preferencyjny.

Pola przykładowe:

- user_id
- goal_type
- tracking_style
- dietary_preferences
- restrictions
- disliked_foods
- preferred_meal_count
- quiet_hours
- planning_style
- companion_style
- smart_memory_enabled
- updated_at

#### MealLog

Zapisany posiłek.

Pola przykładowe:

- meal_id
- user_id
- meal_time
- logged_at
- input_mode
- source_type: photo/text/saved/planned/catchup/usual/manual
- confidence_band
- estimate_type: exact/estimated/fuzzy/planned
- calories
- macros
- items
- review_status
- confirmation_mode: full_review/lightweight_confirm/bulk_review
- saved_at

#### MealItem

Pojedynczy produkt albo składnik w ramach posiłku.

Pola przykładowe:

- item_id
- meal_id
- user_id
- label
- quantity
- unit
- calories
- macros
- source_type: ai_inferred/manual/barcode/database/memory/planned
- barcode
- product_id
- confidence_band
- added_at
- edited_at

Uwaga:

> Barcode należy do poziomu **MealItem**, nie do poziomu całego **MealLog**.

#### MealReviewDiff

Różnica między AI/propozycją a finalnym zapisem.

Pola przykładowe:

- diff_id
- meal_id
- user_id
- changed_fields
- added_items
- removed_items
- portion_deltas
- macro_delta
- correction_type
- significance
- created_at

#### MemoryItem

Potwierdzona albo aktywna pamięć użytkownika.

Pola przykładowe:

- memory_id
- user_id
- memory_type
- label
- value
- confidence
- status: candidate/confirmed/active/muted/decayed/deleted
- evidence_count
- last_used_at
- created_from
- user_visible
- updated_at

#### MealSlotPattern

Rytm posiłków.

Pola przykładowe:

- pattern_id
- user_id
- meal_slot
- day_type: weekday/weekend/specific_day
- usual_time_window
- confidence
- last_observed_at
- reminder_eligible

#### CorrectionPattern

Powtarzalna korekta.

Pola przykładowe:

- pattern_id
- user_id
- trigger_food_pattern
- correction_kind
- default_adjustment
- evidence_count
- confidence
- prompt_copy_variant
- status

#### PlannedMeal

Planowany posiłek.

Pola przykładowe:

- planned_meal_id
- user_id
- date
- meal_slot
- plan_type: exact/usual/fuzzy/eating_out/placeholder/recipe
- label
- linked_memory_id
- estimated_nutrition
- uncertainty_band
- grocery_eligible
- status: planned/confirmed_logged/changed/skipped/moved
- actual_meal_id
- confirmation_mode: lightweight_confirm/full_review

#### WeekPlan

Plan tygodnia albo kilku dni.

Pola przykładowe:

- week_plan_id
- user_id
- start_date
- planning_mode: planned_meals_lite/week_plan_v1/week_plan_premium
- planned_meal_count
- forecast_summary
- grocery_list_id
- status
- created_at
- completed_at

#### GroceryListItem

Pozycja zakupowa.

Pola przykładowe:

- grocery_item_id
- week_plan_id
- source_planned_meal_ids
- item_name
- quantity
- category
- confidence
- section: buy/check_if_have/uncertain
- checked_at
- removed_at

#### DaySettlement

Domknięcie dnia.

Pola przykładowe:

- settlement_id
- user_id
- date
- status: open/partial/settled/incomplete/skipped
- confidence_level
- missing_slots
- catchup_used
- closed_at
- next_day_suggestion

### 9.2 Pipeline pamięci

1. User action
2. Domain event
3. Memory signal extraction
4. Candidate scoring
5. Candidate created
6. Memory used or proposed, zależnie od typu i pewności
7. User can accept / reject / edit / mute
8. Memory promoted to active
9. Memory used in UX
10. User accepts / rejects / edits output
11. Confidence updated
12. Decay, mute or deletion

### 9.3 Feature flags

Rekomendowane flagi:

- `SMART_MEMORY_ENABLED`
- `SMART_MEMORY_CANDIDATES_ENABLED`
- `SMART_MEMORY_USER_VISIBLE_SETTINGS_ENABLED`
- `GOOD_ENOUGH_REVIEW_ENABLED`
- `LIGHTWEIGHT_CONFIRM_SHEET_ENABLED`
- `CLOSE_DAY_ENABLED`
- `CATCH_UP_MODE_ENABLED`
- `PLANNED_MEALS_LITE_ENABLED`
- `COMPANION_NEXT_ACTION_ENABLED`
- `WEEK_PLAN_ENABLED`
- `PLAN_TO_CONFIRM_ENABLED`
- `GROCERY_LIST_ENABLED`
- `INGREDIENT_BARCODE_LOOKUP_ENABLED`

Flagi muszą mieć kill switch i telemetry guardrails.

## 10. API i kontrakty — szkic

To nie jest finalna specyfikacja endpointów, tylko mapa potrzeb.

### 10.1 Smart Memory

- `GET /v2/memory/summary`
- `GET /v2/memory/items`
- `POST /v2/memory/candidates/{id}/confirm`
- `POST /v2/memory/candidates/{id}/reject`
- `PATCH /v2/memory/items/{id}`
- `DELETE /v2/memory/items/{id}`
- `POST /v2/memory/pause`
- `POST /v2/memory/resume`

### 10.2 Meal Companion / Next Action

- `GET /v2/home/next-action`
- `POST /v2/companion/action-feedback`
- `GET /v2/companion/context-summary`

Uwaga:

> `POST /v2/companion/chat` nie jest częścią Meal Companion v1. Chat może mieć osobny kontrakt, ale nie powinien być centrum Companion.

### 10.3 Close Day / Catch-up

- `GET /v2/days/{date}/settlement`
- `POST /v2/days/{date}/catch-up/parse`
- `POST /v2/days/{date}/catch-up/confirm`
- `POST /v2/days/{date}/settle`
- `POST /v2/days/{date}/reopen`

### 10.4 Planned Meals / Week Plan

- `GET /v2/week-plans/current`
- `POST /v2/week-plans`
- `PATCH /v2/week-plans/{id}`
- `POST /v2/planned-meals`
- `PATCH /v2/planned-meals/{id}`
- `GET /v2/planned-meals/{id}/confirm-preview`
- `POST /v2/planned-meals/{id}/confirm-log`
- `POST /v2/planned-meals/{id}/change`
- `POST /v2/planned-meals/{id}/skip`

### 10.5 Grocery

- `GET /v2/week-plans/{id}/grocery-list`
- `PATCH /v2/grocery-items/{id}`
- `POST /v2/grocery-items`
- `POST /v2/grocery-list/export`

### 10.6 Ingredient / product barcode lookup

Barcode jest kontraktem dla produktu/składnika, nie dla całego posiłku.

- `GET /v2/products/lookup?barcode={barcode}`
- `POST /v2/meals/{meal_id}/items`
- `PATCH /v2/meals/{meal_id}/items/{item_id}`
- `DELETE /v2/meals/{meal_id}/items/{item_id}`

Expected behavior:

- success lookup tworzy albo uzupełnia `MealItem`,
- no match prowadzi do manual ingredient entry,
- błędny odczyt kodu i brak produktu w katalogu są różnymi stanami,
- lookup nie powinien sam tworzyć `MealLog` jako „barcode meal”.

## 11. AI context policy

### 11.1 Zasada

Meal Companion v1 nie używa AI. Poniższe zasady dotyczą innych powierzchni, w których AI nadal może działać: Add Meal review, chat, potencjalne późniejsze krótkie wyjaśnienia decyzji, forecast summary albo correction assistance.

AI nie powinno dostawać całej historii użytkownika. Powinno dostawać mały, celowy kontekst.

Warstwy kontekstu:

| Warstwa | Przykład | Kiedy używać |
|---|---|---|
| Current task | zdjęcie, opis, składnik z barcode lookup | zawsze dla bieżącego logu albo edycji składnika |
| Current day summary | kalorie, makro, brakujące sloty | Home, Close Day, późniejsze Companion explanation |
| Active memory | typowe porcje, zwykłe posiłki | Review, Planned Meals, suggestions |
| Plan context | dzisiejsze planned meals | Plan-to-confirm, Home |
| Recent friction | porzucony review, powtarzalna korekta | recovery i trust |
| Long-term patterns | rhythm, preferences | reminders, planning |

### 11.2 Prompt context boundaries

Nie wysyłać:

- pełnej historii posiłków bez potrzeby,
- wszystkich raw events,
- danych wrażliwych, jeśli nie są potrzebne,
- niezatwierdzonych inferencji jako faktów,
- informacji o zdrowiu jako diagnozy.

Wysyłać:

- zwięzłe summary,
- potwierdzone albo aktywne preferencje,
- aktywne memory items,
- bieżący stan dnia,
- relevant planned meal,
- confidence/uncertainty,
- tylko te dane składnika z barcode lookup, które są potrzebne do Review/Edit Meal.

### 11.3 Przykład context summary

Zamiast:

> Użytkownik jadł X, Y, Z przez 90 dni...

Używać:

> User often logs oatmeal on weekday mornings. Active portion default: oats 60 g, banana 1, yogurt 150 g. User prefers good-enough tracking. Current day: breakfast missing, lunch planned at 13:00.

## 12. UX surfaces

### 12.1 Home / Today

Nowa rola Home:

> Home nie jest tylko dashboardem. Home jest centrum następnego kroku.

Moduły:

1. Today status
2. Next best action
3. Planned meal card
4. Usual meal shortcuts
5. Close Day card
6. Companion note
7. Progress / macros as secondary context

### 12.2 Add Meal

Domyślne wejścia do posiłku:

- Photo
- Text
- Saved
- Usual
- Planned
- Catch-up

Barcode nie jest domyślnym wejściem do całego posiłku. Barcode pojawia się jako:

- dodanie produktu/składnika w Review Meal,
- dodanie produktu/składnika w Edit Meal Details,
- szybkie doprecyzowanie składnika w manualnym meal item,
- lookup produktu w bazie, jeśli użytkownik faktycznie dodaje pojedynczą rzecz.

Review:

- good-enough save,
- one key question,
- detailed edit,
- remember this correction,
- save as usual,
- add ingredient manually,
- scan ingredient barcode.

### 12.3 Lightweight Review / Confirm Sheet

Używany dla:

- planned meals,
- usual meals,
- znanych posiłków z wysoką pewnością,
- powtórzonych posiłków z pamięci.

Minimalna zawartość:

- nazwa posiłku,
- porcja: mniej / podobnie / więcej,
- najważniejsze kalorie i makro,
- opcja „Edytuj szczegóły”,
- CTA: „Potwierdź i zapisz”.

### 12.4 Smart Memory Settings

Ekran pamięci:

- co Fitaly pamięta,
- co jest proponowane,
- co jest aktywne,
- co zostało wyciszone,
- możliwość edycji,
- możliwość usunięcia,
- możliwość wyłączenia całej Smart Memory.

### 12.5 Planned Meals / Week Plan

Ekrany:

1. Planned Meals intro
2. Plan grid 1–3 dni dla Planned Meals Lite
3. Add planned meal sheet
4. Day forecast
5. Planned meal details
6. Plan-to-confirm sheet
7. Grocery list dopiero w Week Plan Expansion
8. Plan-vs-actual summary dopiero w późniejszej wersji

### 12.6 Close Day

Entry points:

- Home wieczorem,
- push reminder,
- History następnego dnia,
- Weekly Report.

Ekrany / sheets:

- Missing slots
- One-text catch-up
- Bulk Catch-up Review
- Good-enough settlement
- Tomorrow suggestion

## 13. Telemetry i KPI

### 13.1 Nowe metryki Tier 1 / Tier 2

| Metryka | Definicja | Po co |
|---|---|---|
| Smart Memory Coverage | % aktywnych użytkowników z min. 1 active memory item | Czy pamięć realnie się buduje. |
| Memory Acceptance Rate | confirmed / proposed memory candidates | Czy sugestie pamięci są trafne. |
| Memory Rejection Rate | rejected / proposed | Guardrail na „creepy” albo nietrafne memory. |
| Smart Memory Disable Rate | users with memory disabled / eligible users | Czy default-on memory nie narusza zaufania. |
| Correction-to-Memory Conversion | ile korekt zamienia się w memory item | Czy koszt korekty staje się inwestycją. |
| Future Correction Reduction | spadek podobnych korekt po aktywnej pamięci | Czy Smart Memory działa. |
| Next Action Acceptance Rate | accepted next actions / displayed | Czy Home prowadzi do działania. |
| Planned Confirm Rate | planned meals confirmed via Confirm Sheet / planned meals due | Najważniejszy KPI Planned Meals Lite. |
| Planned Meal Change Rate | changed planned meals / due planned meals | Czy plan jest realistyczny. |
| Grocery Utility Rate | grocery list opened + item checked / generated | Czy lista zakupów ma wartość. |
| Settled Day Rate | settled days / active days | Czy Close Day domyka dni. |
| Catch-up Completion Rate | catch-up started → bulk review confirmed / settled | Czy nadrabianie działa. |
| Good-enough Save Rate | saves bez detailed edit przy acceptable confidence | Czy review nie jest zbyt ciężkie. |
| Ingredient Barcode Utility | barcode lookup success + item added / barcode scans | Czy barcode ma sens jako ingredient-level utility. |
| Companion Helpfulness | next action / companion prompt → meal_saved / planned_confirmed / close_day | Czy Companion daje downstream action. |

### 13.2 Event taxonomy — nowe eventy

#### Smart Memory

- `domain.memory_candidate.created`
- `domain.memory_candidate.confirmed`
- `domain.memory_candidate.rejected`
- `domain.memory_item.activated`
- `domain.memory_item.edited`
- `domain.memory_item.muted`
- `domain.memory_item.deleted`
- `domain.memory_item.used`
- `domain.memory_settings.opened`
- `domain.memory_settings.disabled`
- `domain.memory_settings.enabled`

Parametry:

- memory_type
- candidate_source
- confidence_band
- evidence_count
- user_confirmed
- used_surface

#### Meal Companion

- `domain.next_action.generated`
- `domain.next_action.viewed`
- `domain.next_action.accepted`
- `domain.next_action.dismissed`
- `domain.companion_suggestion.used`
- `domain.companion_suggestion.rejected`

Parametry:

- action_type
- ranking_reason
- surface
- downstream_result
- user_state
- engine_type: deterministic

#### Close Day / Catch-up

- `domain.day_settlement.opened`
- `domain.day_settlement.completed`
- `domain.day_settlement.skipped`
- `domain.catchup.started`
- `domain.catchup.parsed`
- `domain.catchup.bulk_review_opened`
- `domain.catchup.confirmed`
- `domain.catchup.abandoned`

Parametry:

- missing_slots_count
- catchup_input_type
- estimate_count
- settlement_status
- confidence_level

#### Planned Meals / Week Plan

- `domain.week_plan.started`
- `domain.week_plan.created`
- `domain.week_plan.completed`
- `domain.planned_meal.created`
- `domain.planned_meal.edited`
- `domain.planned_meal.confirm_sheet_opened`
- `domain.planned_meal.confirmed_logged`
- `domain.planned_meal.changed`
- `domain.planned_meal.skipped`
- `domain.grocery_list.generated`
- `domain.grocery_item.checked`
- `domain.grocery_list.exported`

Parametry:

- planning_mode
- planned_days_count
- planned_meal_count
- plan_type
- source: manual/smart_memory/template
- uncertainty_band
- grocery_item_count
- confirm_mode

#### Ingredient barcode

- `domain.ingredient_barcode.scan_started`
- `domain.ingredient_barcode.detected`
- `domain.ingredient_barcode.lookup_completed`
- `domain.ingredient_barcode.lookup_failed`
- `domain.meal_item.added_from_barcode`
- `domain.meal_item.edited_after_barcode`

Parametry:

- barcode_type
- lookup_result: found/not_found/error
- product_id
- meal_context
- added_to_meal
- correction_after_add

### 13.3 Guardrails

| Guardrail | Alarm |
|---|---|
| Memory Disable Rate | rośnie po uruchomieniu default-on memory |
| Memory Rejection Rate | wysoki rejection dla danego memory_type |
| Planned Confirm Abandon Rate | użytkownik otwiera Confirm Sheet, ale nie zapisuje |
| Silent Save Bugs | jakikolwiek zapis planned/usual bez confirmation_mode |
| Barcode Meal Creation | jakikolwiek nowy `MealLog` z source_type `barcode` po migracji architektury |
| Catch-up Overwrite/Error | catch-up tworzy błędne pozycje bez czytelnej edycji/usunięcia |
| Companion AI Leakage | Meal Companion v1 używa AI endpointu albo generuje długie porady |
| Reminder irritation | opt-out, disable, immediate dismiss rosną po zmianie next actions |

## 14. Roadmapa

### 14.1 Zasada

Nie dodawać całego systemu do launch scope 1.0. To jest post-release expansion.

Powód:

- launch ma potwierdzić activation, trust, retention i premium sanity,
- Smart Memory wymaga danych i zaufania,
- Planned Meals, Week Plan i Meal Companion bez pamięci będą słabsze,
- zbyt duży scope przed launch grozi rozmyciem produktu.

### 14.2 Faza 0 — Post-launch data audit

Cel:

> Sprawdzić, czy obecne eventy i modele wystarczą do budowy Smart Memory.

Zakres:

- mapa obecnych eventów,
- mapa obecnych obiektów meal/user/reminder,
- review diff availability,
- saved meals model,
- user preferences model,
- reminder behavior data,
- weekly reports data,
- paywall/premium constraints,
- privacy copy check,
- Add Meal barcode migration impact.

Output:

- Smart Memory data gap report,
- lista brakujących eventów,
- lista brakujących pól domenowych,
- decyzja: co dodać do telemetry, a co do memory layer,
- decyzja techniczna: jak przenieść barcode z meal-level input do ingredient-level utility.

Definition of done:

- wiadomo, jakie sygnały są dostępne,
- wiadomo, czego brakuje,
- każdy brakujący sygnał ma uzasadnienie produktowe,
- brak zbierania danych „na wszelki wypadek”.

### 14.3 Faza 1 — Smart Memory Foundation

Cel:

> Zbudować minimalną warstwę pamięci, która zmniejsza przyszłe tarcie.

Zakres MVP:

- MemoryItem model,
- CorrectionPattern model,
- MealSlotPattern model,
- memory candidates,
- user-visible Smart Memory settings,
- default-on Smart Memory z możliwością wyłączenia,
- save as usual,
- remember this correction,
- portion defaults,
- memory used in Add Meal Review.

Nie wchodzi:

- pełny Week Plan,
- grocery list,
- rozbudowany Companion,
- plan-vs-actual intelligence.

Definition of done:

- użytkownik może zobaczyć, edytować, wyciszyć, usunąć i wyłączyć pamięć,
- Fitaly potrafi zaproponować usual meal,
- Fitaly potrafi zapamiętać powtarzalną korektę,
- review podobnego posiłku wymaga mniej korekt,
- memory events są mierzalne.

### 14.4 Faza 2 — Friction Closures Lite

Cel:

> Domknąć najczęstsze momenty porzucenia trackingu.

Zakres:

- Good-enough review,
- one key question,
- Lightweight Review / Confirm Sheet,
- Close Day,
- Catch-up Mode z Bulk Review,
- quick usuals,
- soft recovery po pominiętym dniu.

Definition of done:

- użytkownik może zamknąć dzień bez pełnej precyzji,
- catch-up umożliwia zapis kilku rzeczy jednym opisem przez Bulk Review,
- usual/planned posiłki nie zapisują się bez Confirm Sheet,
- Home pokazuje najkrótszą akcję,
- Settled Day Rate jest mierzalne.

### 14.5 Faza 3 — Planned Meals Lite

Cel:

> Pozwolić użytkownikowi zaplanować kilka decyzji i później szybko je potwierdzać.

Zakres MVP:

- PlannedMeal model,
- plan grid 1–3 dni,
- lunch/kolacja jako główne sloty,
- manual planned meal,
- usual prefill,
- Lightweight Review / Confirm Sheet,
- change-of-plan,
- podstawowy day forecast bez pełnej Recipe Base.

Nie wchodzi:

- pełna baza przepisów,
- pełna lista zakupów,
- 7-dniowy planner jako default,
- plan-vs-actual intelligence,
- Meal Companion AI.

Definition of done:

- planowany posiłek może stać się logiem przez Confirm Sheet,
- plan nie wymaga pełnych przepisów,
- Planned Confirm Rate jest mierzalny,
- plan nie zwiększa poczucia porażki przy zmianie.

### 14.6 Faza 4 — Meal Companion Foundation

Cel:

> Użyć Smart Memory, planned meals i stanu dnia do prowadzenia użytkownika przez deterministic next-best-actions.

Zakres:

- next-best-action engine,
- Home Companion card,
- ranking planned/usual/catch-up/close-day,
- Companion copy variants,
- feedback loop: accepted/dismissed,
- guardrail: no AI in v1 Companion.

Definition of done:

- Home nie jest tylko dashboardem,
- next action prowadzi do downstream action,
- dismiss rate nie rośnie,
- Companion pozostaje calm i non-judgmental,
- Companion v1 działa bez AI.

### 14.7 Faza 5 — Week Plan Expansion + Grocery v1

Cel:

> Rozszerzyć Planned Meals Lite do użytecznego planu kilku dni z prostą listą zakupów.

Zakres:

- 3–5 day planning,
- fuzzy placeholders,
- day/week forecast,
- grocery item extraction,
- grocery categories,
- checkoff,
- export text,
- plan-vs-actual jako prosty insight, jeśli dane są stabilne.

Definition of done:

- grocery list działa bez scope bomb,
- forecast rozróżnia dane pewne, memory i estimate,
- Plan-vs-actual nie moralizuje,
- Grocery Utility Rate i Planned Confirm Rate są mierzalne.

### 14.8 Faza 6 — Big Post-Release Update

Cel:

> Spiąć publicznie Smart Memory, Friction Closures, Planned Meals / Week Plan i Meal Companion w jeden większy update.

Zakres komunikowany:

- Fitaly pamięta typowe posiłki i porcje.
- Home podpowiada najkrótszy kolejny krok.
- Możesz zaplanować kilka dni i szybko potwierdzać posiłki.
- Możesz domknąć dzień bez perfect trackingu.
- Możesz uzupełniać zaległości jednym opisem.

Warunek:

Nie komunikować tego jako big update, dopóki Smart Memory nie daje realnego skrócenia pracy, a planned/usual confirm flows nie są szybsze od ręcznego logowania.

## 15. Epiki do roadmapy

### Epic A — Smart Memory Data Foundation

Opis:

Zbudować domenową warstwę pamięci użytkownika, opartą o meal logs, review diffs, saved meals, rytm posiłków, preferencje i plan-vs-actual.

Zakres:

- modele danych,
- event contract,
- memory candidates,
- user-visible settings,
- delete/mute/edit/disable,
- feature flags,
- telemetry.

DoD:

- Smart Memory działa jako osobna warstwa domenowa,
- użytkownik widzi, co jest pamiętane,
- pamięć może zasilać review i Home,
- Memory Disable Rate jest mierzalny.

### Epic B — Correction Memory in Review

Opis:

Zamienić powtarzalne korekty w przyszłe defaulty i sugestie.

Zakres:

- capture review diff,
- detect repeated correction,
- propose/apply memory,
- apply correction pattern,
- measure future correction reduction.

DoD:

- powtarzalna korekta skutkuje pamięcią albo propozycją pamięci,
- podobny posiłek wymaga mniej korekt,
- podstawowa Correction / Portion Memory działa w free.

### Epic C — Meal Rhythm / Usual Meals

Opis:

Rozpoznać typowe posiłki według pory dnia i dnia tygodnia.

Zakres:

- meal slot patterns,
- usual meal candidates,
- Home shortcuts,
- Lightweight Confirm Sheet,
- suppression for wrong suggestions.

DoD:

- Home pokazuje trafne usuals,
- użytkownik może je sprawdzić, zapisać, edytować albo wyciszyć,
- usual meal nie zapisuje się bez minimalnego potwierdzenia.

### Epic D — Good-enough Review

Opis:

Zredukować burden review przez confidence bands i pytanie tylko o najważniejszą niepewność.

Zakres:

- confidence UX,
- one-key-question sheet,
- good-enough save,
- detailed edit as optional,
- events.

DoD:

- spada detailed edit rate dla wysokiej pewności,
- save latency spada,
- trust metrics nie pogarszają się.

### Epic E — Close Day + Catch-up

Opis:

Pozwolić użytkownikowi spokojnie domykać niepełne dni.

Zakres:

- day settlement state,
- missing meal detection,
- one-text catch-up,
- Bulk Catch-up Review,
- estimated meal creation,
- next-day recovery.

DoD:

- użytkownik może zamknąć dzień mimo luk,
- catch-up nie zapisuje automatycznie bez Bulk Review,
- Settled Day Rate mierzalny,
- D1 return po Close Day rośnie lub nie spada.

### Epic F — Planned Meals Lite

Opis:

Dodać lekki plan posiłków z plan-to-confirm przed pełnym Meal Companion i pełnym Week Plan.

Zakres:

- PlannedMeal model,
- plan grid 1–3 dni,
- lunch/kolacja jako główne sloty,
- manual planned meal,
- usual prefill,
- Lightweight Review / Confirm Sheet,
- change-of-plan,
- day forecast lite.

DoD:

- planowany posiłek może zostać zapisany po szybkim potwierdzeniu,
- Planned Confirm Rate jest główną metryką,
- plan nie wymaga pełnych przepisów,
- grocery nie jest warunkiem ukończenia tego epika.

### Epic G — Meal Companion Home

Opis:

Przekształcić Home w deterministic next-best-action surface.

Zakres:

- decision engine,
- companion card,
- action ranking,
- feedback,
- copy system,
- guardrail no-AI-v1.

DoD:

- Home prowadzi do działania,
- next-action acceptance jest mierzalne,
- dismiss rate mieści się w guardrailach,
- Companion v1 nie używa AI jako mechanizmu sugestii.

### Epic H — Ingredient Barcode Utility

Opis:

Przenieść barcode z meal-level Add Meal path do ingredient/product-level utility.

Zakres:

- barcode scan as ingredient add,
- product lookup,
- add item to Review/Edit Meal,
- manual fallback for no match,
- event taxonomy,
- Add Meal spec update.

DoD:

- barcode lookup nie tworzy całego MealLog,
- success lookup tworzy albo uzupełnia MealItem,
- brak matcha i brak odczytu są osobnymi stanami,
- Ingredient Barcode Utility jest mierzalne.

### Epic I — Grocery List v1

Opis:

Wygenerować prostą listę zakupów z planu wtedy, gdy planned meals są wystarczająco konkretne.

Zakres:

- grocery item extraction,
- categories,
- checked state,
- uncertain items,
- export text.

DoD:

- lista jest używalna bez pełnego recipe engine,
- grocery checkoff i export są mierzalne,
- grocery nie zmienia Fitaly w pantry/grocery product.

### Epic J — Premium Framing for Continuity System

Opis:

Ułożyć premium wokół mniejszego wysiłku i lepszej personalizacji.

Zakres:

- paywall copy,
- premium boundaries,
- feature usage instrumentation,
- first premium benefit after purchase.

DoD:

- premium nie jest workiem funkcji,
- użytkownik po zakupie używa konkretnego benefit,
- premium benefit adoption mierzalne.

## 16. MVP vs później

### 16.1 MVP publicznego update'u

Minimalny zestaw, który ma sens jako duży update:

- Smart Memory visible settings
- default-on Smart Memory z możliwością wyłączenia
- usual meals by time
- correction memory w review
- good-enough review
- Lightweight Review / Confirm Sheet
- Close Day
- Catch-up Mode z Bulk Review
- Planned Meals Lite
- plan-to-confirm
- Meal Companion Home card jako deterministic next action

Elementy opcjonalne dla big update, tylko jeśli są stabilne:

- podstawowa lista zakupów
- Week Plan Expansion 3–5 dni
- ingredient barcode utility, jeśli Add Meal spec i UX zostały już zaktualizowane

### 16.2 Nie robić w pierwszym update

- pełna baza przepisów,
- pantry inventory,
- delivery integrations,
- zaawansowane meal prep templates,
- dietetyczne programy tygodniowe,
- rozbudowana gamifikacja,
- „AI dietician” jako centralny produkt,
- AI fallback jako centrum Meal Companion v1,
- barcode jako osobne wejście do tworzenia całego posiłku,
- lokalizacja restauracji GPS,
- clinical/medical vertical,
- GLP-1-specific program bez osobnego trust stacku.

## 17. Ryzyka

| Ryzyko | Jak wygląda | Mitigacja |
|---|---|---|
| Za mało danych | Companion i Week Plan są generyczne | Najpierw Smart Memory Foundation. |
| Creepy memory | User czuje, że app wie za dużo | User-visible memory, edit/mute/delete/disable. |
| Default-on memory backlash | User wyłącza pamięć albo traci zaufanie | Jasny copy, Settings → Smart Memory, Memory Disable Rate jako guardrail. |
| Scope bomb | Planner zmienia się w recipe/grocery app | Planned Meals Lite przed Week Plan Expansion; grocery dopiero po stabilizacji. |
| Silent save bug | Plan/usual zapisuje się bez kontroli | confirmation_mode wymagane w domain eventach i testach. |
| Zbyt dużo pytań | Onboarding i profiling zwiększa drop-off | Progressive profiling tylko w kontekście. |
| Nieczytelny premium | User nie rozumie, za co płaci | Premium = mniej pracy + lepsze guidance. |
| AI overreach | Companion daje zbyt długie porady | Meal Companion v1 bez AI; next action > advice. |
| Reminder irritation | Więcej pushy, mniej zaufania | Suppression i downstream measurement. |
| Niedoskonałe forecasty | Plan wygląda precyzyjniej niż jest | Uncertainty bands i fuzzy labels. |
| Zbyt ciężki Close Day | Wieczorne domykanie staje się obowiązkiem | „Zostaw jako niepełny” jako pełnoprawna opcja. |
| Barcode jako meal path | Pojedynczy produkt wygląda jak dziwny posiłek | Barcode przenieść do ingredient/product add. |

## 18. Decyzje otwarte

### 18.1 Decyzje zamknięte

| Pytanie | Decyzja |
|---|---|
| Czy planowany posiłek może być zapisany bez Review? | Nie. Zawsze co najmniej Lightweight Review / Confirm Sheet. |
| Czy Week Plan Lite ma wejść przed Meal Companion Foundation? | Tak, ale jako bardzo ograniczone Planned Meals Lite bez pełnej Recipe Base i bez pełnej grocery list jako wymogu. |
| Jak traktujemy Smart Memory consent? | Smart Memory default-on z możliwością pełnego wyłączenia i usunięcia pamięci. |
| Czy Correction Memory ma być free czy premium? | Podstawowa Correction / Portion Memory w free; głębsze użycie cross-surface może być premium. |
| Czy Meal Companion v1 ma być całkowicie bez AI? | Tak. Deterministic rules engine. |
| Czy barcode jest top-level Add Meal input? | Nie. Barcode przechodzi do dodawania produktu/składnika. |

### 18.2 Nadal otwarte

1. Czy lista zakupów ma być free, premium, czy hybrydowa?
2. Czy Companion ma mieć osobną nazwę w UI, czy pozostać niewidoczną warstwą Home?
3. Jak mocno personalizować AI persona poza chatem, jeśli Companion v1 nie używa AI?
4. Jaki jest minimalny confidence threshold dla automatycznego użycia pamięci?
5. Czy planowane posiłki zużywają AI credits przy tworzeniu forecastu, jeśli forecast korzysta z AI w późniejszej wersji?
6. Czy fuzzy planned meals powinny wpływać na dzienny forecast liczbowo, czy tylko jakościowo?
7. Jak rozwiązać data retention i memory deletion UX w ustawieniach?
8. Czy ingredient barcode utility ma wejść razem z pierwszym post-release update, czy jako osobny cleanup Add Meal po launchu?

## 19. Sugerowana kolejność implementacji technicznej

1. Review diff normalization.
2. MemoryItem model.
3. Smart Memory settings with disable/delete/mute.
4. Save as usual.
5. Correction candidate generation.
6. Portion default application.
7. MealSlotPattern detection.
8. Home usual shortcuts.
9. Good-enough review.
10. Lightweight Review / Confirm Sheet.
11. DaySettlement model.
12. Catch-up parser.
13. Bulk Catch-up Review and estimated meal save.
14. PlannedMeal model.
15. Planned Meals Lite grid 1–3 days.
16. Planned-to-confirm flow.
17. Change-of-plan flow.
18. Next action engine.
19. Home Companion card.
20. Ingredient barcode lookup as MealItem utility.
21. WeekPlan expansion.
22. Grocery list v1.
23. Plan-vs-actual summary.
24. Premium framing and paywall update.
25. Big update marketing surface.

Zasada sekwencji:

> Najpierw mechaniki, które skracają zapis i budują pamięć. Dopiero potem większe powierzchnie planowania, grocery i publiczne story.

## 20. Przykładowe user stories

### Smart Memory

Jako użytkownik chcę, żeby Fitaly pamiętało moje typowe śniadanie, żebym nie musiał wpisywać go codziennie od nowa.

Acceptance criteria:

- po kilku podobnych logach Fitaly proponuje zapisanie posiłku jako usual albo zaczyna używać go jako aktywnej pamięci,
- użytkownik może zaakceptować, edytować, wyciszyć lub usunąć,
- usual pojawia się na Home rano,
- użytkownik może wyłączyć Smart Memory w ustawieniach.

### Correction Memory

Jako użytkownik chcę, żeby Fitaly uczyło się z moich korekt, żeby AI nie popełniało wciąż tych samych błędów.

Acceptance criteria:

- system wykrywa powtarzalną korektę,
- tworzy memory candidate albo aktywny memory item zależnie od confidence,
- kolejny podobny posiłek używa poprawionego defaultu,
- telemetry mierzy, czy korekta się zmniejszyła.

### Close Day

Jako użytkownik chcę zamknąć dzień nawet wtedy, gdy nie zapisałem wszystkiego idealnie.

Acceptance criteria:

- Home wykrywa częściowy dzień,
- oferuje uzupełnienie jednym opisem albo zostawienie luk,
- catch-up pokazuje Bulk Catch-up Review przed zapisem,
- po zapisie dzień ma status settled,
- następnego dnia użytkownik nie jest zawstydzany.

### Planned Meals

Jako użytkownik chcę zaplanować kilka posiłków, a później szybko je potwierdzać bez wpisywania wszystkiego od zera.

Acceptance criteria:

- użytkownik może dodać planned meals do najbliższych dni,
- widzi prosty forecast,
- w dniu posiłku może kliknąć „Sprawdź i zapisz jak zaplanowano”,
- aplikacja otwiera Lightweight Review / Confirm Sheet,
- użytkownik może oznaczyć, że plan się zmienił.

### Ingredient Barcode

Jako użytkownik chcę zeskanować kod produktu, żeby szybko dodać pojedynczy składnik do posiłku.

Acceptance criteria:

- barcode scan działa w Review/Edit Meal jako dodawanie składnika,
- sukces lookupu dodaje MealItem,
- brak matcha prowadzi do manualnego wpisania składnika,
- system nie tworzy całego posiłku z pojedynczego barcode produktu.

## 21. Copy bank

### Smart Memory

- „Zapamiętać jako Twoje typowe śniadanie?”
- „Używać tej porcji następnym razem?”
- „Fitaly może zapamiętać tę korektę i skrócić przyszłe logowanie.”
- „To wygląda jak posiłek, który często jesz rano.”
- „Nie pokazuj więcej tej sugestii.”
- „Smart Memory jest włączone. Możesz ją edytować albo wyłączyć w ustawieniach.”

### Meal Companion

- „Najprostszy następny krok: sprawdź lunch z planu.”
- „Możesz to zapisać jako wystarczająco dobre.”
- „Plan się zmienił — normalne. Zaktualizujmy dzień.”
- „Nie musisz doprecyzowywać wszystkiego.”
- „Dzień jest częściowo zapisany. Uzupełnić najważniejsze rzeczy?”

### Planned Meals / Week Plan

- „Zaplanuj kilka decyzji teraz, później tylko potwierdzaj.”
- „Użyj typowych posiłków.”
- „Ten dzień wygląda spokojnie.”
- „Sprawdź i zapisz jak zaplanowano.”
- „Lista zakupów gotowa z tego, co jest wystarczająco konkretne.”
- „Kolacja do decyzji — zostawiamy miejsce w planie.”

### Close Day

- „Zamknij dzień bez perfect trackingu.”
- „Masz wystarczająco dobry obraz dnia.”
- „Brakuje jednego posiłku. Możesz go uzupełnić jednym zdaniem.”
- „Możesz też zostawić ten dzień jako niepełny.”
- „Jutro najłatwiej wrócić od prostego pierwszego posiłku.”

### Ingredient barcode

- „Dodaj produkt kodem kreskowym.”
- „Nie znaleźliśmy tego produktu. Możesz wpisać go ręcznie.”
- „Kod odczytany. Sprawdzić produkt?”
- „Dodano składnik do posiłku.”

## 22. Marketing story dla big update

### Roboczy claim

> **Plan lightly. Confirm faster. Stay on track without perfect tracking.**

Polska wersja operacyjna:

> **Planuj lekko, potwierdzaj szybciej i ogarniaj jedzenie bez perfect trackingu.**

### Trzy proof points

1. **Smart Memory** — Fitaly pamięta typowe posiłki, porcje i korekty.
2. **Planned Meals / Week Plan** — zaplanuj kilka dni, zobacz forecast i później szybko potwierdzaj posiłki.
3. **Close Day + Catch-up** — uzupełnij zaległości i zamknij dzień spokojnie.

### Czego nie mówić

Nie mówić:

- „najdokładniejszy dietetyk AI”,
- „pełny meal prep system”,
- „AI zaplanuje Ci idealną dietę”,
- „nigdy więcej błędów w diecie”,
- „kontrola bez wyjątków”,
- „logowanie bez sprawdzania”.

Mówić:

- mniej tarcia,
- mniej mental load,
- spokojna pomoc,
- planowanie bez sztywności,
- tracking bez poczucia porażki,
- szybkie potwierdzanie zamiast ręcznej pracy.

## 23. Rekomendacja finalna

Ten kierunek powinien wejść na roadmapę jako **najważniejszy post-release product expansion**, ale pod warunkiem, że najpierw zostanie rozbudowana warstwa danych i pamięci.

Największy błąd byłby taki:

> Dodać Meal Companion i Week Plan jako osobne feature’y bez Smart Memory.

Drugi duży błąd:

> Przyspieszyć logowanie tak mocno, że produkt zacznie zapisywać planned/usual/catch-up meals bez kontroli użytkownika.

Najlepszy kierunek:

> **Smart Memory jako fundament, potem Friction Closures, Planned Meals Lite, deterministic Meal Companion i dopiero szerszy Week Plan / Grocery.**

To tworzy przewagę, której nie da się łatwo skopiować prostym AI scanem. Konkurencja może dodać kolejne wejście do logowania. Trudniej skopiować produkt, który z każdym tygodniem realnie zmniejsza wysiłek konkretnego użytkownika.

Finalny zapis roadmapowy:

> **Post-release roadmap should prioritize a unified Continuity System: Smart Memory first, then friction closures and Planned Meals Lite, then deterministic Meal Companion and Week Plan expansion. Build in phases, prevent silent saves, move barcode to ingredient-level utility, and package publicly as one major update only after memory-driven value is real.**

## 24. Aneks: materiał bazowy

Dokument opiera się na aktualnym kierunku strategicznym i wykonawczym Fitaly, w szczególności:

- Fitaly Brand & Marketing Direction SoT — calm, supportive, non-judgmental, less stress, less manual friction.
- Fitaly Launch Readiness / Release Playbook — launch scope, post-launch cadence, decyzje po 30 dniach, core loop discipline.
- Fitaly Analytics & KPI Spec — event taxonomy, ALD/AU, AI correction rate, reminder/report downstream utility, data governance.
- Fitaly Add Meal v2.2 — jeden lekki system Add Meal, krótki review, optional edit, dotychczas photo/text/barcode/saved jako wejścia do wspólnego review.
- Aktualna korekta v0.2 — barcode powinien zostać przeniesiony z meal-level Add Meal path do ingredient-level utility w Review / Edit Meal.
- Fitaly plan prac pre-launch — najpierw launch hardening i core loop, potem inteligencja i retencja.
- Decyzje produktowe v0.2: no silent save, Smart Memory default-on, Correction Memory jako core/free, deterministic Meal Companion v1, Planned Meals Lite przed pełnym Companion/Week Plan.
