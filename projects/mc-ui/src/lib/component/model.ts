export interface Column {
  field?: string; // field name;
  name?: string; // column name
  width?: number;
}

export interface ScrollData {
  headerData?: any[];
  columns?: Column[];
  action?: 'append' | 'insert' | 'initialize';
  rows: any[];
  start?: number;
  rowCount?: number;
}
