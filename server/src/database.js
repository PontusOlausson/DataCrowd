var mysql = require('mysql');

let connection = mysql.createConnection({
  host: '35.228.147.168',
  user: 'TestUser',
  password: 'securePassword',
  database: 'dialogdata_db'
});

connection.connect((err) => {
  if (err) { throw err; }
  console.log('Connected to MySQL database!');
});

module.exports = connection;
