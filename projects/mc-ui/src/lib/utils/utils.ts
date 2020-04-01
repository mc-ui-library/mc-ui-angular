export function isEmpty(val: any) {
  return val === null || val === '' || val === undefined;
}

export function debounce(callback: Function, wait: number, context: any = this) {
  let timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      callback.apply(context, args);
    }, wait);
  };
}
