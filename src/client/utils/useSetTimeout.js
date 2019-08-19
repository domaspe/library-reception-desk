import { useEffect } from 'react';

export function useSetTimeout(callback, timeout) {
  useEffect(() => {
    const timeoutId = setTimeout(callback, timeout);
    return () => clearTimeout(timeoutId);
  }, []);
}
