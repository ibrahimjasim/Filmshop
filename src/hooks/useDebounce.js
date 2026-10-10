import {useState, useEffect} from 'react';


export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    // Städfunktion: om value ändras innan tiden gått ut, avbryt timern.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
