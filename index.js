const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 5000;

// মিডলওয়্যার
app.use(cors());
app.use(express.json());

// === ইমেইল কনফিগারেশন ===
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kaabbobd22@gmail.com', // ১. এখানে আপনার জিমেইল দিন
        pass: 'qgju bwja brjr paze'    // ২. এখানে সেই ১৬ অক্ষরের অ্যাপ পাসওয়ার্ড দিন
    }
});

// অর্ডার রিসিভ করার রুট
app.post('/api/order', async (req, res) => {
    const { name, phone, email, serviceName, serviceType, details } = req.body;

    console.log("New Order:", req.body);

    // ইমেইলের ডিজাইন (HTML)
    const mailOptions = {
        from: 'My Agency <kaabbobd22@gmail.com>',
        to: 'kaabbobd22@gmail.com', // ৩. যে ইমেইলে নোটিফিকেশন পেতে চান
        subject: `New Order: ${serviceName} from ${name}`,
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
        <h2 style="color: #2c3e50;">New Order Received! 🎉</h2>
        <p>You have a new service request.</p>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Client Name:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Service:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2980b9; font-weight: bold;">${serviceName}</td>
          </tr>
        </table>

        <p style="margin-top: 20px;">Please contact the client as soon as possible.</p>
      </div>
    `
    };

    // মেইল পাঠানো
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
        res.status(200).json({ message: 'Order sent & Email delivered!', success: true });
    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ message: 'Failed to send email', success: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});