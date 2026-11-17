/* =========================================================
   HUDDERSFIELD GARDENING, DRIVEWAY & PATIO CLEANING
   Complete Website JavaScript
   Gallery | Mobile Navigation | 3D Effects
   WhatsApp Quotes | Rule-Based Chatbot
   ========================================================= */

"use strict";

// =========================================================
// 1. GENERAL UTILITIES
// =========================================================

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// =========================================================
// 2. PROJECT GALLERY
// Loads all projects from gallery.json
// =========================================================

const gallery = $("#galleryGrid");

let PROJECTS = [];

const IMAGE_BASE_PATHS = [
    "",
    "assets/"
];

function getImageCandidates(src) {

    const filename = String(src || "").split("/").pop();

    if (!filename) return [];

    const candidates = [
        filename,
        `assets/${filename}`,
        String(src).replace(/^\/+/, "")
    ];

    return [...new Set(candidates)];
}

function loadGalleryImage(img, candidates, index = 0) {

    if (!candidates.length || index >= candidates.length) {

        img.classList.add("image-load-failed");
        img.alt = "Project image currently unavailable";

        const card = img.closest(".gallery-item");

        if (card) {
            card.classList.add("image-unavailable");
            card.setAttribute("aria-label", "Project image unavailable");
        }

        console.error("Unable to load gallery image:", candidates);

        return;
    }

    const nextPath = candidates[index];

    img.dataset.currentImagePath = nextPath;

    img.onerror = () => {
        loadGalleryImage(img, candidates, index + 1);
    };

    img.onload = () => {

        img.classList.remove("image-load-failed");

        const card = img.closest(".gallery-item");

        if (card) {
            card.href = img.src;
            card.classList.remove("image-unavailable");
        }
    };

    img.src = nextPath;
}

function renderGallery(filter = "all") {

    if (!gallery) {
        console.warn("Gallery element #galleryGrid was not found.");
        return;
    }

    const items = PROJECTS.filter(project => {

        return filter === "all" ||
            project.category === filter;

    });

    if (!items.length) {

        gallery.innerHTML = `
            <div class="gallery-empty">
                <p>No projects found in this category.</p>
            </div>
        `;

        return;
    }

    gallery.innerHTML = items.map((project, index) => {

        const title = escapeHTML(project.title);
        const alt = escapeHTML(project.alt || project.title);
        const category = escapeHTML(project.category);

        return `
            <a
                class="gallery-item"
                href="#gallery"
                data-project-index="${index}"
                aria-label="View ${title}"
            >
                <img
                    src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                    alt="${alt}"
                    loading="lazy"
                    decoding="async"
                    data-project-src="${escapeHTML(project.src)}"
                >

                <span class="gallery-overlay">
                    ${title} ↗
                </span>

            </a>
        `;

    }).join("");

    // Load images using automatic fallback.
    $$("img[data-project-src]", gallery).forEach(img => {

        const candidates = getImageCandidates(
            img.dataset.projectSrc
        );

        loadGalleryImage(img, candidates);

    });

}

