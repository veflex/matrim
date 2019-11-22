module.exports = (function eligibilityAPI() {
  const express = require('express')
  const router = express.Router()
  const { check, validationResult } = require('express-validator/check')

  return function userRouter(db) {
    const eligibilityModel = require('./../models/eligibilityModel')(
      db.connection
    )

    /********************************************************************************/
    /** ************************** ELIGIBILITY QUESTION ******************************/
    /********************************************************************************/

    // post a new eligibility question
    router.post('/elig_question', (req, res) => {
      eligibilityModel.createQuestion(function(err, result) {
        if (err) return res.status(500).send(err)
        res.status(200).send(result)
      }, req.body.question)
    })

    // get all eligibility questions
    router.get('/elig_question', (req, res) => {
      eligibilityModel.getAllQuestions(function(err, result) {
        if (err) return res.status(500).send(err)
        res.status(200).send(result)
      }, req.query.sex)
    })

    // get one eligibility question
    router.get('/elig_question/:id', (req, res) => {
      eligibilityModel.getOneQuestions(function(err, result) {
        if (err) return res.status(500).send(err)
        res.status(200).send(result)
      }, req.params.id)
    })

    // patch one eligibility question
    router.put('/elig_question/:id', (req, res) => {
      eligibilityModel.updateQuestion(
        function(err, result) {
          if (err) return res.status(500).send(err)
          res.status(200).send(result)
        },
        {
          question: req.body.question,
          id: req.params.id
        }
      )
    })

    // delete one eligibility question
    router.delete('/elig_question/:id', (req, res) => {
      eligibilityModel.deleteQuestion(function(err, result) {
        if (err) return res.status(500).send(err)
        res.status(200).send(result)
      }, req.params.id)
    })

    /********************************************************************************/
    /** ************************** ELIGIBILITY ANSWER ********************************/
    /********************************************************************************/

    // insert user's eligibility answers
    router.post(
      '/elig_answer',
      [
        check('userId', 'Mauvaise valeur de user_id')
          .exists()
          .isNumeric({ no_symbols: true }),
        check('questionId', 'question_id')
          .exists()
          .isNumeric({ no_symbols: true }),
        check('answer', 'Mauvaise valeur de user_id')
          .exists()
          .isIn([0, 1])
        // auth.authenticate
      ],
      (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() })
        }
        eligibilityModel.insertAnswers(function(err, result) {
          if (err) return res.status(500).send(err)
          res.status(200).send(result)
        }, req.body)
      }
    )

    // checks if the page query is valid compared to the maxpage possible queryPage can't be > maxPages
    const checkPageQuery = function checkPageQuery(maxPage, queryPage) {
      if (queryPage < 0 || queryPage < 1 || queryPage > maxPage) {
        return 1
      } else {
        return queryPage
      }
    }

    // checks if the limit query is valid
    const checkLimitQuery = function checkLimitQuery(limit) {
      if (limit < 0 || limit > 100) {
        return (limit = 80)
      } else {
        return limit
      }
    }

    // get all eligibility answers
    router.get('/elig_answer', (req, res) => {
      // check the limit query so it's not <0 and >100
      req.query.limit = checkLimitQuery(req.query.limit)
      // we get the max pages related to the limit
      eligibilityModel.getMaxPages(function(err, result) {
        if (err) {
          return res.status(500).send(err)
        } else {
          const maxPages = Math.round(result[0].maxPages)
          req.query.page = checkPageQuery(maxPages, req.query.page)

          eligibilityModel.getAllAnswers(function(err, result) {
            if (err) return res.status(500).send(err)
            res.status(200).send(result)
          }, req.query)
        }
      }, req.query.limit)
    })

    // get one eligibility answer
    router.get('/elig_answer/:user_id/:question_id', (req, res) => {
      eligibilityModel.getOneAnswer(function(err, result) {
        if (err) return res.status(500).send(err)
        res.status(200).send(result)
      }, req.params)
    })

    // update one eligibility answer
    router.put(
      '/elig_answer',
      [
        check('userId', 'Mauvaise valeur de user_id')
          .exists()
          .isNumeric({ no_symbols: true }),
        check('questionId', 'Mauvaise valeur de question_id')
          .exists()
          .isNumeric({ no_symbols: true }),
        check('answer', 'Mauvaise valeur de answer')
          .exists()
          .isIn([0, 1])
        // auth.authenticate
      ],
      (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() })
        }
        eligibilityModel.updateAnswer(function(err, result) {
          if (err) return res.status(500).send(err)
          res.status(200).send(result)
        }, req.body)
      }
    )

    return router
  }
})()
