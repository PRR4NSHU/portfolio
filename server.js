// ---------------- CONFIGURATION ----------------
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// ---------------- APP INIT ----------------
const app = express();
const PORT = process.env.PORT || 5000;

// ---------------- MIDDLEWARE ----------------
app.use(cors({ origin: '*' })); // Allow all origins
app.use(bodyParser.json());

// ---------------- DATABASE CONNECTION ----------------
// .env file me MONGO_URI jaroor dalein
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

// 1. Save Contact Message
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, error: "Please fill all required fields." });
        }

        // Save to DB
        const newContact = await Contact.create({ name, email, subject, message });
        
        console.log("📩 New Message form:", name);
        res.status(201).json({ success: true, message: "Message Sent Successfully!" });

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ success: false, error: "Server Error. Please try again later." });
    }
});

// 2. Test Route
app.get('/', (req, res) => {
    res.send("Portfolio Backend is Running 🚀");
});

// ---------------- START SERVER ----------------
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on Port: ${PORT}`);
});