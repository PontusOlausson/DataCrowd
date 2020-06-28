/* jslint node: true */

'use strict';

/**
 * @class Dialogue
 */
class Dialogue {
  constructor() {
    this.utterances = [];
    this.isFinished = false;
  }

  /**
  * @param {utterance} - the new utterance to add to the dialogue.
  */
  addUtterance(utterance) {
    // TODO: check if the new utterance is a response to the previously last utterance.
    this.utterances.push(utterance);
  }
}

module.exports = Dialogue;
