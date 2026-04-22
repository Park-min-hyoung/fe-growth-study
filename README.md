# fe-growth-study

브라우저 엔진 레벨 역량 강화를 위한 **최대 100일** 학습 프로젝트 (하루 2~3시간 기준)

> 브라우저 API 87일 + Side Study(번들 분석, 패키지 매니저, 환경변수, Docker, Cloud/CI/CD) 13일

## 개발 환경 세팅

```bash
cd ~/Desktop/fe-growth-study
npm install
npm run dev
```

- **스택**: Vite + React + TypeScript
- **주요 라이브러리**: D3, Zustand, React Query, ky, Zod, DOMPurify

## 커리큘럼

### Module 1: Selection API 심화 (Day 01-07)

| Day | 주제 | 파일명 | 난이도 |
|-----|------|--------|--------|
| 01 | Range 객체 - 생성, setStart/setEnd, cloneRange | `range-basics.tsx` | ⭐⭐⭐ |
| 02 | Selection 객체 - addRange, removeAllRanges, collapse | `selection-control.tsx` | ⭐⭐⭐ |
| 03 | TreeWalker - 텍스트 노드 순회, 필터링 | `tree-walker.tsx` | ⭐⭐⭐⭐ |
| 04 | 글로벌 오프셋 기반 커서(Caret) 제어 | `caret-control.tsx` | ⭐⭐⭐⭐⭐ |
| 05 | 커서 좌표 추적 (getBoundingClientRect, caretRangeFromPoint) | `caret-coordinates.tsx` | ⭐⭐⭐⭐ |
| 06 | CSS Custom Highlight API | `highlight-api.tsx` | ⭐⭐⭐⭐ |
| 07 | selectionchange 이벤트 + 플로팅 툴바 위치 계산 | `floating-toolbar.tsx` | ⭐⭐⭐⭐⭐ |

### Module 2: Command 패턴 (Day 08-14)

| Day | 주제 | 파일명 | 난이도 |
|-----|------|--------|--------|
| 08 | Command 인터페이스 설계 (execute/undo) | `command-interface.ts` | ⭐⭐⭐ |
| 09 | ToggleMarkCommand - bold 적용/해제 | `toggle-mark-bold.tsx` | ⭐⭐⭐⭐ |
| 10 | ToggleMarkCommand - italic, underline + 중첩 마크 | `toggle-mark-multi.tsx` | ⭐⭐⭐⭐⭐ |
| 11 | InsertBlockCommand - heading (h1/h2) | `insert-block-heading.tsx` | ⭐⭐⭐⭐ |
| 12 | InsertBlockCommand - list (ul/ol) | `insert-block-list.tsx` | ⭐⭐⭐⭐⭐ |
| 13 | SetLinkCommand + CompositeCommand | `link-and-composite.tsx` | ⭐⭐⭐⭐⭐ |
| 14 | 단축키 매핑 시스템 + CommandManager | `shortcut-manager.tsx` | ⭐⭐⭐⭐⭐ |

### Module 3: Undo/Redo 시스템 (Day 15-20)

| Day | 주제 | 파일명 | 난이도 |
|-----|------|--------|--------|
| 15 | History 상태 모델 (past/present/future) | `history-model.ts` | ⭐⭐⭐⭐ |
| 16 | historyReducer 구현 (PUSH/UNDO/REDO) | `history-reducer.ts` | ⭐⭐⭐⭐⭐ |
| 17 | 불변 상태 업데이트 유틸리티 | `immutable-utils.ts` | ⭐⭐⭐⭐⭐ |
| 18 | 스냅샷 최적화 (중복 방지, 크기 제한, diff) | `snapshot-optimize.ts` | ⭐⭐⭐⭐⭐⭐ |
| 19 | useEditorHistory 훅 + 단축키 연결 | `use-editor-history.tsx` | ⭐⭐⭐⭐⭐ |
| 20 | 히스토리 시각화 + CommandManager 연동 | `history-visualization.tsx` | ⭐⭐⭐⭐⭐⭐ |

### Module 4: HTML ↔ JSON 직렬화 (Day 21-25)

| Day | 주제 | 파일명 | 난이도 |
|-----|------|--------|--------|
| 21 | TextNode → 인라인 HTML 변환 | `text-to-html.ts` | ⭐⭐⭐ |
| 22 | Block → HTML 변환 (docToHtml 완성) | `doc-to-html.ts` | ⭐⭐⭐⭐ |
| 23 | HTML → Block 파싱 (htmlToDoc) | `html-to-doc.ts` | ⭐⭐⭐⭐⭐ |
| 24 | DOMPurify 설정 + XSS 방어 | `sanitization.ts` | ⭐⭐⭐⭐ |
| 25 | paste 핸들러 + roundtrip 테스트 | `paste-handler.tsx` | ⭐⭐⭐⭐⭐ |

