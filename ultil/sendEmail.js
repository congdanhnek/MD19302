const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'nguyenphamcongdanh02112005@gmail.com',
      pass: 'duxx phae nrup fmge'
    }
  });

module.exports = { transporter };