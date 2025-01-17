/* jslint node: true */

'use strict';

const express = require('express');
const model = require('../model.js');

const router = express.Router();

/**
 * requireAuth is an endpoint guard for logged in users.
 * aka: A middle ware used to limit access to an endpoint to authenticated users
 * @param {Request} req
 * @param {String} req.session.userID - A string that uniquely identifies the given user.
 * @param {Response} res
 * @param {Function} next
 * @returns {void}
 */
const requireAuth = (req, res, next) => {
  model.findUser(req.session.userID)
    .then((maybeUser) => {
      // "auth" check
      if (maybeUser === undefined) {
        res.status(401).send('Unauthorized. Please make sure you are logged in before attempting this action again.');
        return;
      }

      next();
    })
    .catch((err) => {
      throw (err);
    });
};

const requireAdmin = (req, res, next) => {
  model.findUser(req.session.userID)
    .then((maybeUser) => {
      // "auth" check
      if (maybeUser === undefined) {
        res.status(401).send('Unauthorized. Please make sure you are logged in before attempting this action again.');
        return;
      } if (maybeUser.admin !== 1) {
        res.status(401).send('Unauthorized. Please make sure you are logged in as admin before attempting this action again.');
        return;
      }

      next();
    })
    .catch((err) => {
      throw (err);
    });
};

/**
 * Tells the client if they are in an authenticated user-session.
 * @param {String} req.session.userID - A string that uniquely identifies the given user.
 * @returns {void}
 */
router.get('/isAuthenticated', (req, res) => {
  model.findUser(req.session.userID)
    .then((maybeUser) => {
      res.status(200).json({
        isAuthenticated: maybeUser !== undefined,
        userID: maybeUser !== undefined ? maybeUser.id : 'N/A',
      });
    })
    .catch((err) => {
      throw (err);
    });
});

/**
 * Attempts to authenticate the user-session
 * @param {String} req.body.userID - The username of the user attempting to authenticate
 * @param {String} req.session.userID - A string that uniquely identifies the given user.
 * @returns {void}
 */
router.post('/authenticate', (req, res) => {
  model.findUser(req.body.userID)
    .then((user) => {
      if (user) {
        req.session.userID = req.body.userID;
        req.session.save((error) => {
          if (error) console.error(error);
          else console.debug(`Saved userID: ${req.session.userID}`);
        });
        res.sendStatus(200);
      } else { res.status(401).send(`No existing user with name ${req.body.userID}.`); }
    })
    .catch((err) => {
      throw err;
    });
});

/**
 * Attempts to register a new user.
 * @param {String} req.body.userID - A string that uniquely identifies the new user.
 * @returns {void}
 */
router.post('/registerUser', (req, res) => {
  if (req.body.userID.length <= 4) {
    return res.status(400).send(`Användarnamnet måste vara längre än 4 tecken.`);
  }
  model.findUser(req.body.userID)
    .then((maybeUser) => {
      if (maybeUser !== undefined) {
        res.status(400).send(`Användarnamnet ${req.body.userID} är redan upptaget.`);
      } else {
        model.addUser(req.body.userID, 0);
        res.status(201).send(`Användarnamnet ${req.body.userID} har skapats!`);
      }
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

module.exports = { router, requireAuth, requireAdmin };
