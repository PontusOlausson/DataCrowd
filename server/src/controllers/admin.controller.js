/* jslint node: true */

'use strict';

const express = require('express');
const model = require('../model.js');

const router = express.Router();

/**
 * Attempts to register a new user.
 * @param {String} req.body.userID - A string that uniquely identifies the new user.
 * @returns {void}
 */
router.post('/registerUser', (req, res) => {
  model.findUser(req.body.userID)
    .then((maybeUser) => {
      if (maybeUser !== undefined) {
        res.status(400).send(`Assistant with name ${req.body.userID} already exists.`);
      } else {
        model.addUser(req.body.userID, 0);
        res.sendStatus(200);
      }
    })
    .catch((err) => {
      throw err;
    });
});

/**
 * Fetch the list of users.
 * @returns {void}
 */
router.get('/getUsers', (req, res) => {
  model.getUsers()
    .then((result) => {
      res.status(200).json({ users: result, });
    })
    .catch((err) => {
      throw err;
    });
});

/**
 * Fetch the list of user utterances.
 * @returns {void}
 */
router.get('/getUserUtterances', (req, res) => {
  model.getUserUtterances()
    .then((result) => {
      res.status(200).json({ userUtterances: result, });
    })
    .catch((err) => {
      throw err;
    });
});

module.exports = { router };
