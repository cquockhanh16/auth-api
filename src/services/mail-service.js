const TelegramBot = require("node-telegram-bot-api");
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

const sendEmailToTele = (message) => {
  const botToken = process.env.BOT_TOKEN;
  // const chatId = process.env.CHAT_ID;
  const bot = new TelegramBot(botToken, { polling: true });
  bot.on("message", (msg) => {
    const chatId = msg.chat.id;

    // send a message to the chat acknowledging receipt of their message
    bot
      .sendMessage(chatId, message, {
        // parse_mode: "HTML",
        disable_web_page_preview: true,
      })
      .then((resp) => {
        console.log("Đã gửi tin nhắn Telegram");
      })
      .catch((error) => console.log(error));
  });
};

module.exports = { sendEmail, sendEmailToTele };
