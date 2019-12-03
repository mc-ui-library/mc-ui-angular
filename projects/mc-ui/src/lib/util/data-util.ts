export class DataUtil {
  search(items: any[], keyword: string, field: string = 'name') {
    if (keyword) {
      const keywords = keyword.toLowerCase().trim().split(' ');
      items = items.filter(item => {
        const text = ('' + item[field]).toLowerCase();
        return keywords.find(k => text.indexOf(k) > -1);
      });
    }
    return items;
  }

  // for dropdown summary
  summarizeValues(values: any[], displayField = 'name', secondDisplayField = '', hideEmptyText = false, noLimit = false) {
    const limit = 10;
    let countOthers;
    let txt = '';
    const len = values.length;
    const res = values.reduce((names, value) => {
      let name = value[displayField];
      if (!name && secondDisplayField) {
        name = value[secondDisplayField];
      }
      if (!noLimit && name && name.length > limit) {
        name = name.substr(0, limit) + '...';
      }
      names.push(name);
      return names;
    }, []);

    if (len > 3) {
      countOthers = len - 2;
      txt = res[0] + ', ' + res[1] + ', and ' + countOthers + ' Others';
    } else if (len > 0) {
      txt = res.join(', ');
    } else if (!hideEmptyText) {
      txt = 'Select...';
    }
    return txt;
  }
}