### 🛠 Side Study A: 번들 분석 (Day 26)

| Day | 주제 | 내용 |
|-----|------|------|
| 26 | Vite 번들 분석 | `rollup-plugin-visualizer` 설치 + 이 프로젝트 번들 직접 분석 |

---

### Module 5: IME 처리 + 자동저장 (Day 27-31)

| Day | 주제 | 파일명 | 난이도 |
|-----|------|--------|--------|
| 27 | compositionstart/update/end 이벤트 이해 | `composition-events.tsx` | ⭐⭐⭐⭐ |
| 28 | IME 상태 관리 (isComposing 플래그) | `ime-state.tsx` | ⭐⭐⭐⭐⭐ |
| 29 | IME + Selection 충돌 해결 | `ime-selection-sync.tsx` | ⭐⭐⭐⭐⭐⭐ |
| 30 | debounce 구현 + 자동저장 시스템 | `auto-save.tsx` | ⭐⭐⭐⭐ |
| 31 | ETag 충돌 감지 + 충돌 해결 UI | `conflict-resolution.tsx` | ⭐⭐⭐⭐⭐⭐ |

### 🛠 Side Study B: 패키지 매니저 (Day 32-33)

| Day | 주제 | 내용 |
|-----|------|------|
| 32 | pnpm 전환 | npm → pnpm 마이그레이션, workspace 개념 이해 |
| 33 | 의존성 관리 | peer dependency, hoisting, lockfile 원리 |

---

### Module 6: Canvas API 심화 (Day 34-40)

| Day | 주제 | 파일명 | 난이도 |
|-----|------|--------|--------|
| 34 | Canvas 2D 기본 드로잉 (도형, 경로, 텍스트) | `canvas-drawing.tsx` | ⭐⭐⭐ |
| 35 | Canvas 이미지 로딩 + drawImage | `canvas-image.tsx` | ⭐⭐⭐ |
| 36 | 좌표 변환 매트릭스 (translate, rotate, scale) | `canvas-transform.tsx` | ⭐⭐⭐⭐⭐ |
| 37 | 픽셀 조작 (getImageData, putImageData) | `pixel-manipulation.tsx` | ⭐⭐⭐⭐ |
| 38 | 색상 채널 조작 (밝기, 대비, 그레이스케일) | `color-channels.tsx` | ⭐⭐⭐⭐⭐ |
| 39 | Canvas 합성 (globalCompositeOperation) | `canvas-compositing.tsx` | ⭐⭐⭐⭐ |
| 40 | 고DPI(Retina) 대응 + Blob/DataURL 변환 | `hidpi-export.tsx` | ⭐⭐⭐⭐⭐ |

### 🛠 Side Study C: 환경변수 관리 (Day 41-42)

| Day | 주제 | 내용 |
|-----|------|------|
| 41 | 환경변수 기초 | `.env`, `.env.production`, Vite의 `import.meta.env` 체계 |
| 42 | 빌드 타임 vs 런타임 | 환경변수가 번들에 어떻게 삽입되는지, secrets 관리 원칙 |

---

### Module 7: Web Worker + OffscreenCanvas (Day 43-48)

| Day | 주제 | 파일명 | 난이도 |
|-----|------|--------|--------|
| 43 | Web Worker 기본 (생성, 통신, 종료) | `worker-basics.tsx` | ⭐⭐⭐ |
| 44 | Worker에서 이미지 데이터 처리 | `worker-image.tsx` + `image.worker.ts` | ⭐⭐⭐⭐ |
| 45 | OffscreenCanvas 생성 + Worker 전달 | `offscreen-canvas.tsx` | ⭐⭐⭐⭐⭐ |
| 46 | Transferable Objects 성능 최적화 | `transferable-objects.tsx` | ⭐⭐⭐⭐⭐ |
| 47 | Worker 진행률 보고 (progress events) | `worker-progress.tsx` | ⭐⭐⭐⭐ |
| 48 | Worker 파이프라인 패턴 (순차 연산 체이닝) | `worker-pipeline.tsx` | ⭐⭐⭐⭐⭐⭐ |

### Module 8: EXIF + 이미지 변환 (Day 49-53)

