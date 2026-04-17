/**
 * Day 10 - ToggleMarkCommand - italic, underline + 중첩 마크
 * 난이도: ⭐⭐⭐⭐⭐
 *
 * 학습 목표:
 * - italic, underline ToggleMarkCommand 확장
 * - 중첩 마크 처리 (bold + italic 동시 적용)
 * - 서식 상태 실시간 감지 (selectionchange)
 * - 툴바 버튼 활성화 상태와 서식 상태 동기화
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { Command, CommandHistory } from '../day08/command-interface';

// ============================================================
// Part 1: 서식 명령 맵
// ============================================================

/**
 * TODO: 태그명 → execCommand 명령어 맵핑
 *
 * 힌트:
 * - 'STRONG' → 'bold'
 * - 'EM' → 'italic'
 * - 'U' → 'underline'
 * - 'S' → 'strikeThrough'
 */
export const TAG_TO_COMMAND: Record<string, string> = {
  // TODO: 구현
};

/**
 * TODO: 특정 서식이 현재 Selection에 적용되어 있는지 확인
 *
 * 힌트:
 * - document.queryCommandState(commandName) 활용
 * - 또는 anchorNode.closest(tagName) 활용
 */
export function isFormatActive(tagName: string): boolean {
  // TODO: 구현
  return false;
}

// ============================================================
// Part 2: 범용 ToggleMarkCommand
// ============================================================

/**
 * TODO: Day09의 ToggleMarkCommand를 확장하여 italic, underline 등 모든 마크 지원
 *
 * 힌트:
 * - TAG_TO_COMMAND 맵을 활용하여 execCommand 호출
 * - undo는 동일하게 innerHTML 스냅샷 방식
 */
export class ToggleMarkCommand implements Command {
  private snapshot: string = '';
  description: string;

  constructor(
    private editorRoot: HTMLElement,
    private tagName: keyof typeof TAG_TO_COMMAND
  ) {
    this.description = `ToggleMark<${tagName}>`;
  }

  execute(): void {
    // TODO: 구현
  }

  undo(): void {
    // TODO: 구현
  }
}

// ============================================================
// Part 3: 중첩 마크 처리
// ============================================================

/**
 * TODO: 선택 영역에 중첩된 서식 상태를 한번에 반환
 *
 * 예시: "볼드+이탤릭" 텍스트 선택 시 → { bold: true, italic: true, underline: false }
 *
 * 힌트:
 * - queryCommandState를 각 서식마다 호출
 * - 또는 anchorNode부터 조상 탐색으로 각 태그 존재 여부 확인
 */
export function getActiveFormats(): {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
} {
  // TODO: 구현
  return { bold: false, italic: false, underline: false, strikethrough: false };
}

/**
 * TODO: 선택 영역에 여러 서식을 동시에 적용하는 CompositeCommand 생성
 *
 * 힌트:
 * - Day08의 CompositeCommand 활용
 * - tags 배열의 각 항목으로 ToggleMarkCommand 생성
 */
export function createMultiMarkCommand(
  editorRoot: HTMLElement,
  tags: string[]
): Command {
  // TODO: 구현
  return {
    execute: () => {},
    undo: () => {},
    description: 'MultiMark',
  };
}

// ============================================================
// Part 4: 데모 컴포넌트
// ============================================================

/**
 * TODO: 멀티 서식 툴바 데모
 *
 * 요구사항:
 * - Bold(B), Italic(I), Underline(U), Strikethrough(S) 버튼
 * - selectionchange로 각 버튼의 활성화 상태 실시간 업데이트
 * - undo/redo 동작
 * - 중첩 서식 적용 가능 (B+I 동시 적용)
 */

interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
}

export default function ToggleMarkMultiDemo() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [history] = useState(() => new CommandHistory());
  const [formatState, setFormatState] = useState<FormatState>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  });
  const [, forceUpdate] = useState(0);

  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);

  // TODO: selectionchange 이벤트로 formatState 업데이트
  // useEffect(() => { ... }, []);

  const handleToggle = useCallback((tagName: string) => {
    if (!editorRef.current) return;
    // TODO: ToggleMarkCommand 생성 후 history.execute()
    refresh();
  }, [history, refresh]);

  const handleUndo = useCallback(() => {
    history.undo();
    refresh();
  }, [history, refresh]);

  const handleRedo = useCallback(() => {
    history.redo();
    refresh();
  }, [history, refresh]);

  const buttons: { tag: string; label: string; style?: React.CSSProperties }[] = [
    { tag: 'STRONG', label: 'B', style: { fontWeight: 'bold' } },
    { tag: 'EM', label: 'I', style: { fontStyle: 'italic' } },
    { tag: 'U', label: 'U', style: { textDecoration: 'underline' } },
    { tag: 'S', label: 'S', style: { textDecoration: 'line-through' } },
  ];

  const isActive = (tag: string): boolean => {
    const map: Record<string, keyof FormatState> = {
      STRONG: 'bold',
      EM: 'italic',
      U: 'underline',
      S: 'strikethrough',
    };
    return formatState[map[tag]] ?? false;
  };

  return (
    <div>
      <h2>Day 10: ToggleMarkCommand - Multi</h2>

      <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', alignItems: 'center' }}>
        {buttons.map(({ tag, label, style }) => (
          <button
            key={tag}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleToggle(tag)}
            style={{
              minWidth: '36px',
              padding: '4px 8px',
              background: isActive(tag) ? '#333' : '#f5f5f5',
              color: isActive(tag) ? '#fff' : '#333',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              ...style,
            }}
          >
            {label}
          </button>
        ))}

        <div style={{ width: '1px', height: '24px', background: '#ccc', margin: '0 4px' }} />

        <button onClick={handleUndo} disabled={!history.canUndo()}>Undo</button>
        <button onClick={handleRedo} disabled={!history.canRedo()}>Redo</button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        style={{ border: '1px solid #ccc', padding: '16px', minHeight: '200px', lineHeight: '1.8' }}
      >
        <p>다양한 서식을 조합해보세요. <strong>볼드</strong>, <em>이탤릭</em>, <u>밑줄</u>, <s>취소선</s>을 적용할 수 있습니다.</p>
        <p>텍스트를 선택하고 여러 버튼을 클릭하면 <strong><em>볼드+이탤릭</em></strong>처럼 중첩 서식도 가능합니다.</p>
      </div>

      <div style={{ marginTop: '8px', padding: '8px', background: '#f0f0f0', fontSize: '12px', fontFamily: 'monospace' }}>
        현재 서식: {Object.entries(formatState)
          .filter(([, v]) => v)
          .map(([k]) => k)
          .join(', ') || '없음'}
      </div>
    </div>
  );
}

/**
 * ============================================================
 * 완료 체크리스트
 * ============================================================
 *
 * [ ] italic, underline, strikethrough 서식을 적용/해제할 수 있다
 * [ ] TAG_TO_COMMAND 맵으로 서식 명령을 통일되게 관리한다
 * [ ] selectionchange로 툴바 버튼 상태가 실시간 업데이트된다
 * [ ] 중첩 서식(bold + italic)이 올바르게 동작한다
 * [ ] undo/redo가 모든 서식에서 정상 동작한다
 * [ ] 활성화된 서식 버튼이 시각적으로 구분된다
 * [ ] 버튼 클릭 시 mousedown preventDefault로 선택이 유지된다
 */
