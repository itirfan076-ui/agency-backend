const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose'); // নতুন যুক্ত করা হয়েছে
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// === ১. ডাটাবেস কনফিগারেশন (এখানে আপনার পাসওয়ার্ড দিন) ===
// আপনার 'db_password' কেটে আসল পাসওয়ার্ডটি বসান
const DB_USER = "isirfan076";
const DB_PASS = "IrfanBsc076";
const DB_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.tlitxhv.mongodb.net/agencyDB?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(DB_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.log('DB Connection Error:', err));

// === ২. অর্ডারের মডেল (Model) ===
const OrderSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    serviceName: String,
    serviceType: String,
    details: Object, // ডায়নামিক তথ্যের জন্য
    date: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

// === ৩. ইমেইল কনফিগারেশন (আপনার আগের তথ্য দিন) ===
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kaabbobd22@gmail.com',  // <--- এখানে আপনার জিমেইল বসান
        pass: 'qgju bwja brjr paze'     // <--- এখানে সেই ১৬ অক্ষরের অ্যাপ পাসওয়ার্ড বসান
    }
});

// === ৪. অর্ডার রুট (Save + Email) ===
app.post('/api/order', async (req, res) => {
    const { name, phone, email, serviceName, serviceType, details } = req.body;

    try {
        // ক. ডাটাবেসে সেভ করা
        const newOrder = new Order({ name, phone, email, serviceName, serviceType, details });
        await newOrder.save();

        // খ. ইমেইল পাঠানো
        const mailOptions = {
            from: 'My Agency',
            to: 'kaabbobd22@gmail.com', // যে ইমেইলে নোটিফিকেশন পেতে চান
            subject: `New Order: ${serviceName}`,
            html: `
        <h3>New Order Received</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${serviceName}</p>
      `
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Order saved & Email sent!', success: true });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Server Error', success: false });
    }
});

// === ৫. অ্যাডমিন প্যানেলের জন্য রুট (সব অর্ডার দেখার জন্য) ===
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 }); // নতুন অর্ডার সবার উপরে থাকবে
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

app.get('/', (req, res) => { res.send('Backend with DB is Running'); });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
