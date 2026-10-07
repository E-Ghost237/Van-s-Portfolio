/* ════════════════════════════════════════════════════════════════════
   VAN NISTEROOYL · PORTFOLIO · interactions & animations
   Vanilla JS, zero dependencies. Everything is failure-tolerant:
   each feature is isolated so one error can never blank the page.
   ════════════════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const mq = (q) => (window.matchMedia ? window.matchMedia(q).matches : false);
  const reduced = mq("(prefers-reduced-motion: reduce)");
  const finePointer = mq("(pointer: fine)");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* private mode */ } },
  };
  const safe = (fn) => {
    try { fn(); } catch (err) { console.warn("[portfolio]", err); }
  };
  const root = document.documentElement;

  /* ── 1 · Preloader ─────────────────────────────────────────────── */
  const preloaderDone = new Promise((resolve) => {
    safe(async () => {
      const pre = $("#preloader");
      const linesBox = $("#preloaderLines");
      const bar = $("#preloaderBar");
      const finish = () => {
        root.classList.add("is-loaded");
        if (pre) {
          pre.classList.add("done");
          setTimeout(() => pre.remove(), 700);
        }
        resolve();
      };

      if (!pre || !linesBox || reduced || store.get("vw-seen")) {
        store.set("vw-seen", "1");
        finish();
        return;
      }

      const boot = [
        { cmd: "whoami" },
        { out: "van.nisterooyl · full-stack developer" },
        { cmd: "boot portfolio --modules" },
        { out: "[frontend] [backend] [cloud] [mobile] [ai] ✓", hi: true },
        { cmd: "launch" },
        { out: "→ ready.", hi: true },
      ];

      const typeLine = async (text) => {
        const line = document.createElement("div");
        line.className = "tl";
        line.innerHTML = '<span class="tl__p">$ </span><span class="tl__c"></span><span class="tl__cur"></span>';
        linesBox.appendChild(line);
        const target = line.querySelector(".tl__c");
        const cur = line.querySelector(".tl__cur");
        for (const ch of text) {
          target.textContent += ch;
          await sleep(24);
        }
        cur.remove();
      };

      const putLine = async (text, hi) => {
        await sleep(160);
        const line = document.createElement("div");
        line.className = "tl";
        line.innerHTML = `<span class="${hi ? "tl__hi" : "tl__o"}"></span>`;
        line.firstChild.textContent = text;
        linesBox.appendChild(line);
      };

      let progress = 0;
      const step = () => {
        progress = Math.min(100, progress + 100 / boot.length);
        if (bar) bar.style.width = progress + "%";
      };

      try {
        for (const l of boot) {
          if (l.cmd) await typeLine(l.cmd);
          else await putLine(l.out, l.hi);
          step();
        }
        await sleep(320);
      } catch (e) { /* keep going */ }

      store.set("vw-seen", "1");
      finish();
    });

    /* absolute safety net: never trap the visitor behind the preloader */
    setTimeout(() => {
      if (!root.classList.contains("is-loaded")) {
        root.classList.add("is-loaded");
        const pre = $("#preloader");
        if (pre) pre.remove();
      }
      resolve();
    }, 3400);
  });

  /* ── 2 · Footer year ───────────────────────────────────────────── */
  safe(() => {
    const y = $("#year");
    if (y) y.textContent = String(new Date().getFullYear());
  });

  /* ── 3 · Mobile nav ────────────────────────────────────────────── */
  safe(() => {
    const toggle = $(".nav-toggle");
    const nav = $("#navMenu");

    const close = () => {
      nav?.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      toggle?.setAttribute("aria-expanded", "false");
    };

    toggle?.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    $$("a", nav || document).forEach((a) =>
      a.addEventListener("click", close)
    );
    document.addEventListener("keydown", (e) => e.key === "Escape" && close());
    window.addEventListener("resize", () => window.innerWidth > 700 && close());
  });

  /* ── 4 · Scroll: progress bar, header state, active link, to-top ── */
  safe(() => {
    const header = $(".header");
    const bar = $("#scrollBar");
    const toTop = $("#toTop");
    const links = $$(".nav__link");
    const sections = links
      .map((a) => document.querySelector(a.getAttribute("href") || ""))
      .filter(Boolean);

    const onScroll = () => {
      const y = window.scrollY;
      header?.classList.toggle("is-scrolled", y > 24);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

      toTop?.classList.toggle("is-show", y > 680);

      let activeId = "";
      if (y > 320) {
        for (const s of sections) {
          if (y >= s.offsetTop - 190) activeId = s.id;
        }
      }
      links.forEach((a) =>
        a.classList.toggle("is-active", a.getAttribute("href") === "#" + activeId)
      );
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    toTop?.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
    );
  });

  /* ── 5 · Scroll reveals ────────────────────────────────────────── */
  safe(() => {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window) || reduced) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px" }
    );
    els.forEach((el) => io.observe(el));
  });

  /* ── 6 · Everything below waits for the preloader ──────────────── */
  preloaderDone.then(() => {
    /* 6a · hero typing loop */
    safe(() => {
      const el = $("#typed");
      if (!el) return;
      const roles = [
        "Full-Stack Developer",
        "Cloud & DevOps Enthusiast",
        "AI-Augmented Engineer",
        "Flutter Mobile Developer",
        "Linux Power User",
      ];
      if (reduced) {
        el.textContent = roles[0];
        return;
      }
      let ri = 0, ci = 0, deleting = false;
      const tick = () => {
        const word = roles[ri];
        ci += deleting ? -1 : 1;
        el.textContent = word.slice(0, ci);
        let delay = deleting ? 34 : 62;
        if (!deleting && ci === word.length) { delay = 2300; deleting = true; }
        else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 420; }
        setTimeout(tick, delay);
      };
      setTimeout(tick, 650);
    });

    /* 6b · animated counters */
    safe(() => {
      const nums = $$("[data-count]");
      const animate = (el) => {
        const target = parseInt(el.dataset.count, 10) || 0;
        const suffix = el.dataset.suffix || "";
        if (reduced) { el.textContent = target + suffix; return; }
        const t0 = performance.now();
        const dur = 1500;
        const frame = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      };
      if (!("IntersectionObserver" in window)) { nums.forEach(animate); return; }
      const io = new IntersectionObserver((entries) => {
        for (const en of entries) {
          if (en.isIntersecting) { animate(en.target); io.unobserve(en.target); }
        }
      }, { threshold: 0.4 });
      nums.forEach((n) => io.observe(n));
    });

    /* 6c · terminal typing (about) */
    safe(() => {
      const body = $("#terminalBody");
      if (!body) return;

      const LINES = [
        { cmd: "whoami" },
        { out: "van · full-stack developer · douala, cm" },
        { cmd: "cat stack.txt" },
        { out: "angular · next.js · fastapi · laravel · flutter · postgres" },
        { cmd: "ls ~/infra" },
        { out: "docker/  terraform/  aws/  linux/  git/", hi: true },
        { cmd: "ai --status" },
        { out: "● online · multiplier: excellent", hi: true },
        { cmd: "./ship.sh" },
        { out: "building… ✓  testing… ✓  shipping… ✓", green: true },
      ];

      const renderAll = () => {
        body.innerHTML = LINES.map((l) =>
          l.cmd
            ? `<div class="tl"><span class="tl__p">$ </span><span class="tl__c">${l.cmd}</span></div>`
            : `<div class="tl"><span class="${l.hi ? "tl__hi" : l.green ? "tl__hi2" : "tl__o"}">${l.out}</span></div>`
        ).join("");
      };

      if (reduced || !("IntersectionObserver" in window)) { renderAll(); return; }

      const typeCmd = async (text) => {
        const line = document.createElement("div");
        line.className = "tl";
        line.innerHTML = '<span class="tl__p">$ </span><span class="tl__c"></span><span class="tl__cur"></span>';
        body.appendChild(line);
        const target = line.querySelector(".tl__c");
        for (const ch of text) {
          target.textContent += ch;
          await sleep(26);
        }
        line.querySelector(".tl__cur").remove();
      };

      const putOut = async (l) => {
        await sleep(180);
        const line = document.createElement("div");
        line.className = "tl";
        const cls = l.hi ? "tl__hi" : l.green ? "tl__hi2" : "tl__o";
        line.innerHTML = `<span class="${cls}"></span>`;
        line.firstChild.textContent = l.out;
        body.appendChild(line);
      };

      let played = false;
      const io = new IntersectionObserver(async (entries) => {
        if (!entries.some((e) => e.isIntersecting) || played) return;
        played = true;
        io.disconnect();
        for (const l of LINES) {
          if (l.cmd) await typeCmd(l.cmd);
          else await putOut(l);
        }
      }, { threshold: 0.35 });

      io.observe(body.closest(".terminal") || body);
    });

    /* 6d · particle network (hero) */
    safe(() => {
      const canvas = $("#particles");
      if (!canvas || reduced) return;
      const ctx = canvas.getContext("2d");
      const hero = canvas.closest(".hero");
      if (!ctx || !hero) return;

      let W = 0, H = 0, dpr = 1, pts = [], raf = null, visible = true;
      const mouse = { x: -9e3, y: -9e3 };
      const COLORS = ["34,211,238", "129,140,248", "192,132,252"];

      const resize = () => {
        dpr = Math.min(2, window.devicePixelRatio || 1);
        W = hero.clientWidth;
        H = hero.clientHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.min(85, Math.floor((W * H) / 16500));
        pts = Array.from({ length: count }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.34,
          vy: (Math.random() - 0.5) * 0.34,
          r: 1 + Math.random() * 1.5,
          c: COLORS[(Math.random() * COLORS.length) | 0],
        }));
      };

      const step = () => {
        ctx.clearRect(0, 0, W, H);

        for (const p of pts) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
          if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;

          /* gentle mouse repulsion */
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 150 * 150 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = ((150 - d) / 150) * 0.55;
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }
        }

        /* connections */
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const a = pts[i], b = pts[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 130 * 130) {
              const alpha = (1 - Math.sqrt(d2) / 130) * 0.24;
              ctx.strokeStyle = `rgba(129,140,248,${alpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
          /* link to cursor */
          const p = pts[i];
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 170 * 170) {
            const alpha = (1 - Math.sqrt(d2) / 170) * 0.4;
            ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        /* dots */
        for (const p of pts) {
          ctx.fillStyle = `rgba(${p.c},0.75)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }

        raf = requestAnimationFrame(step);
      };

      const play = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(step); };
      const pause = () => { if (raf) { cancelAnimationFrame(raf); raf = null; } };

      resize();
      play();
      window.addEventListener("resize", () => { resize(); });

      hero.addEventListener("mousemove", (e) => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
      });
      hero.addEventListener("mouseleave", () => { mouse.x = -9e3; mouse.y = -9e3; });

      new IntersectionObserver((en) => {
        visible = en[0].isIntersecting;
        visible ? play() : pause();
      }).observe(hero);
      document.addEventListener("visibilitychange", () => {
        document.hidden ? pause() : play();
      });
    });

    /* 6e · 3D tilt on project media */
    safe(() => {
      if (!finePointer || reduced) return;
      $$("[data-tilt]").forEach((card) => {
        const media = card.querySelector(".project__media");
        if (!media) return;
        card.addEventListener("mouseenter", () => {
          media.style.transition = "transform .1s linear, border-color .35s, box-shadow .45s";
        });
        card.addEventListener("mousemove", (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          media.style.transform = `rotateY(${(px * 6).toFixed(2)}deg) rotateX(${(-py * 6).toFixed(2)}deg)`;
        });
        card.addEventListener("mouseleave", () => {
          media.style.transition = "";
          media.style.transform = "";
        });
      });
    });

    /* 6f · magnetic buttons */
    safe(() => {
      if (!finePointer || reduced) return;
      $$(".magnetic").forEach((el) => {
        el.addEventListener("mousemove", (e) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.22;
          const y = (e.clientY - r.top - r.height / 2) * 0.3;
          el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        });
        el.addEventListener("mouseleave", () => { el.style.transform = ""; });
      });
    });

    /* 6g · cursor glow */
    safe(() => {
      const glow = $("#cursorGlow");
      if (!glow || !finePointer || reduced) return;
      let tx = innerWidth / 2, ty = innerHeight / 3, x = tx, y = ty, shown = false;
      window.addEventListener(
        "mousemove",
        (e) => {
          tx = e.clientX; ty = e.clientY;
          if (!shown) { glow.classList.add("is-on"); shown = true; }
        },
        { passive: true }
      );
      (function loop() {
        x += (tx - x) * 0.11;
        y += (ty - y) * 0.11;
        glow.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        requestAnimationFrame(loop);
      })();
    });
  });

  /* ── 7 · Contact form (validation → mailto) ────────────────────── */
  safe(() => {
    const form = $("#contactForm");
    const note = $("#formNote");
    if (!form) return;

    const setErr = (name, msg) => {
      const el = form.querySelector(`[data-error-for="${name}"]`);
      if (el) el.textContent = msg || "";
    };
    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const name = String(d.get("name") || "").trim();
      const email = String(d.get("email") || "").trim();
      const subject = String(d.get("subject") || "").trim();
      const message = String(d.get("message") || "").trim();

      let ok = true;
      setErr("name"); setErr("email"); setErr("subject"); setErr("message");
      if (note) note.textContent = "";

      if (name.length < 2) { setErr("name", "Please enter your name."); ok = false; }
      if (!isEmail(email)) { setErr("email", "Please enter a valid email."); ok = false; }
      if (subject.length < 2) { setErr("subject", "Please add a subject."); ok = false; }
      if (message.length < 10) { setErr("message", "Message should be at least 10 characters."); ok = false; }
      if (!ok) return;

      const body = `Hi Van,\n\n${message}\n\n${name}\n${email}`;
      window.location.href =
        `mailto:zanguevan31@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (note)
        note.textContent =
          "Opening your email client… or write me directly at zanguevan31@gmail.com.";
      form.reset();
    });
  });
})();
