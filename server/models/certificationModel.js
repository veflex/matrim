module.exports = function(connection) {
  
  // get all type of certification
  const getCertifications_type = function getCertifications_type(clbk) {
    let sql = `SELECT id, label FROM certification_type`;
    const query = connection.query(sql, (err, res) => {
      if (err) return clbk(err, null);
      return clbk(null, res);
    });
    console.log('last db query =>', query.sql);
  };

  // get state certification of user
  const getCertification_state = function getCertification_state(clbk, payload) {
    console.log(payload)
    let sql = `SELECT state FROM certification_state WHERE id_user = ? AND id_certif = ? AND date = (SELECT max(date) FROM certification_state WHERE id_user = ? AND id_certif = ?)`;
    const query = connection.query(sql, [payload.id_user, payload.id_certif, payload.id_user, payload.id_certif], (err, res) => {
      if (err) return clbk(err, null);
      return clbk(null, res);
    });
    console.log('last db query =>', query.sql);
  };

  // get statement of user
  const getStatement = function getStatement(clbk, payload) {
    console.log(payload)
    let sql = `SELECT sworn_statement FROM certification_statement WHERE id_user = ? AND id_certif = ?`;
    const query = connection.query(sql, [payload.id_user, payload.id_certif], (err, res) => {
      if (err) return clbk(err, null);
      return clbk(null, res);
    });
    console.log('last db query =>', query.sql);
  };

  /**
   *  get certification to one user
   * @param {object}
   */
  const getValidationCertificationUser = function getValidationCertificationUser(clbk, payload) {
    const sql = `SELECT certified FROM user WHERE id = ?`;
    const query = connection.query(sql, [payload.id_user], (err, res) => {
      if (err) return clbk(err, null);
      console.log(res)
      return clbk(null, res);
    });
    console.log('last db query =>', query.sql);
  };

  // get file of user
  const getFile = function getFile(clbk, payload) {
    console.log(payload)
    let sql = `SELECT file_name FROM certification_files WHERE id_user = ? AND id_certif = ?`;
    const query = connection.query(sql, [payload.id_user, payload.id_certif], (err, res) => {
      if (err) return clbk(err, null);
      return clbk(null, res);
    });
    console.log('last db query =>', query.sql);
  };

  const postFile = function postFile(clbk, file) {
    const sql = 'INSERT INTO `certification_files`(`id_user`, `id_certif`, `file_name`) VALUES (?,?,?)'
    const query = connection.query(sql, [file], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  const postStatement = function postStatement(clbk, statement) {
    const sql = 'INSERT INTO `certification_statement`(`id_user`, `id_certif`, `sworn_statement`) VALUES (?,?,?)'
    const query = connection.query(sql, [statement.id_user, statement.id_certif, statement.sworn_statement], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  const editStatement = function editStatement(clbk, statement) {
    const sql = 'UPDATE `certification_statement` SET sworn_statement = ? WHERE id_user = ? AND id_certif = ?'
    const query = connection.query(sql, [statement.sworn_statement, statement.id_user, statement.id_certif], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  const uploadDocProfil = function uploadDocProfil(clbk, doc) {
    let sql,payload
    if(doc.page){
      sql = 'INSERT INTO `certification_files`(`id_user`, `id_certif`, `file_name`, `page`) VALUES (?,?,?,?)'
      payload = [doc.id_user, doc.id_certif, doc.file, doc.page]
    } else {
      sql = 'INSERT INTO `certification_files`(`id_user`, `id_certif`, `file_name`) VALUES (?,?,?)'
      payload = [doc.id_user, doc.id_certif, doc.file]
    }
    const query = connection.query(sql, payload, (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  const updateDocProfil = function updateDocProfil(clbk, doc) {
    const sql = 'UPDATE `certification_files` SET file_name = ? WHERE id_user = ? AND id_certif = ?'
    const query = connection.query(sql, [doc.file, doc.id_user, doc.id_certif], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }
  
  const deleteFile = function deleteFile(clbk, doc) {
  const sql = 'DELETE FROM `certification_files` WHERE id_user = ? AND id_certif = ? AND file_name = ?'
    const query = connection.query(sql, [doc.id_user, doc.id_certif, doc.file], (err, res) => {
      if (err) return clbk(err, null)
      return clbk(null, res)
    })
    console.log('last db query =>', query.sql)
  }

  return {
    getStatement,
    getFile,
    getCertification_state,
    getValidationCertificationUser,
    getCertifications_type,
    postFile,
    postStatement,
    editStatement,
    uploadDocProfil,
    updateDocProfil,
    deleteFile
  };
};
