import {
  useState
} from 'react';

/* Hook to update/rerender component */
export function useForceUpdate() {

  const setValue = useState(0)[1];

  return () => setValue(value => ++value);
}