module.exports = (function eligibilityAPI() {
  const express = require('express');
  const router = express.Router();

  return function userRouter(db) {
    const eligibilityModel = require('./../../models/back-office/boEligibilityModel')(
      db.connection
    );

    /********************************************************************************/
    /**************************** ELIGIBILITY QUESTION ******************************/
    /********************************************************************************/

    // post a new eligibility question
    router.post('/elig_question', (req, res) => {
      eligibilityModel.createQuestion(function(err, result) {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
      }, req.body.question);
    });

    // get one eligibility question
    router.get('/elig_question/:id', (req, res) => {
      eligibilityModel.getOneQuestions(function(err, result) {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
      }, req.params.id);
    });

    // patch one eligibility question
    router.put('/elig_question/:id', (req, res) => {
      eligibilityModel.updateQuestion(
        function(err, result) {
          if (err) return res.status(500).send(err);
          res.status(200).send(result);
        },
        {
          question: req.body.question,
          id: req.params.id
        }
      );
    });

    // delete one eligibility question
    router.delete('/elig_question/:id', (req, res) => {
      eligibilityModel.deleteQuestion(function(err, result) {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
      }, req.params.id);
    });

    /********************************************************************************/
    /**************************** ELIGIBILITY ANSWER ********************************/
    /********************************************************************************/

    // checks if the page query is valid compared to the maxpage possible queryPage can't be > maxPages
    const checkPageQuery = function checkPageQuery(maxPage, queryPage) {
      if (queryPage < 0 || queryPage < 1 || queryPage > maxPage) {
        return 1;
      } else {
        return queryPage;
      }
    };

    // checks if the limit query is valid
    const checkLimitQuery = function checkLimitQuery(limit) {
      if (limit < 0 || limit > 100) {
        return (limit = 80);
      } else {
        return limit;
      }
    };

    // get all eligibility answers
    router.get('/elig_answer', (req, res) => {
      //check the limit query so it's not <0 and >100
      req.query.limit = checkLimitQuery(req.query.limit);
      //we get the max pages related to the limit
      eligibilityModel.getMaxPages(function(err, result) {
        if (err) {
          return res.status(500).send(err);
        } else {
          var maxPages = Math.round(result[0].maxPages);
          req.query.page = checkPageQuery(maxPages, req.query.page);

          eligibilityModel.getAllAnswers(function(err, result) {
            if (err) return res.status(500).send(err);
            res.status(200).send(result);
          }, req.query);
        }
      }, req.query.limit);
    });
    return router;
  };
})();
