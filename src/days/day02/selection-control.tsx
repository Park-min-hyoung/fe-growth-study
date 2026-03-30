/**
 * Day 02 - Selection 객체 제어
 * 난이도: ⭐⭐⭐
 *
 * 학습 목표:
 * - window.getSelection()으로 Selection 객체를 활용
 * - addRange/removeAllRanges로 프로그래밍적 선택
 * - Selection 방향 감지 (anchor vs focus)
 * - 크로스브라우저 차이 이해
 */

import { useRef, useState, useCallback } from "react";

// const getCurrentRange = useCallback((): Range | null => {
//   const selection = window.getSelection();
//   if (!selection || selection.rangeCount === 0) return null;
//   return selection.getRangeAt(0);
// }, []);

// ============================================================
// Part 1: 프로그래밍적 텍스트 선택
// ============================================================

/**
 * TODO: Selection + Range 조합으로 텍스트를 프로그래밍적으로 선택
 *
 * 힌트:
 * - const selection = window.getSelection()
 * - selection.removeAllRanges() — 기존 선택 해제
 * - selection.addRange(range) — 새 Range를 선택에 추가
 * - Day01에서 만든 createTextRange와 조합
 */
export function selectTextProgrammatically(
  element: HTMLElement,
  startOffset: number,
  endOffset: number
): void {
  // TODO: 구현
  // 1. element 내부의 텍스트 노드를 찾는다
  const textNode = element.firstChild;

  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;
  // 2. Range를 생성하여 startOffset~endOffset 설정
  const range = document.createRange();
  range.setStart(textNode, startOffset);
  range.setEnd(textNode, endOffset);

  // 3. Selection에 Range를 적용
  const selection = window.getSelection();

  if (!selection) return;

  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * TODO: 요소 전체를 선택하는 유틸
 *
 * 힌트:
 * - selection.selectAllChildren(element) — 간편한 전체 선택
 * - 또는 Range로 element 전체를 포함하게 설정
 *   range.selectNodeContents(element)
 */
export function selectAll(element: HTMLElement): void {
  // TODO: 구현
  const selection = window.getSelection();

  if (!selection) return;

  selection.selectAllChildren(element);
}

// ============================================================
// Part 2: 다중 Range 선택
// ============================================================

/**
 * TODO: 다중 Range 선택 실험
 *
 * 힌트:
 * - Firefox는 selection.addRange()로 다중 Range 지원
 * - Chrome/Safari는 일반적으로 하나의 Range만 지원
 * - selection.rangeCount로 현재 선택된 Range 개수 확인
 * - selection.getRangeAt(index)로 특정 Range 접근
 *
 * 참고: Ctrl+클릭으로 다중 선택하는 것과 프로그래밍적 다중 선택은 다름
 */
export function addMultipleRanges(ranges: Range[]): number {
  // TODO: 여러 Range를 Selection에 추가하고, 실제로 추가된 개수를 반환

  const selection = window.getSelection();

  if (!selection) return 0;

  for (const range of ranges) {
    selection.addRange(range);
  }

  return selection.rangeCount;
}

// ============================================================
// Part 3: Selection 방향 감지
// ============================================================

/**
 * TODO: Selection의 방향 (왼→오 vs 오→왼) 감지
 *
 * 힌트:
 * - selection.anchorNode / selection.anchorOffset — 선택 시작점 (사용자가 처음 클릭한 곳)
 * - selection.focusNode / selection.focusOffset — 선택 끝점 (사용자가 드래그를 마친 곳)
 * - anchor가 focus보다 뒤에 있으면 → 역방향 선택
 * - selection.isCollapsed — true이면 커서(선택 없음)
 * - 방향 비교: Range의 compareBoundaryPoints 또는 node.compareDocumentPosition 활용
 */
export type SelectionDirection = "forward" | "backward" | "none";

export function getSelectionDirection(): SelectionDirection {
  // TODO: 현재 Selection의 방향을 판별하여 반환
  // 힌트: anchorNode와 focusNode의 위치를 비교
  const selection = window.getSelection();

  if (selection?.isCollapsed) return 'none'

  const anchorNode = selection?.anchorNode;
const focusNode = selection?.focusNode;

if (!anchorNode || !focusNode) return 'none'

  if (selection?.anchorNode === selection?.focusNode) {
    // 같은 노드면 offset 비교,
    const anchorOffset = selection?.anchorOffset ?? 0;
    const endOffset = selection?.focusOffset ?? 0;

    if (anchorOffset < endOffset) return "forward";
    else if (anchorOffset > endOffset) return "backward";
    else return "none";
  } else {
const postion = 
  }
}

/**
 * TODO: Selection 정보를 객체로 반환
 *
 * 힌트:
 * - anchorNode, anchorOffset, focusNode, focusOffset
 * - isCollapsed, rangeCount, type
 * - toString() — 선택된 텍스트
 */
export interface SelectionInfo {
  text: string;
  isCollapsed: boolean;
  direction: SelectionDirection;
  rangeCount: number;
  anchorOffset: number;
  focusOffset: number;
}

export function getSelectionInfo(): SelectionInfo | null {
  // TODO: 현재 Selection 정보를 수집하여 반환
  return null;
}

// ============================================================
// Part 4: 데모 컴포넌트
// ============================================================

/**
 * TODO: Selection 제어를 시연하는 데모
 *
 * 요구사항:
 * - "3~7글자 선택" 버튼 → selectTextProgrammatically
 * - "전체 선택" 버튼 → selectAll
 * - "선택 해제" 버튼 → selection.removeAllRanges()
 * - "다중 선택 시도" 버튼 → addMultipleRanges (브라우저별 결과 차이 확인)
 * - 하단에 현재 Selection 정보 실시간 표시 (selectionchange 이벤트 활용)
 *   → direction, isCollapsed, selectedText, rangeCount
 */
export default function SelectionControlDemo() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [info, setInfo] = useState<SelectionInfo | null>(null);

  // TODO: useEffect로 document 'selectionchange' 이벤트 리스너 등록
  // selectionchange 발생 시 → getSelectionInfo() 호출 → setInfo

  const handleSelect = useCallback(() => {
    // TODO: selectTextProgrammatically 호출
  }, []);

  return (
    <div>
      <h2>Day 02: Selection 객체 제어</h2>

      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        {/* TODO: "3~7글자 선택" 버튼 */}
        {/* TODO: "전체 선택" 버튼 */}
        {/* TODO: "선택 해제" 버튼 */}
        {/* TODO: "다중 선택 시도" 버튼 */}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          minHeight: "150px",
        }}
      >
        Selection API로 텍스트를 프로그래밍적으로 선택합니다.{" "}
        <strong>anchor</strong>와 <em>focus</em>의 차이를 이해하세요.
      </div>

      {/* TODO: Selection 정보 표시 영역 */}
      {info && (
        <div
          style={{
            marginTop: "12px",
            padding: "12px",
            background: "#f0f0f0",
            fontFamily: "monospace",
            fontSize: "13px",
          }}
        >
          {/* 선택 텍스트, 방향, isCollapsed, rangeCount 등 표시 */}
        </div>
      )}
    </div>
  );
}

/**
 * ============================================================
 * 완료 체크리스트
 * ============================================================
 *
 * [ ] 버튼 클릭으로 특정 범위의 텍스트가 프로그래밍적으로 선택됨
 * [ ] selectAll로 요소 내 전체 텍스트가 선택됨
 * [ ] removeAllRanges로 선택이 해제됨
 * [ ] 다중 Range 추가 시도 + 브라우저별 차이 확인 (rangeCount)
 * [ ] Selection 방향(forward/backward)이 올바르게 감지됨
 * [ ] selectionchange 이벤트로 Selection 정보가 실시간 업데이트됨
 * [ ] isCollapsed 상태가 올바르게 표시됨
 */
