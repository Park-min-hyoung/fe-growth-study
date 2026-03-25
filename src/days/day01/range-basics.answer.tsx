/**
 * Day 01 - Range 객체 기본 (정답 코드)
 *
 * ⚠️ 먼저 range-basics.tsx를 직접 구현한 뒤 비교하세요!
 */

import { useRef, useState, useCallback } from "react";

// ============================================================
// Part 1: Range 생성 + 텍스트 노드에서 범위 지정
// ============================================================

export function createTextRange(
  startNode: Node,
  startOffset: number,
  endNode: Node,
  endOffset: number
): Range {
  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);
  return range;
}

// ============================================================
// Part 2: Range 메서드
// ============================================================

/** 선택된 범위의 내용을 복제하여 반환 */
export function cloneRangeContents(range: Range): DocumentFragment {
  return range.cloneContents();
}

/** 선택된 범위의 내용을 추출(원본에서 제거)하여 반환 */
export function extractRangeContents(range: Range): DocumentFragment {
  return range.extractContents();
}

/** 선택된 범위를 주어진 태그로 감싸기 */
export function surroundWithElement(range: Range, tagName: string): void {
  const wrapper = document.createElement(tagName);

  try {
    // surroundContents는 범위가 요소를 부분적으로 포함하면 에러 발생
    range.surroundContents(wrapper);
  } catch {
    // 대안: extractContents → wrapper에 넣기 → insertNode
    const fragment = range.extractContents();
    wrapper.appendChild(fragment);
    range.insertNode(wrapper);
  }
}

// ============================================================
// Part 3: Range 비교 (compareBoundaryPoints)
// ============================================================

export function compareRanges(
  range1: Range,
  range2: Range
): { startToStart: number; endToEnd: number } {
  return {
    startToStart: range1.compareBoundaryPoints(
      Range.START_TO_START,
      range2
    ),
    endToEnd: range1.compareBoundaryPoints(Range.END_TO_END, range2),
  };
}

export function duplicateRange(range: Range): Range {
  return range.cloneRange();
}

// ============================================================
// Part 4: 데모 컴포넌트
// ============================================================

export default function RangeBasicsDemo() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [rangeInfo, setRangeInfo] = useState<string>("");
  const [clonedContent, setClonedContent] = useState<string>("");

  /** 현재 Selection에서 Range를 가져오는 헬퍼 */
  const getCurrentRange = useCallback((): Range | null => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    return selection.getRangeAt(0);
  }, []);

  /** 프로그래밍적으로 2번째~8번째 글자를 선택 */
  const handleSelectRange = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // 첫 번째 텍스트 노드 찾기
    const textNode = editor.firstChild;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

    const range = createTextRange(textNode, 1, textNode, 8);

    // Selection에 적용하여 시각적으로 보여주기
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  /** 선택된 범위의 내용을 복제하여 표시 */
  const handleClone = useCallback(() => {
    const range = getCurrentRange();
    if (!range) return;

    const fragment = cloneRangeContents(range);

    // DocumentFragment의 텍스트 내용을 표시
    const temp = document.createElement("div");
    temp.appendChild(fragment);
    setClonedContent(temp.innerHTML);
  }, [getCurrentRange]);

  /** 선택된 범위의 내용을 추출(원본에서 제거) */
  const handleExtract = useCallback(() => {
    const range = getCurrentRange();
    if (!range) return;

    const fragment = extractRangeContents(range);

    const temp = document.createElement("div");
    temp.appendChild(fragment);
    setClonedContent(`추출됨: ${temp.innerHTML}`);
  }, [getCurrentRange]);

  /** 선택된 범위를 <mark>로 감싸기 */
  const handleSurround = useCallback(() => {
    const range = getCurrentRange();
    if (!range) return;

    surroundWithElement(range, "mark");
  }, [getCurrentRange]);

  /** Range 정보 표시 */
  const handleShowRangeInfo = useCallback(() => {
    const range = getCurrentRange();
    if (!range) {
      setRangeInfo("선택된 범위가 없습니다.");
      return;
    }

    const info = [
      `toString(): "${range.toString()}"`,
      `startContainer: ${range.startContainer.nodeName} (nodeType: ${range.startContainer.nodeType})`,
      `startOffset: ${range.startOffset}`,
      `endContainer: ${range.endContainer.nodeName} (nodeType: ${range.endContainer.nodeType})`,
      `endOffset: ${range.endOffset}`,
      `collapsed: ${range.collapsed}`,
      `commonAncestorContainer: ${range.commonAncestorContainer.nodeName}`,
    ].join("\n");

    setRangeInfo(info);
  }, [getCurrentRange]);

  return (
    <div>
      <h2>Day 01: Range 객체 기본</h2>

      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button onClick={handleSelectRange}>범위 선택 (2~8)</button>
        <button onClick={handleClone}>복제</button>
        <button onClick={handleExtract}>추출</button>
        <button onClick={handleSurround}>감싸기 (mark)</button>
        <button onClick={handleShowRangeInfo}>Range 정보</button>
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
        Range 객체를 학습합니다. 이 텍스트에서 다양한 범위를 선택하고
        조작해보세요. <strong>볼드 텍스트</strong>와 <em>이탤릭 텍스트</em>도
        포함되어 있습니다.
      </div>

      {rangeInfo && (
        <pre
          style={{
            marginTop: "12px",
            padding: "12px",
            background: "#f5f5f5",
            fontSize: "13px",
          }}
        >
          {rangeInfo}
        </pre>
      )}

      {clonedContent && (
        <div
          style={{
            marginTop: "12px",
            padding: "12px",
            background: "#e8f5e9",
            fontSize: "13px",
          }}
        >
          <strong>결과:</strong> {clonedContent}
        </div>
      )}
    </div>
  );
}
