/* jslint node: true */

'use strict';

const Utterance = require('./models/utterance.model');
const db = require('./database');

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
 * @param {String} id - The id of the user.
 * @param {int} admin - flag that indicates if the user is an admin or not.
 * @returns {void}
 */
exports.addUser = (id, admin) => {
  const statement = db.prepare('INSERT INTO users (id, admin) VALUES (?, ?)');
  statement.run(id, admin, (err) => {
    if (err) { throw new Error(err); }
  });
  statement.finalize();
};

/**
* Returns the user object with the given id.
* @param {String} id - The id of the user.
* @returns {User}
*/
exports.findUser = (id) => new Promise((resolve, reject) => {
  const statement = db.prepare('SELECT * FROM users WHERE (id) = (?)');
  statement.get(id, (err, result) => {
    if (err) { reject(new Error(err)); } else { resolve(result); }
  });
});

exports.getUsers = (id) => new Promise((resolve, reject) => {
  const statement = db.prepare('SELECT * FROM users');
  statement.get(id, (err, result) => {
    if (err) { reject(new Error(err)); } else { resolve(result); }
  });
});

exports.addUserUtterance = (uttr, userID, responseTo, type) => new Promise((resolve, reject) => {
  const statement = db.prepare('INSERT INTO userUtterances \
   (uttr, userID, responseTo, type) VALUES (?, ?, ?, ?)');
  statement.run(uttr, userID, responseTo, type, (err) => {
    if (err) { throw new Error(err); }
  });
});

exports.getUserUtterances = () => new Promise((resolve, reject) => {
  const utterances = {};
  db.all('SELECT userUtterances.*, \
   COUNT(judgements.uttrID) as j_count, \
   AVG(judgements.score) as score \
   FROM userUtterances \
   LEFT OUTER JOIN judgements ON userUtterances.id = judgements.uttrID \
   GROUP BY userUtterances.id \
   ORDER BY userUtterances.id', (err, rows) => {
    if (err) { reject(err); }

    const bar = new Promise((resolve) => {
      rows.forEach((item) => {
        const utterance = new Utterance(
          item.id, item.userID, item.responseTo, item.type, item.uttr, item.botAnswer, item.j_count, item.score
        );
        utterances[item.id] = utterance;
      });
      resolve();
    });

    return bar.then(() => {
      resolve(utterances);
    });
  });
});

/**
* Returns an utterance not previously judged by the user.
* @param {String} userID - The id of the user.
* @returns {User}
*/
exports.getUtteranceForJudgement = (userID) => new Promise((resolve, reject) => {
  const statement = db.prepare('SELECT * \
  FROM userUtterances \
  LEFT OUTER JOIN (SELECT uttrID FROM judgements WHERE userID = (?)) AS j ON userUtterances.id = j.uttrID \
  WHERE j.uttrID IS NULL');

  statement.get(userID, (err, item) => {
    if (err) { reject(err); }
    if (item) {
      const utterance = new Utterance(
        item.id, item.userID, item.responseTo, item.type, item.uttr, item.botAnswer, null, null
      );
      resolve(utterance);
    }
    else {
      resolve(null);  // no utterance available to judge.
    }
  });
  statement.finalize();
});


exports.addJudgement = (uttrID, userID, score) => {
  const statement = db.prepare('INSERT INTO judgements (uttrID, userID, score) VALUES (?, ?, ?)');
  statement.run(uttrID, userID, score, (err) => {
    if (err) { throw err; }
    console.debug('added judgement');
  });
  statement.finalize();
}
