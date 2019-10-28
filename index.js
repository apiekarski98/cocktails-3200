
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root"
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
