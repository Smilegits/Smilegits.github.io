/* =========================================================
   Smile Sharma — Portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---- Loader ---- */
  window.addEventListener("load", function () {
    const loader = document.getElementById("loader");
    setTimeout(function () { loader && loader.classList.add("done"); }, 1400);
  });

  /* ---- Year ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Nav scroll state + progress bar ---- */
  const nav = document.getElementById("nav");
  const progress = document.querySelector(".scroll-progress");
  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 40);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  const toggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  if (toggle && mobileMenu) {
    toggle.addEventListener("click", function () {
      toggle.classList.toggle("open");
      mobileMenu.classList.toggle("open");
      document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.classList.remove("open");
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---- Reveal on scroll ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          const el = e.target;
          const siblings = Array.from(el.parentElement.querySelectorAll(":scope > .reveal"));
          const idx = siblings.indexOf(el);
          el.style.transitionDelay = (idx > 0 ? Math.min(idx * 0.08, 0.4) : 0) + "s";
          el.classList.add("in");
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Animated counters ---- */
  const counters = document.querySelectorAll("[data-count]");
  const countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.getAttribute("data-count"));
      const suffix = el.getAttribute("data-suffix") || "";
      const decimals = (target % 1 !== 0) ? 1 : 0;
      const dur = 1600;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(function (el) { countObserver.observe(el); });

  /* ---- Custom cursor (pointer devices only) ---- */
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine) {
    const cursor = document.querySelector(".cursor");
    const dot = document.querySelector(".cursor-dot");
    let mx = 0, my = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      if (dot) { dot.style.left = mx + "px"; dot.style.top = my + "px"; }
    });
    function follow() {
      cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
      if (cursor) { cursor.style.left = cx + "px"; cursor.style.top = cy + "px"; }
      requestAnimationFrame(follow);
    }
    follow();
    document.querySelectorAll('a, button, [data-cursor="hover"]').forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursor && cursor.classList.add("grow"); });
      el.addEventListener("mouseleave", function () { cursor && cursor.classList.remove("grow"); });
    });
  }

  /* ---- Subtle parallax on hero blobs ---- */
  const blobs = document.querySelectorAll(".blob");
  if (fine && blobs.length) {
    window.addEventListener("mousemove", function (e) {
      const dx = (e.clientX / window.innerWidth - 0.5);
      const dy = (e.clientY / window.innerHeight - 0.5);
      blobs.forEach(function (b, i) {
        const f = (i + 1) * 12;
        b.style.transform = "translate(" + dx * f + "px," + dy * f + "px)";
      });
    });
  }

  /* ---- Tilt + spotlight on cards (pointer devices) ---- */
  if (fine) {
    const tiltEls = document.querySelectorAll(".project-card, .skill-group");
    tiltEls.forEach(function (el) {
      el.classList.add("tilt", "spotlight");
      el.addEventListener("mousemove", function (e) {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (0.5 - py) * 8;
        const ry = (px - 0.5) * 8;
        el.style.transform = "perspective(800px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-6px)";
        el.style.setProperty("--mx", px * 100 + "%");
        el.style.setProperty("--my", py * 100 + "%");
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });

    // spotlight-only (no tilt) for larger blocks
    document.querySelectorAll(".project-featured, .contact-link, .edu-card, .cert-card").forEach(function (el) {
      el.classList.add("spotlight");
      el.addEventListener("mousemove", function (e) {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        el.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      });
    });

    /* ---- Magnetic buttons ---- */
    document.querySelectorAll(".btn, .nav-cta").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + mx * 0.25 + "px," + my * 0.35 + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });
  }

})();
