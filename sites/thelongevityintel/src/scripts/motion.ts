/* Motion layer: home hero molecule field, card glow, stat count-ups. Loaded dynamically after window load + idle by Base.astro,
   never on articles and never under prefers-reduced-motion. Adds to a complete static page; JS off changes nothing.
   Never touches article or medical text: count-ups only run on the numeric headline tiles of the statistics page. */

const all = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
const lite = (nav.hardwareConcurrency ?? 8) <= 4 || !!nav.connection?.saveData;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const root = document.documentElement;

/** run start() while el is on screen and the tab is visible, stop() otherwise */
function whileVisible(el: Element, start: () => void, stop: () => void) {
  let inView = false;
  const sync = () => (inView && !document.hidden ? start() : stop());
  new IntersectionObserver((es) => { inView = es[es.length - 1].isIntersecting; sync(); }, { threshold: 0.01 }).observe(el);
  document.addEventListener("visibilitychange", sync);
}

// ---------- 1. Hero: slowly drifting molecules and a soft particle field ----------
const hero = document.querySelector<HTMLElement>('[data-motion-slot="hero"]');
if (hero && !lite) setTimeout(() => initMolecules(hero), 500);

type Atom = { x: number; y: number; z: number; r: number };
type Mol = { atoms: Atom[]; bonds: [number, number][]; x: number; y: number; depth: number; spin: number; spinV: number; yaw: number; yawV: number; vx: number; vy: number; scale: number; hue: 0 | 1; pulse: number };

function makeMolecule(kind: number, rnd: () => number): Pick<Mol, "atoms" | "bonds"> {
  const atoms: Atom[] = [], bonds: [number, number][] = [];
  if (kind === 0) { // benzene-like ring with two substituents
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; atoms.push({ x: Math.cos(a), y: Math.sin(a), z: (rnd() - 0.5) * 0.4, r: 1 }); bonds.push([i, (i + 1) % 6]); }
    atoms.push({ x: 2, y: 0.1, z: 0.2, r: 0.7 }); bonds.push([0, 6]);
    atoms.push({ x: -1.9, y: -1.1, z: -0.2, r: 0.7 }); bonds.push([3, 7]);
  } else if (kind === 1) { // fused ring plus five-member ring (indole-like)
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; atoms.push({ x: Math.cos(a) - 0.87, y: Math.sin(a), z: (rnd() - 0.5) * 0.4, r: 1 }); bonds.push([i, (i + 1) % 6]); }
    const s = atoms.length;
    for (let i = 0; i < 3; i++) { const a = -0.9 + i * 0.9; atoms.push({ x: Math.cos(a) * 1.15 + 0.35, y: Math.sin(a) * 1.15, z: 0, r: 0.85 }); }
    bonds.push([0, s], [s, s + 1], [s + 1, s + 2], [s + 2, 5]);
  } else { // branching chain
    const n = 6; let px = -2.4;
    for (let i = 0; i < n; i++) { px += 0.95; const py = (i % 2 ? 0.55 : -0.35) + (rnd() - 0.5) * 0.15; atoms.push({ x: px, y: py, z: (rnd() - 0.5) * 0.5, r: i % 3 === 0 ? 1 : 0.8 }); if (i) bonds.push([i - 1, i]); }
    atoms.push({ x: atoms[2].x, y: atoms[2].y + 1.1, z: 0.2, r: 0.7 }); bonds.push([2, n]);
    atoms.push({ x: atoms[4].x, y: atoms[4].y - 1.1, z: -0.2, r: 0.7 }); bonds.push([4, n + 1]);
  }
  return { atoms, bonds };
}

