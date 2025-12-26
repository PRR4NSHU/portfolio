// --- CONFIGURATION ---
// Localhost (Testing ke liye):
const API_URL = "https://portfolio-wtm0.onrender.com/api;

// Live (Render) ke liye (Deploy karte waqt upar wala comment karein aur niche wala uncomment karein):
// const API_URL = "https://your-portfolio-backend.onrender.com/api/contact";


// --- TYPING EFFECT LOGIC ---
const TypeWriter = function(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
}

TypeWriter.prototype.type = function() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    if(this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

    let typeSpeed = 100;

    if(this.isDeleting) {
        typeSpeed /= 2;
    }

    if(!this.isDeleting && this.txt === fullTxt) {
        typeSpeed = this.wait;
        this.isDeleting = true;
    } else if(this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.wordIndex++;
        typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
}

// Init On DOM Load
document.addEventListener('DOMContentLoaded', init);

function init() {
    const txtElement = document.querySelector('.txt-type');
    if(txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }
}


// --- MOBILE NAVIGATION TOGGLE ---
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('navLinks');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('is-active');
    });
}

// Close mobile menu when a link is clicked
if (navLinks) {
    navLinks.querySelectorAll('li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (mobileMenu) mobileMenu.classList.remove('is-active');
        });
    });
}


// --- ACTIVE SCROLL SPY (Fixed Duplicate Code) ---
const sections = document.querySelectorAll("section");
const navLi = document.querySelectorAll(".nav-links li a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        // -150px ka offset taaki header ke niche aate hi active ho jaye
        if (window.scrollY >= (sectionTop - 150)) {
            current = section.getAttribute("id");
        }
    });

    navLi.forEach((a) => {
        a.classList.remove("active");
        // Agar href link section id se match kare
        if (a.getAttribute("href").includes(current)) {
            a.classList.add("active");
        }
    });
});


// --- CONTACT FORM LOGIC ---
async function submitContact(e) {
    e.preventDefault(); 

    const name = document.getElementById('cName').value;
    const email = document.getElementById('cEmail').value;
    const subject = document.getElementById('cSubject').value;
    const message = document.getElementById('cMessage').value;
    const statusTxt = document.getElementById('formStatus');
    const btn = document.getElementById('submitBtn');

    // Validation (Backend bhejne se pehle check)
    if(!name || !email || !message) {
        statusTxt.style.color = "red";
        statusTxt.innerText = "⚠️ Please fill all required fields.";
        return;
    }

    // Button loading state
    btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    const data = { name, email, subject, message };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            statusTxt.style.color = "green";
            statusTxt.innerText = "✅ Message Sent Successfully!";
            document.querySelector('.contact-form').reset();
        } else {
            statusTxt.style.color = "red";
            statusTxt.innerText = "❌ Error: " + (result.error || "Failed to send.");
        }

    } catch (error) {
        console.error("Error:", error);
        statusTxt.style.color = "red";
        statusTxt.innerText = "❌ Server Connection Failed! (Is backend running?)";
    } finally {
        // Button reset state
        btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        btn.disabled = false;

        // 5 second baad status message hata do
        setTimeout(() => {
            if(statusTxt) statusTxt.innerText = "";
        }, 5000);
    }
}

// --- THEME SWITCHER LOGIC ---

const toggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// 1. Check Local Storage on Load (Page khulte hi check karega)
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark');
    toggleBtn.classList.replace('fa-moon', 'fa-sun'); // Icon Change
}

// 2. Toggle Event Listener (Click karne par)
if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        // Agar abhi Dark hai to Light kar do
        if (htmlElement.getAttribute('data-theme') === 'dark') {
            htmlElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            toggleBtn.classList.replace('fa-sun', 'fa-moon');
        } 
        // Agar Light hai to Dark kar do
        else {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            toggleBtn.classList.replace('fa-moon', 'fa-sun');
        }
    });

}
