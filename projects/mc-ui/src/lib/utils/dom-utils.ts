export function getComponentNameByElement(el: HTMLElement) {
  const items = el.tagName.toLowerCase().split('-');
  items.shift();
  return items.join('-');
}

export function getThemeClasses(compName: string, themes: string | string[]) {
  // normalize themes
  themes = !Array.isArray(themes) ? [themes] : themes.concat();
  return themes.reduce((agg, d) => {
    // d can be empty
    if (d) {
      agg.push(compName + '-' + d);
    }
    return agg;
  }, []);
}

export function getContainerWidth(conEl: HTMLElement) {
  const stylePosition = conEl.style.position;
  conEl.style.position = 'relative';
  const children = Array.from(conEl.children);
  children.forEach((el: HTMLElement) => (el.style.display = 'none'));
  const width = conEl.clientWidth;
  conEl.style.position = stylePosition;
  children.forEach((el: HTMLElement) => (el.style.display = ''));
  return width;
}

// selector: class name(.class-name) or tag name (mc-componentname)
export function findParentDom(dom: any, selector: string, stopClassName = '', depth = 10) {
  let cls = '';
  let resultDom: HTMLElement;
  if (!dom || !dom.nodeName) {
    return null;
  }
  if (selector.startsWith('.')) {
    cls = selector.slice(1);
  }

  while (depth--) {
    if (
      !dom ||
      !dom.classList ||
      dom.nodeName === 'BODY' ||
      (stopClassName ? dom.classList.contains(stopClassName) : false)
    ) {
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
