/* Mohammed Nadeem Mansoori - portfolio.
   Lenis smooth scroll + GSAP ScrollTrigger choreography.
   Every animation is motivated; all of it is gated on prefers-reduced-motion. */

const EMAIL = "nadeemmansoori05@gmail.com";
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Nav background on scroll
const nav = document.getElementById("nav");
const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 12);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

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

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = typeof gsap !== "undefined";

function fillCounts() {
  // Final values, no animation.
  document.querySelectorAll(".count").forEach((el) => {
    el.textContent = el.getAttribute("data-count") || el.textContent;
  });
}

if (reduced || !hasGsap) {
  fillCounts();
} else {
  gsap.registerPlugin(ScrollTrigger);

  // ---- Lenis smooth scroll, synced to GSAP's ticker ----
  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    // in-page anchors go through Lenis
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length > 1) {
          const target = document.querySelector(id);
          if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -70 }); }
        }
      });
    });
  }

  // ---- Hero entrance: story reveal, top-of-page ----
  gsap.set(["[data-hero=sub]", "[data-hero=cta]", "[data-hero=meta]"], { y: 18 });
  gsap.timeline({ defaults: { ease: "expo.out" } })
    .to("[data-hero=eyebrow]", { opacity: 1, duration: 0.6 }, 0.1)
    .to(".h-line > span", { y: 0, duration: 1.0, stagger: 0.12 }, 0.15)
    .to("[data-hero=sub]", { opacity: 1, y: 0, duration: 0.7 }, "-=0.55")
    .to("[data-hero=cta]", { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
    .to("[data-hero=meta]", { opacity: 1, y: 0, duration: 0.6 }, "-=0.45");

  // ---- Reveal on view, batched so grid items stagger together ----
  gsap.set(".reveal", { opacity: 0, y: 30 });
  ScrollTrigger.batch(".reveal", {
    start: "top 88%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.09, overwrite: true }),
  });

  // ---- Count-up stats (hierarchy: the numbers earn attention) ----
  document.querySelectorAll(".count").forEach((el) => {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => (el.textContent = Math.round(obj.v)),
    });
  });

  // ---- Subtle hero glow parallax (depth, not decoration) ----
  gsap.to(".bg-fx .glow", {
    yPercent: 30,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  // ---- WORK: pinned horizontal pan on desktop; native swipe elsewhere ----
  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px)", () => {
    const section = document.querySelector(".work-pan");
    const viewport = document.querySelector(".pan-viewport");
    const track = document.querySelector(".pan-track");
    const bar = document.getElementById("panBar");
    if (!section || !track || !viewport) return;
    const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
    if (distance() <= 0) return;
    viewport.style.overflow = "hidden";
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => "+=" + distance(),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => { if (bar) bar.style.width = 18 + self.progress * 82 + "%"; },
      },
    });
    return () => {
      viewport.style.overflow = "";
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
      gsap.set(track, { x: 0 });
    };
  });

  // Native horizontal swipe when not pinned (mobile).
  const vp = document.querySelector(".pan-viewport");
  if (vp) {
    const mq = window.matchMedia("(max-width: 900px)");
    const apply = () => (vp.style.overflowX = mq.matches ? "auto" : "");
    apply();
    mq.addEventListener("change", apply);
  }

  window.addEventListener("load", () => ScrollTrigger.refresh());
}
