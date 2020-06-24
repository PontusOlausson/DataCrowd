exports.addUser = 'INSERT INTO users (userID, admin) VALUES (?, ?)';
exports.findUser = 'SELECT * FROM users WHERE userID = ? LIMIT 1';
exports.getUsers = 'SELECT * FROM users';
exports.addUserUtterance = 'INSERT INTO userUtterances \
 (uttr, userID, responseTo) VALUES (?, ?, ?)';
exports.getUserUtterances = 'SELECT userUtterances.*, \
 COUNT(judgements.uttrID) as j_count, \
 AVG(judgements.score) as score \
 FROM userUtterances \
 LEFT OUTER JOIN judgements ON userUtterances.uttrID = judgements.uttrID \
 GROUP BY userUtterances.uttrID \
 ORDER BY userUtterances.uttrID';
exports.getUtteranceForJudgement = 'SELECT * \
 FROM userUtterances \
 LEFT OUTER JOIN (SELECT uttrID FROM judgements WHERE userID = ?) AS j ON userUtterances.uttrID = j.uttrID \
 WHERE j.uttrID IS NULL \
 LIMIT 1';
exports.addJudgement = 'INSERT INTO judgements (uttrID, userID, score) VALUES (?, ?, ?)';
exports.getUtterance = 'SELECT * FROM userUtterances WHERE uttrID = ? LIMIT 1';
