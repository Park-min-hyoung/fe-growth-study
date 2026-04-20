/**
 * Day 04 - 글로벌 오프셋 기반 커서(Caret) 제어
 * 난이도: ⭐⭐⭐⭐⭐
 *
 * 학습 목표:
 * - TreeWalker를 활용하여 중첩된 인라인 요소를 넘나드는 커서 제어
 * - 전체 텍스트 기준 오프셋 ↔ 특정 노드+로컬 오프셋 간 변환
 * - 커서 위치를 실시간으로 추적
 *
 * 상호작용: Day03의 TreeWalker 활용
 */

import { useRef, useState, useCallback, useEffect } from "react";

// ============================================================
// Part 1: setCaretByOffset — 전체 오프셋으로 커서 이동
// ============================================================

/**
 * TODO: 루트 요소 내에서 전체 글자 수 기준 N번째 위치에 커서 배치
 *
 * 예시: "Hello <b>World</b>" 에서 offset=7 → "Wo|rld" (World의 2번째 뒤)
 *
 * 힌트:
 * 1. TreeWalker(SHOW_TEXT)로 텍스트 노드 순차 순회
 * 2. 누적 길이를 세면서, 목표 offset이 현재 노드 범위에 해당하면:
 *    - 해당 노드 내 로컬 오프셋 = offset - 지금까지 누적 길이
 * 3. Range를 생성 → setStart(foundNode, localOffset) → collapse(true)
 * 4. Selection에 적용
 *
 * 주의:
 * - 빈 텍스트 노드(공백만 있는)도 길이에 포함할지 결정
 * - offset이 전체 길이를 초과하면 마지막에 배치
 */
export function setCaretByOffset(
  root: HTMLElement,
  globalOffset: number
): void {
  // TODO: 구현
  let currentTotalLength = 0;

  const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

  while (treeWalker.nextNode()) {
    const currentNode = treeWalker.currentNode as Text;
    const currentNodeLength = currentNode.length;

    const localOffset = globalOffset - currentTotalLength;

    if (localOffset <= currentNodeLength) {
      const range = document.createRange();
      range.setStart(currentNode, localOffset);
      range.collapse();
      break;
    }

    currentTotalLength += currentNodeLength;
  }

  if (globalOffset > currentTotalLength) {
    const range = document.createRange();
    range.setStart(root, currentTotalLength);
    range.collapse();
  }
}

// ============================================================
// Part 2: getCaretOffset — 현재 커서의 전체 오프셋 반환
// ============================================================

/**
 * TODO: 현재 커서 위치를 전체 텍스트 기준 오프셋(글자 수)으로 반환
 *
 * 힌트:
 * 1. Selection에서 anchorNode, anchorOffset 획득
 * 2. TreeWalker로 root부터 텍스트 노드 순회
 * 3. anchorNode를 찾을 때까지 각 노드의 길이를 누적
 * 4. anchorNode를 찾으면 누적값 + anchorOffset 반환
 *
 * 주의:
 * - anchorNode가 텍스트 노드가 아닌 경우 처리 (요소 노드일 수 있음)
 * - anchorNode가 root 밖에 있을 수 있음
 */
export function getCaretOffset(root: HTMLElement): number {
  // TODO: 구현
  const selection = window.getSelection();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let accTextNodeLength = 0;
  let caretOffset = 0;

  if (!selection) return 0;

  const anchorNode = selection.anchorNode;

  if (
    anchorNode?.nodeType !== Node.TEXT_NODE ||
    Boolean(root.contains(anchorNode) === false)
  ) {
    return 0;
  }

  const anchorOffset = selection.anchorOffset;

  while (walker.nextNode()) {
    const currentNode = walker.currentNode as Text;

    if (currentNode === anchorNode) {
      caretOffset = accTextNodeLength + anchorOffset;
      break;
    }

    accTextNodeLength += currentNode.length;
  }

  return caretOffset;
}

