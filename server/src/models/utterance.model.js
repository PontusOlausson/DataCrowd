/* jslint node: true */

'use strict';

/**
 * @class Utterance
 */
class Utterance {
  constructor(id, userID, responseTo, features, uttr = null, botAnswer = null, j_count, score) {
    this.id = id;
    this.userID = userID;
    this.responseTo = responseTo;
    this.features = features;
    this.uttr = uttr;
    this.botAnswer = botAnswer;
    this.j_count = j_count
    this.score = score
  }
}

module.exports = Utterance;
