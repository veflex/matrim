module.exports = function(connection) {
  // get all the users
  const getAll = function getAllUser(clbk, queries) {
    const limit = queries.limit;
    const page = (queries.page - 1) * limit;

    let sql = `SELECT u.name, u.email FROM user as u`;
    sql += ` LIMIT ${page}, ${limit}`;
    const query = connection.query(sql, (err, res) => {
      if (err) return clbk(err, null);
      return clbk(null, res);
    });
    console.log('last db query =>', query.sql);
  };

  /**
   *  get eligibility answer by user max page
   * @param {object} limit - limit of user by page, allows to calculate the max pages needed
   */
  const getMaxPages = function getMaxUserPages(clbk, limit) {
    const sql = 'SELECT COUNT(*) / ' + limit + ' as maxPages FROM `user`';
    const query = connection.query(sql, (err, res) => {
      if (err) return clbk(err, null);
      return clbk(null, res);
    });
    console.log('last db query =>', query.sql);
  };
  /**
   *  get eligibility answer by user max page
   * @param {object} limit - limit of user by page, allows to calculate the max pages needed
   */
  const getOneUser = function getOneUser(clbk, id) {
    const sql =
      'SELECT u.id, u.onboarding_step, u.is_eligible, b.date FROM `user` u LEFT JOIN blocked b on u.id = b.user_id WHERE u.id = ?';
    const query = connection.query(sql, [id], (err, res) => {
      if (err) return clbk(err, null);
      return clbk(null, res);
    });
    console.log('last db query =>', query.sql);
  };

  return { getAll, getMaxPages, getOneUser };
};
