/**
 * Day 03 - TreeWalker API
 * 난이도: ⭐⭐⭐⭐
 *
 * 학습 목표:
 * - document.createTreeWalker()로 DOM 트리를 효율적으로 순회
 * - NodeFilter를 사용한 조건부 노드 필터링
 * - TreeWalker vs NodeIterator vs 재귀 순회 비교
 */

import { useRef, useState, useCallback } from "react";

// ============================================================
// Part 1: 텍스트 노드만 순회 (NodeFilter.SHOW_TEXT)
// ============================================================

/**
 * TODO: 주어진 루트 요소 내의 모든 텍스트 노드를 수집
 *
 * 힌트:
 * - document.createTreeWalker(root, whatToShow, filter)
 *   root: 순회 시작 노드
 *   whatToShow: NodeFilter.SHOW_TEXT (텍스트 노드만)
 *   filter: null (필터 없음) 또는 NodeFilter 객체
 * - walker.nextNode()로 다음 노드 이동 (null이면 끝)
 * - walker.currentNode로 현재 노드 접근
 * - while 루프로 모든 노드 수집
 */
export function collectTextNodes(root: HTMLElement): Text[] {
  const textNodes: Text[] = [];
  // TODO: TreeWalker 생성 + while(walker.nextNode()) 루프로 수집
  const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

  while (treeWalker.nextNode()) {
    textNodes.push(treeWalker.currentNode as Text);
  }

  return textNodes.filter(Boolean);
}

/**
 * TODO: 전체 텍스트 길이 계산 (모든 텍스트 노드의 textContent 합산)
 */
export function getTotalTextLength(root: HTMLElement): number {
  // TODO: collectTextNodes 활용

  const textNodes = collectTextNodes(root);

  const mappedTextNodes = textNodes.map((node) => node.textContent);
  const totalTextLength = mappedTextNodes.join("").length;

  return totalTextLength;
}

// ============================================================
// Part 2: 커스텀 필터 함수로 특정 조건의 노드만 수집
// ============================================================

/**
 * TODO: 커스텀 NodeFilter로 조건에 맞는 노드만 수집
 *
 * 힌트:
 * - NodeFilter는 { acceptNode(node): number } 객체
 * - 반환값:
 *   NodeFilter.FILTER_ACCEPT — 포함
 *   NodeFilter.FILTER_REJECT — 제외 (자식도 건너뜀)
 *   NodeFilter.FILTER_SKIP — 제외 (자식은 계속 순회)
 * - REJECT vs SKIP 차이가 중요:
 *   REJECT: 해당 노드와 모든 자손을 무시
 *   SKIP: 해당 노드만 무시, 자손은 계속 방문
 */

/** 빈 텍스트 노드(공백만)를 제외한 텍스트 노드 수집 */
export function collectNonEmptyTextNodes(root: HTMLElement): Text[] {
  const nodeFilter = {
    acceptNode: function (node: Node) {
      if (node.textContent?.trim() !== "") return NodeFilter.FILTER_REJECT;
      else return NodeFilter.FILTER_ACCEPT;
    },
  };
  const textNodes: Text[] = [];
  // TODO: filter에서 node.textContent?.trim() 확인
  const treewalker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ALL,
    nodeFilter
  );

  while (treewalker.nextNode()) {
    textNodes.push(treewalker.currentNode as Text);
  }

  return textNodes;
}

/** 특정 태그(예: 'SCRIPT', 'STYLE') 내부의 노드를 제외하고 수집 */
export function collectVisibleTextNodes(root: HTMLElement): Text[] {
  const nodeFilter = {
    acceptNode: function (node: Node) {
      if (node.nodeName === "SCRIPT" || node.nodeName === "STYLE")
        return NodeFilter.FILTER_REJECT;
      else if (node.nodeType === Node.TEXT_NODE)
        return NodeFilter.FILTER_ACCEPT;
      else return NodeFilter.FILTER_SKIP;
    },
  };
  const textNodes: Text[] = [];
  const treeWalker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ALL,
    nodeFilter
  );

  while (treeWalker.nextNode()) {
    textNodes.push(treeWalker.currentNode as Text);
  }

  return textNodes;
}

