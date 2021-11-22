// https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json

export const getSheet = ({ sheetID, tableName }) => {
  const fetchURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;
  const specfySheetName = (tableName && `&sheet=${tableName}`) ?? '';
  return fetch(fetchURL + specfySheetName)
    .then((res) => res.text())
    .then((text) => JSON.parse(text.substr(47).slice(0, -2)))
    .then((rowJson) => {
      let {
        table: { cols, rows },
      } = rowJson;
      // console.log({ cols, rows });
      cols = cols.map(({ label }) => label);
      // 分離出 col 以及去掉不需要的 col
      rows = rows
        .map(({ c }) => c.slice(0, cols.length))
        // 把有值的 col 打平抽出值的部份
        .map((row) => row.map((val) => val?.v));
      // console.log({cols,rows,});
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

export const getSettings = (sheetID) =>
  getSheet({
    sheetID,
    tableName: 'settings',
  })
    .then(convertSheetRowArray)
    .then(({ rows }) => {
      let current_group = 'none';
      const setting_name_zh_eng = {
        活動名稱: 'event_name',
        別名: 'alias',
        開始日: 'start',
        舉行天數: 'for_days',
        活動資訊: 'event_info',
        主辦單位: 'host_name',
        主辦單位網站: 'host_site_url',
        主辦單位信箱: 'host_mail',
      };
      return rows.reduce((groups, setting) => {
        let { key } = setting;
        const { group, value, description, type } = setting;
        if (key in setting_name_zh_eng) {
          key = setting_name_zh_eng[key];
        }

        if (group) {
          current_group = group;
        }
        if (key) {
          if (!(current_group in groups)) {
            groups[current_group] = [];
          }
          groups[current_group].push({ key, value, description, type });
        }
        return groups;
      }, {});
    })
    .then((setting) => {
      setting.config = setting.config.reduce(
        (config, { key, value, description, type }) => {
          config[key] = { value, description, type };
          return config;
        },
        {},
      );
      ['list', 'venue_map'].forEach((group_name) => {
        setting[group_name].forEach((item) => {
          delete item.type;
        });
      });

      return setting;
    });

//
export const getList = (sheetID, tableName) =>
  getSheet({
    sheetID,
    tableName,
  })
    .then(convertSheetRowArray)
    .then(({ cols, rows: list }) => {
      // let current_day = '0';

      const info_name_zh_eng = {
        編號: 'space',
        名稱: 'circle_name',
        資訊網址: 'info_url',
        描述: 'description',
      };

      const header = {
        space: undefined,
        circle_name: undefined,
        info_url: undefined,
        description: undefined,
      };

      for (let info_name_zh of Object.keys(info_name_zh_eng)) {
        if (cols.includes(info_name_zh)) {
          const info_name_eng = info_name_zh_eng[info_name_zh];
          header[info_name_eng] = info_name_zh;
        }
      }

      //
      list = list.reduce((thisList, circle) => {
        // 轉換中文標頭
        for (let info_name_zh of Object.keys(info_name_zh_eng)) {
          if (info_name_zh in circle) {
            const info_name_eng = info_name_zh_eng[info_name_zh];
            circle[info_name_eng] = circle[info_name_zh];
          }
        }
        // const { day } = circle;
        let { space, circle_name, info_url, description } = circle;

        thisList.push({ space, circle_name, info_url, description });
        return thisList;
      }, []);

      return { header, list };
    });
// .then((rows) => {
//   rows.getSpace = function (day, space) {
//     return this[`day${day}`].find((circle) =>
//       new RegExp(space, 'i').test(circle.space),
//     );
//   };
//   rows.getCircle = function (day, circle_name) {
//     return this[`day${day}`].find((circle) =>
//       new RegExp(circle_name, 'i').test(circle.circle_name),
//     );
//   };
//   return rows;
// })
