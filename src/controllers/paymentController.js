const { verifyPayment } = require("../services/paystackService");
const Order = require("../models/Order");

async function paymentCallback(req, res) {
  try {
    const reference = req.query.reference;

    const data = await verifyPayment(reference);

    if (data.status !== "success") {
      return res.status(400).redirect("/?payment=failed");
    }

    const order = await Order.findById(reference);

    if (!order) {
      return res.status(400).redirect("/?payment=failed");
    }

    order.status = "PAID";
    await order.save();
    return res.status(200).redirect("/?payment=success");
  } catch (error) {
    console.error(error);
    return res.status(500).redirect("/?payment=failed");
  }
}

module.exports = paymentCallback;