// ============================================================
// Part 3: TreeWalker vs NodeIterator vs 재귀 순회
// ============================================================

/**
 * TODO: 세 가지 방식으로 텍스트 노드를 수집하고 성능 비교
 *
 * 힌트:
 * - NodeIterator: document.createNodeIterator(root, whatToShow, filter)
 *   TreeWalker와 비슷하지만 nextNode()/previousNode()만 지원 (형제/부모 이동 없음)
 * - 재귀 순회: node.childNodes를 for 루프로 재귀 방문
 * - performance.now()로 소요 시간 측정
 */

/** NodeIterator 방식 */
export function collectWithNodeIterator(root: HTMLElement): Text[] {
  // TODO: createNodeIterator 사용
  const textNodes: Text[] = [];
  let node = null;
  const nodeIterator = document.createNodeIterator(root, NodeFilter.SHOW_TEXT);

  while ((node = nodeIterator.nextNode())) {
    textNodes.push(node as Text);
  }

  return textNodes;
}

/** 재귀 순회 방식 */
export function collectWithRecursion(root: HTMLElement): Text[] {
  const textNodes: Text[] = [];
  // TODO: 재귀 함수로 childNodes 순회
  function walk(node: Node) {
    if (!node) return;

    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node);
    }

    if (node.childNodes.length > 0) {
      for (const childNode of node.childNodes) {
        walk(childNode);
      }
    }
  }

  walk(root);

  return textNodes;
}

/** 성능 비교 */
export function benchmarkTraversal(root: HTMLElement) {
  // TODO: 세 방식의 실행 시간을 측정하여 반환
  const calc = (fn) => {
    const t0 = performance.now();
    fn(root);
    const t1 = performance.now();

    return t1 - t0;
  };

  return {
    treeWalker: calc(collectTextNodes),
    nodeIterator: calc(collectWithNodeIterator),
    recursion: calc(collectWithRecursion),
  };
}

// ============================================================
// Part 4: 데모 컴포넌트
// ============================================================

/**
 * TODO: TreeWalker를 시각화하는 데모
 *
 * 요구사항:
 * - contenteditable 영역에 복잡한 중첩 구조의 HTML
 * - "텍스트 노드 수집" 버튼 → 모든 텍스트 노드의 내용과 부모 태그 표시
 * - "비어있지 않은 노드만" 버튼 → 빈 텍스트 노드 제외
 * - "성능 비교" 버튼 → 세 방식의 실행 시간 비교 표시
 * - 각 텍스트 노드를 클릭하면 해당 노드가 에디터에서 하이라이트
 */
