// selector: class name(.class-name) or tag name (mc-componentname)
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

export function getWindowSize() {
  const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  return { width, height };
}

export function getSize(dom: HTMLElement) {
  let size = dom.getBoundingClientRect();
  const style = dom.style;
  if (style.display === 'none') {
    style.visibility = 'hidden';
    style.display = '';
    size = dom.getBoundingClientRect();
    style.visibility = '';
    style.display = 'none';
  } else if (style.height === '0' || style.height === '0px') {
    style.visibility = 'hidden';
    const position = style.position || '';
    style.position = 'absolute';
    style.height = '';
    size = dom.getBoundingClientRect();
    style.visibility = '';
    style.height = '0px';
    style.position = position;
  }
  return size;
}

export function removeDom(dom: HTMLElement) {
  if (dom && dom.parentElement) {
    dom.parentElement.removeChild(dom);
  }
}

export function openUrl(url: string, target = '', fileName = '') {
  let a = document.createElement('a');
  a.href = url;
  if (fileName) {
    a.download = fileName;
  }
  if (target) {
    a.target = target;
  }
  document.body.append(a);
  a.click();
  a.remove();
}

export function exportFile(fileName: string, content: string, mimeType = 'text/csv', charset = 'utf-8') {
  const blob = new Blob([content], { type: `type:${mimeType};charset=${charset};` });
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, fileName);
  } else {
    this.openUrl(URL.createObjectURL(blob), '', fileName);
  }
}

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
  const children = Array.from(conEl.children);
  children.forEach((el: HTMLElement) => (el.style.display = 'none'));
  const width = conEl.clientWidth;
  children.forEach((el: HTMLElement) => (el.style.display = ''));
  return width;
}
