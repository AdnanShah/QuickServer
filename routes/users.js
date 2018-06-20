var express = require("express");
var router = express.Router();
var mysql = require("../config/database.js");

var express = require("express");
var router = express.Router();
// var mysql = require("../config");
var async = require("async");
const Promise = require("bluebird");
const nodemailer = require("nodemailer");

router.post("/register", (req, res) => {
  req.checkBody("name").notEmpty();
  req.checkBody("email").notEmpty();
  req.checkBody("number").notEmpty();
  req.checkBody("reason").notEmpty();
  req.checkBody("details").notEmpty();
  req.getValidationResult().then(error => {
    if (!error.isEmpty()) {
      res.json({
        status: 403,
        message: "ServerMandatoryParameterMissing",
        error: error
      });
    } else {
      let data = {
        name: req.body.name,
        number: req.body.number,
        reason: req.body.reason,
        details: req.body.details,
        email: req.body.email
      };
      // if (req.body.category_id == "" || req.body.category_id == null) {
      //   data.category_id = null;
      // } else {
      //   data.category_id = req.body.category_id;
      // }
      // const saltRounds = 10;
      // //https://www.npmjs.com/package/bcrypt
      // bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      // data.password = hash;
      // console.log(data.password);
      const selectQry =
        "select email from users" + ' where email = "' + req.body.email + '" ';
      const insertQry = `insert into users set ?`;
      Promise.using(mysql.getSqlConn(), conn => {
        conn
          .query(selectQry)
          .then(rows => {
            if (rows.length > 0) {
              res.json({ status: 403, message: "EmailAlreadyExists" });
            } else {
              conn.query(insertQry, data).then(user => {
                var smtpTrans = nodemailer.createTransport({
                  service: "Gmail",
                  auth: {
                    user: "adnanshah9911@gmail.com",
                    pass: "52193610shah"
                  }
                });
                var mailOptions = {
                  to: req.body.email,
                  from: "lookmeuplmu@gmail.com",
                  subject: "Look Me Up Activation Code",
                  text: "your data is => " + JSON.stringify(data) + "\n\n"
                };
                smtpTrans
                  .sendMail(mailOptions)
                  .then(() => {
                    res.json({
                      status: 200,
                      message: "User Registered And Email Sent Successfully"
                    });
                  })
                  .catch(err => {
                    res.json({
                      status: 401,
                      message: "Email not sent",
                      Error: err
                    });
                  });
              });
            }
          })
          .catch(err => {
            res.json({ status: 500, error: "QueryError" + err });
          });
      });
      // }); // hash
    }
  }); // getValidationResult
});

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
