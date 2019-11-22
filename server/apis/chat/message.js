module.exports = (function messageAPI() {
  const express = require('express')
  const router = express.Router()

  return function messageRouter(db) {
    const messageModel = require('../../models/chat/messageModel')(
      db.connection
    )

    router.get('/message/:id_conversation', (req, res) => {
      messageModel.getAllMessages(function(err, result) {
        if (err) return res.status(500).send(err)
        res.status(200).send(result)
      }, req.params.id_conversation)
    })
    router.get('/lastMessage/:id_conversation', (req, res) => {
      messageModel.getLastMessage(function(err, result) {
        if (err) return res.status(500).send(err)
        res.status(200).send(result)
      }, req.params.id_conversation)
    })

    router.post('/message', (req, res) => {
      messageModel.sendMessage(function(err, result) {
        if (err) return res.status(500).send(err)
        res.status(200).send(result)
      }, req.body)
    })

    return router
  }
})()
