/**
 * Day 10 - ToggleMarkCommand - italic, underline + 중첩 마크 (정답 코드)
 *
 * ⚠️ 먼저 toggle-mark-multi.tsx를 직접 구현한 뒤 비교하세요!
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { Command, CommandHistory, CompositeCommand } from '../day08/command-interface';

// ============================================================
// Part 1: 서식 명령 맵
// ============================================================

export const TAG_TO_COMMAND: Record<string, string> = {
  STRONG: 'bold',
  EM: 'italic',
  U: 'underline',
  S: 'strikeThrough',
};

export function isFormatActive(tagName: string): boolean {
  const commandName = TAG_TO_COMMAND[tagName];
  if (!commandName) return false;
  return document.queryCommandState(commandName);
}

// ============================================================
// Part 2: 범용 ToggleMarkCommand
// ============================================================

export class ToggleMarkCommand implements Command {
  private snapshot: string = '';
  description: string;

  constructor(
    private editorRoot: HTMLElement,
    private tagName: string
  ) {
    this.description = `ToggleMark<${tagName}>`;
  }

  execute(): void {
    this.snapshot = this.editorRoot.innerHTML;
    const commandName = TAG_TO_COMMAND[this.tagName];
    if (commandName) {
      document.execCommand(commandName);
    }
  }

  undo(): void {
    this.editorRoot.innerHTML = this.snapshot;
  }
}

// ============================================================
// Part 3: 중첩 마크 처리
// ============================================================

export function getActiveFormats(): {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
} {
  return {
    bold: document.queryCommandState('bold'),
    italic: document.queryCommandState('italic'),
    underline: document.queryCommandState('underline'),
    strikethrough: document.queryCommandState('strikeThrough'),
  };
}

export function createMultiMarkCommand(editorRoot: HTMLElement, tags: string[]): Command {
  const commands = tags.map((tag) => new ToggleMarkCommand(editorRoot, tag));
  return new CompositeCommand(commands);
}

// ============================================================
// Part 4: 데모 컴포넌트
// ============================================================

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

  useEffect(() => {
    const handler = () => {
      setFormatState(getActiveFormats());
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, []);

  const handleToggle = useCallback((tagName: string) => {
    if (!editorRef.current) return;
    const command = new ToggleMarkCommand(editorRef.current, tagName);
    history.execute(command);
    setFormatState(getActiveFormats());
    refresh();
  }, [history, refresh]);

  const handleUndo = useCallback(() => {
    history.undo();
    setFormatState(getActiveFormats());
    refresh();
  }, [history, refresh]);

  const handleRedo = useCallback(() => {
    history.redo();
    setFormatState(getActiveFormats());
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

        <button onClick={handleUndo} disabled={!history.canUndo()}>
          Undo ({history.getUndoStack().length})
        </button>
        <button onClick={handleRedo} disabled={!history.canRedo()}>
          Redo ({history.getRedoStack().length})
        </button>
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
