const { OTP } = require("../../models");

const verifyOTP = async (req, res, next) => {
  const { otp, email } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email, otp }).exec();

    if (otpRecord) {
      res.status(200).json({ message: "OTP verification successful" });
      next();
    } else {
      res.status(400).json({ message: "Mã OTP không hợp lệ." });
    }
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

module.exports = verifyOTP;
