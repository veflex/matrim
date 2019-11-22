module.exports = function(connection) {
  const getCedexAutocomplete = function getCedexAutocomplete(clbk, cedex) {
    const sql =
      "SELECT * FROM `cedex` WHERE cedex LIKE '?%' ORDER BY cedex ASC LIMIT 5";
    const query = connection.query(sql, [Number(cedex)], (err, res) => {
      if (err) return clbk(err, null);
      return clbk(null, res);
    });
    console.log('last db query =>', query.sql);
  };
  const getOneCedex = function getOneCedex(clbk, cedex) {
    const sql = 'SELECT * FROM `cedex` WHERE cedex= ?';
    const query = connection.query(sql, [cedex], (err, res) => {
      if (err) return clbk(err, null);
      return clbk(null, res);
    });
    console.log('last db query =>', query.sql);
  };

  return {
    getCedexAutocomplete,
    getOneCedex
  };
};
