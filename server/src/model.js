/* jslint node: true */

'use strict';

const Utterance = require('./models/utterance.model');
const Dialogue = require('./models/dialogue.model');
const db = require('./database');
const queries = require('./queries');

// Will be initialized in the exports.init function
exports.io = undefined;

/**
 * Initialize the model
 * @param { { io: SocketIO.Server} } config - The configurations needed to initialize the model.
 * @returns {void}
 */
exports.init = ({ io }) => {
  exports.io = io;
};

/**
 * Creates a user with the given id.
 * @param {String} userID - The id of the user.
 * @param {int} admin - flag that indicates if the user is an admin or not.
 * @returns {void}
 */
exports.addUser = (userID, admin) => {
  db.query(queries.addUser, [userID, admin], (err) => {
    if (err) { throw new Error(err); }
  });
};

/**
* Returns the user object with the given id.
* @param {String} userID - The id of the user.
* @returns {User}
*/
exports.findUser = (userID) => new Promise((resolve, reject) => {
  if (userID == null) { return resolve(undefined); }
  db.query(queries.findUser, userID, (err, result) => {
    if (err) { reject(err); } else { resolve(result[0]); }
  });
});

exports.getUsers = () => new Promise((resolve, reject) => {
  db.query(queries.getUsers, (err, result) => {
    if (err) { reject(err); } else { resolve(result); }
  });
});

exports.addUserUtterance = (uttr, userID, responseTo) => new Promise((resolve, reject) => {
  // TODO: should this really be a promise?
  db.query(queries.addUserUtterance, [uttr, userID, responseTo], (err) => {
    if (err) { reject(err) } else { resolve(); }
  });
});

exports.getUserUtterances = () => new Promise((resolve, reject) => {
  const utterances = {};
  db.query(queries.getUserUtterances, (err, rows) => {
    if (err) { reject(err); }

    const bar = new Promise((resolve) => {
      rows.forEach((item) => {
        const utterance = new Utterance(
          item.uttrID, item.userID, item.responseTo, item.uttr, item.botAnswer, item.votes, item.score
        );
        utterances[item.uttrID] = utterance;
      });
      resolve();
    });

    return bar.then(() => {
      resolve(utterances);
    });
  })
});

/**
* Returns the user object with the given id.
* @returns {Dialogue[]}
*/
exports.getDialogues = () => new Promise((resolve, reject) => {
  const dialogues = [];
});

function constructDialogue(dialogue, utterance) {
  if (utterance.responseTo != null) {
    db.query(queries.getUtterance, utterance.responseTo, (err, result) => {
      if (err) { reject(err); }
      if (result.length > 0) {
        result = result[0];
        newUtterance = new Utterance(
          result.uttrID, result.userID, result.responseTo, result.uttr, result.botAnswer
        );
        dialogue = constructDialogue(dialogue, newUtterance);
      }
    });
  }

  dialogue.addUtterance(utterance);
  return dialogue;
}

exports.getDialogueForJudgement = (userID) => new Promise((resolve, reject) => {
  var dialogue = new Dialogue();

  db.query(queries.getUtteranceForJudgement, userID, (err, result) => {
    if (err) { reject(err); }
    if (result.length > 0) {
      result = result[0];
      const utterance = new Utterance(
        result.uttrID, result.userID, result.responseTo, result.uttr, result.botAnswer
      );
      dialogue = constructDialogue(dialogue, utterance);
      // console.debug('Finished with scary code');
      // console.debug(dialogue.utterances);
      resolve(dialogue);
    }
    else {
      resolve(null);  // no utterance available to judge.
    }
  });
});


exports.addJudgement = (uttrID, userID, score) => {
  db.query(queries.addJudgement, [uttrID, userID, score], (err) => {
    if (err) { throw err; }
    console.debug('added judgement');
  });
}
