const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.static(path.join(__dirname, '..', 'dist')));

app.use(bodyParser.json());
app.use(cors());

// CORS headers middleware
app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "fullscreen=(self), geolocation=()");
  next();
});

// Define a simple route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

app.post('/api/inquiries', (req, res) => {
    const { name, email, message } = req.body;
  
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });

    const mailOptions = {
        from: email,
        to: 'khatrisonia566@gmail.com',
        subject: 'New Inquiry from Contact Form',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
      };
    
      // Send email using transporter
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email', error);
          return res.status(500).json({ message: 'Error sending email' });
        }
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Inquiry sent successfully' });
      });
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
