module.exports = (function eligibilityAPI() {
  const express = require('express')
  const router = express.Router()

  return function userRouter(db) {
    const blockedModel = require('../models/blockedModel')(db.connection)

    // block one user for 15 days
    router.post('/block_user/:id', (req, res) => {
      const date = new Date().getTime() + 60 * 60 * 24 * 1000 * 15
      blockedModel.blockUser(
        function(err, result) {
          if (err) return res.status(500).send(err)
          res.status(200).send(result)
        },
        { id: req.params.id, date }
      )
    })
    // checks if the user is blocked
    router.get('/block_user/:id', (req, res) => {
      blockedModel.isBlocked(function(err, result) {
        if (err) return res.status(500).send(err)
        res.status(200).send(result)
      }, req.params.id)
    })
    return router
  }
})()
