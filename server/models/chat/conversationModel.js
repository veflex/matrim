module.exports = function(connection) {
  const getAllConversation = function getAllConversation(clbk, id) {
    const sql = `SELECT  c.id as id_conv, 

      CASE WHEN u2.id = ? 
      THEN c.isUser2Read 
      ELSE c.isUser1Read 
      END as isRead, 
      CASE WHEN u2.id = ? 
      THEN u1.name 
      ELSE u2.name
      END as name, 
      CASE WHEN u2.id = ? 
      THEN TIMESTAMPDIFF(YEAR, u1.birthday, CURDATE()) 
      ELSE TIMESTAMPDIFF(YEAR, u2.birthday, CURDATE())
      END as age,    
      CASE WHEN u2.id = ? 
      THEN u1.id
      ELSE u2.id
      END as user_id,      
      CASE WHEN u2.id = ? 
      THEN u1.img
      ELSE u2.img
      END as user_img      
    FROM conversation c
    JOIN user u1 ON c.user_1 = u1.id
    JOIN user u2 ON c.user_2 = u2.id
    WHERE c.user_1 = ? OR c.user_2 = ?`
    const query = connection.query(
      sql,
      [id, id, id, id, id, id, id],
      (err, res) => {
        if (err) return clbk(err, null)
        return clbk(null, res)
      }
    )
    console.log('last db query =>', query.sql)
  }
  const createConversation = function createConversation(clbk, ids) {
    const { user_1, user_2 } = ids
    const sql = `INSERT INTO conversation (user_1, user_2) VALUES (?,?)`
    // QUERY QUI PERMET DE VOIR LE DERNIER MESSAGE A COUPLER AVEC LA CONVERSATION IF ISREAD=0 POUR POUVOIR METTRE UN BOUT DU MESSAGE DANS LE BLOCK MESSAGERIE
    // SELECT m.* FROM message m WHERE id_conversation = ? ORDER BY m.created_at DESC LIMIT 1
    const query = connection.query(sql, [user_1, user_2], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }
  const updateConversationOnRead = function updateConversationOnRead(
    clbk,
    payload
  ) {
    const { from_user, id_conv } = payload
    const sql =
      'UPDATE conversation SET isUser1Read = CASE WHEN user_1 = ? THEN true ELSE isUser1Read END , isUser2Read = CASE WHEN user_2 = ? THEN true ELSE isUser2Read END WHERE id = ?'
    const query = connection.query(
      sql,
      [from_user, from_user, id_conv],
      (err, res) => {
        if (err) return clbk(err, null)
        return clbk(null, res)
      }
    )
    console.log('last db query =>', query.sql)
  }
  const updateConversationOnWrite = function updateConversationOnWrite(
    clbk,
    payload
  ) {
    const { from_user, id_conv } = payload
    console.log('payload:', payload)
    const sql =
      'UPDATE conversation SET isUser1Read = CASE WHEN user_1 = ? THEN true ELSE false END , isUser2Read = CASE WHEN user_2 = ? THEN true ELSE false END WHERE id = ?'
    const query = connection.query(
      sql,
      [from_user, from_user, id_conv],
      (err, res) => {
        if (err) return clbk(err, null)
        return clbk(null, res)
      }
    )
    console.log('last db query =>', query.sql)
  }

  return {
    getAllConversation,
    createConversation,
    updateConversationOnWrite,
    updateConversationOnRead
  }
}
