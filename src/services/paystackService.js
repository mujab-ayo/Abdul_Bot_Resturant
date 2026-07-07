require("dotenv").config();
const axios = require("axios");

async function initializePayment(amount, email, orderId) {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        reference: orderId.toString(),
        callback_url: `${process.env.BASE_URL}/api/payment/callback`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.Paystack_Test_Secret_Key}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.data.authorization_url;
  } catch (error) {
      console.error("Paystack error:", error.response?.data || error.message);
    throw new Error("Failed to initialize payment");
  }
}

async function verifyPayment(reference) {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.Paystack_Test_Secret_Key}`,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to verify payment");
  }
}

module.exports = {
  initializePayment,
  verifyPayment,
};
