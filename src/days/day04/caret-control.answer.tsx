/**
 * Day 04 - 글로벌 오프셋 기반 커서(Caret) 제어 (정답 코드)
 *
 * ⚠️ 먼저 caret-control.tsx를 직접 구현한 뒤 비교하세요!
 */

import { useRef, useState, useCallback, useEffect } from 'react';

// ============================================================
// Part 1: setCaretByOffset — 전체 오프셋으로 커서 이동
// ============================================================

export function setCaretByOffset(root: HTMLElement, globalOffset: number): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let accumulated = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const len = node.length;

    if (accumulated + len >= globalOffset) {
      const localOffset = globalOffset - accumulated;
      const range = document.createRange();
      range.setStart(node, localOffset);
      range.collapse(true);

      const selection = window.getSelection();
      if (!selection) return;
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }

    accumulated += len;
  }

  // offset이 전체 길이를 초과하면 마지막에 배치
  const range = document.createRange();
  range.selectNodeContents(root);
  range.collapse(false);

  const selection = window.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
}

// ============================================================
// Part 2: getCaretOffset — 현재 커서의 전체 오프셋 반환
// ============================================================

export function getCaretOffset(root: HTMLElement): number {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return 0;

  const { anchorNode, anchorOffset } = selection;
  if (!anchorNode || !root.contains(anchorNode)) return 0;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let accumulated = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node === anchorNode) {
      return accumulated + anchorOffset;
    }
    accumulated += (node as Text).length;
  }

  return accumulated;
}

// ============================================================
// Part 3: 커서를 특정 요소의 시작/끝으로 이동
// ============================================================

export function setCaretToElementEdge(element: HTMLElement, position: 'start' | 'end'): void {
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(position === 'start');

  const selection = window.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
}

export function setCaretAroundElement(element: HTMLElement, position: 'before' | 'after'): void {
  const range = document.createRange();

  if (position === 'before') {
    range.setStartBefore(element);
  } else {
    range.setStartAfter(element);
  }
  range.collapse(true);

  const selection = window.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
}

// ============================================================
// Part 4: 데모 컴포넌트
// ============================================================

export default function CaretControlDemo() {
  const editorRef = useRef<HTMLDivElement>(null);
  const boldRef = useRef<HTMLElement>(null);
  const [targetOffset, setTargetOffset] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [totalLength, setTotalLength] = useState(0);

  useEffect(() => {
    const handler = () => {
      if (!editorRef.current) return;
      setCurrentOffset(getCaretOffset(editorRef.current));
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      const walker = document.createTreeWalker(editorRef.current, NodeFilter.SHOW_TEXT);
      let len = 0;
      while (walker.nextNode()) {
        len += (walker.currentNode as Text).length;
      }
      setTotalLength(len);
    }
  }, []);

  const handleMoveCaret = useCallback(() => {
    if (!editorRef.current) return;
    setCaretByOffset(editorRef.current, targetOffset);
    editorRef.current.focus();
  }, [targetOffset]);

  const handleMoveToStart = useCallback(() => {
    if (!editorRef.current) return;
    setCaretToElementEdge(editorRef.current, 'start');
    editorRef.current.focus();
  }, []);

  const handleMoveToEnd = useCallback(() => {
    if (!editorRef.current) return;
    setCaretToElementEdge(editorRef.current, 'end');
    editorRef.current.focus();
  }, []);

  const handleBeforeBold = useCallback(() => {
    if (!boldRef.current) return;
    setCaretAroundElement(boldRef.current, 'before');
    editorRef.current?.focus();
  }, []);

  const handleAfterBold = useCallback(() => {
    if (!boldRef.current) return;
    setCaretAroundElement(boldRef.current, 'after');
    editorRef.current?.focus();
  }, []);

  return (
    <div>
      <h2>Day 04: 커서(Caret) 제어</h2>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
        <input
          type="number"
          value={targetOffset}
          onChange={(e) => setTargetOffset(Number(e.target.value))}
          style={{ width: '80px' }}
          placeholder="오프셋"
        />
        <button onClick={handleMoveCaret}>이동</button>
        <button onClick={handleMoveToStart}>처음으로</button>
        <button onClick={handleMoveToEnd}>끝으로</button>
        <button onClick={handleBeforeBold}>볼드 요소 앞</button>
        <button onClick={handleAfterBold}>볼드 요소 뒤</button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        style={{ border: '1px solid #ccc', padding: '16px', minHeight: '150px' }}
      >
        안녕하세요! <strong ref={boldRef as React.Ref<HTMLElement>}>커서 제어</strong>를 학습합니다.{' '}
        <em>이탤릭</em> 텍스트와 <strong><em>중첩 마크</em></strong>도 포함되어 있습니다.
      </div>

      <div style={{ marginTop: '12px', padding: '8px', background: '#f0f0f0', fontFamily: 'monospace' }}>
        현재 커서 위치: {currentOffset} / 전체 길이: {totalLength}
      </div>
    </div>
  );
}
