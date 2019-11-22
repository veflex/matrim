module.exports = (function userAPI() {
  const express = require('express');
  const router = express.Router();

  return function userRouter(db) {
    const boUserModel = require('./../../models/back-office/boUserModel')(
      db.connection
    );
    // checks if the page query is valid compared to the maxpage possible queryPage can't be > maxPages
    const checkPageQuery = function checkPageQuery(maxPage, queryPage) {
      if (
        typeof queryPage !== 'number' ||
        queryPage < 0 ||
        queryPage < 1 ||
        queryPage > maxPage
      ) {
        return 1;
      } else {
        return queryPage;
      }
    };

    // checks if the limit query is valid
    const checkLimitQuery = function checkLimitQuery(limit) {
      if (typeof limit !== 'number' || limit < 0 || limit > 50) {
        return (limit = 20);
      } else {
        return limit;
      }
    };

    // get all the users formatted for the back office
    router.get('/bo-user', (req, res) => {
      req.query.limit = checkLimitQuery(Number(req.query.limit));
      boUserModel.getMaxPages(function(err, result) {
        if (err) {
          return res.status(500).send(err);
        } else {
          var maxPages = Math.ceil(result[0].maxPages);
          req.query.page = checkPageQuery(maxPages, Number(req.query.page));
          boUserModel.getAll(function(err, result) {
            if (err) return res.status(500).send(err);
            res.status(200).send({ users: result, maxPages });
          }, req.query);
        }
      }, req.query.limit);
    });

    router.get('/bo-user/:id', (req, res) => {
      boUserModel.getOneUser(function(err, result) {
        if (err) return res.status(500).send(err);
        res.status(200).send(result[0]);
      }, req.params.id);
    });

    return router;
  };
})();
