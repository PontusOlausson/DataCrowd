/* jslint node: true */

'use strict';

const express = require('express');
const model = require('../model.js');

const router = express.Router();


/**
 * Fetch the list of users.
 * @returns {void}
 */
router.get('/getUsers', (req, res) => {
  model.getUsers()
    .then((result) => {
      res.status(200).json({ users: result });
    })
    .catch((err) => {
      throw err;
    });
});

router.get('/getFinishedDialogues', (req, res) => {
  model.getFinishedDialogues()
    .then((dialogues) => {
      res.status(200).json({ dialogues });
    })
    .catch((err) => {
      throw err;
    });
});

module.exports = { router };