function initMolecules(host: HTMLElement) {
  const canvas = document.createElement("canvas");
  canvas.className = "mol-gl"; canvas.setAttribute("aria-hidden", "true");
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;
  // seeded so every visit draws the same calm composition
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  let W = 0, H = 0, dpr = 1, mols: Mol[] = [], dust: { x: number; y: number; z: number; v: number; ph: number }[] = [];
  const build = () => {
    seed = 7;
    const n = W < 700 ? 6 : 11;
    mols = Array.from({ length: n }, (_, i) => {
      const m = makeMolecule(i % 3, rnd), depth = 0.35 + rnd() * 0.65;
      return { ...m, x: rnd() * W, y: rnd() * H, depth, spin: rnd() * 6.28, spinV: (rnd() - 0.5) * 0.06, yaw: rnd() * 6.28, yawV: 0.05 + rnd() * 0.06, vx: (rnd() - 0.3) * 5 * depth, vy: -(1.5 + rnd() * 3) * depth, scale: (W < 700 ? 15 : 22) + depth * 22, hue: (i % 4 === 3 ? 1 : 0) as 0 | 1, pulse: rnd() };
    });
    dust = Array.from({ length: W < 700 ? 22 : 46 }, () => ({ x: rnd() * W, y: rnd() * H, z: 0.2 + rnd() * 0.8, v: 2 + rnd() * 5, ph: rnd() * 6.28 }));
  };
  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    W = host.clientWidth; H = host.clientHeight;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    build();
  };
  size();
  let rt = 0; addEventListener("resize", () => { clearTimeout(rt); rt = window.setTimeout(size, 150); }, { passive: true });
  host.insertBefore(canvas, host.firstChild);

  let dark = root.classList.contains("dark");
  new MutationObserver(() => { dark = root.classList.contains("dark"); }).observe(root, { attributes: true, attributeFilter: ["class"] });
  const col = (hue: 0 | 1, a: number) => (hue ? (dark ? `rgba(224,154,58,${a})` : `rgba(193,125,42,${a})`) : (dark ? `rgba(77,196,120,${a})` : `rgba(45,158,88,${a})`));

  let raf = 0, last = 0, t = 0, tx = 0, ty = 0, mx = 0, my = 0;
  if (fine) host.addEventListener("pointermove", (e) => { const b = host.getBoundingClientRect(); tx = ((e as PointerEvent).clientX - b.left) / b.width - 0.5; ty = ((e as PointerEvent).clientY - b.top) / b.height - 0.5; }, { passive: true });

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (now - last < 33) return; // ~30 fps
    const dt = Math.min((now - last) / 1000, 0.1); last = now; t += dt;
    mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    for (const d of dust) {
      d.y -= d.v * d.z * dt; d.x += Math.sin(t * 0.3 + d.ph) * 3 * dt;
      if (d.y < -4) { d.y = H + 4; d.x = Math.random() * W; }
      if (d.x < -4) d.x = W + 4; if (d.x > W + 4) d.x = -4;
      ctx.fillStyle = col(0, (0.10 + 0.22 * d.z) * (0.6 + 0.4 * Math.sin(t * 0.8 + d.ph)));
      ctx.beginPath(); ctx.arc(d.x - mx * 30 * d.z, d.y - my * 20 * d.z, 0.9 + d.z * 1.1, 0, 6.2832); ctx.fill();
    }
    ctx.lineCap = "round";
    for (const m of mols) {
      m.x += m.vx * dt; m.y += m.vy * dt; m.spin += m.spinV * dt; m.yaw += m.yawV * dt;
      const pad = m.scale * 3;
      if (m.y < -pad) { m.y = H + pad; m.x = Math.random() * W; }
      if (m.x < -pad) m.x = W + pad; if (m.x > W + pad) m.x = -pad;
      const cs = Math.cos(m.spin), sn = Math.sin(m.spin), cy = Math.cos(m.yaw), sy = Math.sin(m.yaw);
      const ox = m.x - mx * 60 * m.depth, oy = m.y - my * 40 * m.depth;
      const P = m.atoms.map((a) => { // y-axis turn (pseudo 3D) then in-plane spin
        const x1 = a.x * cy + a.z * sy, z1 = -a.x * sy + a.z * cy;
        return { x: ox + (x1 * cs - a.y * sn) * m.scale, y: oy + (x1 * sn + a.y * cs) * m.scale, z: z1, r: a.r };
      });
      const base = 0.10 + 0.22 * m.depth;
      ctx.strokeStyle = col(m.hue, base); ctx.lineWidth = 0.8 + m.depth * 0.9;
      ctx.beginPath(); for (const [i, j] of m.bonds) { ctx.moveTo(P[i].x, P[i].y); ctx.lineTo(P[j].x, P[j].y); } ctx.stroke();
      // a slow pulse of "signal" travelling one bond at a time
      const ph = t * 0.35 + m.pulse * 10, bi = Math.floor(ph) % m.bonds.length, bt = ph % 1, [pi, pj] = m.bonds[bi];
      ctx.fillStyle = col(m.hue, 0.55 * m.depth + 0.15);
      ctx.beginPath(); ctx.arc(P[pi].x + (P[pj].x - P[pi].x) * bt, P[pi].y + (P[pj].y - P[pi].y) * bt, 1.6 + m.depth, 0, 6.2832); ctx.fill();
      for (const p of P) {
        const rr = (2 + p.r * 2.2 * m.depth) * (1 + p.z * 0.15);
        ctx.fillStyle = col(m.hue, base * 0.5); ctx.beginPath(); ctx.arc(p.x, p.y, rr * 2.2, 0, 6.2832); ctx.fill();
        ctx.fillStyle = col(m.hue, base + 0.12); ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, 6.2832); ctx.fill();
      }
    }
  };
  whileVisible(host, () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); canvas.classList.add("on"); } }, () => { cancelAnimationFrame(raf); raf = 0; });
}

// ---------- 2. Soft cursor glow on lift cards (fine pointers; the hover lift itself is CSS) ----------
if (fine && !lite) {
  for (const el of all<HTMLElement>("a.lift")) {
    let raf = 0, ev: PointerEvent | null = null;
    const apply = () => { raf = 0; if (!ev) return; const b = el.getBoundingClientRect(); el.style.setProperty("--mx", (((ev.clientX - b.left) / b.width) * 100).toFixed(1) + "%"); el.style.setProperty("--my", (((ev.clientY - b.top) / b.height) * 100).toFixed(1) + "%"); };
    el.addEventListener("pointerenter", () => el.classList.add("glow"));
    el.addEventListener("pointermove", (e) => { ev = e as PointerEvent; if (!raf) raf = requestAnimationFrame(apply); }, { passive: true });
    el.addEventListener("pointerleave", () => el.classList.remove("glow"));
  }
}

// ---------- 3. Count-ups on the statistics headline tiles (final numbers are already in the HTML) ----------
{
  const els = all<HTMLElement>(".st-val");
  if (els.length) {
    const io = new IntersectionObserver((es) => {
      for (const e of es) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        const el = e.target as HTMLElement, txt = (el.textContent ?? "").trim();
        const m = /^(\$?)(\d+(?:\.\d+)?)(.*)$/.exec(txt);
        if (!m) continue;
        const [, pre, num, post] = m, to = Number(num), dec = (num.split(".")[1] ?? "").length, t0 = performance.now(), dur = 1100;
        el.style.minWidth = el.offsetWidth + "px"; // final width reserved: no layout shift while digits change
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / dur), v = to * (1 - Math.pow(1 - p, 3));
          el.textContent = pre + (p < 1 ? v.toFixed(dec) : num) + post;
          if (p < 1) requestAnimationFrame(step);
        };
        el.textContent = pre + (0).toFixed(dec) + post; requestAnimationFrame(step);
      }
    }, { threshold: 0.6 });
    els.forEach((e) => io.observe(e));
  }
}
