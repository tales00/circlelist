// https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json

export const getSheet = ({ sheetID, tableName, headerLength }) => {
  const fetchURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;
  const specfySheetName = (tableName && `&sheet=${tableName}`) ?? '';
  return fetch(fetchURL + specfySheetName)
    .then((res) => res.text())
    .then((text) => {
      return JSON.parse(text.substr(47).slice(0, -2));
    })
    .then((rowJson) => {
      let {
        table: { cols, rows },
      } = rowJson;
      // 去掉不需要的 col 然後抽出 label 的值
      cols = cols.slice(0, headerLength).map(({ label }) => label);
      // 分離出 col 以及去掉不需要的 col
      rows = rows
        .map(({ c }) => c.slice(0, cols.length))
        // 把有值的 col 打平抽出值的部份
        .map((row) => row.map((val) => val?.v));
      return {
        cols,
        rows,
      };
    });
};

// 判斷第一個 col 是否是註解然後過濾掉
const removeCommentFromSheetRowArray = (rows) =>
  rows.filter(([val]) => !(typeof val === 'string' && val.startsWith('//')));

const sheetRowArrayToObjByCol = ({ cols, rows }) => {
  // console.log(cols);
  rows = rows
    // 跟 header 整合成物件
    .map((row) =>
      cols.reduce((arr, cur, idx) => {
        arr[cur] = row[idx];
        return arr;
      }, {}),
    );
  return {
    cols,
    rows,
  };
};

const convertSheetRowArray = ({ cols, rows }) => {
  rows = removeCommentFromSheetRowArray(rows);
  return sheetRowArrayToObjByCol({ cols, rows });
};

export const getConfig = (sheetID) =>
  getSheet({
    sheetID,
    tableName: 'config',
    headerLength: 2,
  })
    .then(convertSheetRowArray)
    .then(({ rows }) => rows);

//
export const getMenu = (sheetID) =>
  getSheet({
    sheetID,
    tableName: 'menu',
    headerLength: 8,
  })
    .then(convertSheetRowArray)
    .then(({ rows }) => {
      // process variant
      return rows;
    });
