module.exports = (function conversationAPI() {
  const express = require('express')
  const router = express.Router()

  return function conversationRouter(db) {
    const conversationModel = require('../../models/chat/conversationModel')(
      db.connection
    )

    router.get('/conversations/:id', (req, res) => {
      conversationModel.getAllConversation(function(err, result) {
        if (err) return res.status(500).send(err)
        res.status(200).send(result)
      }, req.params.id)
    })

    router.post('/conversation', (req, res) => {
      conversationModel.createConversation(function(err, result) {
        if (err) return res.status(500).send(err)
        res.status(200).send(result)
      }, req.body)
    })

    router.put('/conversation-read/:id_conv', (req, res) => {
      conversationModel.updateConversationOnRead(
        function(err, result) {
          if (err) return res.status(500).send(err)
          res.status(200).send(result)
        },
        { from_user: req.body.from_user, id_conv: req.params.id_conv }
      )
    })
    router.put('/conversation-write/:id_conv', (req, res) => {
      conversationModel.updateConversationOnWrite(
        function(err, result) {
          if (err) return res.status(500).send(err)
          res.status(200).send(result)
        },
        { from_user: req.body.from_user, id_conv: req.params.id_conv }
      )
    })
    return router
  }
})()
