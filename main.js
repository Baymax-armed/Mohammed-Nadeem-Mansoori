/* Mohammed Nadeem Mansoori - portfolio.
   Lenis smooth scroll + GSAP. Reduced-motion safe. */

const EMAIL = "nadeemmansoori05@gmail.com";
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const nav = document.getElementById("nav");
const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 12);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const copyBtn = document.getElementById("copyBtn");
const copyNote = document.getElementById("copyNote");
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(EMAIL); if (copyNote) copyNote.textContent = "Copied " + EMAIL; }
    catch (_) { if (copyNote) copyNote.textContent = EMAIL; }
    setTimeout(() => copyNote && (copyNote.textContent = ""), 3200);
  });
}

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduced && typeof gsap !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Lenis smooth scroll
  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length > 1) { const el = document.querySelector(id); if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -10 }); } }
      });
    });
  }

  // Hero intro
  gsap.timeline({ defaults: { ease: "expo.out" } })
    .to(".hero .tagpill", { opacity: 1, y: 0, duration: 0.7 }, 0.15)
    .fromTo(".hero h1 .name > span", { y: "110%" }, { y: "0%", duration: 1.1 }, 0.2)
    .to(".role", { opacity: 1, duration: 0.6 }, "-=0.5")
    .to(".hero-cta", { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");
  gsap.set([".hero .tagpill", ".hero-cta"], { y: 16 });

  // Rotating role
  const roleBox = document.querySelector(".role");
  const track = document.querySelector(".role .track");
  if (roleBox && track && track.children.length > 2) {
    const step = roleBox.clientHeight;
    const n = track.children.length - 1; // last is a duplicate of the first
    const tl = gsap.timeline({ repeat: -1, delay: 1.6 });
    for (let i = 1; i <= n; i++) {
      tl.to(track, { y: -step * i, duration: 0.65, ease: "expo.inOut" }, i === 1 ? 0 : ">1.6");
    }
    tl.set(track, { y: 0 });
  }

  // Scroll reveals (batched, stagger)
  gsap.set(".reveal", { opacity: 0, y: 34 });
  ScrollTrigger.batch(".reveal", {
    start: "top 86%",
    once: true,
    onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.1, overwrite: true }),
  });

  // Hero atmosphere parallax
  gsap.to(".hero-atmos .head", { yPercent: 24, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero-atmos .fog", { yPercent: -14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  window.addEventListener("load", () => ScrollTrigger.refresh());
}
