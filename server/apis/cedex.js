module.exports = (function cedexAPI() {
  const express = require('express');
  const router = express.Router();

  return function userRouter(db) {
    const cedexModel = require('../models/cedexModel')(db.connection);

    // get 15 cedex thanks tu user input
    router.get('/cedex', (req, res) => {
      cedexModel.getCedexAutocomplete(function(err, result) {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
      }, req.query.cedex);
    });
    router.get('/cedex/:cedex', (req, res) => {
      cedexModel.getOneCedex(function(err, result) {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
      }, req.params.cedex);
    });
    return router;
  };
})();
