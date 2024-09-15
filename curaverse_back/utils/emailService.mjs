import nodemailer from "nodemailer";

const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "karemomnia399@gmail.com",
    pass: "zgeb ctvy ptrk umah",
  },
});

const icloudTransporter = nodemailer.createTransport({
  service: "icloud",
  auth: {
    user: "karemomnia399@icloud.com",
    pass: "lvca-hxja-mbxt-ehlx",
  },
});

export function sendEmail(to, subject, text, useService = "gmail") {
  const transporter =
    useService === "gmail" ? gmailTransporter : icloudTransporter;
  const mailOptions = {
    from:
      useService === "gmail"
        ? "karemomnia399@gmail.com"
        : "karemomnia399@icloud.com",
    to: to,
    subject: subject,
    text: text,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
