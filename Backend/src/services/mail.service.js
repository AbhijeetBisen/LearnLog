const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

let sendMailTo = async (to, subject, html) => {
  let options = {
    from: process.env.EMAIL,
    to,
    subject,
    html,
  };

  return await transporter.sendMail(options);
};

module.exports = sendMailTo;