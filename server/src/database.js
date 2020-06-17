const path = require('path'); //  Helps resolve relative paths, into absolute baths, independent of operating system
const sqlite3 = require('sqlite3').verbose();

const databasePath = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(databasePath);

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users ( \
    id TEXT PRIMARY KEY \
  )');

  db.run('CREATE TABLE IF NOT EXISTS templates ( \
    template TEXT, \
    id INTEGER PRIMARY KEY AUTOINCREMENT \
  )');

  db.run('CREATE TABLE IF NOT EXISTS parameterType ( \
    type TEXT, id INTEGER PRIMARY KEY AUTOINCREMENT \
  )');

  db.run('CREATE TABLE IF NOT EXISTS userUtterances ( \
    uttr TEXT, \
    userID TEXT, \
    responseTo INTEGER, \
    type INTEGER, \
    botAnswer INTEGER, \
    id INTEGER PRIMARY KEY AUTOINCREMENT, \
    FOREIGN KEY (userID) REFERENCES users(id), \
    FOREIGN KEY (responseTo) REFERENCES userUtterances(id), \
    FOREIGN KEY (type) REFERENCES parameterTyoe(id), \
    FOREIGN KEY (botAnswer) REFERENCES template(id) \
  )');

  db.run('CREATE TABLE IF NOT EXISTS botUtterances ( \
    templateID INTEGER, \
    responseTo INTEGER, \
    userID TEXT, \
    id INTEGER PRIMARY KEY AUTOINCREMENT, \
    FOREIGN KEY (templateID) REFERENCES templates(id), \
    FOREIGN KEY (responseTo) REFERENCES userUtterances(id), \
    FOREIGN KEY (userID) REFERENCES users(id) \
  )');

  db.run('CREATE TABLE IF NOT EXISTS judgements ( \
    uttrID INTEGER, \
    userID TEXT, \
    score INTEGER, \
    FOREIGN KEY (uttrID) REFERENCES userUtterances(id), \
    FOREIGN KEY (userID) REFERENCES users(id) \
  )');
});

module.exports = db;
