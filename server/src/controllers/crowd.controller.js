/* jslint node: true */

'use strict';

const express = require('express');
const model = require('../model.js');

const router = express.Router();

router.post('/submitUtterance', (req, res) => {
  const { utterance } = req.body;
  console.debug(utterance);

  // do some checks on the input
  if (utterance === 'testUttr') {
    res.status(422).send('testUttr är en testkod för fel.');
    return;
  }

  // TODO:
  // Control the input:
  //    contains right entities
  //    unique (use hamming distance)
  // Control that the response is expected (someone else could already have responded)
  //    in that case, probably send a status code to communicate this

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
      res.status(200).json({ dialogue });
    })
    .catch((err) => {
      throw err;
    });
});

router.get('/getDialogueForSystemResponse', (req, res) => {
  model.getDialogueForSystemResponse(req.session.userID)
    .then((dialogue) => {
      res.status(200).json({ dialogue });
    })
    .catch((err) => {
      throw err;
    });
});

router.get('/getTemplates', (req, res) => {
  model.getTemplates()
    .then((templates) => {
      res.status(200).json({ templates });
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
  model.getDialogueForUserResponse(req.session.userID)
    .then((dialogue) => {
      res.status(200).json({ dialogue });
    })
    .catch((err) => {
      throw err;
    });
});

module.exports = { router };
