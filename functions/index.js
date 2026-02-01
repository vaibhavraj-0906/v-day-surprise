const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// Configure your email service here
// For Gmail, enable "Less secure app access" in your Google Account settings
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendRsvpEmail = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const { boyfriendEmail, girlfriendName, roomId } = req.body;

    if (!boyfriendEmail || !girlfriendName) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: boyfriendEmail,
      subject: "💕 Congratulations! You Have a Date on the 14th! 💕",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff5f7; border-radius: 10px;">
          <div style="text-align: center; padding: 20px;">
            <h1 style="color: #ec4899; font-size: 32px; margin: 0;">💕 Congratulations! 💕</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 8px; text-align: center;">
            <p style="font-size: 18px; color: #333; margin-bottom: 10px;">
              <strong>${girlfriendName}</strong> said YES!
            </p>
            <p style="font-size: 24px; color: #ec4899; font-weight: bold; margin: 20px 0;">
              You have a date on the 14th! 🎉
            </p>
            <p style="font-size: 16px; color: #666; margin-top: 20px;">
              This is going to be amazing! 💕
            </p>
          </div>

          <div style="margin-top: 20px; padding: 20px; background-color: rgba(236, 72, 153, 0.1); border-left: 4px solid #ec4899; border-radius: 4px;">
            <p style="color: #666; margin: 0;">
              💌 You can view your Valentine's room here to see all the memories and special moments shared!
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>Made with 💕 by Valentine's Forever Room</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
