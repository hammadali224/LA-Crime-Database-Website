const express = require("express");
var mysql = require('mysql2');
var path = require('path');
var bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.get("/about.ejs", function (req, res) {
   // Render the index page with the chart
    res.render('about');
});
app.get("/", function (req, res) {

   // Render the index page with the chart
    res.render('index', { data: null, command: null, chartData: null });
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
  var input = req.body.idSearchBar; // Get the name of the table from the request body
  var sql = `SELECT CrimeID, Time, Address, TypeName FROM Crime c NATURAL JOIN Location l NATURAL JOIN CrimeDesc cd WHERE l.AreaName = '${input}' ORDER BY CrimeID;`; // Use the name of the table in the query
  console.log(sql);

  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
	res.render('index', { data: result, command: sql, chartData: null });
  });
});
app.post('/show', function(req, res) {
  // var tableName = req.body.idAq1Bar; // Get the name of the table from the request body
  var areaname = req.body.idShowBar;
  var sql = `CALL GetCrimeInfo('${areaname}')`; // Use the name of the table in the query
  console.log(sql);

  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
        // res.render('index', { command: sql });
        res.render('index', { command: sql, data: result,  chartData: 8 });
  });
});
app.post('/aq1', function(req, res) {
  // var tableName = req.body.idAq1Bar; // Get the name of the table from the request body
  var sql = `SELECT AreaName, COUNT(LocationID) as Count FROM Crime NATURAL JOIN Location WHERE Time < 0600 GROUP BY AreaName;`; // Use the name of the table in the query
  console.log(sql);

  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
        // res.render('index', { command: sql });
	res.render('index', { command: sql, data: result,  chartData: null });
  });
});
app.post('/aq2', function(req, res) {
  // var tableName = req.body.idAq2Bar; // Get the name of the table from the request body
  var areaname = req.body.idAq2Bar;
  var sex = req.body.idAq2Bar2;
  var sql = `SELECT * FROM (SELECT CrimeID, Address, TypeName, Time FROM Crime c NATURAL JOIN Location loc NATURAL JOIN CrimeDesc WHERE AreaName = '${areaname}' UNION SELECT CrimeID, Address, TypeName, Time FROM Crime c NATURAL JOIN Victim NATURAL JOIN Location NATURAL JOIN CrimeDesc v WHERE Sex = '${sex}' ) as tab ORDER BY CrimeID;`; // Use the name of the table in the query
  console.log(sql);

  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
       // res.render('index', { command: sql });
res.render('index', { command: sql, data: result, chartData: null });
  });
});
app.post('/add', function(req, res) {
  var crimeid = req.body.idAddBar; // Get the name of the table from the request body
  var locid = req.body.idAddBar2;
  var time = req.body.idAddBar3;
  var sql = `INSERT INTO Crime VALUES (${crimeid}, ${locid}, DEFAULT, DEFAULT, ${time});`;
  console.log(sql);

  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
        // res.render('index', { command: sql });
res.render('index', { command: sql, data: null, chartData: null });
  });
});
app.post('/update', function(req, res) {
  var crimeid = req.body.idUpdateBar; // Get the name of the table from the request body
  var time = req.body.idUpdateBar2;
  var sql = `UPDATE Crime SET Time=${time} WHERE CrimeID = ${crimeid};`;
  console.log(sql);

  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
        // res.render('index', { command: sql });
res.render('index', { command: sql, data: null,chartData: null });
  });
});
app.post('/remove', function(req, res) {
  var tableName = req.body.idRemoveBar; // Get the name of the table from the request body
  var sql = `DELETE FROM Crime WHERE CrimeID=${tableName}`; // Use the name of the table in the query
  console.log(sql);

  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
        res.render('index', { command: sql, data: null, chartData: null });
  });
});
const server = app.listen(80, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log("Server is running on " + host + ":" + port);
});
