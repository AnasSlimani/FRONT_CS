import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request) {
  try {
    const { username, email } = await request.json()

    if (!username || !email) {
      return NextResponse.json({ success: false, message: "Username and email are required" }, { status: 400 })
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Current date for the email
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Email content with professional design
    const mailOptions = {
      from: `"JAGUARS Sports Club" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to JAGUARS Sports Club! 🏆",
      text: `
Hello ${username},

Welcome to JAGUARS Sports Club!

Thank you for joining our community. Your account has been successfully created and you now have access to all member features.

Here's what you can do now:
- Explore upcoming events and tournaments
- Register for activities
- Connect with other club members
- Access exclusive member resources

If you have any questions or need assistance, please don't hesitate to contact our support team at ${process.env.EMAIL_USER}.

Best regards,
The JAGUARS Sports Club Team
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-top: 20px;">
    <!-- Header -->
    <tr>
      <td style="padding: 0;">
        <table width="100%" style="border-spacing: 0; background: linear-gradient(90deg, #0d9488 0%, #0f766e 100%); color: white;">
          <tr>
            <td style="padding: 30px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Welcome to JAGUARS!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Your account has been successfully created</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Body -->
    <tr>
      <td style="padding: 30px 30px 20px 30px;">
        <table width="100%" style="border-spacing: 0;">
          <tr>
            <td>
              <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #333333;">Hello ${username},</h2>
              <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.5; color: #555555;">
                Thank you for joining the JAGUARS Sports Club community! We're excited to have you on board.
              </p>
              <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.5; color: #555555;">
                Your account has been successfully created and you now have access to all member features.
              </p>
              
              <h3 style="margin: 25px 0 15px 0; font-size: 18px; color: #333333;">Here's what you can do now:</h3>
              <ul style="margin: 0 0 25px 0; padding-left: 20px; color: #555555; line-height: 1.5;">
                <li style="margin-bottom: 10px;">Explore upcoming events and tournaments</li>
                <li style="margin-bottom: 10px;">Register for activities</li>
                <li style="margin-bottom: 10px;">Connect with other club members</li>
                <li style="margin-bottom: 10px;">Access exclusive member resources</li>
              </ul>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                <tr>
                  <td>
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="border-radius: 4px; background: #0d9488; text-align: center;">
                          <a href="${process.env.NEXT_PUBLIC_API_URL || "https://yourwebsite.com"}" style="background: #0d9488; color: white; display: inline-block; padding: 12px 25px; font-size: 16px; text-decoration: none; border-radius: 4px; font-weight: bold;">Visit Your Dashboard</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.5; color: #555555;">
                If you have any questions or need assistance, please don't hesitate to contact our support team.
              </p>
              <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #555555;">
                Best regards,<br>
                The JAGUARS Sports Club Team
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="padding: 0;">
        <table width="100%" style="border-spacing: 0; background-color: #f8f8f8; border-top: 1px solid #eeeeee;">
          <tr>
            <td style="padding: 20px 30px; text-align: center; color: #777777; font-size: 14px;">
              <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} JAGUARS Sports Club. All rights reserved.</p>
              <p style="margin: 0 0 5px 0;">This email was sent to ${email}</p>
              <p style="margin: 0; color: #999999; font-size: 12px;">${currentDate}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)
    return NextResponse.json({ success: true, message: "Welcome email sent successfully" })
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return NextResponse.json({ success: false, message: "Failed to send welcome email" }, { status: 500 })
  }
}
