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

export function findParentDom(dom: any, selector: string, depth = 10) {
  let cls = '';
  let resultDom: HTMLElement;
  if (!dom || !dom.nodeName) {
    return null;
  }
  if (selector.startsWith('.')) {
    cls = selector.slice(1);
  }

  while (depth--) {
    if (!dom || !dom.classList || dom.nodeName === 'BODY') {
      resultDom = null;
      break;
    }
    if (cls) {
      if (dom.classList.contains(cls)) {
        resultDom = dom;
        break;
      }
    } else {
      if (dom.nodeName.toLowerCase() === selector.toLowerCase()) {
        resultDom = dom;
        break;
      }
    }
    dom = dom.parentNode;
  }
  return resultDom;
}
