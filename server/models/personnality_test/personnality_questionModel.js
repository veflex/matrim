module.exports = function(connection) {
  const insertPersonnalityQuestion = function insertPersonnalityQuestion(
    clbk,
    details
  ) {
    const {
      text,
      subtext,
      isMultiple,
      possible_answer,
      nb_choice,
      type,
      other_answer,
      sex,
      position
    } = details
    const sql =
      'INSERT INTO `personnality_question` (`text`, `subtext`,`isMultiple`, `possible_answer`, `nb_choice`, `type`, `other_answer`, `sex`, `position`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);'
    const query = connection.query(
      sql,
      [
        text,
        subtext,
        isMultiple,
        possible_answer,
        nb_choice,
        type,
        other_answer,
        sex,
        position
      ],
      (err, res) => {
        if (err) return clbk(err, null)
        return clbk(null, res)
      }
    )
    console.log('last db query =>', query.sql)
  }
  const getAllPersonnalityQuestions = function getAllPersonnalityQuestions(
    clbk,
    sex
  ) {
    const sql =
      'SELECT * FROM personnality_question WHERE sex = "U" OR sex = ? ORDER BY position DESC'
    const query = connection.query(sql, [sex], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  return {
    insertPersonnalityQuestion,
    getAllPersonnalityQuestions
  }
}
