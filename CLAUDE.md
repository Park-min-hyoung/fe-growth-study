# fe-growth-study

브라우저 엔진 레벨 역량 강화를 위한 최대 100일 학습 프로젝트 (브라우저 API 87일 + Side Study 13일).
전체 커리큘럼(day별 주제·파일명)은 [README.md](./README.md)를 기준으로 한다.
브라우저 네이티브 API(Range, Selection, Canvas, Web Worker 등)를 직접 구현하며 동작 원리를 익히는 것이 목표.

## 진행 상황

- 현재 학습 중: Day05 (`src/App.tsx`에 활성화되어 있음)
- Day08~10: 학습/답안 파일(`command-interface.ts`, `toggle-mark-bold.tsx`, `toggle-mark-multi.tsx`)이 미리 생성되어 있으나 전부 TODO 스텁 상태로 아직 구현 전. `App.tsx`에도 향후 참조용으로 import만 미리 추가되고 주석 처리되어 있음
- 이 섹션은 학습이 진행됨에 따라 자주 바뀌므로, 실제 구현 여부는 각 파일 하단 체크리스트와 TODO 잔존 여부로 다시 확인할 것

## 명령어

- `npm run dev`: Vite 개발 서버 시작
- `npm run build`: TypeScript 빌드 + Vite 번들
- `npm run lint`: ESLint 검사
- `npm run preview`: 빌드 결과 미리보기

## 스택

- Vite + React 19 + TypeScript (strict 모드)
- D3, Zustand, React Query, ky, Zod, DOMPurify

## 프로젝트 구조

- `src/days/dayNN/`: 각 day별 학습 파일
  - `*.tsx` / `*.ts`: 직접 구현하는 파일 (TODO 주석 포함, UI 없는 day는 `.ts`)
  - `*.answer.tsx` / `*.answer.ts`: 정답 파일 (구현 완료 후 비교용)
  - `dayNN-blog.md`: 블로깅용 학습 정리 문서
- `src/App.tsx`: 각 day 데모 컴포넌트를 import 후 주석 토글로 렌더링 (학습 중인 day만 활성화)

## 학습 파일 작업 시 주의사항

- 각 파일 하단 체크리스트 기준으로 구현 완료 여부 판단
- `*.answer.ts(x)`는 참고용이므로 수정하지 않음
- 커밋 컨벤션: `study: DayNN 주제명` (예: `study: Day01 Range API 학습`)

## 코드 스타일

- TypeScript strict 모드, `any` 타입 금지
- 컴포넌트는 named export + default export 병행 (데모 컴포넌트는 default export)
- 학습 목적 코드이므로 과도한 추상화 금지 — 명시적이고 읽기 쉬운 코드 우선

## `*.answer.tsx` 파일 생성

사용자가 "dayNN 답안 파일 생성" 입력 시 `*.answer.tsx` (UI 없는 day는 `*.answer.ts`) 파일을 생성한다.

- 같은 day의 학습 파일(`*.tsx` / `*.ts`)의 TODO와 하단 체크리스트를 모두 충족하도록 작성
- 학습 파일과 동일한 export 이름·시그니처를 유지하여 비교하기 쉽게 작성

## 푸시

사용자가 "푸시" 혹은 "커밋" 이라고 입력하면, 현재 변경사항을 분석하여 적절한 커밋 메시지로 커밋 후 GitHub에 푸시한다.

### 커밋 메시지 규칙

- 프로젝트 커밋 컨벤션을 따른다: `study: DayNN 주제명`
- 학습 파일(`src/days/dayNN/`) 변경이 주인 경우: `study: DayNN [학습 주제]`
- 설정/구조 변경인 경우: `chore: [변경 내용]`
- 복수의 day가 섞인 경우: 가장 최신 day 기준으로 작성

### 실행 순서

1. `git status`와 `git diff`로 변경사항 확인
2. 변경된 파일 내용을 바탕으로 커밋 메시지 결정 후 사용자에게 제안
3. 사용자 승인 후 `git add` → `git commit` → `git push` 순으로 실행

## 블로깅용 MD 문서 생성

사용자가 "블로깅용 MD문서 생성"이라고 입력하면, [blog.md](./blog.md)의 문서 형식과 생성 규칙을 따라 마크다운 문서를 생성한다.
