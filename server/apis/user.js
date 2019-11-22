module.exports = (function userAPI() {
  const express = require('express')
  const router = express.Router()
  const bcrypt = require('bcrypt')
  const auth = require('./../utils/auth')
  const multer = require('multer')
  const fs = require('fs-extra')
  const { isEmail, isInt } = require('validator')
  const { connection } = require('./../mailjet.config.js')
  const data_Newsletter = require('./mailjet/mails_configs/newsletter')
  const data_Welcome = require('./mailjet/mails_configs/welcome')
  const data_resetPassword = require('./mailjet/mails_configs/reset_password')
  const sendWithMailjet = require('./mailjet/mailjet_sendMail')
  const fastConnexion = require('./mailjet/mails_configs/connexion')
  const axios = require('axios');


  // ...rest of the initial code omitted for simplicity.
  const { check, validationResult } = require('express-validator/check')

  /// //////////////Start Uploader////////////////////////////
  const storageProfil = multer.diskStorage({
    destination: function(req, file, cb) {
      let path
      if (process.env.NODE_ENV === 'development') {
        path = 'static/img/profils'
      } else {
        path = './matrimonline.fr/img/profils'
      }
      fs.mkdirsSync(path)
      cb(null, path)
    },
    filename: function(req, file, cb) {
      cb(
        null,
        (
          Date.now() +
          '_profil.' +
          file.originalname.split('.').pop()
        ).toLowerCase()
      )
    },
    limits: { fileSize: 1000000 }
  })

  const uploadProfil = multer({ storage: storageProfil })
  /// //////////////End Uploader////////////////////////////

  return function userRouter(db) {
    const userModel = require('./../models/userModel')(db.connection)

    // creating an user with name, email sex, crypted password and consent
    router.post(
      '/user',
      [
        check('sex', `Le sexe n'est pas valide`)
          .exists()
          .isLength({ min: 1, max: 1 })
          .isIn(['M', 'F']),
        check('name', `Le prénom n'est pas valide`)
          .exists()
          .matches(/^[a-zàâçéèêëîïôûùüÿñæœ -]+$/i)
          .isLength({ min: 2, max: 20 }),
        check('email', `L'email n'est pas valide`)
          .exists()
          .isEmail(),
        check('password', `Le mot de passe n'est pas valide`)
          .exists()
          .isLength({ min: 12 })
          .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{12,})/),
        check('conditions', `Le champ condition n'est pas valide`)
          .exists()
          .isBoolean(),
        check('dataCollect', `Le champ dataCollect n'est pas valide`)
          .exists()
          .isBoolean(),
        check('newsletter', `Le champ newsletter n'est pas valide`)
          .exists()
          .isBoolean()
      ],
      (req, res) => {
        const {
          sex,
          email,
          password,
          name,
          conditions,
          dataCollect,
          newsletter
        } = req.body
        const newUser = {
          sex,
          email,
          name,
          conditions,
          dataCollect,
          newsletter
        }
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() })
        }
        bcrypt
          .hash(password, 10)
          .then(hash => {
            newUser.password = hash
            userModel.create((err, dataset) => {
              if (err) {
                return res.status(401).send(err)
              }

              const token = auth.createToken(dataset.insertId)
              return res
                .header('x-authenticate', token)
                .status(200)
                .send({ token, id: dataset.insertId })
            }, newUser)
          })
          .catch(err => {
            return res.status(500).send(err)
          })
      }
    )

    // checks if the page query is valid compared to the maxpage possible queryPage can't be > maxPages
    const checkPageQuery = function checkPageQuery(maxPage, queryPage) {
      if (
        queryPage === undefined ||
        queryPage < 0 ||
        queryPage < 1 ||
        queryPage > maxPage
      ) {
        return 1
      } else {
        return queryPage
      }
    }

    // checks if the limit query is valid
    const checkLimitQuery = function checkLimitQuery(limit) {
      if (limit === undefined || limit < 0 || limit > 50) {
        return (limit = 20)
      } else {
        return limit
      }
    }

    // get all the users
    router.get('/user', (req, res) => {
      const queries = {}
      req.query.limit = checkLimitQuery(req.query.limit)
      queries.limit = req.query.limit
      if (req.query.sex !== 'undefined') {
        queries.sex = req.query.sex
      }
      userModel.getMaxPages(function(err, result) {
        if (err) {
          return res.status(500).send(err)
        } else {
          const maxPages = Math.ceil(result[0].maxPages)
          req.query.page = checkPageQuery(maxPages, req.query.page)
          userModel.getAll(function(err, result) {
            if (err) return res.status(500).send(err)
            res.status(200).send({ users: result, maxPages })
          }, req.query)
        }
      }, queries)
    })

    // get all favorited users from user
    router.get('/users/certified', (req, res) => {
      if (req.query.sex !== 'undefined') {
        userModel.getAllCertifiedUsers(function(err, result) {
          if (err) return res.status(500).send(err);
          res.status(200).send({ users: result});
        }, req.query);
      } else {
        res.status(500).send(err)
      }
    })

    // get all favorited users from user
    router.get('/users/discover', (req, res) => {
      if (req.query.sex !== 'undefined') {
        userModel.getUsersDiscover(function(err, result) {
          if (err) return res.status(500).send(err);
          res.status(200).send({ users: result});
        }, req.query);
      } else {
        res.status(500).send(err)
      }
    })

    const cedexFromRayon = function cedexFromRayon(res, req, cedex, rayon, nbr_users) {
      console.log("rayon", rayon)
      console.log("nbr_users", nbr_users)
      // Get postal code then add to request
      axios.get(`https://www.villes-voisines.fr/getcp.php?cp=${cedex}&rayon=${rayon}`) 
      .then(function (response) {
        const cedexs = Object.keys(response.data).map(c => response.data[c].code_postal);
        req.query.cedex = cedexs;
        userModel.getAllFilteredUsers(function(err, result) {
          if (err) return res.status(500).send(err);
          console.log("rayon", rayon)
          console.log("nbr_users", nbr_users)
          console.log("result.length", result.length)
          if ( result.length >= 12 || result.length === nbr_users) {
            res.status(200).send({ users: result});
          } else {
            cedexFromRayon(res, req, cedex, rayon + 10, nbr_users)
          }
        }, req.query);
      })
      .catch(function (error) {
        console.error(error);
      });
    }
    // get all filtered users
    router.get('/users/filtered', (req, res) => {
      const rayon = 10;
      userModel.getNbr_users(function(err, result_nbr) {
        if (err) return res.status(500).send(err);
        console.log('nbr_users', result_nbr)
        if (req.query.sex !== 'undefined') {
          userModel.getAllFilteredUsers(function(err, result) {
            if (err) return res.status(500).send(err);
            if ( result.length >= 12 || result.length === result_nbr) {
              res.status(200).send({ users: result});
            } else {
              cedexFromRayon(res, req, req.query.cedex, rayon, result_nbr)
            }
          }, req.query);
        } else {
          res.status(500).send(err)
        }
      }, req.query)
    })

    // get all favorited users from user
    router.get('/favorites/user', (req, res) => {
      if (req.query.sex !== 'undefined') {
        userModel.getAllFavoritedUsers(function(err, result) {
          if (err) return res.status(500).send(err);
          res.status(200).send({ users: result});
        }, req.query);
      } else {
        res.status(500).send(err)
      }
    })

    // get all users which favorited user
    router.get('/favorited/user', (req, res) => {
      if (req.query.sex !== 'undefined') {
        userModel.getAllMeFavoritedUsers(function(err, result) {
          if (err) return res.status(500).send(err);
          res.status(200).send({ users: result});
        }, req.query);
      } else {
        res.status(500).send(err)
      }
    })

    // get if an user is favorited by an other
    router.get('/favorites', (req, res) => {
        userModel.getFavorite(function(err, result) {
          if (err) return res.status(500).send(err);
          res.status(200).send({ users: result});
        }, req.query);
    })

    // post an user favorited by an other
    router.post('/favorites', (req, res) => {
        userModel.postFavorite(function(err, result) {
          if (err) return res.status(500).send(err);
          res.status(200).send({ users: result});
        }, req.query);
    })

    // delete an user favorited by an other
    router.delete('/favorites', (req, res) => {
        userModel.deleteFavorite(function(err, result) {
          if (err) return res.status(500).send(err);
          res.status(200).send({ users: result});
        }, req.query);
    })

    // get one user by mail or by id
    router.get('/user/:param', (req, res) => {
      const param = req.params.param
      if (isEmail(param)) {
        userModel.getUserByMail(function(err, result) {
          if (err) return res.status(500).send(err)
          res.status(200).send(result)
        }, param)
      } else if (isInt(param)) {
        userModel.getUserById(function(err, result) {
          if (err) return res.status(500).send(err)
          res.status(200).send(result[0])
        }, param)
      }
    })

    router.post('/user/login', (req, res) => {
      // on récupère l'user par son mail
      userModel.getUserByMail((err, user) => {
        // si erreur interne au serveur, retourner l'erreur au client
        if (err) return res.status(500).send(err)
        // sinon si le mail n'existe pas en bdd, retourner une erreur au client
        else if (!user)
          return res
            .status(401)
            .send(
              `Le compte n'a pas été reconnu, vérifier votre email et/ou votre mot de passe.`
            )
        // sinon  le mail a été trouvé, comparer le password avec son crypt/salt
        bcrypt
          .compare(req.body.user.password, user.password)
          .then(function(match) {
            // si le password est invalide, retourner une erreur au client
            if (!match)
              return res
                .status(401)
                .send(
                  `Le compte n'a pas été reconnu, vérifier votre email et/ou votre mot de passe.`
                )

            // tout est ok => retourner l'objet user (sans password, etc.) au client
            // accompagné d'un token dans l'entête HTTP pour sécuriser l'accès au dashboard.
            user = auth.removeSensitiveInfo(user)
            const token = auth.createToken(user.id)
            return res
              .header('x-authenticate', token)
              .status(200)
              .send({ user, token })
          })
          .catch(err => {
            console.log('@catch', err)
            res.status(500).send(err)
          }) // si bcrypt a planté, => erreur au client
      }, req.body.user.email)
    })

    // delete an user thanks to id
    router.delete('/user/:id', (req, res) => {
      userModel.deleteOne(function(err, result) {
        if (err) return res.status(500).send(err)
        res.status(200).send(result)
      }, req.params.id)
    })

    router.put(
      '/user/:id',
      check('email', `L'email n'est pas valide`)
        .optional()
        .isEmail(),
      check('sex', `Le sexe n'est pas valide`)
        .optional()
        .isLength({ min: 1, max: 1 })
        .isIn(['M', 'F']),
      check('name', `Le prénom n'est pas valide`)
        .optional()
        .matches(/^[a-zàâçéèêëîïôûùüÿñæœ -]+$/i)
        .isLength({ min: 2, max: 20 }),
      check('birthday', `La date de naissance n'est pas valide`)
        .optional()
        .matches(
          /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)\d{2})$/
        ),
      check('cedex', `Le code postal n'est pas valide`)
        .optional()
        .isNumeric()
        .isLength({ min: 5, max: 5 }),
      check('situation', `La situation n'est pas valide`)
        .optional()
        .isIn([
          'célibataire',
          'veuf',
          'veuve',
          'séparé',
          'séparée',
          'divorcé',
          'divorcée',
          'en instance de divorce'
        ]),
      check('phone', `Le numéro de téléphone n'est pas valide`)
        .optional()
        .isNumeric()
        .isLength({ min: 10, max: 10 }),
      check('conditions', `Le champ conditions n'est pas valide`)
        .optional()
        .isBoolean(),
      check('dataCollect', `Le champ data_collect n'est pas valide`)
        .optional()
        .isBoolean(),
      check('newsletter', `Le champ newsletter n'est pas valide`)
        .optional()
        .isBoolean(),
      (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() })
        }
        const user = req.body
        if (user.birthday) {
          user.birthday = user.birthday
            .split('-')
            .reverse()
            .join('-')
        }
        userModel.update(
          function(err, result) {
            if (err) return res.status(500).send(err)
            res.status(200).send(result)
          },
          {
            user,
            id: req.params.id
          }
        )
      }
    )
    router.put(
      '/user/:id/password',
      check('password', `Le mot de passe n'est pas valide`)
        .optional()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{12,})/)
        .isLength({ min: 12 }),
      (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() })
        }
        const pass = req.body.password
        bcrypt
          .hash(pass, 10)
          .then(hash => {
            const token = auth.createToken(req.params.id)
            const password_hash = hash
            userModel.updatePassword(
              function(err) {
                if (err) return res.status(500).send(err)
                return res
                  .header('x-authenticate', token)
                  .status(200)
                  .send(token)
              },
              {
                pass: { password: password_hash },
                id: req.params.id
              }
            )
          })
          .catch(err => {
            return res.status(500).send(err)
          })
      }
    )

    // Update profil picture
    router.put(
      '/user/:id/img',
      uploadProfil.single('uploaderImgProfil'),
      (req, res) => {
        const fileNameRegex = /(^[1-9][0-9]{12})(_profil.)(jpeg|jpg|png)$/
        if (req.file.filename.match(fileNameRegex)) {
          userModel.uploadImgProfil(
            function(err, result) {
              if (err) return res.status(500).send(err)
              res.status(200).send(result)
            },
            {
              file: req.file.filename,
              id: req.params.id
            }
          )
        } else return res.status(500).send(`Le fichier n'est pas valide`)
      }
    )
    // Send email to valid newsletter
    router.post('/user/newsletter', (req, res) => {
      // Get base url
      const url_referer = req.headers.referer.split('/')
      const protocol = url_referer[0]
      const base = url_referer[2]
      if (req.body.token && req.body.user) {
        sendWithMailjet(
          connection,
          data_Newsletter(
            [{ Email: req.body.user.email, Name: req.body.user.name }],
            `${protocol}//${base}/user/newsletter/${req.body.token}`
          )
        )
        res
          .status(200)
          .send(
            `L'e-mail de confirmation d'abonnement à la newsletter a été envoyé à ${
              req.body.user.email
            }`
          )
      } else return res.status(500).send(`L'email n'a pas été envoyé`)
    })
    // Send welcome email
    router.post('/user/welcome_email', (req, res) => {
      if (req.body.user) {
        sendWithMailjet(
          connection,
          data_Welcome([
            { Email: req.body.user.email, Name: req.body.user.name }
          ])
        )
        res
          .status(200)
          .send(`L'e-mail de bienvenue a été envoyé à ${req.body.user.email}`)
      } else return res.status(500).send(`L'authentification n'est pas valide`)
    })
    // Send email to reset password
    router.post('/user/reset-password', (req, res) => {
      // Get base url
      const url_referer = req.headers.referer.split('/')
      const protocol = url_referer[0]
      const base = url_referer[2]
      // Check if data email exist
      if (req.body.email) {
        // Get user by mail and sending email
        userModel.getUserByMail(function(err, user) {
          if (err) return res.status(500).send(err)
          const token = auth.createToken(user.id)
          user = auth.removeSensitiveInfo(user)
          sendWithMailjet(
            connection,
            data_resetPassword(
              [{ Email: req.body.email, Name: user.name }],
              `${protocol}//${base}/reset/${token}`
            )
          )
          res.status(200).send(user)
        }, req.body.email)
      } else return res.status(500).send(`L'e-mail n'est pas valide`)
    })
    router.post('/user/fast-connexion', (req, res) => {
      // Get base url
      const url_referer = req.headers.referer.split('/')
      const protocol = url_referer[0]
      const base = url_referer[2]
      // Check if data email exist
      if (req.body.email) {
        // Get user by mail and sending email
        userModel.getUserByMail(function(err, user) {
          if (err) return res.status(500).send(err)
          const token = auth.createToken(user.id)
          user = auth.removeSensitiveInfo(user)
          sendWithMailjet(
            connection,
            fastConnexion(
              [{ Email: req.body.email, Name: user.name }],
              `${protocol}//${base}/connexion/${token}`
            )
          )
          res.status(200).send(user)
        }, req.body.email)
      } else return res.status(500).send(`L'e-mail n'est pas valide`)
    })

    return router
  }
})()
