/* eslint no-multi-str: off */

exports.addUser = 'INSERT INTO users (userID, admin) VALUES (?, ?)';
exports.findUser = 'SELECT * FROM users WHERE userID = ? LIMIT 1';
exports.getUsers = 'SELECT * FROM users';
exports.getTemplates = 'SELECT * FROM templates';
exports.addUserUtterance = 'INSERT INTO userUtterances \
  (uttr, userID, responseTo) VALUES (?, ?, ?)';
exports.getUserUtterances = 'SELECT userUtterances.*, \
  COUNT(judgements.uttrID) as votes, \
  AVG(judgements.score) as score \
  FROM userUtterances \
  LEFT OUTER JOIN judgements ON userUtterances.uttrID = judgements.uttrID \
  GROUP BY userUtterances.uttrID';
exports.getUtteranceForJudgement = 'SELECT u.* \
  FROM \
  ( \
    SELECT userUtterances.*, COUNT(judgements.uttrID) AS votes, AVG(judgements.score) AS score, template AS systemResponseText \
    FROM userUtterances LEFT OUTER JOIN judgements \
    ON userUtterances.uttrID = judgements.uttrID \
    LEFT OUTER JOIN templates \
    ON userUtterances.systemResponse = templates.templateID \
    WHERE userUtterances.userID != ? AND userUtterances.systemResponse IS NULL \
    GROUP BY userUtterances.uttrID \
    HAVING votes < ? \
  ) AS u \
  LEFT OUTER JOIN \
  ( \
    SELECT uttrID FROM judgements WHERE userID = ? \
  ) AS j \
  ON u.uttrID = j.uttrID \
  WHERE j.uttrID IS NULL';
exports.getUtteranceForSystemResponse = 'SELECT u.* \
  FROM \
  ( \
    SELECT userUtterances.*, COUNT(judgements.uttrID) AS votes, AVG(judgements.score) AS score, template AS systemResponseText \
    FROM userUtterances LEFT OUTER JOIN judgements \
    ON userUtterances.uttrID = judgements.uttrID \
    LEFT OUTER JOIN templates \
    ON userUtterances.systemResponse = templates.templateID \
    WHERE userUtterances.systemResponse IS NULL \
    GROUP BY userUtterances.uttrID \
HAVING votes >= ? AND score >= ? \
  ) AS u \
  LEFT OUTER JOIN \
  ( \
    SELECT uttrID FROM systemResponses WHERE userID = ? \
  ) AS s \
  ON u.uttrID = s.uttrID \
  WHERE s.uttrID IS NULL \
  LIMIT 1';
exports.addJudgement = 'INSERT INTO judgements (uttrID, userID, score) VALUES (?, ?, ?)';
exports.getUtterance = 'SELECT userUtterances.*, template AS systemResponseText \
  FROM userUtterances \
  LEFT OUTER JOIN templates \
  ON userUtterances.systemResponse = templates.templateID \
  WHERE userUtterances.uttrID = ?';
exports.getFinishedUtterances = 'SELECT * FROM userUtterances WHERE systemResponse = 1';
exports.addSystemResponse = 'INSERT INTO systemResponses (templateID, uttrID, userID) VALUES (?, ?, ?)';
exports.getSystemResponsesRanked = 'SELECT templateID, COUNT(templateID) AS votes \
  FROM systemResponses \
  WHERE uttrID = ? \
  GROUP BY templateID \
  HAVING votes >= ? \
  ORDER BY votes DESC';
exports.updateSystemResponse = 'UPDATE userUtterances SET systemResponse = ? WHERE (uttrID = ?)';
exports.getUtteranceForUserResponse = 'SELECT u.* \
  FROM \
  ( \
    SELECT userUtterances.*, template AS systemResponseText \
    FROM userUtterances \
    LEFT OUTER JOIN templates \
    ON userUtterances.systemResponse = templates.templateID \
    WHERE systemResponse IS NOT NULL \
    AND systemResponse != 1 AND systemResponse != 2 \
  ) AS u \
  LEFT OUTER JOIN \
  ( \
    SELECT responseTo FROM userUtterances WHERE userID = ? \
  ) AS r1 \
  ON u.uttrID = r1.responseTo \
  LEFT OUTER JOIN \
  ( \
    SELECT userUtterances.responseTo, \
    COUNT(judgements.uttrID) as votes, \
    AVG(judgements.score) as score \
    FROM userUtterances \
    LEFT OUTER JOIN judgements ON userUtterances.uttrID = judgements.uttrID \
    GROUP BY userUtterances.uttrID \
    HAVING votes < ? \
  ) as r2 \
  ON u.uttrID = r2.responseTo \
  LEFT OUTER JOIN \
  ( \
    SELECT userUtterances.responseTo, \
    COUNT(judgements.uttrID) as votes, \
    AVG(judgements.score) as score \
    FROM userUtterances \
    LEFT OUTER JOIN judgements ON userUtterances.uttrID = judgements.uttrID \
    GROUP BY userUtterances.uttrID \
    HAVING votes >= ? AND score > ? \
  ) AS r3 \
  ON u.uttrID = r3.responseTo \
  WHERE r1.responseTo IS NULL AND r2.responseTo IS NULL AND r3.responseTo IS NULL';
