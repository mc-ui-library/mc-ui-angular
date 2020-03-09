export function isEmpty(val: any) {
  return val === null || val === '' || val === undefined || isNaN(val);
}

export function debounce(callback: any, wait: number, context: any = this) {
  let timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      callback.apply(context, args);
    }, wait);
  };
}

export function throttle(callback: any, wait: number, scope: any = this) {
  let timeout: any;
  return (...args: any[]) => {
    if (!timeout) {
      timeout = setTimeout(() => {
        callback.apply(scope, args);
        clearTimeout(timeout);
      }, wait);
    }
  };
}

export function getRootUrl() {
  const location = window.location;
  return location.protocol + '//' + location.hostname + ':' + location.port + '/';
}

export function getFullUrl(childPath) {
  const root = this.getRootUrl();
  if (childPath.charAt(0) === '/') {
    childPath = childPath.substr(1);
  }
  return root + childPath;
}

export function clone(o) {
  // skip the date object
  if (!o || typeof o !== 'object' || (o instanceof Date && !isNaN(o.valueOf()))) {
    return o;
  } else if (Array.isArray(o)) {
    return o.map(item => this.clone(item));
  } else {
    return Object.keys(o).reduce((obj, key) => {
      obj[key] = this.clone(o[key]);
      return obj;
    }, {});
  }
}
