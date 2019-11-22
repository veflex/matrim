module.exports = function(connection) {
  const setStatus = function setStatus(clbk, user) {
    const sql = 'INSERT INTO `status` (`id_user`, `status`) VALUES (? ,?);'
    const query = connection.query(sql, [user.id, user.status], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  return {
    setStatus
  }
}
