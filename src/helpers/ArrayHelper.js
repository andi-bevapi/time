export default class ArrayHelper {
  static async mapBy(arr, key, fields, group = false) {
    const keys = key.split('|');
    return arr.reduce((acc, e) => {
      // generate key for e
      const generatedKey = keys.reduce((kacc, k) => {
        if (kacc === '') {
          return e[k];
        }
        return `${kacc}|${e[k]}`;
      }, '');

      // map e in acc
      let v;
      if (fields instanceof Array) {
        v = fields.reduce((acc, f) => {
          acc[f] = e[f];
          return acc;
        }, {});
      } else if (typeof fields === 'string' && fields) {
        v = e[fields];
      } else {
        v = e;
      }
      if (group) {
        if (!acc[generatedKey]) {
          acc[generatedKey] = [];
        }
        acc[generatedKey].push(v);
      } else {
        acc[generatedKey] = v;
      }
      return acc;
    }, {});
  }
}
