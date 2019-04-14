const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const msql = require("mysql");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const getQuotes = require("./getQuotes");
const cors = require("cors");

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chuck_norris"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

const app = express();

app.set("port", 1234);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../src")));

function authorizationMiddleware(req, res, next) {
  let token = req.body.token;
  if (!token) {
    res.json({ status: 401, data: "unauthorized" });
  } else {
    jwt.verify(token, "super-secret-secret", (error, decoded) => {
      if (error) {
        res.json({ status: 401, data: "unauthorized" });
      }

      if (!decoded) {
        res.json({ status: 500, data: "error with the token" });
      }

      if (decoded) {
        connection.query(
          "SELECT * FROM quotes WHERE username = " + decoded.username,
          (error, results, fields) => {
            console.log(results[0])
            if (results && results[0].username === decoded.username) {
              let quotesStringToArray;
              if (results[0].quotes.trim() !== '') {
                quotesStringToArray = results[0].quotes.split('|');
              }
              res.locals.user = {
                id: results[0].id,
                username: results[0].username,
                quotes: quotesStringToArray
              };
              next();
            } else {
              res.json({ status: 500, data: "invalid credentials" });
            }
          }
        );
      }
    });
  }
}

app.post("/api/login", async (req, res, next) => {
  console.log(`/api/login`, req.body);
  try {
    const body = req.body;

    connection.query("SELECT * FROM quotes WHERE username=" + body.username, (error, results, fields) => {
      let user = results[0];
      console.log(`login`, results, results[0]);

      if (error) {
        res.json({ status: 500, data: `error ${error}` });
      }

      if (!user) {
        res.json({ status: 401, data: "not authorized" });
      } else if (
        user.username === body.username &&
        user.password === body.password
      ) {
        const token = jwt.sign(
          { username: user.username },
          "super-secret-secret",
          { expiresIn: "720h" }
        );


        console.log(user);

        let quotesStringToArray;
        if (user.quotes.trim() !== '') {
          quotesStringToArray = user.quotes.split('|');
        }

        user = {
          ...user,
          quotes: quotesStringToArray
        }

        console.log(user)
        res.json({ status: 200, token, user });
      }
    });
  } catch (error) {
    console.log("An error occured saving the favoriate quotes", error);
    next(error);
  }
});

app.post("/api/auth", authorizationMiddleware, (req, res, next) => {
  try {
    const body = req.body;
    res.json({
      status: 200,
      data: res.locals.user,
    });
  } catch (error) {
    console.log("An error occured saving the favoriate quotes", error);
    next(error);
  }
});

app.post(
  "/api/saveFavoriteQuotes",
  authorizationMiddleware,
  (req, res, next) => {
    console.log(`saveFavoriteQuotes`);
    console.log(`escape quotes`, mysql.escape(req.body.quotes));
    try {
      connection.query(
        "SELECT * from quotes WHERE username =" + res.locals.user.username,
        (error, results, fields) => {
          let quotes = results[0].quotes;

          if (error) {
            return res.json({ status: 500, data: error });
          }

          // quotes is an empty string, so just set the quotes as the value in the quotes row.
          if (quotes.trim() === "") {
            let sql =
              "UPDATE quotes SET quotes = " +
              mysql.escape(req.body.quotes) +
              "WHERE username=" + res.locals.user.username;

            connection.query(sql, (error, results, fields) => {
              if (error) {
                console.log(`saveFavoriteQuotes error`, error);
                return res.json({ status: 500, data: error });
              }

              if (!results) {
                console.log('saveFavoriteQuotes !results', results);
                res.json({ status: 500, data: "no results" });
              } else {
                console.log("saveFavoriteQuotes results", results);
                let quotesStringToArray = results[0].quotes.split('|');
                let user = {
                  id: results[0].id,
                  username: results[0].username,
                  quotes: quotesStringToArray
                }
                res.json({ status: 200, data: user });
              }
            });
          } else {
            let sql =
              "UPDATE quotes SET quotes = " +
              mysql.escape((quotes += req.body.quotes)) +
              "WHERE username=" + res.locals.user.username;

            connection.query(sql, (error, results, fields) => {
              if (error) {
                console.log(`ERROR`, error);
                res.json({
                  status: 500,
                  data: error
                });
              }

              if (!results) {
                res.json({
                  status: 500,
                  data: "no results when inserting concatinated string"
                });
              }

              let quotesStringToArray = results[0].quotes.split('|');
              let user = {
                id: results[0].id,
                username: results[0].username,
                quotes: quotesStringToArray
              }
              res.json({
                status: 200,
                data: user
              });
            });
          }
        }
      );

      connection.end();
    } catch (error) {
      console.log("An error occured saving the favoriate quotes", error);
      next(error);
    }
  }
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).json({ data: "ERROR HANDLER" });
});

app.listen(app.get("port"), () => {
  console.log(`Listening on port: ${app.get("port")}`);
});

module.exports = app;
