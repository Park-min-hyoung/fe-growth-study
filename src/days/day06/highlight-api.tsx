/**
 * Day 06 - CSS Custom Highlight API
 * 난이도: ⭐⭐⭐⭐
 *
 * 학습 목표:
 * - CSS Custom Highlight API로 DOM 변경 없이 텍스트 하이라이트
 * - CSS::highlights 등록 및 CSS 스타일 연결
 * - 검색 하이라이트, 다중 하이라이트 관리
 *
 * 브라우저 지원: Chrome 105+, Safari 17.2+, Firefox 미지원(2024 기준)
 */

import { useRef, useState, useCallback } from 'react';

// ============================================================
// Part 1: Highlight 객체 생성 및 등록
// ============================================================

/**
 * TODO: Range 배열로 Highlight 객체를 생성하고 CSS.highlights에 등록
 *
 * 힌트:
 * - const highlight = new Highlight(...ranges)
 * - CSS.highlights.set('highlight-name', highlight)
 * - CSS에서 ::highlight(highlight-name) { background: yellow; } 로 스타일 지정
 *
 * 주의:
 * - CSS.highlights는 실험적 API — 타입 선언 없을 수 있음
 * - (CSS as any).highlights 로 접근
 */
export function registerHighlight(name: string, ranges: Range[]): void {
  // TODO: 구현
}

/**
 * TODO: 등록된 Highlight 제거
 *
 * 힌트:
 * - CSS.highlights.delete('highlight-name')
 * - CSS.highlights.clear() — 전체 제거
 */
export function removeHighlight(name: string): void {
  // TODO: 구현
}

// ============================================================
// Part 2: 텍스트 검색 후 하이라이트
// ============================================================

/**
 * TODO: root 요소 내에서 searchText와 일치하는 모든 위치에 하이라이트 적용
 *
 * 힌트:
 * 1. TreeWalker(SHOW_TEXT)로 모든 텍스트 노드 순회
 * 2. 각 텍스트 노드에서 searchText 위치를 indexOf로 찾기
 * 3. 찾은 위치마다 Range 생성:
 *    range.setStart(textNode, matchIndex)
 *    range.setEnd(textNode, matchIndex + searchText.length)
 * 4. 수집한 Range 배열로 registerHighlight 호출
 *
 * 반환: 매칭 개수
 */
export function highlightSearchText(
  root: HTMLElement,
  searchText: string,
  highlightName: string
): number {
  // TODO: 구현
  return 0;
}

// ============================================================
// Part 3: 다중 하이라이트 (우선순위)
// ============================================================

/**
 * TODO: 다중 Highlight 등록 시 우선순위 설정
 *
 * 힌트:
 * - Highlight 객체에 priority 속성 설정 가능
 * - highlight.priority = 1 (높을수록 우선)
 * - 겹치는 하이라이트가 있을 때 priority로 색상 결정
 */
export function registerHighlightWithPriority(
  name: string,
  ranges: Range[],
  priority: number
): void {
  // TODO: 구현
}

// ============================================================
// Part 4: 데모 컴포넌트
// ============================================================

/**
 * TODO: CSS Custom Highlight API 데모
 *
 * 요구사항:
 * - 검색어 입력 → 텍스트 내 매칭 항목 모두 하이라이트
 * - 매칭 개수 표시
 * - "하이라이트 제거" 버튼
 * - 현재 Selection을 별도 색상으로 하이라이트
 * - CSS ::highlight() 스타일은 <style> 태그 또는 inline으로 주입
 */
export default function HighlightApiDemo() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [searchText, setSearchText] = useState('');
  const [matchCount, setMatchCount] = useState(0);

  const handleSearch = useCallback(() => {
    if (!editorRef.current || !searchText) return;
    // TODO: highlightSearchText 호출
  }, [searchText]);

  const handleClear = useCallback(() => {
    // TODO: removeHighlight 호출
    setMatchCount(0);
  }, []);

  return (
    <div>
      {/* CSS Custom Highlight 스타일 */}
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
        {matchCount > 0 && <span>{matchCount}개 발견</span>}
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

/**
 * ============================================================
 * 완료 체크리스트
 * ============================================================
 *
 * [ ] new Highlight()로 Highlight 객체를 생성할 수 있다
 * [ ] CSS.highlights.set()으로 하이라이트를 등록할 수 있다
 * [ ] CSS ::highlight() 선택자로 스타일을 적용할 수 있다
 * [ ] TreeWalker로 검색어 위치를 찾아 Range를 생성할 수 있다
 * [ ] 여러 매칭 항목에 동시에 하이라이트를 적용할 수 있다
 * [ ] CSS.highlights.delete()로 하이라이트를 제거할 수 있다
 * [ ] priority 속성으로 다중 하이라이트 우선순위를 설정할 수 있다
 */
