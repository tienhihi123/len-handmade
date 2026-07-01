import { useRef, useState, MouseEvent } from "react";

export function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    setIsDown(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeftState(ref.current.scrollLeft);
    setHasDragged(false);
  };

  const onMouseLeave = () => {
    setIsDown(false);
  };

  const onMouseUp = () => {
    setIsDown(false);
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDown || !ref.current) return;
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    
    if (Math.abs(walk) > 8) {
      setHasDragged(true);
    }
    
    if (ref.current) {
      ref.current.scrollLeft = scrollLeftState - walk;
    }
    e.preventDefault();
  };

  // Helper method to wrap element actions, making sure dragged gestures are ignored
  const handleItemClick = (e: any, callback: () => void) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      callback();
    }
  };

  return {
    ref,
    isDragging: isDown && hasDragged,
    handleItemClick,
    props: {
      ref,
      onMouseDown,
      onMouseLeave,
      onMouseUp,
      onMouseMove,
    }
  };
}
