/* Mohammed Nadeem Mansoori - portfolio interactions.
   Small, dependency-free, and reduced-motion aware. */

const EMAIL = "nadeemmansoori05@gmail.com";

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Nav background on scroll
const nav = document.getElementById("nav");
const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 12);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Reveal on scroll (skipped entirely when the user prefers reduced motion)
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reveals = document.querySelectorAll(".reveal");
if (reduce || !("IntersectionObserver" in window)) {
  reveals.forEach((el) => el.classList.add("in"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );
  reveals.forEach((el) => io.observe(el));
}

// Copy email
const copyBtn = document.getElementById("copyBtn");
const copyNote = document.getElementById("copyNote");
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      if (copyNote) copyNote.textContent = "Copied " + EMAIL;
    } catch (_) {
      if (copyNote) copyNote.textContent = EMAIL;
    }
    window.setTimeout(() => copyNote && (copyNote.textContent = ""), 3200);
  });
}
