/**
 * Day 09 - ToggleMarkCommand - bold 적용/해제
 * 난이도: ⭐⭐⭐⭐
 *
 * 학습 목표:
 * - Selection API를 활용한 서식 Command 구현
 * - 선택 영역 내 텍스트에 <strong> 태그 적용/해제
 * - 스냅샷 기반 undo (innerHTML 저장)
 * - 부분 선택 + 이미 적용된 서식 감지
 */

import { useRef, useState, useCallback } from 'react';
import { Command, CommandHistory } from '../day08/command-interface';

// ============================================================
// Part 1: 서식 감지 유틸리티
// ============================================================

/**
 * TODO: 현재 Selection의 조상 요소 중 특정 태그가 있는지 확인
 *
 * 힌트:
 * - selection.anchorNode부터 editorRoot까지 올라가며 tagName 확인
 * - node.parentElement?.closest(tagName) 활용 가능
 * - 또는 직접 while 루프로 parentElement 탐색
 */
export function isMarkActive(tagName: string, editorRoot: HTMLElement): boolean {
  // TODO: 구현
  return false;
}

/**
 * TODO: Range 내의 모든 텍스트가 특정 태그로 감싸져 있는지 확인
 *
 * 힌트:
 * - range.commonAncestorContainer.closest(tagName) 확인
 * - 또는 range 내 텍스트 노드들의 조상 탐색
 */
export function isRangeFullyMarked(range: Range, tagName: string): boolean {
  // TODO: 구현
  return false;
}

// ============================================================
// Part 2: ToggleMarkCommand
// ============================================================

/**
 * TODO: 선택 영역에 마크(태그) 서식을 토글하는 Command
 *
 * 구현 전략 (스냅샷 방식):
 * - execute() 전에 editorRoot.innerHTML을 저장 → undo 시 복원
 * - 적용: surroundContents or execCommand('bold')
 * - 해제: 이미 적용된 경우 → 반대 execCommand or 직접 unwrap
 *
 * 힌트:
 * - 가장 간단한 방법: document.execCommand('bold') (deprecated이나 동작)
 * - 직접 구현: 선택 영역을 추출(extractContents) → wrapper에 넣기 → insertNode
 * - 이미 bold인 경우 해제: wrapper를 제거하고 내용만 남기기 (unwrap)
 *
 * undo 전략:
 * - innerHTML 스냅샷 저장 후 복원이 가장 단순
 * - 더 정교하게: Range 상태도 저장
 */
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
    // TODO: 스냅샷 저장 후 서식 토글
  }

  undo(): void {
    // TODO: 스냅샷으로 복원
  }
}

// ============================================================
// Part 3: 직접 Bold 적용/해제 (execCommand 없이)
// ============================================================

/**
 * TODO: execCommand를 사용하지 않고 직접 Range 조작으로 bold 적용
 *
 * 힌트:
 * 적용:
 * 1. selection.getRangeAt(0)
 * 2. range.extractContents() → fragment
 * 3. document.createElement('strong') → appendChild(fragment)
 * 4. range.insertNode(strong)
 *
 * 해제 (unwrap):
 * 1. strong 요소 찾기 (anchorNode.closest('strong'))
 * 2. strong의 childNodes를 strong 앞에 insertBefore
 * 3. strong 제거 (strong.remove())
 */
export function applyBold(): void {
  // TODO: 구현
}

export function removeBold(editorRoot: HTMLElement): void {
  // TODO: 구현
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

  return (
    <div>
      <h2>Day 09: ToggleMarkCommand - Bold</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          onMouseDown={(e) => e.preventDefault()} // 선택 해제 방지
          onClick={handleToggleBold}
          style={{ fontWeight: 'bold', minWidth: '40px' }}
        >
          B
        </button>
        <button onClick={handleUndo} disabled={!history.canUndo()}>
          Undo
        </button>
        <button onClick={handleRedo} disabled={!history.canRedo()}>
          Redo
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        style={{
          border: '1px solid #ccc',
          padding: '16px',
          minHeight: '150px',
          lineHeight: '1.8',
        }}
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

/**
 * ============================================================
 * 완료 체크리스트
 * ============================================================
 *
 * [ ] 선택 영역에 bold 서식을 적용할 수 있다
 * [ ] 이미 bold인 선택 영역에서 서식을 해제할 수 있다
 * [ ] ToggleMarkCommand가 Command 인터페이스를 올바르게 구현한다
 * [ ] execute() 전 innerHTML 스냅샷을 저장한다
 * [ ] undo() 시 스냅샷으로 정확히 복원된다
 * [ ] CommandHistory와 연동하여 undo/redo가 동작한다
 * [ ] 버튼 클릭 시 선택이 해제되지 않도록 mousedown preventDefault를 사용한다
 */
