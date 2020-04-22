"use strict";
const http = require('http');
const nodemailer = require("nodemailer");
require('dotenv').config();
const request = require('request-promise');

let timeoutId;

async function main() {

  http.createServer(async function async(req, res) {
    if (xAuthIsValid(req, res)) {
      console.log('reset');
      reset();
      await sendState('clear');
    }
    res.end();
  }).listen(process.env.PORT);

  reset();
}

function xAuthIsValid(req, res) {
  if (req.header('x-authorization') === process.env.AUTH) {
    return true;
  }

  res.status(401).send('Unauthorized');
  return false;
}

function reset() {
  timeoutId && clearTimeout(timeoutId);
  timeoutId = setTimeout(async () => {
    await onTimeOut();
    console.log('run again');
    reset();
  }, Number(process.env.TIMEOUT_SEC) * 1000);
}

async function onTimeOut() {
  console.log('timeout');

  await sendState('detected');

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 465,
    secure: true, // true for 465, false for other ports
    auth: {
      type: "LOGIN",
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  });

  const info = await transporter.sendMail({
    from: process.env.SENDER,
    to: process.env.RECIPIENT,
    subject: process.env.SUBJECT,
    text: "-'",
    html: "<b>watch dog raised</b>",
  });

  transporter.close();

  return info;
}

async function sendState(value) {
  await request({
    method: 'POST',
    uri: 'https://my-oauth2-server.herokuapp.com/st/command',
    headers: {
      'x-authorization': process.env.AUTH2
    },
    body: {
      "devices": [{
        "deviceId": "5e9f6449cbfe427e4234bb98",
        "states": [{
          "capability": "st.tamperAlert",
          "attribute": "tamper",
          "value": value,
        }]
      }]
    },
    json: true
  })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.error(err);
    });
}

module.exports = {onTimeOut};

//

main().then(() => undefined);
