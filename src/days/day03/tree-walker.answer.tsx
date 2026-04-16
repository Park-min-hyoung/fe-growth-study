/**
 * Day 03 - TreeWalker API (Answer)
 * 난이도: ⭐⭐⭐⭐
 */

import { useRef, useState, useCallback } from "react";

// ============================================================
// Part 1: 텍스트 노드만 순회 (NodeFilter.SHOW_TEXT)
// ============================================================

export function collectTextNodes(root: HTMLElement): Text[] {
  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }
  return textNodes;
}

export function getTotalTextLength(root: HTMLElement): number {
  return collectTextNodes(root).reduce(
    (sum, node) => sum + (node.textContent?.length ?? 0),
    0
  );
}

// ============================================================
// Part 2: 커스텀 필터 함수로 특정 조건의 노드만 수집
// ============================================================

/** 빈 텍스트 노드(공백만)를 제외한 텍스트 노드 수집 */
export function collectNonEmptyTextNodes(root: HTMLElement): Text[] {
  const textNodes: Text[] = [];
  const filter: NodeFilter = {
    acceptNode(node: Node) {
      return node.textContent?.trim()
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  };
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, filter);
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }
  return textNodes;
}

/**
 * SCRIPT, STYLE 내부 텍스트를 제외하고 보이는 텍스트 노드만 수집
 *
 * FILTER_REJECT vs FILTER_SKIP:
 * - REJECT: 해당 노드와 모든 자손을 순회에서 제외 → SCRIPT/STYLE에 적합
 * - SKIP: 해당 노드만 제외, 자손은 계속 순회 → 일반 요소 노드에 적합
 */
export function collectVisibleTextNodes(root: HTMLElement): Text[] {
  const textNodes: Text[] = [];
  const EXCLUDED_TAGS = new Set(["SCRIPT", "STYLE"]);

  const filter: NodeFilter = {
    acceptNode(node: Node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        // SCRIPT/STYLE은 자손까지 통째로 무시
        return EXCLUDED_TAGS.has(el.tagName)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_SKIP;
      }
      // 텍스트 노드
      return NodeFilter.FILTER_ACCEPT;
    },
  };

  // SHOW_TEXT | SHOW_ELEMENT: 요소 노드도 필터에서 볼 수 있어야 REJECT 가능
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    filter
  );
  while (walker.nextNode()) {
    if (walker.currentNode.nodeType === Node.TEXT_NODE) {
      textNodes.push(walker.currentNode as Text);
    }
  }
  return textNodes;
}

// ============================================================
// Part 3: TreeWalker vs NodeIterator vs 재귀 순회
// ============================================================

/** NodeIterator 방식 */
export function collectWithNodeIterator(root: HTMLElement): Text[] {
  const textNodes: Text[] = [];
  const iter = document.createNodeIterator(root, NodeFilter.SHOW_TEXT, null);
  let node: Node | null;
  while ((node = iter.nextNode())) {
    textNodes.push(node as Text);
  }
  return textNodes;
}

/** 재귀 순회 방식 */
export function collectWithRecursion(root: HTMLElement): Text[] {
  const textNodes: Text[] = [];
  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node as Text);
    }
    for (const child of node.childNodes) {
      walk(child);
    }
  }
  walk(root);
  return textNodes;
}

/** 세 가지 순회 방식 성능 비교 */
export function benchmarkTraversal(root: HTMLElement) {
  const RUNS = 100;

  const t0 = performance.now();
  for (let i = 0; i < RUNS; i++) collectTextNodes(root);
  const treeWalker = (performance.now() - t0) / RUNS;

  const t1 = performance.now();
  for (let i = 0; i < RUNS; i++) collectWithNodeIterator(root);
  const nodeIterator = (performance.now() - t1) / RUNS;

  const t2 = performance.now();
  for (let i = 0; i < RUNS; i++) collectWithRecursion(root);
  const recursion = (performance.now() - t2) / RUNS;

  return { treeWalker, nodeIterator, recursion };
}

// ============================================================
// Part 4: 데모 컴포넌트
// ============================================================

export default function TreeWalkerDemo() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<{ text: string; parent: string }[]>([]);
  const [benchmark, setBenchmark] = useState<{
    treeWalker: number;
    nodeIterator: number;
    recursion: number;
  } | null>(null);

  const handleCollect = useCallback(() => {
    if (!editorRef.current) return;
    const collected = collectTextNodes(editorRef.current).map((node) => ({
      text: node.textContent ?? "",
      parent: node.parentElement?.tagName ?? "unknown",
    }));
    setNodes(collected);
    setBenchmark(null);
  }, []);

  const handleNonEmpty = useCallback(() => {
    if (!editorRef.current) return;
    const collected = collectNonEmptyTextNodes(editorRef.current).map(
      (node) => ({
        text: node.textContent ?? "",
        parent: node.parentElement?.tagName ?? "unknown",
      })
    );
    setNodes(collected);
    setBenchmark(null);
  }, []);

  const handleBenchmark = useCallback(() => {
    if (!editorRef.current) return;
    const result = benchmarkTraversal(editorRef.current);
    setBenchmark(result);
    setNodes([]);
  }, []);

  const handleHighlight = useCallback((text: string) => {
    if (!editorRef.current) return;
    const walker = document.createTreeWalker(
      editorRef.current,
      NodeFilter.SHOW_TEXT,
      null
    );
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      if (node.textContent === text) {
        const range = document.createRange();
        range.selectNode(node);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        break;
      }
    }
  }, []);

  return (
    <div>
      <h2>Day 03: TreeWalker API</h2>

      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button onClick={handleCollect}>텍스트 노드 수집</button>
        <button onClick={handleNonEmpty}>비어있지 않은 노드만</button>
        <button onClick={handleBenchmark}>성능 비교</button>
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

      {nodes.length > 0 && (
        <div style={{ marginTop: "12px" }}>
          <h3>수집된 텍스트 노드 ({nodes.length}개)</h3>
          <ul style={{ fontFamily: "monospace", fontSize: "13px" }}>
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
 * [x] createTreeWalker로 텍스트 노드만 수집할 수 있다
 * [x] FILTER_ACCEPT/REJECT/SKIP의 차이를 이해하고 활용할 수 있다
 * [x] 빈 텍스트 노드를 필터링할 수 있다
 * [x] SCRIPT/STYLE 내부 텍스트를 FILTER_REJECT로 제외할 수 있다
 * [x] NodeIterator와 재귀 순회 방식도 구현할 수 있다
 * [x] 세 가지 순회 방식의 성능을 비교할 수 있다
 * [x] 수집된 텍스트 노드의 부모 태그와 내용이 올바르게 표시된다
 */
