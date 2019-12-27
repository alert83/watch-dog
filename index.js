"use strict";
const http = require('http');
const nodemailer = require("nodemailer");

require('dotenv').config();

let timeoutId;

async function main() {

  //create a server object:
  http.createServer(function (req, res) {
    const auth = req.headers['x-authorization'];
    if (auth === process.env.AUTH) reset();
    res.end(); //end the response
  }).listen(process.env.PORT);
}

function reset() {
  timeoutId && clearTimeout(timeoutId);
  timeoutId = setTimeout(async () => await onTimeOut(), Number(process.env.TIMEOUT_SEC) * 1000);
}

async function onTimeOut() {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 465,
    secure: true, // true for 465, false for other ports
    auth: {
      type: "LOGIN",
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.SENDER,
    to: process.env.RECIPIENT,
    subject: process.env.SUBJECT,
    text: "-'",
    html: "<b>watch dog raised</b>",
  });
}

module.exports = {onTimeOut};

//

main().then(() => undefined);