// ============================================================
// Part 3: 커서를 특정 요소의 시작/끝으로 이동
// ============================================================

/**
 * TODO: 특정 요소의 시작 또는 끝에 커서 배치
 *
 * 힌트:
 * - range.selectNodeContents(element) → 요소의 전체 내용을 선택
 * - range.collapse(true) → 시작점에 커서
 * - range.collapse(false) → 끝점에 커서
 */
export function setCaretToElementEdge(
  element: HTMLElement,
  position: "start" | "end"
): void {
  // TODO: 구현
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(Boolean(position === "start"));

  const selection = window.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * TODO: 특정 요소 바로 앞 또는 뒤에 커서 배치
 *
 * 힌트:
 * - range.setStartBefore(node) / range.setStartAfter(node)
 * - range.collapse(true)
 */
export function setCaretAroundElement(
  element: HTMLElement,
  position: "before" | "after"
): void {
  // TODO: 구현
  const range = document.createRange();

  if (position === "before") {
    range.setStartBefore(element);
  } else {
    range.setEndAfter(element);
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

/**
 * TODO: 커서 제어 데모
 *
 * 요구사항:
 * - 숫자 입력 + "이동" 버튼 → setCaretByOffset
 * - 현재 커서 위치(글로벌 오프셋) 실시간 표시
 * - "처음으로" / "끝으로" 버튼
 * - "볼드 요소 앞/뒤로" 버튼 (특정 inline 요소 기준 이동)
 * - 전체 텍스트 길이 표시
 */
export default function CaretControlDemo() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [targetOffset, setTargetOffset] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);

  // TODO: selectionchange 이벤트로 currentOffset 실시간 업데이트
  // useEffect(() => {
  //   const handler = () => {
  //     if (editorRef.current) {
  //       setCurrentOffset(getCaretOffset(editorRef.current));
  //     }
  //   };
  //   document.addEventListener('selectionchange', handler);
  //   return () => document.removeEventListener('selectionchange', handler);
  // }, []);

  const handleMoveCaret = useCallback(() => {
    // TODO: setCaretByOffset(editorRef.current!, targetOffset)
  }, [targetOffset]);

  return (
    <div>
      <h2>Day 04: 커서(Caret) 제어</h2>

      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <input
          type="number"
          value={targetOffset}
          onChange={(e) => setTargetOffset(Number(e.target.value))}
          style={{ width: "80px" }}
          placeholder="오프셋"
        />
        {/* TODO: "이동" 버튼 */}
        {/* TODO: "처음으로" 버튼 */}
        {/* TODO: "끝으로" 버튼 */}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          minHeight: "150px",
        }}
      >
        안녕하세요! <strong>커서 제어</strong>를 학습합니다. <em>이탤릭</em>{" "}
        텍스트와{" "}
        <strong>
          <em>중첩 마크</em>
        </strong>
        도 포함되어 있습니다.
      </div>

      <div
        style={{
          marginTop: "12px",
          padding: "8px",
          background: "#f0f0f0",
          fontFamily: "monospace",
        }}
      >
        현재 커서 위치: {currentOffset} / 전체 길이: ?
        {/* TODO: 전체 텍스트 길이도 표시 */}
      </div>
    </div>
  );
}

/**
 * ============================================================
 * 완료 체크리스트
 * ============================================================
 *
 * [ ] 전체 오프셋 기준으로 커서를 정확한 위치에 이동시킬 수 있다
 * [ ] 인라인 요소(strong, em) 경계를 넘어서도 올바르게 동작한다
 * [ ] 현재 커서의 전체 오프셋을 정확히 계산할 수 있다
 * [ ] 요소의 시작/끝에 커서를 배치할 수 있다
 * [ ] 요소 앞/뒤에 커서를 배치할 수 있다
 * [ ] selectionchange로 커서 위치가 실시간 업데이트된다
 * [ ] offset이 범위를 벗어날 때 적절히 처리된다
 */
