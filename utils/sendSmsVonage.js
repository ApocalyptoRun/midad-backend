import { Vonage } from "@vonage/server-sdk";
import dotenv from "dotenv";
dotenv.config();

const vonage = new Vonage({
  apiKey: process.env.API_KEY_VONAGE,
  apiSecret: process.env.API_SECRET_VONAGE,
});

export async function sendSmsVonage(phoneNumber, otp) {
  const from = "Midad";
  const to = phoneNumber;
  const text = `Your verification code is : ${otp}`;

  await vonage.sms
    .send({ to, from, text })
    .then((resp) => {
      console.log("Message sent successfully");
      console.log(resp);
    })
    .catch((err) => {
      console.log("There was an error sending the messages.");
      console.error(err);
    });
}
