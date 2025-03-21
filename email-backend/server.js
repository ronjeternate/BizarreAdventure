require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false, 
    },
});

// ✅ Welcome Email Route
app.post("/send-email", async (req, res) => {
    const { email, name } = req.body;

    const text = `Hi ${name},  

🎉 Welcome to **BIZARRE!** 🎉  

We’re absolutely thrilled to have you join us! 🥳 At **BIZARRE**, we believe in making every shopping experience unique, fun, and hassle-free.  

✨ **What you can expect from us:**  
✅ A curated selection of amazing products  
✅ Exclusive deals and special offers  
✅ A seamless shopping experience  

We're here to make your journey exciting, so if you ever need assistance, have questions, or just want to say hello, don’t hesitate to reach out! 💙  

Once again, **welcome aboard!** 🎊 We can't wait for you to explore all the exciting things we have in store.  

Happy shopping! 🛍️  

**Best regards,**  
The BIZARRE Team 🚀  
`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to BIZARRE!",
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Welcome email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

// ✅ Order Status Update Email Route
app.post("/send-order-update", async (req, res) => {
    const { email, name, orderId, status } = req.body;

    const text = `Hi ${name},  

Your order status has been updated! 📦

Order ID: ${orderId}  
New Status: ${status}  

We appreciate your patience and trust in BIZARRE! 🎉 If you have any questions about your order, feel free to contact our support team.  

🚀 **Thank you for shopping with us!**  

Best regards,
The BIZARRE Team 🚀`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Order Update: Your Order #${orderId} is now ${status}`,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Order update email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

app.post("/send-order-confirmation", async (req, res) => {
    const { email, name, orderId, total } = req.body;

    const text = `Hi ${name},  

Thank you for your order! 🎉  

Your order has been successfully placed and is now being processed. Here are your order details:

🛍 Order ID: ${orderId}  
💰 Total Amount: $${total}  

We will notify you once your order has been shipped. If you have any questions, feel free to reach out to our support team.  

🚀 **Thank you for shopping with BIZARRE!**  

Best regards,  
The BIZARRE Team 🚀`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Order Confirmation - BIZARRE",
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Order confirmation email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});




app.listen(5000, () => console.log("🚀 Server running on port 5000"));
