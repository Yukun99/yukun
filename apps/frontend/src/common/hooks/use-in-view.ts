import { useEffect, useRef, useState } from 'react';

// one-shot "has this scrolled into view yet", for holding content back until it is worth mounting
const useInView = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.1, rootMargin: '0px 200px' },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, inView };
};

export default useInView;
