# fe-growth-study

브라우저 엔진 레벨 역량 강화를 위한 75일 학습 프로젝트.
브라우저 네이티브 API(Range, Selection, Canvas, Web Worker 등)를 직접 구현하며 동작 원리를 익히는 것이 목표.

## 명령어

- `npm run dev`: Vite 개발 서버 시작
- `npm run build`: TypeScript 빌드 + Vite 번들
- `npm run lint`: ESLint 검사

## 스택

- Vite + React 19 + TypeScript (strict 모드)
- D3, Zustand, React Query, ky, Zod, DOMPurify

## 프로젝트 구조

- `src/days/dayNN/`: 각 day별 학습 파일
  - `*.tsx`: 직접 구현하는 파일 (TODO 주석 포함)
  - `*.answer.tsx`: 정답 파일 (구현 완료 후 비교용)

## 학습 파일 작업 시 주의사항

- 각 파일 하단 체크리스트 기준으로 구현 완료 여부 판단
- `*.answer.tsx`는 참고용이므로 수정하지 않음
- 커밋 컨벤션: `study: DayNN 주제명` (예: `study: Day01 Range API 학습`)

## 코드 스타일

- TypeScript strict 모드, `any` 타입 금지
- 컴포넌트는 named export + default export 병행 (데모 컴포넌트는 default export)
- 학습 목적 코드이므로 과도한 추상화 금지 — 명시적이고 읽기 쉬운 코드 우선
