var mysql      = require('mysql');

var con = mysql.createConnection({
  host     : 'us-cdbr-iron-east-05.cleardb.net',
  user     : 'b912905bc8ad2c',
  password : '1a5c658a',
  database : 'heroku_1549d99746341be'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

const express = require('express')
const app = express();

app.get('/', (req, res) => {
    res.send('CS 3200: Cocktails Database')
});

app.listen(process.env.PORT || 8000, () => {
    console.log('Example app listening on port 8000!')
});