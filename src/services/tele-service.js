const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

// Cấu hình Telegram
const botToken = "YOUR_BOT_TOKEN";
const chatId = "YOUR_CHAT_ID";
const bot = new TelegramBot(botToken, { polling: true });

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Lắng nghe email mới và gửi về Telegram
transporter.on("mail", async (mail) => {
  const subject = mail.subject;
  const from = mail.from.text;
  const text = mail.text || "No content";

  await bot.sendMessage(
    chatId,
    `📧 New Email\nFrom: ${from}\nSubject: ${subject}\n\n${text}`
  );
});

console.log("Đang chờ email mới...");
