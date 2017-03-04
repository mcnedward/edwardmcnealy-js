const request = require('request'),
      nodemailer = require('nodemailer'),
      myEmail = 'edwardmcnealy@gmail.com',
      password = 'ahhucjuakeiybabs';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: myEmail,
    pass: password
  }
});

const emailMaxLength = 50,
      subjectMaxLength = 100;
      messageMaxLength = 1000;

function isEmailRequestValid(email, subject, message) {
  return email && email.length <= emailMaxLength &&
    subject && subject.length <= subjectMaxLength &&
    message && message.length <= messageMaxLength;
}

module.exports = {
  contact: (req, res) => {
    var token = req.token;
    if (!token || token === '') {
      res.status(200).send('Could not verify your recaptcha, please try again.');
    } else {
      let contactInfo = req.body;
      let email = contactInfo.email;
      let subject = contactInfo.subject;
      let message = contactInfo.message;

      if (!isEmailRequestValid(email, subject, message)) {
        res.status(400).send('Something was wrong with your contact info. Please check that all fields are filled out and valid!');
        return;
      }

      // Add the sender's email and a notice that this is from the website, since the From email address is myself
      let html = '<h4>Email from: < ' + email + ' > sent from edwardmcnealy.com!</h4><hr><br/>' + message;
      // Be sure to preserve lines in html
      html = html.replace(/\r?\n/g, '<br/>');
      let text = 'Email from: <' + email + '> sent from edwardmcnealy.com!\n\n' + message;

      let mailOptions = {
        from: email,
        to: myEmail,
        subject: subject,
        text: text,
        html: html
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(400).send('Something went wrong when trying to send your email, please try again.');
          return;
        }
        res.status(200).send("Thanks for that! I'll get back to you as soon as I can!");
      });
    }
  }
}
