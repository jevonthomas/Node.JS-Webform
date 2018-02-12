'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();
const password = process.env.PASSWORD;

const app = express();

//view engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')))

//bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // NodeMailer Start
  let transporter = nodemailer.createTransport({
    // host: '',
    // port: '',
    // secure: false,
    service: 'gmail',
    auth: {
        user: 'jevon.g.thomas@gmail.com',
        pass: password
    },
    tls: {
      rejectUnauthorized:false
    }
  });

  // Options for how the email will be generated
  let mailOptions = {
    from: 'jevon.g.thomas@gmail.com',
    to: 'jevon.g.thomas@gmail.com',
    subject: 'Contact Request',
    text: 'Enable HTML',
    html: output
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);   
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('contact', {msg:'Email has been sent'});
  });
});



app.listen(8080);