var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'b912905bc8ad2c',
    password: '1a5c658a',
    database: 'heroku_1549d99746341be',
    port: 3306
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

const express = require('express')
const app = express();

app.get('/', (req, res) => {
    con.query('DROP TABLE ingredient');
    con.query('CREATE TABLE ingredient (\n' +
        '    ingredient_id INT PRIMARY KEY,\n' +
        '    ingredient_name VARCHAR(30) NOT NULL\n' +
        ')');
    con.query('INSERT INTO ingredient (ingredient_id, ingredient_name) VALUES (1, \'rum\'), (2, \'gin\'), (3, \'tequila\'), (4, \'whiskey\'), (5, \'vodka\')');
    var query = con.query('SELECT ingredient_name FROM ingredient');
    res.send(query);
});

app.listen(process.env.PORT || 8000, () => {
    console.log('Example app listening on port 8000!')
});