| Day | 주제 | 파일명 | 난이도 |
|-----|------|--------|--------|
| 49 | EXIF 데이터 파싱 (DataView + ArrayBuffer) | `exif-parser.ts` | ⭐⭐⭐⭐⭐⭐ |
| 50 | EXIF orientation 자동 회전 | `exif-rotation.tsx` | ⭐⭐⭐⭐⭐ |
| 51 | Crop 연산 구현 | `crop-operation.tsx` | ⭐⭐⭐⭐ |
| 52 | Resize 연산 (비율 유지, 보간법) | `resize-operation.tsx` | ⭐⭐⭐⭐⭐ |
| 53 | Rotate 연산 (임의 각도, Canvas 크기 재계산) | `rotate-operation.tsx` | ⭐⭐⭐⭐⭐ |

### 🛠 Side Study D: Docker (Day 54-56)

| Day | 주제 | 내용 |
|-----|------|------|
| 54 | Docker 기초 | 컨테이너/이미지 개념, `docker run`, `docker ps` |
| 55 | Dockerfile 작성 | 이 프로젝트 Dockerfile 직접 작성 + 빌드 |
| 56 | docker-compose | 로컬 개발 환경 구성 |

---

### Module 9: 필터 + 내보내기 (Day 57-60)

| Day | 주제 | 파일명 | 난이도 |
|-----|------|--------|--------|
| 57 | 이미지 필터 (세피아, 인버트, 블러) | `image-filters.tsx` | ⭐⭐⭐⭐ |
| 58 | 커스텀 컨볼루션 필터 (샤픈, 엣지 검출) | `convolution-filter.tsx` | ⭐⭐⭐⭐⭐⭐ |
| 59 | WebP/PNG 내보내기 + 품질 슬라이더 | `image-export.tsx` | ⭐⭐⭐⭐ |
| 60 | AbortController + 전체 이미지 파이프라인 통합 | `image-pipeline.tsx` | ⭐⭐⭐⭐⭐⭐⭐ |

### 🛠 Side Study E: Cloud + CI/CD + 배포 (Day 61-64)

| Day | 주제 | 내용 |
|-----|------|------|
| 61 | Cloud 기초 | AWS S3 + CloudFront 개념, 정적 호스팅 원리 |
| 62 | GitHub Actions 기초 | workflow 파일 작성, 트리거, 잡 구성 |
| 63 | CI/CD 파이프라인 | 이 프로젝트 빌드 → S3 배포 자동화 직접 구성 |
| 64 | 배포 점검 | 환경변수 주입, 캐시 무효화, 롤백 방법 |

---

### Module 10: D3 기초 + React 패턴 (Day 65-69)

| Day | 주제 | 파일명 | 난이도 |
|-----|------|--------|--------|
| 65 | D3 스케일 (scaleLinear, scaleBand) | `scales-basic.tsx` | ⭐⭐⭐ |
| 66 | D3 스케일 (scaleTime, scaleOrdinal, 색상 스케일) | `scales-advanced.tsx` | ⭐⭐⭐⭐ |
| 67 | D3 축(axis) + 포맷터 | `axis-formatter.tsx` | ⭐⭐⭐⭐ |
| 68 | D3 도형 생성기 (line, area, arc) | `shape-generators.tsx` | ⭐⭐⭐⭐ |
| 69 | "D3 in, React out" 패턴 + SVG viewBox | `d3-react-pattern.tsx` | ⭐⭐⭐⭐⭐ |

### Module 11: Line & Bar 차트 (Day 70-74)

| Day | 주제 | 파일명 | 난이도 |
|-----|------|--------|--------|
| 70 | Line 차트 기본 구현 | `line-chart.tsx` | ⭐⭐⭐⭐ |
| 71 | Line 차트 - 다중 시리즈 + 애니메이션 | `line-chart-multi.tsx` | ⭐⭐⭐⭐⭐ |
| 72 | Bar 차트 기본 구현 | `bar-chart.tsx` | ⭐⭐⭐⭐ |
| 73 | Bar 차트 - 그룹/스택 + 반응형(ResizeObserver) | `bar-chart-advanced.tsx` | ⭐⭐⭐⭐⭐⭐ |
| 74 | 차트 공통 컴포넌트 (Axis, Grid, Legend) | `chart-components.tsx` | ⭐⭐⭐⭐⭐ |

### Module 12: Pie + 범례 + 인터랙션 (Day 75-80)

