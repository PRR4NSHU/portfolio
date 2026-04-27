// ---------------- CONFIGURATION ----------------
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); 

// ---------------- APP INIT ----------------
const app = express();
const PORT = process.env.PORT || 5000;

// ---------------- MIDDLEWARE ----------------
app.use(cors({ origin: '*' })); 
app.use(bodyParser.json());

// 1. Static Files: Ye line frontend files (HTML/CSS/JS) serve karegi
app.use(express.static(path.join(__dirname, 'public')));

// ---------------- DATABASE CONNECTION ----------------
const dbUri = process.env.MONGO_URI;

mongoose.connect(dbUri)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ DB Error:", err));

// ---------------- SCHEMA ----------------
const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', ContactSchema);

// ---------------- API ROUTES ----------------

// 1. Backend Status Route (Sirf is link par rocket message dikhega)
app.get('/api/status', (req, res) => {
    res.send("Portfolio Backend is Running 🚀");
});

// 2. Save Contact Message
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, error: "Please fill all required fields." });
        }

        await Contact.create({ name, email, subject, message });
        console.log("📩 New Message from:", name);
        res.status(201).json({ success: true, message: "Message Sent Successfully!" });
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ success: false, error: "Server Error. Please try again later." });
    }
});

// 3. MAIN FIX: Wildcard Route (Ye hamesha sabse niche hona chahiye)
// Jab koi API route match nahi hoga, tabhi ye index.html serve karega
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---------------- START SERVER ----------------
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on Port: ${PORT}`);
    console.log(`🔗 Website: http://localhost:${PORT}`);
    console.log(`🔗 API Status: http://localhost:${PORT}/api/status`);
});
