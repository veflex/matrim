module.exports = function(connection) {
  /********************************************************************************/
  /** ************************** ELIGIBILITY QUESTION ******************************/
  /********************************************************************************/

  /**
   * create a new question
   * @param {string} question - the core of the question
   */
  const createQuestion = function createEligibilityQuestion(clbk, question) {
    const sql = 'INSERT INTO `eligibility_question`(`question`) VALUES (?)'
    const query = connection.query(sql, [question], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  /**
   *  get all the questions
   */
  const getAllQuestions = function getAllEligibilityQuestions(clbk, sex) {
    const sql =
      'SELECT * FROM `eligibility_question` WHERE sex = "U" OR sex = ?'
    const query = connection.query(sql, [sex], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  /**
   *  get one question
   * @param {number} id - id of the question
   */
  const getOneQuestions = function getOneEligibilityQuestions(clbk, id) {
    const sql = 'SELECT * FROM `eligibility_question` WHERE id = ?'
    const query = connection.query(sql, [id], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  /**
   * update one question
   * @property {object} data - object with 2 property question and id
   * @property {string} data.question - the updated question
   * @property {number} data.id - id of the question to update
   */
  const updateQuestion = function updateEligibilityQuestion(clbk, data) {
    const sql = 'UPDATE `eligibility_question` SET `question`= ? WHERE `id` = ?'
    const query = connection.query(
      sql,
      [data.question, data.id],
      (err, res) => {
        if (err) return clbk(err, null)
        return clbk(null, res)
      }
    )
    console.log('last db query =>', query.sql)
  }

  /**
   * delete one question
   * @param {number} id - id of the question to delete
   */
  const deleteQuestion = function deleteEligibilityQuestion(clbk, id) {
    const sql = 'DELETE FROM `eligibility_question` WHERE `id` = ?'
    const query = connection.query(sql, [id], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  /********************************************************************************/
  /** ************************** ELIGIBILITY ANSWER ********************************/
  /********************************************************************************/

  /**
   * insert the user answer of one question
   * @param {object} data - object that contains answer data
   * @property {number} data.user_id - id of the user
   * @property {number} data.question_id - id of the answered question
   * @property {number} data.answer - answer to the question 1 for passed, 0 for denied
   */
  const insertAnswers = function insertEligibilityAnswer(clbk, data) {
    console.log(data)
    const sql =
      'INSERT INTO `eligibility_answer`(`user_id`, `question_id`, `answer`) VALUES (?, ?, ?)'
    const { userId, questionId, answer } = data
    const query = connection.query(
      sql,
      [userId, questionId, answer],
      (err, res) => {
        if (err) return clbk(err, null)
        return clbk(null, res)
      }
    )
    console.log('last db query =>', query.sql)
  }

  /**
   * update one question
   * @property {object} data - object with 3 property : answer, user_id and question_id
   * @property {string} data.answer - the answer of the question
   * @property {number} data.question_id - id of the question to update
   * @property {number} data.user_id - id of the user answering
   */
  const updateAnswer = function updateEligibilityAnswer(clbk, data) {
    const sql =
      'UPDATE `eligibility_answer` as a SET `answer`= ? WHERE a.user_id = ? AND a.question_id = ?'
    const query = connection.query(
      sql,
      [data.answer, data.userId, data.questionId],
      (err, res) => {
        if (err) return clbk(err, null)
        return clbk(null, res)
      }
    )
    console.log('last db query =>', query.sql)
  }

  /**
   *  get all users answers
   * @param {object} queries - paramaters that will allow to paginate the uer eligibility array
   * @property {number} queries.page - indicate the current page
   * @property {number} queries.limit - indicate the number of users to return (must be multiplicated by the * number of questions so the sql query gets the right amount of users)
   */
  const getAllAnswers = function getAllEligibilityAnswers(clbk, queries) {
    const limit = queries.limit
    const page = (queries.page - 1) * limit
    let sql =
      'SELECT u.id as user_id, u.name, u.email, q.question,  a.answer FROM `eligibility_answer` as a INNER JOIN `eligibility_question` as q ON a.question_id = q.id INNER JOIN user as u ON a.user_id = u.id ORDER BY user_id'
    sql += ` LIMIT ${page}, ${limit}`
    const query = connection.query(sql, (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  /**
   *  get one user answer
   * @param {object} data - paramaters that will allow to verify if the user already answered the question
   * @property {number} data.user_id - id of the user
   * @property {number} data.question_id - id of the question
   */
  const getOneAnswer = function getOneEligibilityAnswer(clbk, data) {
    const { user_id, question_id } = data
    const sql =
      'SELECT * FROM `eligibility_answer` as a WHERE a.user_id = ? AND a.question_id = ?'
    const query = connection.query(sql, [user_id, question_id], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  /**
   *  get eligibility answer by user max page
   * @param {object} limit - limit of user by page, allows to calculate the max pages needed
   */
  const getMaxPages = function getMaxEligibilityPages(clbk, limit) {
    const sql =
      'SELECT COUNT(*) / ' + limit + ' as maxPages FROM `eligibility_answer`'
    const query = connection.query(sql, (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  return {
    createQuestion,
    getAllQuestions,
    getOneQuestions,
    updateQuestion,
    deleteQuestion,
    insertAnswers,
    updateAnswer,
    getOneAnswer,
    getAllAnswers,
    getMaxPages
  }
}
