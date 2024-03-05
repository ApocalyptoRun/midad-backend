import axios from "axios";

export const sendSms = (phoneNumber, otp) => {
  const url = "https://6g62gz.api.infobip.com/sms/2/text/advanced";
  const headers = {
    Authorization: "App " + process.env.API_KEY,
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
