module.exports = function(connection) {
  const insertAnswer = function insertAnswer(clbk, payload) {
    const { id_user, body } = payload
    const sql =
      'INSERT INTO `personnality_answer` (`id_user`, `id_question`, `answer`) VALUES (?, ?, ?);'
    const query = connection.query(
      sql,
      [id_user, body.id_question, body.answer],
      (err, res) => {
        if (err) return clbk(err, null)
        return clbk(null, res)
      }
    )
    console.log('last db query =>', query.sql)
  }
  const getOneAnswer = function getOneAnswer(clbk, payload) {
    const { id_user, id_question } = payload
    const sql =
      'SELECT * FROM personnality_answer WHERE id_user = ? AND id_question = ?'
    const query = connection.query(sql, [id_user, id_question], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }
  const getUserAnswers = function getUserAnswers(clbk, id) {
    const sql =
      'SELECT * FROM `personnality_answer` a INNER JOIN `personnality_question` q ON a.id_question = q.id WHERE id_user = ? '
    const query = connection.query(sql, [id], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }
  const updateAnswer = function updateAnswer(clbk, payload) {
    const { id_user, id_question, answer } = payload
    const sql =
      'UPDATE `personnality_answer` SET `answer`= ? WHERE id_user =? AND id_question = ?'
    const query = connection.query(
      sql,
      [answer, id_user, id_question],
      (err, res) => {
        if (err) return clbk(err, null)
        return clbk(null, res)
      }
    )
    console.log('last db query =>', query.sql)
  }

  return {
    insertAnswer,
    getOneAnswer,
    updateAnswer,
    getUserAnswers
  }
}
