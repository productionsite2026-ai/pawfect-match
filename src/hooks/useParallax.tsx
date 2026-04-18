import { useEffect, useState, useRef, RefObject } from 'react';

interface ParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down';
}

export const useParallax = (options: ParallaxOptions = {}): [RefObject<HTMLDivElement>, number] => {
  const { speed = 0.5, direction = 'up' } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const distanceFromCenter = elementCenter - viewportCenter;
      
      const newOffset = direction === 'up' 
        ? distanceFromCenter * speed * -1
        : distanceFromCenter * speed;
      
      setOffset(newOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return [ref, offset];
};

export const useScrollReveal = (threshold = 0.1): [RefObject<HTMLDivElement>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

export const useStaggeredReveal = (itemCount: number, staggerDelay = 100): boolean[] => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(Array(itemCount).fill(false));
  const [triggered, setTriggered] = useState(false);

  const trigger = () => {
    if (triggered) return;
    setTriggered(true);
    
    for (let i = 0; i < itemCount; i++) {
      setTimeout(() => {
        setVisibleItems(prev => {
          const newArr = [...prev];
          newArr[i] = true;
          return newArr;
        });
      }, i * staggerDelay);
    }
  };

  return visibleItems;
};
