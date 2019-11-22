module.exports = (function cedexAPI() {
  const express = require('express')
  const router = express.Router()

  return function userRouter(db) {
    const personnality_answerModel = require('../../models/personnality_test/personnality_answerModel')(
      db.connection
    )

    // insert user answer
    router.post('/personnality_answer/:id_user', (req, res) => {
      personnality_answerModel.insertAnswer(
        function(err, result) {
          if (err) return res.status(500).send(err)
          res.status(200).send(result)
        },
        { id_user: req.params.id_user, body: req.body }
      )
    })
    router.get('/personnality_answer/:id_user/:id_question', (req, res) => {
      const { id_question, id_user } = req.params
      personnality_answerModel.getOneAnswer(
        function(err, result) {
          if (err) return res.status(500).send(err)
          res.status(200).send(result)
        },
        { id_question, id_user }
      )
    })
    router.get('/personnality_answer/:id_user', (req, res) => {
      const { id_user } = req.params
      personnality_answerModel.getUserAnswers(function(err, result) {
        if (err) return res.status(500).send(err)
        res.status(200).send(result)
      }, id_user)
    })
    router.put('/personnality_answer', (req, res) => {
      const { id_question, id_user, answer } = req.body
      personnality_answerModel.updateAnswer(
        function(err, result) {
          if (err) return res.status(500).send(err)
          res.status(200).send(result)
        },
        { id_question, id_user, answer }
      )
    })
    return router
  }
})()
