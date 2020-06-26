/* jslint node: true */

'use strict';

/**
 * @class Utterance
 */
class Utterance {
  constructor(uttrID, userID, responseTo, uttr, systemResponse = null, votes = null, score = null) {
    this.uttrID = uttrID;
    this.userID = userID;
    this.responseTo = responseTo;
    this.uttr = uttr;
    this.systemResponse = systemResponse;
    this.votes = votes
    this.score = score
  }
}

module.exports = Utterance;
