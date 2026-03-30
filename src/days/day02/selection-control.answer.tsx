/**
 * Day 02 - Selection 객체 제어 (정답 코드)
 *
 * ⚠️ 먼저 selection-control.tsx를 직접 구현한 뒤 비교하세요!
 */

import { useRef, useState, useCallback, useEffect } from 'react';

// ============================================================
// Part 1: 프로그래밍적 텍스트 선택
// ============================================================

/**
 * Selection + Range 조합으로 텍스트를 프로그래밍적으로 선택
 *
 * 핵심 흐름:
 * 1. element 내부에서 텍스트 노드를 찾는다
 * 2. Range를 만들어 startOffset~endOffset 설정
 * 3. selection.removeAllRanges() → addRange(range)
 */
export function selectTextProgrammatically(
  element: HTMLElement,
  startOffset: number,
  endOffset: number
): void {
  // 첫 번째 텍스트 노드 탐색 (재귀 없이 단순 탐색)
  let textNode: Text | null = null;
  for (const child of element.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      textNode = child as Text;
      break;
    }
  }
  if (!textNode) return;

  const length = textNode.length;
  const safeStart = Math.min(startOffset, length);
  const safeEnd = Math.min(endOffset, length);

  const range = document.createRange();
  range.setStart(textNode, safeStart);
  range.setEnd(textNode, safeEnd);

  const selection = window.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * 요소 전체를 선택하는 유틸
 *
 * range.selectNodeContents(element) — element의 모든 자식 노드를 범위로 설정
 * selection.selectAllChildren(element) — 위와 동일한 효과를 단번에 수행
 *
 * 두 방법 모두 동일하지만 selectNodeContents 쪽이 더 범용적으로 쓰임
 */
export function selectAll(element: HTMLElement): void {
  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(element);

  selection.removeAllRanges();
  selection.addRange(range);
}

// ============================================================
// Part 2: 다중 Range 선택
// ============================================================

/**
 * 여러 Range를 Selection에 추가하고, 실제로 추가된 개수를 반환
 *
 * 브라우저 차이:
 * - Firefox: addRange()를 여러 번 호출하면 rangeCount가 증가 (다중 Range 지원)
 * - Chrome/Safari: addRange()를 여러 번 호출해도 마지막 Range만 유지 (rangeCount = 1)
 *
 * 즉, rangeCount를 반환하면 브라우저별 실제 지원 여부를 확인할 수 있다.
 */
export function addMultipleRanges(ranges: Range[]): number {
  const selection = window.getSelection();
  if (!selection) return 0;

  selection.removeAllRanges();

  for (const range of ranges) {
    selection.addRange(range);
  }

  const actualCount = selection.rangeCount;
  console.log(
    `[addMultipleRanges] 시도: ${ranges.length}개, 실제 추가됨: ${actualCount}개`,
    `(브라우저: ${navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Chrome/Safari 계열'})`
  );

  return actualCount;
}

// ============================================================
// Part 3: Selection 방향 감지
// ============================================================

export type SelectionDirection = 'forward' | 'backward' | 'none';

/**
 * 현재 Selection의 방향을 판별
 *
 * - isCollapsed → 'none' (커서 상태, 선택 없음)
 * - anchorNode === focusNode → offset 비교만으로 방향 판별
 * - anchorNode !== focusNode → Node.compareDocumentPosition() 사용
 *   - DOCUMENT_POSITION_FOLLOWING(4): anchor가 focus보다 앞에 있음 → forward
 *   - 그 외: backward
 */
export function getSelectionDirection(): SelectionDirection {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return 'none';

  const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
  if (!anchorNode || !focusNode) return 'none';

  if (anchorNode === focusNode) {
    return anchorOffset <= focusOffset ? 'forward' : 'backward';
  }

  // compareDocumentPosition: anchorNode 기준으로 focusNode의 위치
  const position = anchorNode.compareDocumentPosition(focusNode);

  // DOCUMENT_POSITION_FOLLOWING = 4: focusNode가 anchorNode 뒤에 있음 → forward
  return position & Node.DOCUMENT_POSITION_FOLLOWING ? 'forward' : 'backward';
}

/**
 * Selection 정보를 객체로 반환
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
  const selection = window.getSelection();
  if (!selection) return null;

  return {
    text: selection.toString(),
    isCollapsed: selection.isCollapsed,
    direction: getSelectionDirection(),
    rangeCount: selection.rangeCount,
    anchorOffset: selection.anchorOffset,
    focusOffset: selection.focusOffset,
  };
}

// ============================================================
// Part 4: 데모 컴포넌트
// ============================================================

export default function SelectionControlDemo() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [info, setInfo] = useState<SelectionInfo | null>(null);

  // selectionchange 이벤트로 Selection 정보 실시간 업데이트
  useEffect(() => {
    const handler = () => setInfo(getSelectionInfo());
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, []);

  const handleSelect = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    // 에디터 내 첫 텍스트 노드 기준 3~7번째 글자 선택
    selectTextProgrammatically(editor, 3, 7);
  }, []);

  const handleSelectAll = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    selectAll(editor);
  }, []);

  const handleDeselect = useCallback(() => {
    window.getSelection()?.removeAllRanges();
  }, []);

  const handleMultiRange = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // 에디터 내 텍스트 노드들로 두 개의 Range 생성
    const children = Array.from(editor.childNodes);
    const textNodes = children.filter((n) => n.nodeType === Node.TEXT_NODE) as Text[];

    if (textNodes.length === 0) return;

    const ranges: Range[] = [];

    // 첫 번째 텍스트 노드: 0~5
    const r1 = document.createRange();
    r1.setStart(textNodes[0], 0);
    r1.setEnd(textNodes[0], Math.min(5, textNodes[0].length));
    ranges.push(r1);

    // 두 번째 텍스트 노드가 있으면 추가, 없으면 첫 번째 노드의 다른 구간
    if (textNodes.length > 1) {
      const r2 = document.createRange();
      r2.setStart(textNodes[1], 0);
      r2.setEnd(textNodes[1], Math.min(5, textNodes[1].length));
      ranges.push(r2);
    } else {
      const r2 = document.createRange();
      const len = textNodes[0].length;
      r2.setStart(textNodes[0], Math.min(10, len));
      r2.setEnd(textNodes[0], Math.min(15, len));
      ranges.push(r2);
    }

    const count = addMultipleRanges(ranges);
    console.log(`실제 선택된 Range 수: ${count}`);
  }, []);

  return (
    <div>
      <h2>Day 02: Selection 객체 제어</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button onClick={handleSelect}>3~7글자 선택</button>
        <button onClick={handleSelectAll}>전체 선택</button>
        <button onClick={handleDeselect}>선택 해제</button>
        <button onClick={handleMultiRange}>다중 선택 시도</button>
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
        Selection API로 텍스트를 프로그래밍적으로 선택합니다.{' '}
        <strong>anchor</strong>와 <em>focus</em>의 차이를 이해하세요.
      </div>

      {info && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px',
            background: '#f0f0f0',
            fontFamily: 'monospace',
            fontSize: '13px',
          }}
        >
          <div>selectedText: "{info.text}"</div>
          <div>direction: {info.direction}</div>
          <div>isCollapsed: {String(info.isCollapsed)}</div>
          <div>rangeCount: {info.rangeCount}</div>
          <div>anchorOffset: {info.anchorOffset}</div>
          <div>focusOffset: {info.focusOffset}</div>
        </div>
      )}
    </div>
  );
}
