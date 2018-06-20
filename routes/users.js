var express = require("express");
var router = express.Router();
var mysql = require("../config/database.js");

var express = require("express");
var router = express.Router();
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
                    user: "your email here",
                    pass: "your password here"
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
    }
  });
});

router.post("/apply", (req, res) => {
  req.checkBody("artist").notEmpty();
  req.checkBody("f_name").notEmpty();
  req.checkBody("cnic").notEmpty();
  req.checkBody("date_of_birth").notEmpty();
  req.checkBody("age").notEmpty();
  req.checkBody("gender").notEmpty();
  req.checkBody("status").notEmpty();
  req.checkBody("height").notEmpty();
  req.checkBody("weight").notEmpty();
  req.checkBody("chest").notEmpty();
  req.checkBody("qualification").notEmpty();
  req.checkBody("institution").notEmpty();
  req.checkBody("contact").notEmpty();
  req.checkBody("whatsapp").notEmpty();
  req
    .checkBody("email")
    .notEmpty()
    .isEmail();
  req.checkBody("fb_ID").notEmpty();
  req.checkBody("address").notEmpty();
  req.checkBody("artist_cat").notEmpty();
  req.getValidationResult().then(error => {
    if (!error.isEmpty()) {
      res.json({
        status: 403,
        message: "ServerMandatoryParameterMissing",
        error: error
      });
    } else {
      let data = {
        artist: req.body.artist,
        f_name: req.body.f_name,
        cnic: req.body.cnic,
        date_of_birth: req.body.date_of_birth,
        age: req.body.age,
        gender: req.body.gender,
        status: req.body.status,
        height: req.body.height,
        weight: req.body.weight,
        chest: req.body.chest,
        qualification: req.body.qualification,
        institution: req.body.institution,
        contact: req.body.contact,
        whatsapp: req.body.whatsapp,
        email: req.body.email,
        fb_ID: req.body.fb_ID,
        address: req.body.address,
        artist_cat: req.body.artist_cat
      };
      const selectQry =
        "select email from apply" + ' where email = "' + req.body.email + '" ';
      const insertQry = `insert into apply set ?`;
      Promise.using(mysql.getSqlConn(), conn => {
        conn
          .query(selectQry)
          .then(rows => {
            if (rows.length > 0) {
              res.json({ status: 403, message: "EmailAlreadyExists" });
            } else {
              conn.query(insertQry, data).then(user => {
                res.json("data inserted");
              });
            }
          })
          .catch(err => {
            res.json({ status: 500, error: "QueryError" + err });
          });
      });
    }
  });
});

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
