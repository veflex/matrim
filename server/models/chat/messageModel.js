module.exports = function(connection) {
  const getAllMessages = function getAllMessages(clbk, id) {
    const sql = `SELECT u1.name as from_user, u1.id as id_from, u1.img as img_from, u2.name as to_user, m.id, m.message, m.created_at as send_at FROM message m 
    JOIN user u1 ON m.from_user = u1.id
    JOIN user u2 ON m.to_user = u2.id
    WHERE id_conversation = ? ORDER BY m.created_at ASC`
    const query = connection.query(sql, [id], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  const getLastMessage = function getLastMessage(clbk, id) {
    const sql =
      'SELECT m.*, DATE_FORMAT(m.created_at, "%d/%m/%Y") as date, DATE_FORMAT(m.created_at, "%Hh%i") as time FROM message m WHERE id_conversation = ? ORDER BY m.created_at DESC LIMIT 1'
    const query = connection.query(sql, [id], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  const sendMessage = function sendMessage(clbk, payload) {
    const { id_conversation, from_user, to_user, message } = payload
    const sql =
      'INSERT INTO `message` (`id_conversation`, `from_user`, `to_user`, `message`) VALUES (?, ?, ?, ?)'
    const query = connection.query(
      sql,
      [id_conversation, from_user, to_user, message],
      (err, res) => {
        if (err) return clbk(err, null)
        return clbk(null, res)
      }
    )
    console.log('last db query =>', query.sql)
  }

  const createConversation = function createConversation(clbk, ids) {
    const { user_1, user_2 } = ids
    const sql = `INSERT INTO conversation (user_1, user_2) VALUES (?, ?)`
    // QUERY QUI PERMET DE VOIR LE DERNIER MESSAGE A COUPLER AVEC LA CONVERSATION IF ISREAD=0 POUR POUVOIR METTRE UN BOUT DU MESSAGE DANS LE BLOCK MESSAGERIE
    // SELECT m.* FROM message m WHERE id_conversation = ? ORDER BY m.created_at DESC LIMIT 1
    const query = connection.query(sql, [user_1, user_2], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  return {
    getAllMessages,
    createConversation,
    getLastMessage,
    sendMessage
  }
}
