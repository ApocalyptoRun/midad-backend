import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import twilio from "twilio";

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = twilio(accountSid, authToken);

export const sendSmsTwilio = (phoneNumber, otp) => {
  return client.messages
    .create({
      to: "+" + phoneNumber,
      body: `Your verification code is : ${otp}`,
      from: "+19542043371",
    })
    .then((message) => {
      // console.log(message.sid);
      return message.sid;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

export const sendSms = (phoneNumber, otp) => {
  const url = "https://6g62gz.api.infobip.com/sms/2/text/advanced";
  const headers = {
    Authorization: "App " + process.env.INFOBIP_KEY,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const messageData = {
    messages: [
      {
        destinations: [{ to: phoneNumber }],
        from: "Midad",
        text: `Your verication code is : ${otp}`,
      },
    ],
  };

  axios
    .post(url, messageData, { headers })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const generateOPT = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
