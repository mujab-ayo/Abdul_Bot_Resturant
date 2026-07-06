const router = require("express").Router();

const paymentCallback = require("../controllers/paymentController");

router.get("/callback", paymentCallback);

module.exports = router;