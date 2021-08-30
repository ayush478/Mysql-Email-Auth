const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
require("dotenv").config();

const nodemailer = require("nodemailer");
const log = console.log;
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));



const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "nodejs",
});
db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
app.post("/register", (req, res) => {
  var name = req.body.username;
  var email = req.body.password;
  rand = Math.floor(Math.random() * 100 + 54);
  host = req.get("host");
  link = "http://" + req.get("host") + "/verify?id=" + rand;
  var emailMessage = `Hi ${name},\n\nThank you for contacting us.\n\nYour email is: ${email}.\n\n.`;

  console.log(emailMessage);


  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL || "abc@gmail.com", // TODO: your gmail account
      pass: process.env.PASSWORD || "1234", // TODO: your gmail password
    },
  });

  var emailOptions = {
    from: process.env.EMAIL || "abc@gmail.com",
    to: email,
    subject: "Please confirm your Email account",
    html:
      "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
      link +
      ">Click here to verify</a>",
  };

  transporter.sendMail(emailOptions, (err, info) => {
    if (error) {
      console.log(error);
  
    } else {
      console.log("Message Sent: " + info.response);
      console.log("Email Message: " + emailMessage);
   
    }
  });

  app.get("/verify", function (req, res) {
    console.log(req.protocol + ":/" + req.get("host"));
    if (req.protocol + "://" + req.get("host") == "http://" + host) {
      console.log("Domain is matched. Information is from Authentic email");
      if (req.query.id == rand) {
        console.log("email is verified");
        res.end(
          "<h1>Email " + emailOptions.to + " is been Successfully verified"
        );
      } else {
        console.log("email is not verified");
        res.end("<h1>Bad Request</h1>");
      }
    } else {
      res.end("<h1>Request is from unknown source");
    }
  });
});

app.listen(3001, () => {
  console.log("running server");
});
