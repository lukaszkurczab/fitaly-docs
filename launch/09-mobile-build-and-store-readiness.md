# 09 — Mobile Build i Store Readiness

Status: required launch gate

## Build config

Potwierdź:

- `appVersionSource=remote` i poprawne version/build numbers;
- production API URL;
- production flags;
- signing/credentials;
- Android target SDK zgodny z aktualnym store requirement i repo gate;
- Android artifact = AAB;
- iOS bundle identifier `com.lkurczab.foodscannerai` pozostaje świadomym legacy
  wyjątkiem związanym z istniejącym listingiem;
- Android package i iOS bundle są powiązane z właściwymi Firebase/RevenueCat
  aplikacjami;
- Sentry release/environment i sourcemaps/upload.

## Production checks

```bash
cd fitaly
npm run check:launch-readiness:android
npm run check:launch-readiness:ios
```

Finalne buildy:

```bash
npm run publish:android
npm run publish:ios
```

## Install/update sanity

Na internal track/TestFlight:

- clean install;
- update z ostatniej dostępnej wersji;
- startup i session restore;
- auth/onboarding;
- Add Meal, Review/save, History/Stats;
- AI i billing;
- notifications/permissions;
- export/delete;
- app background/foreground;
- crash/relaunch;
- network loss/recovery.

## Permissions i platform behavior

Zweryfikuj copy i behavior dla:

- camera;
- photo/media library;
- notifications;
- storage/share, jeśli wymagane;
- denied/permanently denied/retry;
- Android back button i system dialogs;
- iOS safe areas i modal presentation;
- keyboard i touch targets.

## Store package

- app name, subtitle/short description i category;
- screenshots zgodne z aktualnym UI;
- privacy policy, terms, support URL i contact;
- account deletion disclosure;
- data safety/privacy labels zgodne z telemetry, AI, Firebase, RevenueCat i
  Sentry;
- subscription terms, prices i restore copy;
- age rating i content declarations;
- release notes;
- phased rollout i stop mechanism.

## Acceptance

- oba production artifacts zbudowane i instalowalne;
- sanity passed na TestFlight/internal Play track;
- metadata i disclosures zatwierdzone;
- brak placeholderów, debug config i 1.1 exposure;
- rollback/pause rollout możliwy.
