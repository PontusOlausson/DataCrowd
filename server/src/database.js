var mysql = require('mysql');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ilqwhJacce1',
  database: 'datacrowd'
});

connection.connect((err) => {
  if (err) { throw err; }
  console.log('Connected to MySQL database!');
})

module.exports = connection;
