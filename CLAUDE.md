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

## `*.answer.tsx` 파일 생성

사용자가 "dayNN 답안 파일 생성" 입력 시 \*.answer.tsx 파일을 생성한다.

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
