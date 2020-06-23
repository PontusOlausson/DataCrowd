exports.addUser = 'INSERT INTO users (id, admin) VALUES (?, ?)';
exports.findUser = 'SELECT * FROM users WHERE id = ? LIMIT 1';
exports.getUsers = 'SELECT * FROM users';
exports.addUserUtterance = 'INSERT INTO userUtterances \
 (uttr, userID, responseTo, type) VALUES (?, ?, ?, ?)';
exports.getUserUtterances = 'SELECT userUtterances.*, \
 COUNT(judgements.uttrID) as j_count, \
 AVG(judgements.score) as score \
 FROM userUtterances \
 LEFT OUTER JOIN judgements ON userUtterances.id = judgements.uttrID \
 GROUP BY userUtterances.id \
 ORDER BY userUtterances.id';
exports.getUtteranceForJudgement = 'SELECT * \
 FROM userUtterances \
 LEFT OUTER JOIN (SELECT uttrID FROM judgements WHERE userID = ?) AS j ON userUtterances.id = j.uttrID \
 WHERE j.uttrID IS NULL \
 LIMIT 1';
exports.addJudgement = 'INSERT INTO judgements (uttrID, userID, score) VALUES (?, ?, ?)';
exports.getUtterance = 'SELECT * FROM userUtterances WHERE id = ? LIMIT 1'
