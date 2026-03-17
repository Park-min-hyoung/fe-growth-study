/**
 * Day 01 - Range 객체 기본
 * 난이도: ⭐⭐⭐
 *
 * 학습 목표:
 * - document.createRange()로 Range 객체를 생성하고 조작
 * - setStart/setEnd로 텍스트 범위를 정밀하게 지정
 * - cloneRange, compareBoundaryPoints 등 Range 메서드 활용
 *
 * 제외: contenteditable 기본 제어, 기본 이벤트 핸들링은 이미 숙지
 */

import { useRef, useState, useCallback } from 'react';

// ============================================================
// Part 1: Range 생성 + 텍스트 노드에서 범위 지정
// ============================================================

/**
 * TODO: 주어진 요소 내에서 Range를 생성하여 특정 텍스트 범위를 지정하는 함수
 *
 * 힌트:
 * - const range = document.createRange()
 * - range.setStart(textNode, startOffset) — textNode는 Text 노드, offset은 글자 수
 * - range.setEnd(textNode, endOffset)
 * - 요소의 첫 번째 텍스트 노드: element.firstChild (Text 타입인지 확인)
 * - 여러 텍스트 노드에 걸친 범위도 가능 (시작 노드와 끝 노드가 다를 수 있음)
 */
export function createTextRange(
  startNode: Node,
  startOffset: number,
  endNode: Node,
  endOffset: number
): Range {
  // TODO: Range 생성 후 시작/끝 설정하여 반환
  const range = document.createRange();
  return range;
}

// ============================================================
// Part 2: Range 메서드 (extractContents, cloneContents, deleteContents, surroundContents)
// ============================================================

/**
 * TODO: Range의 주요 조작 메서드를 실습하는 함수들
 *
 * 힌트:
 * - range.extractContents() → DocumentFragment 반환, 원본에서 제거됨
 * - range.cloneContents() → DocumentFragment 반환, 원본 유지됨
 * - range.deleteContents() → 범위 내 콘텐츠 삭제
 * - range.surroundContents(newParent) → 범위를 새 요소로 감쌈
 *   주의: 범위가 요소를 부분적으로 포함하면 에러 발생
 * - range.insertNode(node) → 범위의 시작점에 노드 삽입
 */

/** 선택된 범위의 내용을 복제하여 반환 */
export function cloneRangeContents(range: Range): DocumentFragment {
  // TODO: range.cloneContents() 사용
  return document.createDocumentFragment();
}

/** 선택된 범위의 내용을 추출(원본에서 제거)하여 반환 */
export function extractRangeContents(range: Range): DocumentFragment {
  // TODO: range.extractContents() 사용
  return document.createDocumentFragment();
}

/** 선택된 범위를 주어진 태그로 감싸기 */
export function surroundWithElement(range: Range, tagName: string): void {
  // TODO: document.createElement(tagName) 생성 후 range.surroundContents 사용
  // 주의: 부분 선택 시 에러 처리 필요 → try-catch
  // 대안: extractContents → createElement → appendChild → insertNode
}

// ============================================================
// Part 3: Range 비교 (compareBoundaryPoints)
// ============================================================

/**
 * TODO: 두 Range의 위치를 비교하는 함수
 *
 * 힌트:
 * - range1.compareBoundaryPoints(how, range2)
 * - how 상수:
 *   Range.START_TO_START (0) — 두 범위의 시작점 비교
 *   Range.START_TO_END (1) — range1 시작 vs range2 끝
 *   Range.END_TO_END (2) — 두 범위의 끝점 비교
 *   Range.END_TO_START (3) — range1 끝 vs range2 시작
 * - 반환값: -1 (앞), 0 (같음), 1 (뒤)
 */
export function compareRanges(
  range1: Range,
  range2: Range
): { startToStart: number; endToEnd: number } {
  // TODO: 두 비교 결과를 반환
  return { startToStart: 0, endToEnd: 0 };
}

/**
 * TODO: Range를 복제하는 함수
 *
 * 힌트:
 * - range.cloneRange() — Range 객체 자체를 복제 (내용이 아닌 범위 정보)
 * - 원본 Range를 수정해도 복제본에 영향 없음
 */
export function duplicateRange(range: Range): Range {
  // TODO: cloneRange 사용
  return document.createRange();
}

// ============================================================
// Part 4: 데모 컴포넌트
// ============================================================

/**
 * TODO: Range 조작을 시연하는 데모
 *
 * 요구사항:
 * - contenteditable 영역에 샘플 텍스트
 * - "범위 선택" 버튼 → createTextRange로 특정 범위 선택 → 시각적 확인
 * - "복제" 버튼 → cloneRangeContents → 결과 표시
 * - "추출" 버튼 → extractRangeContents → 원본 변화 확인
 * - "감싸기" 버튼 → surroundWithElement('mark') → 하이라이트 효과
 * - Range 정보 표시 (startContainer, startOffset, endContainer, endOffset, toString)
 */
export default function RangeBasicsDemo() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [rangeInfo, setRangeInfo] = useState<string>('');

  const handleShowRangeInfo = useCallback(() => {
    // TODO: 현재 Selection에서 Range 가져오기
    // const selection = window.getSelection();
    // if (!selection || selection.rangeCount === 0) return;
    // const range = selection.getRangeAt(0);
    // range.startContainer, range.startOffset, range.endContainer, range.endOffset
    // range.toString() — 선택된 텍스트
  }, []);

  return (
    <div>
      <h2>Day 01: Range 객체 기본</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {/* TODO: "범위 선택" 버튼 — 2번째~8번째 글자를 프로그래밍적으로 선택 */}
        {/* TODO: "복제" 버튼 — 선택된 범위의 내용을 복제하여 아래 영역에 표시 */}
        {/* TODO: "추출" 버튼 — 선택된 범위의 내용을 추출(원본에서 제거) */}
        {/* TODO: "감싸기" 버튼 — 선택된 범위를 <mark>로 감싸기 */}
        {/* TODO: "Range 정보" 버튼 → handleShowRangeInfo */}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        style={{
          border: '1px solid #ccc',
          padding: '16px',
          minHeight: '150px',
        }}
      >
        Range 객체를 학습합니다. 이 텍스트에서 다양한 범위를 선택하고
        조작해보세요. <strong>볼드 텍스트</strong>와 <em>이탤릭 텍스트</em>도
        포함되어 있습니다.
      </div>

      {rangeInfo && (
        <pre
          style={{
            marginTop: '12px',
            padding: '12px',
            background: '#f5f5f5',
            fontSize: '13px',
          }}
        >
          {rangeInfo}
        </pre>
      )}
    </div>
  );
}

/**
 * ============================================================
 * 완료 체크리스트
 * ============================================================
 *
 * [ ] document.createRange()로 Range 객체를 생성할 수 있다
 * [ ] setStart/setEnd로 텍스트 노드의 특정 범위를 지정할 수 있다
 * [ ] cloneContents로 범위 내용을 복제할 수 있다
 * [ ] extractContents로 범위 내용을 추출(제거)할 수 있다
 * [ ] surroundContents로 범위를 새 요소로 감쌀 수 있다 (에러 처리 포함)
 * [ ] compareBoundaryPoints로 두 Range의 위치를 비교할 수 있다
 * [ ] cloneRange로 Range 객체를 복제할 수 있다
 * [ ] Range의 속성(startContainer, startOffset 등)을 읽을 수 있다
 */