// Load project data from gallery.json.
async function initializeGallery() {

    if (!gallery) return;

    try {

        const response = await fetch("./gallery.json", {
            cache: "no-cache"
        });

        if (!response.ok) {
            throw new Error(
                `Gallery file returned HTTP ${response.status}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("gallery.json must contain an array.");
        }

        PROJECTS = data;

        console.log(
            `Successfully loaded ${PROJECTS.length} gallery projects.`
        );

        renderGallery("all");

    } catch (error) {

        console.error("Gallery loading failed:", error);

        gallery.innerHTML = `
            <div class="gallery-empty">
                <p>Our project gallery is temporarily unavailable.</p>
                <p>Please contact us for recent project photographs.</p>
            </div>
        `;

    }

}

// Gallery category filters.
function initializeGalleryFilters() {

    $$(".filter").forEach(button => {

        button.addEventListener("click", () => {

            $$(".filter").forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            renderGallery(button.dataset.filter || "all");

        });

    });

}

initializeGallery();
initializeGalleryFilters();


// =========================================================
// 3. MOBILE NAVIGATION
// =========================================================

const menuToggle = $(".menu-toggle");
const mainNav = $(".main-nav");

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {

        const isOpen = mainNav.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });

    $$("a", mainNav).forEach(link => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}


// =========================================================
// 4. PROFESSIONAL 3D HOVER EFFECTS
// =========================================================

if (
    window.matchMedia(
        "(hover: hover) and (min-width: 900px)"
    ).matches
) {

    $$(".tilt").forEach(card => {

        card.addEventListener("mousemove", event => {

            const rect = card.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) / rect.width - 0.5;

            const y =
                (event.clientY - rect.top) / rect.height - 0.5;

            card.style.transform = `
                perspective(900px)
                rotateX(${-y * 5}deg)
                rotateY(${x * 5}deg)
                translateY(-5px)
            `;

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "";

        });

    });

}


// =========================================================
// 5. WHATSAPP QUOTATION FORM
// =========================================================

const quoteForm = $("#quoteForm");

if (quoteForm) {

    quoteForm.addEventListener("submit", async event => {

        event.preventDefault();

        const formData = Object.fromEntries(
            new FormData(quoteForm).entries()
        );

        const name = formData.name || "";
        const phone = formData.phone || "";
        const service = formData.service || "";
        const postcode = formData.postcode || "Not provided";
        const details = formData.details || "Not provided";

        const message = `
Hello, I would like a free quotation.

Name: ${name}
Phone: ${phone}
Service: ${service}
Postcode / Area: ${postcode}
Job Details: ${details}

Please contact me regarding this enquiry.
        `.trim();

        const whatsappURL =
            "https://wa.me/447971312070?text=" +
            encodeURIComponent(message);

        // Open WhatsApp immediately from the user interaction.
        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );

        // Optional enquiry API.
        // WhatsApp remains available if the API is not configured.
        try {

            const response = await fetch("/api/enquiries", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(formData)

            });

            if (!response.ok) {
                throw new Error("Enquiry API unavailable.");
            }

            console.log("Enquiry submitted successfully.");

        } catch (error) {

            console.info(
                "Online enquiry storage is not configured. " +
                "The WhatsApp quotation request is still available.",
                error
            );

        }

    });

}


// =========================================================
// 6. SERVICE BUTTONS
// =========================================================

$$("[data-service]").forEach(button => {

    button.addEventListener("click", () => {

        const serviceSelect = $('[name="service"]');

        if (!serviceSelect) return;

        const selectedService = button.dataset.service;

        for (const option of serviceSelect.options) {

            if (
                option.text.trim().toLowerCase() ===
                selectedService.trim().toLowerCase()
            ) {

                serviceSelect.value = option.value;
                break;

            }

        }

    });

});


// =========================================================
// 7. AUTOMATIC COPYRIGHT YEAR
// =========================================================

const yearElement = $("#year");

if (yearElement) {

    yearElement.textContent = new Date().getFullYear();

}


// =========================================================
// 8. RULE-BASED CUSTOMER SUPPORT CHATBOT
// No external AI API required.
// =========================================================

const chatPanel = $("#chatPanel");
const chatLauncher = $("#chatLauncher");
const chatClose = $("#chatClose");
const chatMessages = $("#chatMessages");
const quickReplies = $("#quickReplies");

function openChat() {

    if (!chatPanel) return;

    chatPanel.classList.add("open");

    chatPanel.setAttribute("aria-hidden", "false");

}

function closeChat() {

    if (!chatPanel) return;

    chatPanel.classList.remove("open");

    chatPanel.setAttribute("aria-hidden", "true");

}

if (chatLauncher) {
    chatLauncher.addEventListener("click", openChat);
}

if (chatClose) {
    chatClose.addEventListener("click", closeChat);
}


// =========================================================
// 9. CHATBOT MESSAGE HANDLING
// =========================================================

function addMessage(message, sender = "bot") {

    if (!chatMessages) return;

    const element = document.createElement("div");

    element.className =
        sender === "user" ? "user-msg" : "bot-msg";

    element.textContent = message;

    chatMessages.appendChild(element);

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


// =========================================================
// 10. CHATBOT KNOWLEDGE BASE
// =========================================================

const chatbotAnswers = {

    greeting:
        "Hello! Welcome to Huddersfield Gardening, Driveway and Patio Cleaning Service. How can we help you today?",

    services:
        `We provide a range of outdoor property services:

• Garden maintenance
• Grass cutting and lawn care
• Tree cutting and removal
• Hedge trimming and reduction
• Fencing installation and repairs
• Decking enquiries
• Driveway cleaning
• Patio cleaning
• Weed and moss removal
• Garden clearance

Which service are you interested in?`,

    quote:
        "We offer free quotation enquiries. Call 07971 312070 or send us a WhatsApp message. You can also complete the quotation form on our website.",

    area:
        "We are based around Huddersfield and consider enquiries from surrounding areas. Please send us your postcode so we can confirm availability in your location.",

    contact:
        "You can contact our team on 07971 312070 or WhatsApp us at https://wa.me/447971312070.",

    fencing:
        "We provide enquiries for garden fencing installation, replacement, repairs and removal of old fencing. Contact us for a free quotation.",

    driveway:
        "We provide driveway and patio cleaning services, helping remove surface dirt, moss and algae. Contact us to discuss your cleaning requirements.",

    garden:
        "Our garden maintenance services include grass cutting, lawn care, hedge trimming, weed removal, garden tidy-ups and general maintenance.",

    tree:
        "We handle enquiries for tree cutting, tree removal, hedge trimming, hedge reduction and stump or root removal. The work depends on site access and requirements.",

    hours:
        "Please call or WhatsApp us to check current availability and arrange a suitable appointment.",

    thanks:
        "You're welcome! Thank you for contacting Huddersfield Gardening. We look forward to helping you.",

    fallback:
        "Thank you for your message. I can help with our services, quotations, service areas and contact details. For specific enquiries, please call 07971 312070."

};


// =========================================================
// 11. CHATBOT INTENT DETECTION
// =========================================================

function getChatbotReply(question) {

    const text = question.toLowerCase().trim();

    if (
        /^(hi|hello|hey|good morning|good afternoon|good evening)/i
            .test(text)
    ) {
        return chatbotAnswers.greeting;
    }

    if (
        /thank|thanks|cheers/.test(text)
    ) {
        return chatbotAnswers.thanks;
    }

    if (
        /service|services|what do you do|what do you offer/.test(text)
    ) {
        return chatbotAnswers.services;
    }

    if (
        /quote|quotation|price|cost|estimate|how much/.test(text)
    ) {
        return chatbotAnswers.quote;
    }

    if (
        /area|location|postcode|cover|coverage|where/.test(text)
    ) {
        return chatbotAnswers.area;
    }

    if (
        /contact|phone|call|number|whatsapp|telephone/.test(text)
    ) {
        return chatbotAnswers.contact;
    }

    if (
        /fenc|deck/.test(text)
    ) {
        return chatbotAnswers.fencing;
    }

    if (
        /driveway|patio|pressure wash|cleaning|clean/.test(text)
    ) {
        return chatbotAnswers.driveway;
    }

    if (
        /garden|grass|lawn|weed|moss|maintenance/.test(text)
    ) {
        return chatbotAnswers.garden;
    }

    if (
        /tree|hedge|stump|root|cutting|removal/.test(text)
    ) {
        return chatbotAnswers.tree;
    }

    if (
        /opening|hours|available|availability|open|appointment/.test(text)
    ) {
        return chatbotAnswers.hours;
    }

    return chatbotAnswers.fallback;

}


// =========================================================
// 12. CHATBOT CONVERSATION
// =========================================================

function sendChatMessage(question) {

    if (!question || !question.trim()) return;

    addMessage(question, "user");

    const answer = getChatbotReply(question);

    window.setTimeout(() => {

        addMessage(answer, "bot");

    }, 250);

}

if (quickReplies) {

    $$("button", quickReplies).forEach(button => {

        button.addEventListener("click", () => {

            sendChatMessage(button.textContent);

        });

    });

}


// =========================================================
// 13. CHATBOT INPUT FORM
// =========================================================

const chatForm = $("#chatForm");
const chatInput = $("#chatText");

if (chatForm && chatInput) {

    chatForm.addEventListener("submit", event => {

        event.preventDefault();

        const message = chatInput.value.trim();

        if (!message) return;

        sendChatMessage(message);

        chatInput.value = "";

        chatInput.focus();

    });

}


// =========================================================
// 14. INITIALIZATION COMPLETE
// =========================================================

console.log(
    "%cHuddersfield Gardening Website",
    "color:#16a34a;font-size:18px;font-weight:bold;"
);

console.log(
    "Website JavaScript initialized successfully."
);
