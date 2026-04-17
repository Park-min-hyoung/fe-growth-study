/**
 * Day 08 - Command 인터페이스 설계 (정답 코드)
 *
 * ⚠️ 먼저 command-interface.ts를 직접 구현한 뒤 비교하세요!
 */

// ============================================================
// Part 1: Command 인터페이스 정의
// ============================================================

export interface Command {
  execute(): void;
  undo(): void;
  description?: string;
}

// ============================================================
// Part 2: CommandHistory
// ============================================================

export class CommandHistory {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  execute(command: Command): void {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = []; // 새 명령 실행 시 redoStack 초기화
  }

  undo(): void {
    const command = this.undoStack.pop();
    if (!command) return;
    command.undo();
    this.redoStack.push(command);
  }

  redo(): void {
    const command = this.redoStack.pop();
    if (!command) return;
    command.execute();
    this.undoStack.push(command);
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  getUndoStack(): readonly Command[] {
    return [...this.undoStack];
  }

  getRedoStack(): readonly Command[] {
    return [...this.redoStack];
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}

// ============================================================
// Part 3: 구체적인 Command 구현
// ============================================================

export class SetTextCommand implements Command {
  private previousValue: string;

  get description() {
    return `SetText("${this.newValue}")`;
  }

  constructor(
    private getCurrentValue: () => string,
    private setState: (value: string) => void,
    private newValue: string
  ) {
    this.previousValue = getCurrentValue();
  }

  execute(): void {
    this.setState(this.newValue);
  }

  undo(): void {
    this.setState(this.previousValue);
  }
}

export class CompositeCommand implements Command {
  description = 'Composite';

  constructor(private commands: Command[]) {}

  execute(): void {
    for (const command of this.commands) {
      command.execute();
    }
  }

  undo(): void {
    for (const command of [...this.commands].reverse()) {
      command.undo();
    }
  }
}

// ============================================================
// Part 4: 데모
// ============================================================

import { useState, useCallback } from 'react';

export default function CommandInterfaceDemo() {
  const [text, setText] = useState('안녕하세요!');
  const [history] = useState(() => new CommandHistory());
  const [, forceUpdate] = useState(0);

  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);

  const handleSetText = useCallback((newText: string) => {
    const command = new SetTextCommand(
      () => text,
      setText,
      newText
    );
    history.execute(command);
    refresh();
  }, [history, text, refresh]);

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
          Undo ({history.getUndoStack().length})
        </button>
        <button onClick={handleRedo} disabled={!history.canRedo()}>
          Redo ({history.getRedoStack().length})
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <div>
          <strong>Undo 스택:</strong>
          <ul>
            {history.getUndoStack().map((cmd, i) => (
              <li key={i} style={{ fontFamily: 'monospace', fontSize: '13px' }}>{cmd.description}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Redo 스택:</strong>
          <ul>
            {history.getRedoStack().map((cmd, i) => (
              <li key={i} style={{ fontFamily: 'monospace', fontSize: '13px' }}>{cmd.description}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
