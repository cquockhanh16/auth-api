const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail = (to, subject, text, html = null, file = null) => {
  const fileType = file && file.type ? file.type : "application/octet-stream";
  let object = {};
  if (text) {
    object.text = text;
  }
  if (html) {
    object.html = html;
  }
  return transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    attachments: file
      ? [
          {
            filename: file.originalname || "hoadon.pdf",
            path: file.path ? file.path : file,
            contentType: fileType,
          },
        ]
      : [],
    ...object,
  });
};

module.exports = { sendEmail };
