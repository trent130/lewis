import { useCallback, useRef } from 'react';

export function useScrollLock() {
  const scrollbarWidth = useRef<number | null>(null);

  const getScrollbarWidth = useCallback(() => {
    if (scrollbarWidth.current !== null) return scrollbarWidth.current;
    
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    scrollbarWidth.current = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode?.removeChild(outer);

    return scrollbarWidth.current;
  }, []);

  const lockScroll = useCallback(() => {
    const scrollWidth = getScrollbarWidth();
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollWidth}px`;
  }, [getScrollbarWidth]);

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }, []);

  return { lockScroll, unlockScroll };
}