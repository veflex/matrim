module.exports = function(connection) {
  const blockUser = function blockUser(clbk, data) {
    console.log(data)
    const sql = 'INSERT INTO `blocked`(`user_id`, `date`) VALUES (?,?)'
    const query = connection.query(sql, [data.id, data.date], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  const isBlocked = function isBlocked(clbk, id) {
    const sql = 'SELECT * FROM blocked WHERE user_id = ?'
    const query = connection.query(sql, [id], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  return {
    blockUser,
    isBlocked
  }
}
