module.exports = (function myAuthLib() {
  const jwt = require('jsonwebtoken')
  const secret = '@2019/_matriMonline@team#'

  /**
   * @function
   * @module authenticate a middleware to use in express routes
   * @param {Object} req an express http request object
   * @param {String} req.header["x-authenticate"] the jwt token available in http request header
   * @param {Object} res an express http response object
   * @param {Function} next a function allowing to go back to initial express route callback
   * @return {undefined} RAS
   */
  const authenticate = function authenticate(req, res, next) {
    try {
      const token = req.header('x-authenticate')
      jwt.verify(token, secret)
      req.isAuthenticated = token
      next() // si pas d'erreur, la fonction appelante continue son exécution
    } catch (err) {
      res.status(401).send(err)
    }
  }

  /**
   * verify an http req to determine is user credntials are correct
   * @function
   * @param {Object} req - An express http request object
   * @returns {Boolean} true if user credentials are coreect, false otherwise
   */
  const verifyToken = function verifyToken(token) {
    try {
      const check = jwt.verify(token, secret)
      return { msg: check, status: true }
    } catch (err) {
      return { msg: err.message, status: false }
    }
  }

  /**
   * create a new jwt token
   * @function
   * @param {Object} user - the user for which the token is created
   * @returns {string} true if user credentials are coreect, false otherwise
   */
  const createToken = function createToken(userId) {
    return jwt.sign(
      {
        userId
      },
      secret
    )
  }

  /**
   * takes an user object as argument and returns a copy of it after deleting sensitive infos such as passord or email
   * @function
   * @param {Object} u - A user object fetched from database
   * @returns {Object} filteredUser - the user minus sensitive values
   */
  const removeSensitiveInfo = function removeSensitiveInfo(u) {
    console.log('auuuuth', u)
    if (!u) throw new Error('A User object is required as argument')
    const filteredUser = {}
    const keys = ['password', 'email']

    for (const key in keys) {
      delete u[keys[key]]
    }

    for (const prop in u) {
      if (u.hasOwnProperty(prop)) filteredUser[prop] = u[prop]
    }

    return filteredUser
  }

  return {
    authenticate,
    createToken,
    verifyToken,
    removeSensitiveInfo
  }
})()
