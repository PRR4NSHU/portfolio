// ---------------- CONFIGURATION ----------------
/**
 * Automatically detects if you are working locally or on live.
 * Replace 'your-app-name.onrender.com' with your actual Render URL.
 */
const BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://your-portfolio-backend.onrender.com"; // <--- Put your Render URL here

const API_URL = `${BASE_URL}/api/contact`;

// ---------------- TYPING EFFECT (Refactored to Class) ----------------
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        // Update text state
        this.txt = this.isDeleting 
            ? fullTxt.substring(0, this.txt.length - 1) 
            : fullTxt.substring(0, this.txt.length + 1);

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = this.isDeleting ? 50 : 100;

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ---------------- INITIALIZATION ----------------
document.addEventListener('DOMContentLoaded', () => {
    // 1. Init Typewriter
    const txtElement = document.querySelector('.txt-type');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }

    // 2. Init Theme
    initTheme();
});

// ---------------- MOBILE NAVIGATION ----------------
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('navLinks');

const toggleMenu = () => {
    navLinks?.classList.toggle('active');
    mobileMenu?.classList.toggle('is-active');
};

mobileMenu?.addEventListener('click', toggleMenu);

navLinks?.querySelectorAll('li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenu?.classList.remove('is-active');
    });
});

// ---------------- SCROLL SPY ----------------
window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const navLi = document.querySelectorAll(".nav-links li a");
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute("id");
        }
    });

    navLi.forEach(a => {
        a.classList.toggle("active", a.getAttribute("href").includes(current));
    });
});

// ---------------- CONTACT FORM ----------------
async function submitContact(e) {
    e.preventDefault();

    const elements = {
        name: document.getElementById('cName'),
        email: document.getElementById('cEmail'),
        subject: document.getElementById('cSubject'),
        message: document.getElementById('cMessage'),
        status: document.getElementById('formStatus'),
        btn: document.getElementById('submitBtn')
    };

    if (!elements.name.value || !elements.email.value || !elements.message.value) {
        updateStatus(elements.status, "⚠️ Please fill required fields.", "red");
        return;
    }

    // Loading State
    elements.btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
    elements.btn.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: elements.name.value,
                email: elements.email.value,
                subject: elements.subject.value,
                message: elements.message.value
            })
        });

        const result = await response.json();

        if (response.ok) {
            updateStatus(elements.status, "✅ Message Sent Successfully!", "green");
            document.querySelector('.contact-form').reset();
        } else {
            throw new Error(result.error || "Failed to send.");
        }
    } catch (error) {
        updateStatus(elements.status, `❌ ${error.message}`, "red");
    } finally {
        elements.btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        elements.btn.disabled = false;
    }
}

function updateStatus(el, msg, color) {
    el.style.color = color;
    el.innerText = msg;
    setTimeout(() => el.innerText = "", 5000);
}

// ---------------- THEME SWITCHER ----------------
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';

    const setTheme = (theme) => {
        if (theme === 'dark') {
            html.setAttribute('data-theme', 'dark');
            toggleBtn?.classList.replace('fa-moon', 'fa-sun');
        } else {
            html.removeAttribute('data-theme');
            toggleBtn?.classList.replace('fa-sun', 'fa-moon');
        }
        localStorage.setItem('theme', theme);
    };

    setTheme(savedTheme);

    toggleBtn?.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(currentTheme);
    });
}
