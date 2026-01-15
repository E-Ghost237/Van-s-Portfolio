/* Mobile menu */
const toggle = document.querySelector(".navToggle");
const nav = document.getElementById("navMenu");

function closeMenu() {
    nav?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
}

toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
});

document.addEventListener("click", (e) => {
    if (!nav || !toggle) return;
    const t = e.target;
    if (!(t instanceof Element)) return;
    const clickedInside = nav.contains(t) || toggle.contains(t);
    if (!clickedInside) closeMenu();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
});

/* Active nav link on scroll (improvement) */
const links = Array.from(document.querySelectorAll(".nav__link"));
const sections = links
    .map((a) => document.querySelector(a.getAttribute("href") || ""))
    .filter(Boolean);

const setActive = () => {
    const y = window.scrollY + 140;
    let activeId = "";
    for (const s of sections) {
        const el = s;
        if (!(el instanceof HTMLElement)) continue;
        if (y >= el.offsetTop) activeId = "#" + el.id;
    }
    links.forEach((a) => {
        const isActive = a.getAttribute("href") === activeId;
        a.classList.toggle("is-active", isActive);
    });
};

window.addEventListener("scroll", setActive, { passive: true });
window.addEventListener("load", setActive);

/* Scroll reveal (improvement) */
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
    (entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                io.unobserve(entry.target);
            }
        }
    },
    { threshold: 0.12 }
);

revealEls.forEach((el) => io.observe(el));

/* Footer year */
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

/* Contact form validation (improvement) */
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");

function setError(name, message) {
    const el = document.querySelector(`[data-error-for="${name}"]`);
    if (el) el.textContent = message || "";
}

function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form) return;

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();

    let ok = true;
    setError("name", "");
    setError("email", "");
    setError("subject", "");
    setError("message", "");
    if (note) note.textContent = "";

    if (name.length < 2) {
        setError("name", "Please enter your name.");
        ok = false;
    }
    if (!isEmail(email)) {
        setError("email", "Please enter a valid email.");
        ok = false;
    }
    if (subject.length < 2) {
        setError("subject", "Please add a subject.");
        ok = false;
    }
    if (message.length < 10) {
        setError("message", "Message should be at least 10 characters.");
        ok = false;
    }

    if (!ok) return;

    // No backend in a static template — show success feedback.
/*     if (note)
        note.textContent =
            "Thanks! Your message is ready to send. Hook this form to EmailJS or a backend endpoint when you're ready.";
    form.reset(); */
});
