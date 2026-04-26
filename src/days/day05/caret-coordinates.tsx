/**
 * Day 05 - 커서 좌표 추적
 * 난이도: ⭐⭐⭐⭐
 *
 * 학습 목표:
 * - getBoundingClientRect()로 Range의 화면 좌표 계산
 * - caretRangeFromPoint / caretPositionFromPoint로 마우스 위치 → 커서 위치 역추적
 * - 커서 위치 기반 플로팅 UI 위치 계산
 *
 * 왜 배우는가:
 * Notion의 슬래시 커맨드 팝업, 멘션(@) 드롭다운, AI 어시스턴트 제안 UI처럼
 * "커서 바로 옆에 무언가를 띄워야 하는" 기능은 모두 커서의 정확한 화면 좌표를 알아야 구현할 수 있다.
 * 텍스트 입력 위치를 DOM 좌표로 변환하는 이 능력 없이는 에디터급 UX를 만들 수 없다.
 *
 * 상호작용: Day04의 커서 제어 응용
 */

import { useRef, useState, useCallback, useEffect } from "react";

// ============================================================
// Part 1: Range 좌표 획득
// ============================================================

/**
 * TODO: 현재 Selection의 Range에서 화면 좌표를 반환하는 함수
 *
 * 힌트:
 * - selection.getRangeAt(0)으로 Range 획득
 * - range.getBoundingClientRect()로 DOMRect 획득
 *   (선택 영역이 있으면 전체 영역, collapsed이면 커서 위치 근처)
 * - collapsed 상태에서 getBoundingClientRect()가 빈 rect를 반환할 수 있음
 *   → getClientRects()[0]으로 대안 처리
 * - 반환값: { x, y, width, height, top, bottom, left, right }
 */
export function getRangeCoordinates(range: Range): DOMRect | null {
  // TODO: 구현

  const domRect = range.getBoundingClientRect();

  return domRect;
}

/**
 * TODO: 커서(collapsed range)의 정확한 x, y 좌표 반환
 *
 * 힌트:
 * - collapsed range에서 getBoundingClientRect()는 width=0인 rect를 반환
 * - top, left, height로 커서 위치 계산 가능
 * - 빈 rect(top=0, left=0)인 경우 getClientRects()로 대안 처리
 */
export function getCaretCoordinates(): { x: number; y: number } | null {
  // TODO: 구현
  const selection = window.getSelection();

  if (!selection) return null;

  const range = selection.getRangeAt(0);
  const clientRects = range.getClientRects();

  if (clientRects.length === 0) return null;

  const clientRectItem = clientRects.item(0);
  const { x, y } = clientRectItem ?? { x: 0, y: 0 };

  return { x, y };
}

// ============================================================
// Part 2: 마우스 좌표 → 커서 위치 (역추적)
// ============================================================

/**
 * TODO: 화면 좌표(x, y)에서 가장 가까운 텍스트 위치의 Range를 반환
 *
 * 힌트:
 * - 브라우저별 API 차이:
 *   Chrome/Safari: document.caretRangeFromPoint(x, y) → Range | null
 *   Firefox: document.caretPositionFromPoint(x, y) → CaretPosition | null
 *     → caretPosition.offsetNode, caretPosition.offset으로 Range 생성
 * - 크로스 브라우저 처리 필요
 *
 * 타입 참고:
 * - (document as any).caretRangeFromPoint
 * - (document as any).caretPositionFromPoint
 */
export function getRangeFromPoint(x: number, y: number): Range | null {
  // TODO: 구현 (크로스 브라우저)
  return null;
}

// ============================================================
// Part 3: 플로팅 UI 위치 계산
// ============================================================

/**
 * TODO: 선택 영역 위에 플로팅 툴팁의 위치를 계산하는 함수
 *
 * 힌트:
 * - range.getBoundingClientRect()로 선택 영역 rect 획득
 * - 툴팁을 선택 영역 상단 중앙에 배치:
 *   x = rect.left + rect.width / 2 (중앙)
 *   y = rect.top - tooltipHeight - 8 (위쪽 8px 간격)
 * - window.scrollX, window.scrollY로 스크롤 오프셋 보정 (position: absolute 시)
 */
export function calcFloatingPosition(
  range: Range,
  tooltipSize: { width: number; height: number }
): { x: number; y: number } {
  // TODO: 구현
  return { x: 0, y: 0 };
}

// ============================================================
// Part 4: 데모 컴포넌트
// ============================================================

/**
 * TODO: 커서 좌표 추적 데모
 *
 * 요구사항:
 * - contenteditable 영역에서 클릭/선택 시 커서 좌표 실시간 표시
 * - 마우스 클릭 위치 → caretRangeFromPoint로 커서 이동
 * - 텍스트 선택 시 선택 영역 위에 플로팅 인포 표시 (위치 계산 결과)
 * - 커서 좌표 (x, y) 표시 패널
 */
export default function CaretCoordinatesDemo() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [caretPos, setCaretPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [floatingPos, setFloatingPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showFloating, setShowFloating] = useState(false);

  // TODO: selectionchange 이벤트로 커서 좌표 업데이트
  useEffect(() => {
    const handler = () => {
      if (editorRef.current) {
        const selection = window.getSelection();

        if (!selection) return;

        const range = selection.getRangeAt(0);

        setCaretPos(getRangeCoordinates(range));
      }
    };
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, []);

  // TODO: 마우스 클릭 → caretRangeFromPoint로 커서 이동
  const handleMouseDown = useCallback((_e: React.MouseEvent) => {
    // TODO: 구현
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <h2>Day 05: 커서 좌표 추적 </h2>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onMouseDown={handleMouseDown}
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          minHeight: "150px",
          lineHeight: "2",
        }}
      >
        <p>첫 번째 단락입니다. 여기서 텍스트를 선택하거나 클릭해보세요.</p>
        <p>
          두 번째 단락에는 <strong>볼드</strong>와 <em>이탤릭</em> 텍스트가
          있습니다.
        </p>
        <p>세 번째 단락입니다. 마우스 클릭 위치로 커서가 이동합니다.</p>
      </div>

      {/* TODO: 플로팅 인포 (선택 영역 위) */}
      {showFloating && floatingPos && (
        <div
          style={{
            position: "fixed",
            left: floatingPos.x,
            top: floatingPos.y,
            background: "#333",
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            pointerEvents: "none",
            transform: "translateX(-50%)",
          }}
        >
          선택됨
        </div>
      )}

      <div
        style={{
          marginTop: "12px",
          padding: "8px",
          fontFamily: "monospace",
          fontSize: "13px",
        }}
      >
        <div>
          커서 좌표:{" "}
          {caretPos
            ? `x=${caretPos.x.toFixed(0)}, y=${caretPos.y.toFixed(0)}`
            : "없음"}
        </div>
        <div>
          플로팅 위치:{" "}
          {floatingPos
            ? `x=${floatingPos.x.toFixed(0)}, y=${floatingPos.y.toFixed(0)}`
            : "없음"}
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
 * [ ] getBoundingClientRect()로 Range의 화면 좌표를 얻을 수 있다
 * [ ] collapsed range에서도 커서 좌표를 정확히 얻을 수 있다
 * [ ] caretRangeFromPoint로 마우스 좌표 → 텍스트 위치를 역추적할 수 있다
 * [ ] 크로스 브라우저(Chrome, Firefox) 처리를 할 수 있다
 * [ ] 선택 영역 기준으로 플로팅 UI의 위치를 계산할 수 있다
 * [ ] 스크롤 오프셋을 고려한 좌표 계산을 할 수 있다
 */
