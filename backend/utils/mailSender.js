import nodemailer from "nodemailer";

const mailSender = async (email, title, body) => {
  try {

    
    const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});


    const info = await transporter.sendMail({
      from: `EduFlex <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent successfully");

    return info;

  } catch (error) {

    console.log("MAIL ERROR:", error);

    throw error;
  }
};

export default mailSender;
