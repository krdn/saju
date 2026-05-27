# Domain Glossary

## Core Concepts

- **Pillar (柱)** — 사주의 4개 시간 위치 (년주/월주/일주/시주). 각각 천간(Stem) + 지지(Branch)로 구성.
- **Chart (SajuChart)** — 4주 + 오행 분포 + 신강/신약 + 십신 + 격국 + 용신/기신 + 대운을 묶은 완성된 명식.
- **School (學派)** — 해석 전통. ko (한국), cn-ziping (중국 자평), cn-mangpai (중국 맹파), jp (일본 추명학).
- **TimeAxis (時間軸)** — 분석 시간 단위. lifetime (평생운), yearly (년운/세운), monthly (월운), daily (일진).

## Computation Pipeline

- **ChartContext** — 출생 정보(BirthInputResolved)로부터 진태양시 보정 + 만세력 합의 검증 + SajuChart + 대운을 묶은 검증된 컨텍스트. 4개 TimeAxis FromBirth wrapper의 공통 진입점.

## Analysis Concepts

- **Yongshin (用神)** — 유리한 오행. 학파별 도출 방식이 다름 (ko: 조후, cn-ziping: 격국, cn-mangpai: 고유 휴리스틱).
- **Gisin (忌神)** — 불리한 오행.
- **Gyeokguk (格局)** — 명식의 카테고리 패턴 (예: 偏印格, 正財格).
- **Strength (身勢)** — 일간의 강약 판정. 신강/신약/균형/종아/종재/종살.
- **Daeun (大運)** — 10년 단위 운세 주기. 방향은 연간 양음 + 성별로 결정.
