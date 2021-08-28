const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

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

// app.use(
//   session({
//     key: "userId",
//     secret: "subscribe",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       expires: 60 * 60 * 24,
//     },
//   })
// );

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
  // res.redirect("/contact_send");

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
      // res.redirect("/contact_send");
    } else {
      console.log("Message Sent: " + info.response);
      console.log("Email Message: " + emailMessage);
      // res.redirect("/contact_error");
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
  // const username = req.body.username;
  // const password = req.body.password;
  // console.log(username);
  // bcrypt.hash(password, saltRounds, (err, hash) => {
  //   if (err) {
  //     console.log(err);
  //   }

  //   db.query(
  //     "INSERT INTO loginuser (user_name, user_pass) VALUES (?,?)",
  //     [username, hash],
  //     (err, result) => {
  //       console.log(err);
  //     }
  //   );
  // });
});

// app.get("/login", (req, res) => {
//   if (req.session.user) {
//     res.send({ loggedIn: true, user: req.session.user });
//   } else {
//     res.send({ loggedIn: false });
//   }
// });

// app.post("/login", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   db.query(
//     "SELECT * FROM loginuser WHERE user_name = ?;",
//     username,
//     (err, result) => {
//       if (err) {
//         res.send({ err: err });
//       }

//       if (result.length > 0) {
//         bcrypt.compare(password, result[0].password, (error, response) => {
//           if (response) {
//             req.session.user = result;
//             console.log(req.session.user);
//             res.send(result);
//           } else {
//             res.send({ message: "Wrong username/password combination!" });
//           }
//         });
//       } else {
//         res.send({ message: "User doesn't exist" });
//       }
//     }
//   );
// });
// Step 1
// let transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL || "abc@gmail.com", // TODO: your gmail account
//     pass: process.env.PASSWORD || "1234", // TODO: your gmail password
//   },
// });

// // Step 2
// let mailOptions = {
//   from: process.env.EMAIL || "abc@gmail.com", // TODO: email sender
//   to: "ayushprajapati47@gmail.com", // TODO: email receiver
//   subject: "Nodemailer - Test",
//   text: "Wooohooo it works!!",
// };

// // Step 3
// transporter.sendMail(mailOptions, (err, data) => {
//   if (err) {
//     return log("Error occurs", err);
//   }
//   return log("Email sent!!!");
// });
app.listen(3001, () => {
  console.log("running server");
});
