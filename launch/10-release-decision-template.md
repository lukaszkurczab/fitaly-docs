# 10 — Release Decision Template

Skopiuj `templates/release-evidence.md` do pliku:

```text
launch/evidence/<rc-id>/release-evidence.md
```

## Dozwolone decyzje

### `CORE_RC_READY`

Wszystkie P0 gate'y przeszły dla jednej, dokładnej pary FE/BE. Brak
nierozwiązanych P0. Każdy waived P1 ma ownera, uzasadnienie i plan.

### `NO_GO`

Istnieje potwierdzony product/code/config problem uniemożliwiający release.

### `BLOCKED_EXTERNAL_DEPENDENCY`

Brakuje wymaganego zewnętrznego dowodu lub zasobu: credentials, store access,
provider/sandbox, deployment, legal approval, AVD/runner lub podobnego. Nie
używaj tej decyzji do ukrywania błędu produktu.

## Reguły

- Decyzja dotyczy dokładnych SHA i buildów wymienionych w evidence.
- Nowy commit unieważnia zależne dowody.
- Local, CI, smoke i store evidence muszą być rozróżnione.
- Nie można wydać `CORE_RC_READY` z nieprzetestowanym Androidem lub billingiem,
  jeśli są częścią publicznego release.
- 1.1 pozostaje poza decyzją i production-off.
- Release owner podpisuje datę, decyzję i zakres rollout.
