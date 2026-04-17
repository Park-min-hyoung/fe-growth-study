/**
 * Day 06 - CSS Custom Highlight API (정답 코드)
 *
 * ⚠️ 먼저 highlight-api.tsx를 직접 구현한 뒤 비교하세요!
 */

import { useRef, useState, useCallback, useEffect } from 'react';

// CSS.highlights 타입 보강
type HighlightRegistry = {
  set(name: string, highlight: Highlight): void;
  delete(name: string): void;
  clear(): void;
  has(name: string): boolean;
};

declare class Highlight {
  constructor(...ranges: Range[]);
  priority: number;
  add(range: Range): void;
  delete(range: Range): void;
  clear(): void;
}

const highlights = (CSS as unknown as { highlights: HighlightRegistry }).highlights;

// ============================================================
// Part 1: Highlight 객체 생성 및 등록
// ============================================================

export function registerHighlight(name: string, ranges: Range[]): void {
  if (!highlights) return;
  const highlight = new Highlight(...ranges);
  highlights.set(name, highlight);
}

export function removeHighlight(name: string): void {
  if (!highlights) return;
  highlights.delete(name);
}

// ============================================================
// Part 2: 텍스트 검색 후 하이라이트
// ============================================================

export function highlightSearchText(
  root: HTMLElement,
  searchText: string,
  highlightName: string
): number {
  removeHighlight(highlightName);
  if (!searchText) return 0;

  const ranges: Range[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const text = node.textContent ?? '';
    let startIndex = 0;

    while (true) {
      const matchIndex = text.indexOf(searchText, startIndex);
      if (matchIndex === -1) break;

      const range = document.createRange();
      range.setStart(node, matchIndex);
      range.setEnd(node, matchIndex + searchText.length);
      ranges.push(range);

      startIndex = matchIndex + searchText.length;
    }
  }

  if (ranges.length > 0) {
    registerHighlight(highlightName, ranges);
  }

  return ranges.length;
}

// ============================================================
// Part 3: 다중 하이라이트 (우선순위)
// ============================================================

export function registerHighlightWithPriority(
  name: string,
  ranges: Range[],
  priority: number
): void {
  if (!highlights) return;
  const highlight = new Highlight(...ranges);
  highlight.priority = priority;
  highlights.set(name, highlight);
}

// ============================================================
// Part 4: 데모 컴포넌트
// ============================================================

const SEARCH_HIGHLIGHT = 'search-highlight';
const SELECTION_HIGHLIGHT = 'selection-highlight';

export default function HighlightApiDemo() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [searchText, setSearchText] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!('highlights' in CSS)) {
      setSupported(false);
      return;
    }

    // selectionchange → 선택 영역 하이라이트
    const handler = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        removeHighlight(SELECTION_HIGHLIGHT);
        return;
      }
      const range = selection.getRangeAt(0).cloneRange();
      registerHighlightWithPriority(SELECTION_HIGHLIGHT, [range], 2);
    };

    document.addEventListener('selectionchange', handler);
    return () => {
      document.removeEventListener('selectionchange', handler);
      removeHighlight(SEARCH_HIGHLIGHT);
      removeHighlight(SELECTION_HIGHLIGHT);
    };
  }, []);

  const handleSearch = useCallback(() => {
    if (!editorRef.current) return;
    if (!searchText.trim()) {
      removeHighlight(SEARCH_HIGHLIGHT);
      setMatchCount(0);
      return;
    }
    const count = highlightSearchText(editorRef.current, searchText, SEARCH_HIGHLIGHT);
    setMatchCount(count);
  }, [searchText]);

  const handleClear = useCallback(() => {
    removeHighlight(SEARCH_HIGHLIGHT);
    setMatchCount(0);
    setSearchText('');
  }, []);

  if (!supported) {
    return (
      <div>
        <h2>Day 06: CSS Custom Highlight API</h2>
        <p style={{ color: 'red' }}>이 브라우저는 CSS Custom Highlight API를 지원하지 않습니다. Chrome 105+ 또는 Safari 17.2+를 사용하세요.</p>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        ::highlight(search-highlight) {
          background-color: yellow;
          color: black;
        }
        ::highlight(selection-highlight) {
          background-color: #4CAF50;
          color: white;
        }
      `}</style>

      <h2>Day 06: CSS Custom Highlight API</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="검색어 입력..."
          style={{ flex: 1, padding: '4px 8px' }}
        />
        <button onClick={handleSearch}>검색</button>
        <button onClick={handleClear}>제거</button>
        {matchCount > 0 && <span style={{ color: '#333' }}>{matchCount}개 발견</span>}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        style={{ border: '1px solid #ccc', padding: '16px', minHeight: '200px', lineHeight: '1.8' }}
      >
        <p>CSS Custom Highlight API를 학습합니다. 이 API는 DOM을 변경하지 않고 텍스트에 하이라이트를 적용할 수 있습니다.</p>
        <p>기존의 하이라이트 방식은 span 태그를 삽입하는 방식이었습니다. 하지만 CSS Custom Highlight API를 사용하면 CSS만으로 하이라이트를 제어할 수 있습니다.</p>
        <p>검색 기능에서 특히 유용합니다. 검색어를 입력하면 텍스트 내 모든 매칭 항목이 하이라이트됩니다. CSS Custom Highlight는 성능도 우수합니다.</p>
      </div>

      <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
        * Chrome 105+, Safari 17.2+ 지원. Firefox 미지원.
      </div>
    </div>
  );
}
