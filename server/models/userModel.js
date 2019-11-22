module.exports = function(connection) {
  // const auth = require('./../utils/auth');
  // CRUD
  // create an user with email, sex and crypted password
  const create = function createUser(clbk, payload) {
    const sql = `INSERT INTO user (email, sex, password, name, conditions, dataCollect, newsletter) VALUES (?, ?, ?, ?, ?, ?, ?)`
    const {
      email,
      sex,
      password,
      name,
      conditions,
      dataCollect,
      newsletter
    } = payload
    const query = connection.query(
      sql,
      [email, sex, password, name, conditions, dataCollect, newsletter],
      (err, res) => {
        if (err) return clbk(err, null)
        return clbk(null, res)
      }
    )
    console.log('last db query =>', query.sql)
  }

  // get all the users
  const getAll = function getAllUser(clbk, queries) {
    const limit = queries.limit
    const page = (queries.page - 1) * limit
    const sex = queries.sex
    let sql = `SELECT u.id, u.name, TIMESTAMPDIFF(YEAR, u.birthday, CURDATE()) AS age, u.img, u.situation FROM user as u`
    if (sex === 'M' || sex === 'F') {
      sql += ` WHERE u.sex = '${sex}'`
    }
    sql += ` LIMIT ${page}, ${limit}`
    const query = connection.query(sql, (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  // get count of all users with sex and subscribe done
  const getNbr_users = function getNbr_users(clbk, queries) {
    let payload = [queries.sex];
    let sql = `SELECT COUNT(u.id) AS nbr_users FROM (SELECT id, TIMESTAMPDIFF(YEAR, birthday, CURDATE()) AS age FROM user WHERE is_eligible = 1 AND onboarding_step = 'done' AND personnality_step = 'done' AND sex = ?`
    if(queries.certified !== 'undefined' && queries.certified !== false){
      sql +=` AND certified = ?`
      payload.push(queries.certified)
    }
    payload.push(queries.min_age)
    payload.push(queries.max_age)
    sql +=`) u WHERE age BETWEEN ? AND ?`
    const query = connection.query(sql, payload, (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res[0].nbr_users)
    })
    console.log('last db query =>', query.sql)
  }

  // get all filtered users
  const getAllFilteredUsers = function getAllFilteredUsers(clbk, queries) {
    let cedexs;
    if(typeof queries.cedex === "string") {
      cedexs = queries.cedex.split(',').map(Number);
    } else {
      cedexs = queries.cedex.map(Number)
    }
    let payload = [cedexs, queries.sex]
    console.log('cedex',queries.cedex)
    let sql = `SELECT * FROM (SELECT u.id, u.name, u.age, u.img, u.situation, u.cedex, u.department_code, d.name AS department_name, u.certified, u.created_at FROM (SELECT id, name, TIMESTAMPDIFF(YEAR, birthday, CURDATE()) AS age, img, situation, cedex, CASE WHEN LEFT(cedex,2) = 97 THEN LEFT(cedex,3) WHEN LEFT(cedex,2) = 98 THEN LEFT(cedex,3) ELSE LEFT(cedex,2) END AS department_code, certified,created_at FROM user WHERE cedex IN (?) AND is_eligible = 1 AND onboarding_step = 'done' AND personnality_step = 'done' AND sex = ?`
    if(queries.certified !== 'undefined'){
      sql +=`AND certified = ?`
      payload.push(queries.certified)
    }
    payload.push(queries.min_age)
    payload.push(queries.max_age)
    sql +=`) u INNER JOIN departments as d ON u.department_code = d.code) u WHERE u.age BETWEEN ? AND ?`
    const query = connection.query(sql,payload, (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  // get all certified users
  const getAllCertifiedUsers = function getAllCertifiedUsers(clbk, queries) {
    const sex = queries.sex
    let payload = [sex]
    let sql = `SELECT * FROM (SELECT u.id, u.name, u.age, u.img, u.situation, u.cedex, u.department_code, d.name AS department_name, u.certified, u.created_at FROM (SELECT id, name, TIMESTAMPDIFF(YEAR, birthday, CURDATE()) AS age, img, situation, cedex, certified, created_at, CASE WHEN LEFT(cedex,2)=97 THEN LEFT(cedex,3) WHEN LEFT(cedex,2)=98 THEN LEFT(cedex,3) ELSE LEFT(cedex,2) END AS department_code FROM user WHERE is_eligible = 1 AND onboarding_step = 'done' AND personnality_step = 'done' AND sex = ? AND certified = 1) u INNER JOIN departments as d ON u.department_code = d.code) u ORDER BY u.created_at DESC`
    if(queries.limit !== 'undefined') {
      const limit = Number(queries.limit)
      sql += ` LIMIT ?`
      payload.push(limit);
    }
    const query = connection.query(sql, payload, (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res) // Recurisité ici
    })
    console.log('last db query =>', query.sql)
  }

  // get all Discover users
  const getUsersDiscover = function getUsersDiscover(clbk, queries) {
    const sex = queries.sex
    let payload = [sex]
    let sql = `SELECT * FROM (SELECT u.id, u.name, u.age, u.img, u.situation, u.cedex, u.department_code, d.name AS department_name, u.certified, u.created_at FROM (SELECT id, name, TIMESTAMPDIFF(YEAR, birthday, CURDATE()) AS age, img, situation, cedex, certified, created_at, CASE WHEN LEFT(cedex,2)=97 THEN LEFT(cedex,3) WHEN LEFT(cedex,2)=98 THEN LEFT(cedex,3) ELSE LEFT(cedex,2) END AS department_code FROM user WHERE is_eligible = 1 AND onboarding_step = 'done' AND personnality_step = 'done' AND sex = ?) u INNER JOIN departments as d ON u.department_code = d.code) u ORDER BY u.created_at DESC`
    if(queries.limit !== 'undefined') {
      const limit = Number(queries.limit)
      sql += ` LIMIT ?`
      payload.push(limit);
    }
    const query = connection.query(sql, payload, (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res) // Recurisité ici
    })
    console.log('last db query =>', query.sql)
  }

  // get all favorited users from user
  const getAllFavoritedUsers = function getAllFavoritedUsers(clbk, queries) {
    const sex = queries.sex
    const user_id = queries.user_id
    let sql = `SELECT * FROM (SELECT u.id, u.name, u.age, u.img, u.situation, u.cedex, u.department_code, d.name AS department_name, u.certified FROM (SELECT id, name, TIMESTAMPDIFF(YEAR, birthday, CURDATE()) AS age, img, situation, cedex, certified, CASE WHEN LEFT(cedex,2)=97 THEN LEFT(cedex,3) WHEN LEFT(cedex,2)=98 THEN LEFT(cedex,3) ELSE LEFT(cedex,2) END AS department_code FROM user WHERE is_eligible = 1 AND onboarding_step = 'done' AND personnality_step = 'done' AND sex = ?) u INNER JOIN departments as d ON u.department_code = d.code) u INNER JOIN (SELECT user_favorited, created_at as favorite_date FROM user_favorites WHERE user_id = ?) f ON u.id = f.user_favorited ORDER BY f.favorite_date DESC`;
    const query = connection.query(sql, [sex, user_id], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  // get if an user is favorited by an other
  const getFavorite = function getFavorite(clbk, queries) {
    const user_id = queries.user_id
    const user_favorited = queries.user_favorited
    let sql = `SELECT * FROM user_favorites WHERE user_favorited = ? AND user_id = ?`;
    const query = connection.query(sql, [user_favorited, user_id], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  // get an user favorited by an other
  const postFavorite = function postFavorite(clbk, queries) {
    const user_id = queries.user_id
    const user_favorited = queries.user_favorited
    let sql = `INSERT INTO user_favorites (user_favorited, user_id, created_at) VALUES (?, ?, CURRENT_TIMESTAMP);`;
    const query = connection.query(sql, [user_favorited, user_id], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  // delete an user favorited by an other
  const deleteFavorite = function deleteFavorite(clbk, queries) {
    const user_id = queries.user_id
    const user_favorited = queries.user_favorited
    let sql = `DELETE FROM user_favorites WHERE user_favorited = ? AND user_id = ?`;
    const query = connection.query(sql, [user_favorited, user_id], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  const getAllMeFavoritedUsers = function getAllMeFavoritedUsers(clbk, queries) {
    const sex = queries.sex
    const user_id = queries.user_id
    let sql = `SELECT * FROM (SELECT u.id, u.name, u.age, u.img, u.situation, u.cedex, u.department_code, d.name AS department_name FROM (SELECT id, name, TIMESTAMPDIFF(YEAR, birthday, CURDATE()) AS age, img, situation, cedex, CASE WHEN LEFT(cedex,2)=97 THEN LEFT(cedex,3) WHEN LEFT(cedex,2)=98 THEN LEFT(cedex,3) ELSE LEFT(cedex,2) END AS department_code FROM user WHERE is_eligible = 1 AND onboarding_step = 'done' AND personnality_step = 'done' AND sex = ?) u INNER JOIN departments as d ON u.department_code = d.code) u INNER JOIN (SELECT user_id, created_at as favorite_date FROM user_favorites WHERE user_favorited = ?) f ON u.id = f.user_id ORDER BY f.favorite_date DESC`;
    const query = connection.query(sql, [sex, user_id], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  // get one user with id
  const getUserById = function getUserById(clbk, id) {
    const sql = `SELECT u.id, u.name, TIMESTAMPDIFF(YEAR, u.birthday, CURDATE()) AS age, u.img, u.sex, u.onboarding_step, u.personnality_step, u.email, u.situation, u.cedex, u.socket FROM user u WHERE id = ?`
    const query = connection.query(sql, [id], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }
  // check if mail is already used
  const getUserByMail = function getUserByMail(clbk, email) {
    const sql = `SELECT u.id, u.name, u.password, TIMESTAMPDIFF(YEAR, u.birthday, CURDATE()) AS age, u.img, u.sex, u.onboarding_step ,u.personnality_step, u.email, u.situation, u.cedex, u.socket FROM user u WHERE email = ?`
    const query = connection.query(sql, [email], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res[0])
    })
    console.log('last db query =>', query.sql)
  }

  // delete one user
  const deleteOne = function deleteOneUser(clbk, id) {
    const sql = `DELETE FROM user WHERE id = ?`
    const query = connection.query(sql, [id], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  /* Create the query for user update,
   * @update => get user infos and construct the query based on the object passed
   *
   *
   */
  const createUpdateQuery = function createUpdateQuery(data) {
    let sql = `UPDATE user SET `
    const values = []
    for (const key in data) {
      const value = data[key]
      values.push(value)
      sql += `${key} = ?, `
    }
    sql += 'updated_at = NOW() WHERE id = ?'
    return { sql, values }
  }

  // update an user
  const update = function updateUser(clbk, payload) {
    const data = createUpdateQuery(payload.user)
    const query = connection.query(
      data.sql,
      [...data.values, payload.id],
      (err, res) => {
        if (err) return clbk(err, null)
        return clbk(null, res)
      }
    )
    console.log('last db query =>', query.sql)
  }

  // update password
  const updatePassword = function updatePassword(clbk, payload) {
    const data = createUpdateQuery(payload.pass)
    const query = connection.query(
      data.sql,
      [...data.values, payload.id],
      (err, res) => {
        if (err) return clbk(err, null)
        return clbk(null, res)
      }
    )
    console.log('last db query =>', query.sql)
  }

  // update profil picture
  const uploadImgProfil = function updateImgProfilUser(clbk, payload) {
    const sql = `UPDATE user SET img = ? WHERE id = ?`
    const query = connection.query(
      sql,
      [payload.file, payload.id],
      (err, res) => {
        if (err) return clbk(err, null)
        return clbk(null, res)
      }
    )
    console.log('last db query =>', query.sql)
  }

  /**
   *  get eligibility answer by user max page
   * @param {object} limit - limit of user by page, allows to calculate the max pages needed
   */
  const getMaxPages = function getMaxUserPages(clbk, opt) {
    let sql = 'SELECT COUNT(*) / ' + opt.limit + ' as maxPages FROM `user`'
    const sex = opt.sex
    if (sex === 'M' || sex === 'F') {
      sql += ` WHERE sex = '${sex}'`
    }
    const query = connection.query(sql, (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  return {
    create,
    getAll,
    getUserById,
    getNbr_users,
    deleteOne,
    update,
    getUserByMail,
    getMaxPages,
    postFavorite,
    deleteFavorite,
    getFavorite,
    getUsersDiscover,
    getAllFavoritedUsers,
    getAllMeFavoritedUsers,
    getAllCertifiedUsers,
    getAllFilteredUsers,
    uploadImgProfil,
    updatePassword
  }
}
