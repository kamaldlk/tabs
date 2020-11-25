import {
  useEffect,
  useState
} from 'react';

/* Hook to handle functions before component render */
export function useFirstRender(callback) {

  const [hasRendered, setHasRendered] = useState(false);

  // Hook for handling behaviour
  useEffect(() => {
    if (!hasRendered) {
      callback();
      setHasRendered(true);
    }
  }, [hasRendered, callback]);
};