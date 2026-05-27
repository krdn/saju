# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm test              # Run all tests (vitest)
pnpm test -- src/compose/yearly.test.ts   # Run a single test file
pnpm typecheck         # tsc --noEmit
pnpm build             # tsup → dist/ (ESM only)
```

## What This Is

`@krdn/saju` — a TypeScript library for Korean Four Pillars of Destiny (사주명리) computation. It takes a birth date/time and produces a chart (SajuChart), then analyzes it through 4 cultural schools (ko, cn-ziping, cn-mangpai, jp) across 4 time axes (lifetime, yearly, monthly, daily). The library also provides LLM prompt templates and Zod response schemas for narrative generation.

Domain vocabulary is in `CONTEXT.md`.

## Architecture

Three layers, each depending only on the one below it:

### 1. Core Computation (src root files)

`computeSajuChart(input)` is the main entry point — a sync pipeline:
```
computePillars → computeElements → computeShenStrength → computeTenGods → computePattern → computeMajorFortunes
```
Supporting modules: `hanja.ts` (天干/地支 constants + mappings), `types.ts` (Pillar, SajuChart, Strength, etc.), `time/trueSolar.ts` (진태양시 correction + hour ambiguity), `consensus/` (two-library day pillar verification).

### 2. Adapters + Compose (src/adapters/, src/compose/)

Each school (`adapters/ko/`, `adapters/cn-ziping/`, `adapters/cn-mangpai/`, `adapters/jp/`) implements per-time-axis builders: `lifetime.ts`, `yearly.ts`, `monthly.ts`, `daily.ts`, `yongshin.ts`.

`compose/` orchestrates 4-school fan-out + cross-check reconciliation. `resolveChartContext` is the shared entry point for all `*FromBirth` wrappers — it handles trueSolar → consensus → chart + daeun in one place.

Key types: `TriNationLifetime`, `TriNationYearly`, `TriNationMonthly`, `TriNationDailyLite` (all in `core/extendedTypes.ts` and `types/`).

### 3. LLM Integration (src/prompts/, src/schemas/)

- `prompts/` — school-specific system prompts + narrative templates per time axis.
- `schemas/` — Zod validation schemas per time axis. Each schema file has the same structure with different min/max thresholds. `schemas/common.ts` has LLM variance normalizers (handles Gemini returning objects instead of arrays, etc.).

## Key Design Decisions

- **All computation is synchronous.** No async anywhere — lunar-javascript and korean-lunar-calendar are sync.
- **Result\<T\> for compose errors.** `{ ok: true, value: T } | { ok: false, error: SajuError }`. Individual adapter failures are caught by `safeFrame()` — one school failing doesn't break the whole response.
- **Two-library consensus.** `verifyConsensus()` compares lunar-javascript vs korean-lunar-calendar day pillars before any analysis. Mismatch → `LIBRARY_MISMATCH` error.
- **lunar-javascript has no types.** Custom declarations in `src/lunar-javascript.d.ts`.

## Test Patterns

- Tests are co-located: `foo.ts` → `foo.test.ts` in the same directory.
- Integration tests in `tests/canonical.test.ts` with fixtures.
- Snapshot tests in `compose/yearly.wrapper.test.ts` for byte-identical regression.
- Canonical test fixture: 1967-03-29 05:30 KST 男 (壬辰 day pillar, 傷官格).
- Mocking pattern: `vi.mock("../module", { spy: true })` + `mockReturnValueOnce` for one-shot overrides.
