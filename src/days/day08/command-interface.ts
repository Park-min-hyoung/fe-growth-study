/**
 * Day 08 - Command 인터페이스 설계 (execute/undo)
 * 난이도: ⭐⭐⭐
 *
 * 학습 목표:
 * - Command 패턴의 핵심 인터페이스 설계
 * - execute / undo 메서드 구조 이해
 * - CommandHistory(스택 기반) 구현
 * - 간단한 텍스트 편집 Command 구현으로 패턴 체험
 */

// ============================================================
// Part 1: Command 인터페이스 정의
// ============================================================

/**
 * TODO: Command 패턴의 기본 인터페이스
 *
 * 힌트:
 * - execute(): 명령 실행
 * - undo(): 명령 취소 (실행 전 상태로 복원)
 * - description?: 명령 설명 (디버깅/UI 표시용)
 */
export interface Command {
  // TODO: 인터페이스 정의
  execute(): void;
  undo(): void;
  description?: string;
}

// ============================================================
// Part 2: CommandHistory — 실행/취소 스택 관리
// ============================================================

/**
 * TODO: Command 실행 이력을 관리하는 클래스
 *
 * 요구사항:
 * - execute(command): Command를 실행하고 undoStack에 쌓기
 *   → 새 명령 실행 시 redoStack 초기화
 * - undo(): undoStack에서 꺼내 command.undo() 호출 → redoStack에 쌓기
 * - redo(): redoStack에서 꺼내 command.execute() 호출 → undoStack에 쌓기
 * - canUndo(): undoStack이 비어있지 않은지
 * - canRedo(): redoStack이 비어있지 않은지
 * - getUndoStack(): 현재 undoStack (읽기 전용 복사본)
 * - getRedoStack(): 현재 redoStack (읽기 전용 복사본)
 * - clear(): 모든 스택 초기화
 */
export class CommandHistory {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  execute(command: Command): void {
    // TODO: 구현
  }

  undo(): void {
    // TODO: 구현
  }

  redo(): void {
    // TODO: 구현
  }

  canUndo(): boolean {
    // TODO: 구현
    return false;
  }

  canRedo(): boolean {
    // TODO: 구현
    return false;
  }

  getUndoStack(): readonly Command[] {
    // TODO: 구현
    return [];
  }

  getRedoStack(): readonly Command[] {
    // TODO: 구현
    return [];
  }

  clear(): void {
    // TODO: 구현
  }
}

// ============================================================
// Part 3: 구체적인 Command 구현 예시
// ============================================================

/**
 * TODO: 텍스트 상태를 변경하는 간단한 Command
 *
 * 힌트:
 * - 생성자에서 실행 전 상태(previousValue)를 캡처
 * - execute()에서 setState(newValue) 호출
 * - undo()에서 setState(previousValue) 호출
 */
export class SetTextCommand implements Command {
  description = 'SetText';
  private previousValue: string;

  constructor(
    private getCurrentValue: () => string,
    private setState: (value: string) => void,
    private newValue: string
  ) {
    // TODO: 현재 값 캡처
    this.previousValue = '';
  }

  execute(): void {
    // TODO: 구현
  }

  undo(): void {
    // TODO: 구현
  }
}

/**
 * TODO: 여러 Command를 하나로 묶는 CompositeCommand (매크로 패턴)
 *
 * 힌트:
 * - execute()에서 모든 commands를 순서대로 실행
 * - undo()에서 모든 commands를 역순으로 취소
 */
export class CompositeCommand implements Command {
  description = 'Composite';

  constructor(private commands: Command[]) {}

  execute(): void {
    // TODO: 구현
  }

  undo(): void {
    // TODO: 구현
  }
}

// ============================================================
// Part 4: 데모 — CommandHistory를 React에서 활용
// ============================================================

import { useState, useCallback } from 'react';

export default function CommandInterfaceDemo() {
  const [text, setText] = useState('안녕하세요!');
  const [history] = useState(() => new CommandHistory());
  const [, forceUpdate] = useState(0);

  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);

  const handleSetText = useCallback((newText: string) => {
    // TODO: SetTextCommand를 생성하여 history.execute() 호출
    // setText 대신 CommandHistory를 통해 실행
    refresh();
  }, [history, refresh]);

  const handleUndo = useCallback(() => {
    // TODO: history.undo() 호출
    refresh();
  }, [history, refresh]);

  const handleRedo = useCallback(() => {
    // TODO: history.redo() 호출
    refresh();
  }, [history, refresh]);

  return (
    <div>
      <h2>Day 08: Command 인터페이스</h2>

      <div style={{ marginBottom: '16px' }}>
        <strong>현재 텍스트:</strong> {text}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {['Hello!', '안녕!', 'Bonjour!', 'Hola!', 'こんにちは！'].map((t) => (
          <button key={t} onClick={() => handleSetText(t)}>
            "{t}"로 변경
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={handleUndo} disabled={!history.canUndo()}>
          Undo
        </button>
        <button onClick={handleRedo} disabled={!history.canRedo()}>
          Redo
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <div>
          <strong>Undo 스택 ({history.getUndoStack().length}):</strong>
          <ul>
            {history.getUndoStack().map((cmd, i) => (
              <li key={i}>{cmd.description}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Redo 스택 ({history.getRedoStack().length}):</strong>
          <ul>
            {history.getRedoStack().map((cmd, i) => (
              <li key={i}>{cmd.description}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * ============================================================
 * 완료 체크리스트
 * ============================================================
 *
 * [ ] Command 인터페이스에 execute/undo 메서드가 있다
 * [ ] CommandHistory가 undoStack/redoStack을 올바르게 관리한다
 * [ ] 새 명령 실행 시 redoStack이 초기화된다
 * [ ] undo()가 명령을 되돌리고 redoStack에 추가한다
 * [ ] redo()가 명령을 재실행하고 undoStack에 추가한다
 * [ ] SetTextCommand가 이전 값을 캡처하여 undo에 사용한다
 * [ ] CompositeCommand가 여러 명령을 순서대로/역순으로 실행한다
 * [ ] canUndo/canRedo가 스택 상태를 정확히 반영한다
 */
