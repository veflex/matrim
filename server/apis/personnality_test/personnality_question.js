module.exports = (function cedexAPI() {
  const express = require('express')
  const router = express.Router()

  return function userRouter(db) {
    const personnality_questionModel = require('../../models/personnality_test/personnality_questionModel')(
      db.connection
    )

    // post one personnality question
    router.post('/personnality_question', (req, res) => {
      personnality_questionModel.insertPersonnalityQuestion(function(
        err,
        result
      ) {
        if (err) return res.status(500).send(err)
        res.status(200).send(result)
      },
      req.body)
    })
    // get all personality questions
    router.get('/personnality_question', (req, res) => {
      personnality_questionModel.getAllPersonnalityQuestions(function(
        err,
        result
      ) {
        if (err) return res.status(500).send(err)
        res.status(200).send(result)
      },
      req.query.sex)
    })
    return router
  }
})()
