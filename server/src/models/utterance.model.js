/* jslint node: true */

'use strict';

/**
 * @class Utterance
 */
class Utterance {
  constructor(uttrID, userID, responseTo, uttr, botAnswer = null, votes = null, score = null) {
    this.uttrID = uttrID;
    this.userID = userID;
    this.responseTo = responseTo;
    this.uttr = uttr;
    this.botAnswer = botAnswer;
    this.votes = votes
    this.score = score
  }
}

module.exports = Utterance;