| Day | 주제 | 파일명 | 난이도 |
|-----|------|--------|--------|
| 75 | Pie/Donut 차트 구현 | `pie-chart.tsx` | ⭐⭐⭐⭐ |
| 76 | 범례 + 툴팁 컴포넌트 | `legend-tooltip.tsx` | ⭐⭐⭐⭐ |
| 77 | 차트 인터랙션 (hover, click, brush) | `chart-interactions.tsx` | ⭐⭐⭐⭐⭐⭐ |
| 78 | D3 zoom + pan 구현 | `zoom-pan.tsx` | ⭐⭐⭐⭐⭐⭐ |
| 79 | 키보드 내비게이션 (데이터 포인트 간 이동) | `keyboard-nav.tsx` | ⭐⭐⭐⭐⭐ |
| 80 | ARIA 접근성 + SVG/PNG 내보내기 | `a11y-export.tsx` | ⭐⭐⭐⭐⭐⭐ |

### Module 13: 공통 역량 (Day 81-85)

| Day | 주제 | 파일명 | 난이도 |
|-----|------|--------|--------|
| 81 | Zustand 기본 (스토어 설계, 셀렉터) | `zustand-basics.tsx` | ⭐⭐⭐ |
| 82 | Zustand 심화 (미들웨어, persist, devtools) | `zustand-advanced.tsx` | ⭐⭐⭐⭐⭐ |
| 83 | React Query (useQuery, useMutation, 캐시) | `react-query-basics.tsx` | ⭐⭐⭐⭐ |
| 84 | React Query + ky (API 클라이언트, 인터셉터) | `api-client.tsx` | ⭐⭐⭐⭐⭐ |
| 85 | Zod 런타임 검증 (스키마 정의, DTO 변환) | `zod-validation.tsx` | ⭐⭐⭐⭐ |

### Module 14: 통합 (Day 86-87)

| Day | 주제 | 파일명 | 난이도 |
|-----|------|--------|--------|
| 86 | 에러 바운더리 + 전역 에러 처리 | `error-boundary.tsx` | ⭐⭐⭐⭐⭐ |
| 87 | 통합 (에디터 + 이미지 모달 + 차트 삽입) | `integration.tsx` | ⭐⭐⭐⭐⭐⭐⭐⭐ |

## 추가된 개념 및 이유

| 추가 개념 | 이유 |
|-----------|------|
| `TreeWalker` (Day 03) | Selection API로 중첩된 인라인 요소 내 텍스트 노드를 정확히 순회하려면 필수. childNodes 재귀보다 효율적 |
| `caretRangeFromPoint` (Day 05) | 마우스 좌표에서 텍스트 위치를 역추적할 때 필요. 드래그 앤 드롭, 플로팅 UI 위치 계산에 활용 |
| `ResizeObserver` (Day 61) | D3 차트의 반응형 구현에 필수. viewBox만으로는 축/레이블 리사이즈를 세밀하게 제어할 수 없음 |
| `AbortController` (Day 52) | 이미지 처리 파이프라인에서 사용자가 작업 취소 시 Worker 및 네트워크 요청을 안전하게 중단하기 위해 필요 |
| `Transferable Objects` (Day 41) | Worker 간 대용량 데이터(ImageData) 전송 시 복사 비용 제거. 성능에 결정적 영향 |
| `컨볼루션 필터` (Day 50) | 이미지 처리의 핵심 알고리즘. 샤픈, 블러, 엣지 검출 등의 원리를 이해하면 커스텀 필터 구현 가능 |
| `DataView` (Day 44) | EXIF 파싱에 필수. 바이너리 데이터를 바이트 단위로 읽는 저수준 API 이해 |
| `Zod` 런타임 검증 (Day 73) | API 응답의 런타임 타입 안전성 확보. TypeScript 컴파일 타임 검증만으로는 외부 데이터를 신뢰할 수 없음 |
| 에러 바운더리 (Day 74) | 에디터/이미지/차트 모듈을 통합할 때, 한 모듈의 에러가 전체 앱을 크래시시키지 않도록 격리 필요 |
| `CSS Custom Highlight API` (Day 06) | 검색 하이라이트 등 실무에서 자주 사용. DOM을 변경하지 않고 시각적 하이라이트 가능 |
| `D3 brush` (Day 65) | 차트에서 범위 선택(영역 줌, 데이터 필터링)에 사용. 실무 대시보드에서 필수 인터랙션 |

## 학습 방법

1. 각 day 폴더의 파일을 열어 TODO 주석과 힌트를 읽는다
2. 뼈대 코드 위에 직접 구현한다
3. 파일 하단의 체크리스트로 완료 여부를 판단한다
4. 완료 후 커밋: `git add . && git commit -m "dayNN: 주제"`
