/* jslint node: true */

'use strict';

const express = require('express');
const model = require('../model.js');

const router = express.Router();

router.post('/submitUtterance', (req, res) => {
  var utterance = req.body.utterance;
  console.debug(utterance);

  // do some checks on the input
  if (utterance == 'testUttr') {
    res.status(422).send('You entered the magical test utterance input. Error.');
    return;
  }

  model.addUserUtterance(utterance, req.session.userID, req.body.responseTo, req.body.type);

  res.status(201).send('The utterance was successfully submitted!');
});

router.post('/passJudgement', (req, res) => {
  model.addJudgement(req.body.uttrID, req.session.userID, req.body.score);
  res.sendStatus(201);
});

router.get('/getUtteranceForJudgement', (req, res) => {
  model.getUtteranceForJudgement(req.session.userID)
    .then((uttr) => {
      res.status(200).json({ utterance: uttr});
    })
    .catch((err) => {
      throw err;
    });
});

module.exports = { router };
