const axios = require("axios");

async function initializePayment(amount, email, orderId) {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        reference: orderId.toString(),
        callback_url: "http://localhost:3000/api/payment/callback",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.data.authorization_url;
  } catch (error) {
    throw new Error("Failed to initialize payment");
  }
}

async function verifyPayment(reference) {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
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
