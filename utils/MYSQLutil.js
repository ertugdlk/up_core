const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '213.243.44.6',
    user: 'get5',
    database: 'get5',
    password: 'jazz3dtr',
    port: 3306
});
connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});

connection.end();