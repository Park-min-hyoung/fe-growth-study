/**
 * Day 05 - 커서 좌표 추적 (정답 코드)
 *
 * ⚠️ 먼저 caret-coordinates.tsx를 직접 구현한 뒤 비교하세요!
 */

import { useRef, useState, useCallback, useEffect } from 'react';

// ============================================================
// Part 1: Range 좌표 획득
// ============================================================

export function getRangeCoordinates(range: Range): DOMRect | null {
  const rect = range.getBoundingClientRect();

  // collapsed range에서 getBoundingClientRect()가 빈 rect를 반환하는 경우
  if (rect.width === 0 && rect.height === 0) {
    const rects = range.getClientRects();
    if (rects.length > 0) return rects[0];
    return null;
  }

  return rect;
}

export function getCaretCoordinates(): { x: number; y: number } | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const rect = getRangeCoordinates(range);
  if (!rect) return null;

  return { x: rect.left, y: rect.top };
}

// ============================================================
// Part 2: 마우스 좌표 → 커서 위치 (역추적)
// ============================================================

export function getRangeFromPoint(x: number, y: number): Range | null {
  // Chrome, Safari
  if ('caretRangeFromPoint' in document) {
    return (document as Document & { caretRangeFromPoint(x: number, y: number): Range | null }).caretRangeFromPoint(x, y);
  }

  // Firefox
  if ('caretPositionFromPoint' in document) {
    const pos = (document as Document & {
      caretPositionFromPoint(x: number, y: number): { offsetNode: Node; offset: number } | null
    }).caretPositionFromPoint(x, y);

    if (!pos) return null;

    const range = document.createRange();
    range.setStart(pos.offsetNode, pos.offset);
    range.collapse(true);
    return range;
  }

  return null;
}

// ============================================================
// Part 3: 플로팅 UI 위치 계산
// ============================================================

export function calcFloatingPosition(
  range: Range,
  tooltipSize: { width: number; height: number }
): { x: number; y: number } {
  const rect = range.getBoundingClientRect();

  const x = rect.left + rect.width / 2;
  const y = rect.top - tooltipSize.height - 8;

  return { x, y };
}

// ============================================================
// Part 4: 데모 컴포넌트
// ============================================================

const FLOATING_SIZE = { width: 80, height: 28 };

export default function CaretCoordinatesDemo() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [caretPos, setCaretPos] = useState<{ x: number; y: number } | null>(null);
  const [floatingPos, setFloatingPos] = useState<{ x: number; y: number } | null>(null);
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    const handler = () => {
      const coords = getCaretCoordinates();
      setCaretPos(coords);

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setShowFloating(false);
        return;
      }

      const range = selection.getRangeAt(0);
      if (range.collapsed) {
        setShowFloating(false);
        return;
      }

      const pos = calcFloatingPosition(range, FLOATING_SIZE);
      setFloatingPos(pos);
      setShowFloating(true);
    };

    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // 기본 동작 허용 후 caretRangeFromPoint로 커서 이동
    // (기본 클릭 동작이 이미 커서를 이동시키므로, 여기선 좌표 역추적 데모)
    const range = getRangeFromPoint(e.clientX, e.clientY);
    if (!range) return;

    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <h2>Day 05: 커서 좌표 추적</h2>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onMouseDown={handleMouseDown}
        style={{ border: '1px solid #ccc', padding: '16px', minHeight: '150px', lineHeight: '2' }}
      >
        <p>첫 번째 단락입니다. 여기서 텍스트를 선택하거나 클릭해보세요.</p>
        <p>두 번째 단락에는 <strong>볼드</strong>와 <em>이탤릭</em> 텍스트가 있습니다.</p>
        <p>세 번째 단락입니다. 마우스 클릭 위치로 커서가 이동합니다.</p>
      </div>

      {showFloating && floatingPos && (
        <div
          style={{
            position: 'fixed',
            left: floatingPos.x,
            top: floatingPos.y,
            background: '#333',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'none',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
          }}
        >
          선택됨
        </div>
      )}

      <div style={{ marginTop: '12px', padding: '8px', background: '#f0f0f0', fontFamily: 'monospace', fontSize: '13px' }}>
        <div>커서 좌표: {caretPos ? `x=${caretPos.x.toFixed(0)}, y=${caretPos.y.toFixed(0)}` : '없음'}</div>
        <div>플로팅 위치: {floatingPos ? `x=${floatingPos.x.toFixed(0)}, y=${floatingPos.y.toFixed(0)}` : '없음'}</div>
      </div>
    </div>
  );
}
