module.exports = (function cedexAPI() {
  const express = require('express')
  const router = express.Router()

  return function userRouter(db) {
    const statusModel = require('../models/statusModel')(db.connection)

    // post user id and status to insert in base
    router.post('/status/:id', (req, res) => {
      const id = req.params.id
      const status = req.body.status
      console.log('api', id, status)
      statusModel.setStatus(
        function(err, result) {
          if (err) return res.status(500).send(err)
          res.status(200).send(result)
        },
        { id, status }
      )
    })
    return router
  }
})()
