function debounce<
  F extends (...args: Parameters<F>) => ReturnType<F>
>(
  func: F,
  wait: number,
  immediate: boolean = false
): F & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debouncedFunction = function (this: unknown, ...args: Parameters<F>): ReturnType<F> | undefined {
    let result: ReturnType<F> | undefined;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    // Clear any existing timeout
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    // Set a new timeout
    timeout = setTimeout(later, wait);

    // Execute immediately if immediate is true
    if (callNow) {
      result = func.apply(context, args);
    }

    return result;
  } as F & { cancel: () => void };

  // Add a cancel method to allow manual cancellation
  debouncedFunction.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debouncedFunction;
}

export { debounce };