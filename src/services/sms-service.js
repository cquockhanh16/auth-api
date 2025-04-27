const dotenv = require("dotenv");
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountPhone = process.env.TWILIO_PHONE_NUMBER;
const client = require("twilio")(accountSid, authToken);

// Send SMS
function sendSMS(to, body) {
  return new Promise((res, rej) => {
    client.messages
      .create({
        body: body,
        from: +16205826122, // Your Twilio number
        to: to, // Format: '+84987654321' for Vietnam
      })
      .then((resp) => {
        res(resp);
      })
      .catch((error) => rej(error));
  });
}

module.exports = { sendSMS };
