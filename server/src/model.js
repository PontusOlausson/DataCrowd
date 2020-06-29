/* jslint node: true */

'use strict';

const Utterance = require('./models/utterance.model');
const Dialogue = require('./models/dialogue.model');
const db = require('./database');
const queries = require('./queries');

const votesCutOff = 3;
const successRatio = 0.6;

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

exports.getTemplates = () => new Promise((resolve, reject) => {
  db.query(queries.getTemplates, (err, result) => {
    if (err) { reject(err); } else { resolve(result); }
  });
});

exports.addUserUtterance = (uttr, userID, responseTo) => new Promise((resolve, reject) => {
  // TODO: should this really be a promise?
  db.query(queries.addUserUtterance, [uttr, userID, responseTo], (err) => {
    if (err) { reject(err); } else { resolve(); }
  });
});

exports.getUserUtterances = () => new Promise((resolve, reject) => {
  const utterances = {};
  db.query(queries.getUserUtterances, (err, rows) => {
    if (err) { reject(err); }

    const bar = new Promise((resolve) => {
      rows.forEach((item) => {
        const utterance = new Utterance(
          item.uttrID, item.userID, item.responseTo, item.uttr,
          item.systemResponse, item.systemResponseText, item.votes, item.score,
        );
        utterances[item.uttrID] = utterance;
      });
      resolve();
    });

    return bar.then(() => {
      resolve(utterances);
    });
  });
});

const getUtterance = (uttrID) => new Promise((resolve, reject) => {
  db.query(queries.getUtterance, uttrID, (err, result) => {
    if (err) { return reject(err); } else {
      const uttr = result[0];
      const utterance = new Utterance(
        uttr.uttrID, uttr.userID, uttr.responseTo,
        uttr.uttr, uttr.systemResponse, uttr.systemResponseText,
      );
      resolve(utterance);
    }
  });
});

const constructDialogue = (dialogue, uttrID) =>
  getUtterance(uttrID)
    .then((utterance) => {
      if(utterance.responseTo) {
        return constructDialogue(dialogue, utterance.responseTo)
          .then((nextDialogue) => {
            nextDialogue.addUtterance(utterance);
            return nextDialogue;
          });
      } else {
        dialogue.addUtterance(utterance);
        return dialogue;
      }
    })
    .catch((err) => {
      throw err;
    });


exports.getDialogueForJudgement = (userID) => new Promise((resolve, reject) => {
  const dialogue = new Dialogue();

  db.query(queries.getUtteranceForJudgement, [3, userID], (err, result) => {
    if (err) { return reject(err); }
    if (result.length > 0) {
      constructDialogue(new Dialogue(), result[0].uttrID)
        .then((dialogue) => resolve(dialogue));
    } else {
      resolve(null); // no utterance available to judge.
    }
  });
});

exports.getDialogueForSystemResponse = (userID) => new Promise((resolve, reject) => {
  const dialogue = new Dialogue();

  db.query(queries.getUtteranceForSystemResponse, [3, 0.6, userID], (err, result) => {
    if (err) { return reject(err); }
    if (result.length > 0) {
      constructDialogue(new Dialogue(), result[0].uttrID)
        .then((dialogue) => resolve(dialogue));
    } else {
      resolve(null); // no utterance available to judge.
    }
  });
});

exports.addJudgement = (uttrID, userID, score) => {
  db.query(queries.addJudgement, [uttrID, userID, score], (err) => {
    if (err) { throw err; }
  });
};

exports.addSystemResponse = (templateID, uttrID, userID) => {
  db.query(queries.addSystemResponse, [templateID, uttrID, userID], (err) => {
    if (err) { throw err; }
  });
};

exports.updateSystemResponsToUtterance = (uttrID) => {
  db.query(queries.getSystemResponsesRanked, [uttrID, 2], (err, result) => {
    if (err) { throw err; }
    if (result.length > 0) {
      db.query(queries.updateSystemResponse, [result[0].templateID, uttrID], (err) => {
        if (err) { throw err; }
      });
    }
  });
};

exports.getDialogueForUserResponse = (userID) => new Promise((resolve, reject) => {
  // TODO: in the future, the utterance being responded to should be reserved.

  db.query(queries.getUtteranceForUserResponse,
    [userID, votesCutOff, votesCutOff, successRatio], (err, result) => {
      if (err) { return reject(err); }
      if (result.length > 0) {
        constructDialogue(new Dialogue(), result[0].uttrID)
          .then((dialogue) => resolve(dialogue));
      } else {
        resolve(null);
      }
    });
});

exports.getFinishedDialogues = () => new Promise((resolve, reject) => {
  var promises = [];

  db.query(queries.getFinishedUtterances, (err, result) => {
    if (err) { return reject(err); }

    for (var i = 0; i < result.length; i++) {
      promises.push(
        constructDialogue(new Dialogue(), result[i].uttrID)
      );
    }

    Promise.all(promises)
      .then((dialogues) => { resolve(dialogues); })
      .catch((err) => { reject(err); });
  });
});
