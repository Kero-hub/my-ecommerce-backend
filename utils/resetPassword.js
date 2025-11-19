const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Your Password",
        html: `
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password (valid for 10 minutes):</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>If you didn’t request this, you can safely ignore this email.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${email}`);
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw new Error("Failed to send password reset email");
    }
};

module.exports = sendPasswordResetEmail;