export default function TreeWalkerDemo() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<{ text: string; parent: string }[]>([]);
  const [benchmark, setBenchmark] = useState<{
    treeWalker: number;
    nodeIterator: number;
    recursion: number;
  } | null>(null);

  const handleCollect = useCallback(() => {
    // TODO: collectTextNodes → 결과를 nodes에 저장
    // 각 노드의 textContent와 parentElement.tagName 기록
    if (!editorRef.current) return;

    const textNodes = collectTextNodes(editorRef.current);
    const nodes = textNodes.map((node) => {
      return {
        parent: node.parentElement?.tagName ?? "",
        text: node.data,
      };
    });
    setNodes(nodes);
  }, []);

  const handleNoEmptyNodeCollection = useCallback(() => {
    // TODO: collectTextNodes → 결과를 nodes에 저장
    // 각 노드의 textContent와 parentElement.tagName 기록
    if (!editorRef.current) return;

    const textNodes = collectTextNodes(editorRef.current);
    const nodes = textNodes
      .map((node) => {
        return {
          parent: node.parentElement?.tagName ?? "",
          text: node.data,
        };
      })
      .filter((node) => Boolean(node.text.trim()));
    setNodes(nodes);
  }, []);

  const handleHighlight = useCallback((text) => {
    if (!editorRef.current) return;

    const walker = document.createTreeWalker(
      editorRef.current,
      NodeFilter.SHOW_TEXT,
      null
    );

    while (walker.nextNode()) {
      const currentNode = walker.currentNode as Text;
      const currentNodeText = currentNode.data;

      if (text === currentNodeText) {
        const range = document.createRange();

        range.setStart(currentNode, 0);
        range.setEnd(currentNode, currentNode.data.length);

        const selection = window.getSelection();

        if (!selection) return;

        selection.removeAllRanges();
        selection.addRange(range);

        break;
      }
    }
  }, []);

  const handleBenchMark = useCallback(() => {
    if (!editorRef.current) return;

    const benchmark = benchmarkTraversal(editorRef.current);
    console.log(benchmark);
    setBenchmark(benchmark);
  }, []);

  return (
    <div>
      <h2>Day 03: TreeWalker API</h2>

      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        {/* TODO: "텍스트 노드 수집" 버튼 */}
        <button onClick={handleCollect}>텍스트 노드 수집</button>
        {/* TODO: "비어있지 않은 노드만" 버튼 */}
        <button onClick={handleNoEmptyNodeCollection}>
          비어있지 않는 노드만
        </button>
        {/* TODO: "성능 비교" 버튼 */}
        <button onClick={handleBenchMark}>성능 비교</button>
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
        <p>
          첫 번째 <strong>볼드</strong> 문단입니다.
        </p>
        <p>
          두 번째 문단에 <em>이탤릭</em>과{" "}
          <strong>
            <em>볼드+이탤릭</em>
          </strong>
          이 있습니다.
        </p>
        <ul>
          <li>리스트 아이템 1</li>
          <li>
            리스트 아이템 2 <a href="#">링크</a>
          </li>
        </ul>
      </div>

      {/* TODO: 수집된 텍스트 노드 목록 표시 */}
      {nodes.length > 0 && (
        <div style={{ marginTop: "12px" }}>
          <h3>수집된 텍스트 노드 ({nodes.length}개)</h3>
          <ul style={{ fontFamily: "monospace", fontSize: "13px" }}>
            {/* TODO: 각 노드의 부모 태그와 텍스트 내용 표시 */}
            {nodes.map((n, i) => (
              <li
                key={i}
                style={{ cursor: "pointer", padding: "2px 0" }}
                onClick={() => handleHighlight(n.text)}
              >
                <span style={{ color: "#888" }}>
                  &lt;{n.parent.toLowerCase()}&gt;
                </span>{" "}
                {JSON.stringify(n.text)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* TODO: 벤치마크 결과 표시 */}
      {benchmark && (
        <div
          style={{
            marginTop: "12px",
            fontFamily: "monospace",
            fontSize: "13px",
          }}
        >
          <h3>성능 비교 (100회 평균, ms)</h3>
          <table style={{ borderCollapse: "collapse" }}>
            <tbody>
              {(["treeWalker", "nodeIterator", "recursion"] as const).map(
                (key) => (
                  <tr key={key}>
                    <td style={{ paddingRight: "16px" }}>{key}</td>
                    <td>{benchmark[key].toFixed(4)} ms</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
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
 * [ ] createTreeWalker로 텍스트 노드만 수집할 수 있다
 * [ ] FILTER_ACCEPT/REJECT/SKIP의 차이를 이해하고 활용할 수 있다
 * [ ] 빈 텍스트 노드를 필터링할 수 있다
 * [ ] SCRIPT/STYLE 내부 텍스트를 FILTER_REJECT로 제외할 수 있다
 * [ ] NodeIterator와 재귀 순회 방식도 구현할 수 있다
 * [ ] 세 가지 순회 방식의 성능을 비교할 수 있다
 * [ ] 수집된 텍스트 노드의 부모 태그와 내용이 올바르게 표시된다
 */
