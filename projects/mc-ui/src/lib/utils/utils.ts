export function isEmpty(val: any) {
  return val === null || val === '' || val === undefined || isNaN(val);
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
