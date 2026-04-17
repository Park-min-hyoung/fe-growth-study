/**
 * Day 07 - selectionchange 이벤트 + 플로팅 툴바 위치 계산 (정답 코드)
 *
 * ⚠️ 먼저 floating-toolbar.tsx를 직접 구현한 뒤 비교하세요!
 */

import { useRef, useState, useCallback, useEffect } from 'react';

// ============================================================
// Part 1: 선택 영역 감지 및 상태 계산
// ============================================================

export function isSelectionInEditor(selection: Selection, editorRoot: HTMLElement): boolean {
  if (selection.rangeCount === 0 || selection.isCollapsed) return false;
  return editorRoot.contains(selection.anchorNode);
}

export function getFormatState(): { bold: boolean; italic: boolean; underline: boolean } {
  return {
    bold: document.queryCommandState('bold'),
    italic: document.queryCommandState('italic'),
    underline: document.queryCommandState('underline'),
  };
}

// ============================================================
// Part 2: 툴바 위치 계산
// ============================================================

export function calcToolbarPosition(
  range: Range,
  toolbarSize: { width: number; height: number },
  margin = 8
): { x: number; y: number } {
  const rect = range.getBoundingClientRect();
  const vw = window.innerWidth;

  let x = rect.left + rect.width / 2 - toolbarSize.width / 2;
  let y = rect.top - toolbarSize.height - margin;

  // 좌측 경계
  if (x < margin) x = margin;
  // 우측 경계
  if (x + toolbarSize.width > vw - margin) {
    x = vw - toolbarSize.width - margin;
  }
  // 상단 경계 → 선택 영역 아래로 이동
  if (y < margin) {
    y = rect.bottom + margin;
  }

  return { x, y };
}

// ============================================================
// Part 3: 서식 적용
// ============================================================

export function toggleFormat(format: 'bold' | 'italic' | 'underline'): void {
  document.execCommand(format);
}

// ============================================================
// Part 4: 데모 컴포넌트
// ============================================================

interface ToolbarState {
  visible: boolean;
  x: number;
  y: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

const TOOLBAR_SIZE = { width: 140, height: 36 };

export default function FloatingToolbarDemo() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [toolbar, setToolbar] = useState<ToolbarState>({
    visible: false,
    x: 0,
    y: 0,
    bold: false,
    italic: false,
    underline: false,
  });

  useEffect(() => {
    const handler = () => {
      const selection = window.getSelection();
      const editor = editorRef.current;

      if (!selection || !editor || !isSelectionInEditor(selection, editor)) {
        setToolbar((prev) => ({ ...prev, visible: false }));
        return;
      }

      const range = selection.getRangeAt(0);
      const { x, y } = calcToolbarPosition(range, TOOLBAR_SIZE);
      const formatState = getFormatState();

      setToolbar({ visible: true, x, y, ...formatState });
    };

    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, []);

  const handleFormat = useCallback((format: 'bold' | 'italic' | 'underline') => {
    toggleFormat(format);
    setToolbar((prev) => ({ ...prev, [format]: !prev[format] }));
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <h2>Day 07: 플로팅 툴바</h2>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        style={{
          border: '1px solid #ccc',
          padding: '24px',
          minHeight: '250px',
          lineHeight: '1.8',
          fontSize: '16px',
        }}
      >
        <p>텍스트를 선택하면 플로팅 툴바가 나타납니다. 이 단락에서 원하는 텍스트를 드래그하여 선택해보세요.</p>
        <p>두 번째 단락입니다. <strong>이미 볼드 처리된 텍스트</strong>와 <em>이탤릭 텍스트</em>도 있습니다.</p>
        <p>툴바의 Bold, Italic, Underline 버튼을 클릭하여 서식을 적용하거나 해제할 수 있습니다. 뷰포트 경계에서 툴바 위치가 자동으로 조정됩니다.</p>
      </div>

      {toolbar.visible && (
        <div
          style={{
            position: 'fixed',
            left: toolbar.x,
            top: toolbar.y,
            width: TOOLBAR_SIZE.width,
            height: TOOLBAR_SIZE.height,
            background: '#333',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px',
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          {(['bold', 'italic', 'underline'] as const).map((fmt) => (
            <button
              key={fmt}
              onMouseDown={(e) => {
                e.preventDefault(); // 선택 해제 방지
                handleFormat(fmt);
              }}
              style={{
                background: toolbar[fmt] ? '#fff' : 'transparent',
                color: toolbar[fmt] ? '#333' : '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontWeight: fmt === 'bold' ? 'bold' : 'normal',
                fontStyle: fmt === 'italic' ? 'italic' : 'normal',
                textDecoration: fmt === 'underline' ? 'underline' : 'none',
                fontSize: '14px',
                flex: 1,
              }}
            >
              {fmt === 'bold' ? 'B' : fmt === 'italic' ? 'I' : 'U'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
