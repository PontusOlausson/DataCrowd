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

  model.addUserUtterance(utterance, req.session.userID, req.body.responseTo);

  res.status(201).send('The utterance was successfully submitted!');
});

router.post('/passJudgement', (req, res) => {
  model.addJudgement(req.body.uttrID, req.session.userID, req.body.score);
  res.sendStatus(201);
});


router.get('/getDialogueForJudgement', (req, res) => {
  model.getDialogueForJudgement(req.session.userID)
    .then((dialogue) => {
      res.status(200).json({ dialogue: dialogue, });
    })
    .catch((err) => {
      throw err;
    });
});

router.get('/getDialogueForSystemResponse', (req, res) => {
  model.getDialogueForSystemResponse(req.session.userID)
    .then((dialogue) => {
      res.status(200).json({ dialogue: dialogue, });
    })
    .catch((err) => {
      throw err;
    });
});

router.get('/getTemplates', (req, res) => {
  model.getTemplates()
    .then((templates) => {
      res.status(200).json({ templates: templates, });
    })
    .catch((err) => {
      throw err;
    });
});

router.post('/addSystemResponse', (req, res) => {
  model.addSystemResponse(req.body.templateID, req.body.uttrID, req.session.userID);
  model.updateSystemResponsToUtterance(req.body.uttrID);
  res.sendStatus(201);
});

router.get('/getDialogueForUserResponse', (req, res) => {

});

module.exports = { router };
