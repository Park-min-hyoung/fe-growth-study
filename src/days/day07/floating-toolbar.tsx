/**
 * Day 07 - selectionchange 이벤트 + 플로팅 툴바 위치 계산
 * 난이도: ⭐⭐⭐⭐⭐
 *
 * 학습 목표:
 * - selectionchange 이벤트로 선택 상태 감지
 * - 선택 영역의 BoundingClientRect 기반 툴바 위치 계산
 * - 뷰포트 경계 처리 (툴바가 화면 밖으로 나가지 않도록)
 * - 텍스트 서식(bold, italic, underline) 상태 감지 및 적용
 *
 * 왜 배우는가:
 * Medium 글쓰기, Notion 블록 에디터처럼 텍스트를 드래그하면 바로 위에 서식 툴바가 뜨는 UX는
 * 현대 에디터의 표준이 되었다. 고정 툴바 대비 맥락에 맞는 위치에 나타나 사용자 시선 이동을 줄여주며,
 * 선택 좌표 계산 + 뷰포트 클리핑을 직접 다뤄봐야 실무 에디터 컴포넌트를 자신 있게 만들 수 있다.
 */

import { useRef, useState, useCallback, useEffect } from 'react';

// ============================================================
// Part 1: 선택 영역 감지 및 상태 계산
// ============================================================

/**
 * TODO: 현재 선택이 contenteditable 요소 내에 있는지 확인
 *
 * 힌트:
 * - selection.rangeCount > 0 이고 !selection.isCollapsed
 * - selection.anchorNode가 root 내에 포함되어 있는지: root.contains(anchorNode)
 */
export function isSelectionInEditor(
  selection: Selection,
  editorRoot: HTMLElement
): boolean {
  // TODO: 구현
  return false;
}

/**
 * TODO: 현재 선택 영역에 특정 서식이 적용되어 있는지 확인
 *
 * 힌트:
 * - document.queryCommandState('bold') → boolean
 * - document.queryCommandState('italic') → boolean
 * - document.queryCommandState('underline') → boolean
 * - 주의: queryCommandState는 deprecated이지만 아직 널리 사용됨
 */
export function getFormatState(): {
  bold: boolean;
  italic: boolean;
  underline: boolean;
} {
  // TODO: 구현
  return { bold: false, italic: false, underline: false };
}

// ============================================================
// Part 2: 툴바 위치 계산
// ============================================================

/**
 * TODO: 선택 영역 기준으로 플로팅 툴바의 위치를 계산
 *
 * 요구사항:
 * - 기본 위치: 선택 영역 상단 중앙
 * - 뷰포트 경계 처리:
 *   - 좌측 경계: x < margin → x = margin
 *   - 우측 경계: x + toolbarWidth > vw - margin → x = vw - toolbarWidth - margin
 *   - 상단 경계: y < margin → 선택 영역 하단으로 이동 (rect.bottom + 8)
 *
 * 힌트:
 * - range.getBoundingClientRect()로 선택 영역 rect 획득
 * - window.innerWidth, window.innerHeight로 뷰포트 크기
 * - position: fixed 기준이므로 scroll 오프셋 불필요
 */
export function calcToolbarPosition(
  range: Range,
  toolbarSize: { width: number; height: number },
  margin?: number
): { x: number; y: number } {
  // TODO: 구현
  return { x: 0, y: 0 };
}

// ============================================================
// Part 3: 서식 적용
// ============================================================

/**
 * TODO: 선택 영역에 서식 적용/해제 토글
 *
 * 힌트:
 * - document.execCommand('bold') — deprecated이지만 contenteditable에서 사용
 * - 또는 직접 Range와 surroundContents로 구현
 *
 * 주의: execCommand는 deprecated API이나 현재 대안(Selection API만으로 구현)이 복잡함
 */
export function toggleFormat(format: 'bold' | 'italic' | 'underline'): void {
  // TODO: 구현
}

// ============================================================
// Part 4: 데모 컴포넌트
// ============================================================

/**
 * TODO: 플로팅 툴바 데모
 *
 * 요구사항:
 * - contenteditable 영역에서 텍스트 선택 시 툴바 표시
 * - 툴바에 Bold(B), Italic(I), Underline(U) 버튼
 * - 이미 적용된 서식은 버튼 활성화 표시
 * - 선택 해제 시 툴바 숨김
 * - 툴바가 뷰포트 경계를 벗어나지 않도록 처리
 */

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

  // TODO: selectionchange 이벤트 등록
  // useEffect(() => { ... }, []);

  const handleFormat = useCallback((format: 'bold' | 'italic' | 'underline') => {
    // TODO: toggleFormat 호출 후 서식 상태 업데이트
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

      {/* 플로팅 툴바 */}
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
          {/* TODO: B, I, U 버튼 */}
          {(['bold', 'italic', 'underline'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => handleFormat(fmt)}
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

/**
 * ============================================================
 * 완료 체크리스트
 * ============================================================
 *
 * [ ] selectionchange 이벤트로 선택 상태 변화를 감지할 수 있다
 * [ ] 선택 영역이 특정 contenteditable 내에 있는지 확인할 수 있다
 * [ ] getBoundingClientRect()로 선택 영역의 화면 좌표를 얻을 수 있다
 * [ ] 선택 영역 상단 중앙에 툴바 위치를 계산할 수 있다
 * [ ] 뷰포트 경계에서 툴바 위치가 자동으로 보정된다
 * [ ] queryCommandState로 현재 서식 상태를 확인할 수 있다
 * [ ] 서식 버튼의 활성화/비활성화 상태가 올바르게 표시된다
 * [ ] 선택 해제 시 툴바가 사라진다
 */
