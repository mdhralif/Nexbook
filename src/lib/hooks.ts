import { useState, useTransition } from 'react';

// Fallback implementation of useOptimistic for React 18
export function useOptimistic<T>(
  state: T,
  updateFn: (currentState: T, optimisticValue: any) => T
): [T, (optimisticValue: any) => void] {
  const [optimisticState, setOptimisticState] = useState(state);
  const [isPending, startTransition] = useTransition();

  const addOptimistic = (optimisticValue: any) => {
    startTransition(() => {
      setOptimisticState(updateFn(state, optimisticValue));
    });
  };

  // Reset optimistic state when base state changes
  if (state !== optimisticState && !isPending) {
    setOptimisticState(state);
  }

  return [optimisticState, addOptimistic];
}
