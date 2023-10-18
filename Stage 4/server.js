const express = require("express");
var mysql = require('mysql2');
var path = require('path');
var bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.get("/", function (req, res) {
        res.render('index', {data: '', command: ''});
});

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

var connection = mysql.createConnection({
    host: '34.132.54.240', // sql server ip
    user: 'root',
    password: '123',
    database: '411project'
  });

console.log("trying to connect to GCP ...")
connection.connect(function(err) {
  if (err) {
    console.error("Error:\n"+err.stack);
    return;
  }
  console.log("connected as id"+connection.threadId);
});

app.post('/search', function(req, res) {
  var tableName = req.body.idSearchBar; // Get the name of the table from the request body
  var sql = `SELECT * FROM ${tableName}`; // Use the name of the table in the query
  console.log(sql);

  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
        res.render('index', { data: result, command: sql });
  });
});
app.post('/aq1', function(req, res) {
  // var tableName = req.body.idAq1Bar; // Get the name of the table from the request body
  var sql = `SELECT loc.AreaName, COUNT(loc.LocationID) FROM Crime c JOIN Location loc ON c.LocationID = loc.locationID WHERE c.Time < 0600 GROUP BY loc.AreaName;`; // Use the name of the table in the query
  console.log(sql);

  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
res.render('index', { command: sql, data: '' });
  });
});
app.post('/aq2', function(req, res) {
  // var tableName = req.body.idAq2Bar; // Get the name of the table from the request body
  var sql = `SELECT * FROM (SELECT CrimeID, Time FROM Crime c NATURAL JOIN Location loc WHERE AreaName = "Central" UNION SELECT CrimeID, Time FROM Crime c NATURAL JOIN Victim v WHERE Sex = "F" ) as tab ORDER BY CrimeID;`; // Use the name of>
  console.log(sql);

  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
       // res.render('index', { command: sql });
res.render('index', { command: sql, data: '' });
  });
});
app.post('/add', function(req, res) {
  var tableName = req.body.idAddBar; // Get the name of the table from the request body
  var sql = `INSERT INTO ${tableName} VALUES (DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT);`;
  console.log(sql);

  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
        // res.render('index', { command: sql });
res.render('index', { command: sql, data: '' });
  });
});
app.post('/update', function(req, res) {
  var tableName = req.body.idUpdateBar; // Get the name of the table from the request body
  var sql = `UPDATE ${tableName} SET Time=0000 WHERE CrimeID < 3;`;
  console.log(sql);

  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
        // res.render('index', { command: sql });
res.render('index', { command: sql, data: '' });
  });
});
app.post('/remove', function(req, res) {
  var tableName = req.body.idRemoveBar; // Get the name of the table from the request body
  var sql = `DELETE FROM ${tableName} LIMIT 1`; // Use the name of the table in the query
  console.log(sql);

  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
        res.render('index', { command: sql, data: '' });
  });
});
const server = app.listen(80, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log("Server is running on " + host + ":" + port);
});
