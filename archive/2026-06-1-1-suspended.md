# Fitaly 1.1 — nota zawieszenia

Status: suspended until Fitaly 1.0 launch
Data decyzji: 2026-06-25
Owner: release owner

## Powód

Część prac nad 1.1 została wykonana w czasie, gdy release work był chwilowo
zablokowany. Po odzyskaniu możliwości pracy nad launchem priorytet wraca do
Fitaly 1.0.

Wykonany kod 1.1 nie jest automatycznie produkcyjnie gotowy i nie może być
liczony jako launch readiness.

## Zawieszone domeny

- Food Library / production autocomplete;
- Smart Memory capture, projection, Memory Center i Review apply;
- Known Patterns;
- Recipe Catalog;
- Planned Meals / Planning;
- Home Next Action;
- Review Memory Explanation;
- szerszy Continuity System, Meal Companion i Week Plan.

## Polityka do launchu

- Kod może pozostać na branchach release-hardening.
- Wszystkie flagi nowych domen muszą pozostać `false` w produkcji.
- Wyłączone domeny nie mogą wykonywać requestów, background work ani ukrytych
  fallbacków.
- UI nie może prowadzić do aktywnych ekranów 1.1 poza jawny disabled state.
- Nie rozwijamy 1.1, chyba że fix jest konieczny do bezpieczeństwa core release,
  izolacji flag albo poprawności export/delete.
- Nie wolno uznać release za gotowy na podstawie testów domen 1.1.

## Zachowane guardraile produktowe

Po wznowieniu prac nadal obowiązują:

- brak silent meal logging;
- plan, known pattern i remembered meal muszą przejść przez Review/Confirm;
- runtime AI nie jest źródłem eligibility, zgodności dietetycznej ani trwałej
  prawdy o użytkowniku;
- unknown pozostaje jawne jako unknown/reveal state;
- użytkownik ma kontrolę nad pamięcią, jej wyłączeniem i usunięciem;
- Home Next Action uruchamiać dopiero po osobnym zamknięciu source domains.

## Warunki wznowienia

1. Fitaly 1.0 ma podpisaną decyzję `CORE_RC_READY` i został wydany.
2. Day0-Day7 nie wymaga release-critical hotfixów blokujących roadmapę.
3. Aktualne dane launchowe potwierdzają priorytet problemu.
4. Powstaje nowy, mały plan z własnym scope, metrykami, gate'ami i rolloutem.
5. Stare plany `00-09` nie są reaktywowane.

## Wycofane dokumenty

Z aktywnego indeksu usunięto historyczne dokumenty Controller/Worker/QA,
post-release intelligence roadmap, Smart Memory closure packet oraz katalog
Launch Hardening CWQ. Historia zmian pozostaje dostępna w Git.
