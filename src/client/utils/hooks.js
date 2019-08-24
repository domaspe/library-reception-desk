import { useRef, useEffect, useState, useCallback } from 'react';

export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export function useIconAnimation(shouldAnimate) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (shouldAnimate) {
      setAnimate(true);
    }

    return () => {};
  }, [shouldAnimate]);

  const onAnimationEnd = useCallback(() => setAnimate(false));

  return [animate, onAnimationEnd];
}
