/**
 * Day 09 - ToggleMarkCommand - bold 적용/해제 (정답 코드)
 *
 * ⚠️ 먼저 toggle-mark-bold.tsx를 직접 구현한 뒤 비교하세요!
 */

import { useRef, useState, useCallback } from 'react';
import { Command, CommandHistory } from '../day08/command-interface';

// ============================================================
// Part 1: 서식 감지 유틸리티
// ============================================================

export function isMarkActive(tagName: string, editorRoot: HTMLElement): boolean {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const anchorNode = selection.anchorNode;
  if (!anchorNode || !editorRoot.contains(anchorNode)) return false;

  const element = anchorNode.nodeType === Node.TEXT_NODE
    ? anchorNode.parentElement
    : anchorNode as Element;

  return !!element?.closest(tagName.toLowerCase());
}

export function isRangeFullyMarked(range: Range, tagName: string): boolean {
  const ancestor = range.commonAncestorContainer;
  const element = ancestor.nodeType === Node.TEXT_NODE
    ? ancestor.parentElement
    : ancestor as Element;

  return !!element?.closest(tagName.toLowerCase());
}

// ============================================================
// Part 2: ToggleMarkCommand
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

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const alreadyApplied = isRangeFullyMarked(range, this.tagName);

    if (alreadyApplied) {
      // execCommand로 해제 (가장 안정적)
      document.execCommand(this.tagName === 'STRONG' ? 'bold' : this.tagName.toLowerCase());
    } else {
      document.execCommand(this.tagName === 'STRONG' ? 'bold' : this.tagName.toLowerCase());
    }
  }

  undo(): void {
    this.editorRoot.innerHTML = this.snapshot;
  }
}

// ============================================================
// Part 3: 직접 Bold 적용/해제 (execCommand 없이)
// ============================================================

export function applyBold(): void {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  const fragment = range.extractContents();
  const strong = document.createElement('strong');
  strong.appendChild(fragment);
  range.insertNode(strong);

  // 삽입 후 Selection 복원
  const newRange = document.createRange();
  newRange.selectNodeContents(strong);
  selection.removeAllRanges();
  selection.addRange(newRange);
}

export function removeBold(editorRoot: HTMLElement): void {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const anchorNode = selection.anchorNode;
  if (!anchorNode) return;

  const element = anchorNode.nodeType === Node.TEXT_NODE
    ? anchorNode.parentElement
    : anchorNode as Element;

  const strong = element?.closest('strong');
  if (!strong || !editorRoot.contains(strong)) return;

  // strong의 자식 노드들을 strong 앞에 삽입
  const parent = strong.parentNode;
  if (!parent) return;

  while (strong.firstChild) {
    parent.insertBefore(strong.firstChild, strong);
  }
  strong.remove();
}

// ============================================================
// Part 4: 데모 컴포넌트
// ============================================================

export default function ToggleMarkBoldDemo() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [history] = useState(() => new CommandHistory());
  const [, forceUpdate] = useState(0);

  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);

  const handleToggleBold = useCallback(() => {
    if (!editorRef.current) return;
    const command = new ToggleMarkCommand(editorRef.current, 'STRONG');
    history.execute(command);
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

  return (
    <div>
      <h2>Day 09: ToggleMarkCommand - Bold</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleToggleBold}
          style={{ fontWeight: 'bold', minWidth: '40px' }}
        >
          B
        </button>
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
        style={{ border: '1px solid #ccc', padding: '16px', minHeight: '150px', lineHeight: '1.8' }}
      >
        텍스트를 선택한 후 B 버튼을 클릭하여 <strong>볼드 서식</strong>을 적용하거나 해제해보세요.
        이미 볼드인 텍스트를 선택하면 해제되어야 합니다.
      </div>

      <div style={{ marginTop: '12px', padding: '8px', background: '#f5f5f5', fontSize: '12px', fontFamily: 'monospace' }}>
        <strong>innerHTML 미리보기:</strong>
        <pre style={{ margin: '4px 0', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {editorRef.current?.innerHTML}
        </pre>
      </div>
    </div>
  );
}
