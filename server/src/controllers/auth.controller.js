/* jslint node: true */

'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const model = require('../model.js');

const saltRounds = 10;

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
        username: maybeUser !== undefined ? maybeUser.name : 'N/A',
      });
    })
    .catch((err) => {
      throw (err);
    });
});

/**
 * Attempts to authenticate the user-session
 * @param {String} req.body.username - The username of the user attempting to authenticate
 * @param {String} req.body.password - The password of the user attempting to authenticate
 * @param {String} req.session.userID - A string that uniquely identifies the given user.
 * @returns {void}
 */
router.post('/authenticate', (req, res) => {
  model.findUser(req.body.username)
    .then((user) => {
      if (user) {
        bcrypt.compare(req.body.password, user.hash, (err, result) => {
          if (result === true) {
            req.session.userID = req.body.username;
            req.session.save((error) => {
              if (error) console.error(error);
              else console.debug(`Saved userID: ${req.session.userID}`);
            });
            res.sendStatus(200);
          } else { res.status(401).send(`Incorrect password ${req.body.password}.`); }
        });
      } else { res.status(401).send(`No existing assistant with name ${req.body.username}.`); }
    })
    .catch((err) => {
      throw err;
    });
});


// TODO: Add 'create account' route.
// The 'authenticate' route is only supposed to check if the user can login.
router.post('/registerUser', (req, res) => {
  model.findUser(req.body.username)
    .then((maybeUser) => {
      if (maybeUser !== undefined) {
        console.debug(`Assistant with name ${req.body.username} already exists.`);
        res.sendStatus(400);
      } else {
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
          model.addUser(req.body.username, hash);
        });
        res.sendStatus(200);
      }
    })
    .catch((err) => {
      throw err;
    });
});

module.exports = { router, requireAuth };
