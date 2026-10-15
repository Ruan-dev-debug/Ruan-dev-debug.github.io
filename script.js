/* Edite aqui: nome (opcional) e WhatsApp com DDI+DDD+número, só dígitos. */
var CONFIG = { nome: "Ruan Dener", whatsapp: "5564984450981" };

(function () {
  "use strict";
  var RM = false;
  try { RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  /* "Reduzir movimento" só desliga movimentos automáticos (chuva de números, cursor piscando). A animação guiada pelo scroll continua. */

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function clamp(x, a, b) { a = a === undefined ? 0 : a; b = b === undefined ? 1 : b; return Math.max(a, Math.min(b, x)); }
  function seg(p, a, b) { return clamp((p - a) / (b - a)); }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  var NS = "http://www.w3.org/2000/svg";
  function S(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* ---------- contato ---------- */
  var d = CONFIG.whatsapp.replace(/\D/g, "");
  var local = d.length > 2 ? d.slice(2) : d, ddd = local.slice(0, 2), rest = local.slice(2);
  var pretty = rest.length >= 8 ? "(" + ddd + ") " + rest.slice(0, rest.length - 4) + "-" + rest.slice(-4) : CONFIG.whatsapp;
  $("#numero").textContent = pretty;
  if (CONFIG.nome) { $("#brand").textContent = CONFIG.nome; $("#foot-nome").textContent = "© " + CONFIG.nome; }
  $$("[data-wa]").forEach(function (a) {
    a.href = "https://wa.me/" + d + "?text=" + encodeURIComponent(a.getAttribute("data-msg") || "");
  });
  var cb = $("#copiar");
  cb.addEventListener("click", function () {
    var ok = function () { cb.textContent = "Número copiado"; setTimeout(function () { cb.textContent = "Copiar número"; }, 2000); };
    var fb = function () {
      var r = document.createRange(); r.selectNodeContents($("#numero"));
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      cb.textContent = "Selecionado, use Ctrl+C";
    };
    try { navigator.clipboard.writeText(pretty).then(ok, fb); } catch (e) { fb(); }
  });

  /* ---------- texto por palavra ---------- */
  function copyInit(id) {
    var sc = $("#" + id), h = $("h2", sc);
    var ws = h.textContent.trim().split(/\s+/);
    h.innerHTML = ws.map(function (w) { return '<span class="w">' + w + "</span>"; }).join(" ");
    return { ws: $$(".w", h), p: $(".copy > p:not(.eyebrow)", sc) };
  }
  function copyP(c, p, a, b) {
    var tp = seg(p, a, b), n = c.ws.length;
    for (var i = 0; i < n; i++) {
      var wp = clamp((tp * (n + 2) - i) / 2);
      c.ws[i].style.opacity = wp;
      c.ws[i].style.transform = "translateY(" + ((1 - wp) * 0.45).toFixed(3) + "em)";
    }
    c.p.style.opacity = seg(p, b - 0.02, b + 0.12);
  }

  /* ---------- cena 1: binário vira computador ---------- */
  var cv = $("#cv"), cx = cv.getContext("2d");
  var c1 = copyInit("s1"), hint = $("#hint");
  var CW = 13, CH = 17, cols = 0, rows = 0, W1 = 0, H1 = 0, DPR = 1;
  var cls, chr, rr1, heads, speeds, idx = [[], [], []], scr = { x: 0, y: 0, w: 0, h: 0 };
  function setup1() {
    var st = cv.parentNode.getBoundingClientRect();
    W1 = st.width; H1 = st.height; if (!W1 || !H1) return;
    DPR = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(W1 * DPR); cv.height = Math.round(H1 * DPR);
    cols = Math.ceil(W1 / CW); rows = Math.ceil(H1 / CH);
    var vr = $("#v1").getBoundingClientRect(), sr = cv.getBoundingClientRect();
    var bx = vr.left - sr.left, by = vr.top - sr.top, bw = vr.width, bh = vr.height;
    var asp = 1.3, W = Math.min(bw, bh * asp), H = W / asp;
    var x0 = bx + (bw - W) / 2, y0 = by + (bh - H) / 2;
    var m = document.createElement("canvas"); m.width = cols; m.height = rows;
    var mc = m.getContext("2d");
    mc.setTransform(1 / CW, 0, 0, 1 / CH, 0, 0);
    var L = 30, mh = H * 0.68;
    mc.fillStyle = "#00ff00"; mc.fillRect(x0 + L, y0 + L, W - 2 * L, mh - 2 * L);
    scr = { x: x0 + L, y: y0 + L, w: W - 2 * L, h: mh - 2 * L };
    mc.strokeStyle = "#ff0000"; mc.lineWidth = L; mc.lineJoin = "round";
    mc.strokeRect(x0 + L / 2, y0 + L / 2, W - L, mh - L);
    mc.fillStyle = "#ff0000";
    mc.fillRect(x0 + W * 0.45, y0 + mh, W * 0.1, H * 0.12);
    mc.fillRect(x0 + W * 0.3, y0 + mh + H * 0.12, W * 0.4, H * 0.05);
    mc.lineWidth = L * 0.8;
    mc.strokeRect(x0 + W * 0.1 + L * 0.4, y0 + H * 0.88 + L * 0.4, W * 0.8 - L * 0.8, H * 0.12 - L * 0.8);
    var data = mc.getImageData(0, 0, cols, rows).data, n = cols * rows;
    cls = new Uint8Array(n); chr = new Uint8Array(n); rr1 = new Float32Array(n);
    idx = [[], [], []];
    for (var i = 0; i < n; i++) {
      var c = data[i * 4] > 128 ? 1 : (data[i * 4 + 1] > 128 ? 2 : 0);
      cls[i] = c; chr[i] = Math.random() < .5 ? 0 : 1; rr1[i] = Math.random(); idx[c].push(i);
    }
    heads = new Float32Array(cols); speeds = new Float32Array(cols);
    for (var k = 0; k < cols; k++) { heads[k] = Math.random() * (rows + 14); speeds[k] = 5 + Math.random() * 9; }
  }
  function draw1(p, dt) {
    if (!cls) return;
    cx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx.clearRect(0, 0, W1, H1);
    var f = ease(seg(p, 0.08, 0.68)), s = ease(seg(p, 0.66, 0.92));
    if (s > 0) {
      var g = cx.createRadialGradient(scr.x + scr.w / 2, scr.y + scr.h / 2, 4, scr.x + scr.w / 2, scr.y + scr.h / 2, Math.max(scr.w, scr.h) * 0.9);
      g.addColorStop(0, "rgba(91,140,255," + (0.34 * s) + ")"); g.addColorStop(1, "rgba(91,140,255,0)");
      cx.fillStyle = g; cx.fillRect(scr.x - scr.w * .5, scr.y - scr.h * .5, scr.w * 2, scr.h * 2);
    }
    cx.font = "14px 'IBM Plex Mono', monospace"; cx.textAlign = "center"; cx.textBaseline = "middle";
    if (!RM) for (var k = 0; k < cols; k++) { heads[k] += speeds[k] * dt; if (heads[k] > rows + 14) heads[k] = -Math.random() * 10; }
    var fills = ["#7FA2FF", "#8FB0FF", "#" + (s > 0.5 ? "D6E4FF" : "6F9BFF")];
    for (var c = 0; c < 3; c++) {
      cx.fillStyle = fills[c];
      var list = idx[c];
      for (var j = 0; j < list.length; j++) {
        var i = list[j], col = i % cols, row = (i / cols) | 0;
        var dd = heads[col] - row, rf = dd >= 0 && dd < 9 ? 1 - dd / 9 : 0;
        var formed = c === 0 ? 0 : clamp(f * 1.5 - rr1[i] * 0.5);
        var a;
        if (c === 0) a = lerp(0.42, 0.07, f) * (0.3 + 0.7 * rf) + 0.025;
        else if (c === 1) a = lerp(0.36 * (0.35 + 0.65 * rf), 1, formed);
        else a = lerp(0.3 * (0.35 + 0.65 * rf), 0.2, formed) + s * 0.78;
        if (!RM && formed < 0.95 && Math.random() < (c === 0 ? 0.02 : 0.03 * (1 - formed))) chr[i] ^= 1;
        cx.globalAlpha = clamp(a, 0, 1);
        cx.fillText(chr[i] ? "1" : "0", col * CW + CW / 2, row * CH + CH / 2);
      }
    }
    cx.globalAlpha = 1;
  }
  function u1(p, dt) {
    copyP(c1, p, 0.18, 0.58);
    hint.style.opacity = 1 - seg(p, 0.02, 0.1);
    draw1(p, dt || 0.016);
  }

  /* ---------- cena 2: código vira site ---------- */
  var c2 = copyInit("s2"), code2 = $("#code2"), wire2 = $("#wire2"), paint2 = $("#paint2");
  var L2 = [
    ["tag", "<header>"], ["tag", "  <nav>Início  Serviços</nav>"], ["tag", "</header>"],
    ["tag", "<h1>Sua loja aberta 24h</h1>"], ["tag", "<p>Peça pelo WhatsApp</p>"], ["tag", "<button>Pedir agora</button>"],
    ["tag", '<div class="cards">'], ["tag", "  <div>Camisetas</div>"], ["tag", "  <div>Tênis</div>"], ["tag", "  <div>Bonés</div>"], ["tag", "</div>"],
    ["cm", "/* estilo */"], ["css", "body{background:#f5f8ff}"], ["css", "h1{font-size:2.4rem}"], ["css", "button{background:#3d6bff}"], ["css", ".cards{display:grid;gap:12px}"]
  ];
  var HC = 0, CC = 0, TOT2 = 0;
  L2.forEach(function (l) { if (l[0] === "tag") HC += l[1].length; else CC += l[1].length; TOT2 += l[1].length; });
  var last2 = -1;
  function u2(p) {
    copyP(c2, p, 0.04, 0.34);
    var typed = Math.floor(seg(p, 0.04, 0.8) * TOT2);
    if (typed !== last2) {
      last2 = typed;
      var rem = typed, out = [];
      for (var i = 0; i < L2.length && rem > 0; i++) {
        var s = L2[i][1], n = Math.min(rem, s.length);
        out.push('<span class="' + L2[i][0] + '">' + esc(s.slice(0, n)) + (rem - n <= 0 && typed < TOT2 ? '<span class="cur"></span>' : "") + "</span>");
        rem -= n;
      }
      code2.innerHTML = out.join("\n");
    }
    var hp = clamp(typed / HC), qp = clamp((typed - HC) / CC);
    wire2.style.clipPath = "inset(0 0 " + ((1 - hp) * 100).toFixed(2) + "% 0)";
    paint2.style.clipPath = "inset(0 0 " + ((1 - qp) * 100).toFixed(2) + "% 0)";
  }

  /* ---------- cena 3: papéis viram tela ---------- */
  var c3 = copyInit("s3"), svg3 = $("#svg3"), P3 = [], rows3 = [], r3 = rng(7);
  S("path", { d: "M185 205 H352", stroke: "#2A3F78", "stroke-width": 2, "stroke-dasharray": "4 7", fill: "none" }, svg3);
  S("rect", { x: 372, y: 28, width: 172, height: 324, rx: 28, fill: "#0F1830", stroke: "#5B8CFF", "stroke-width": 3 }, svg3);
  S("rect", { x: 384, y: 48, width: 148, height: 290, rx: 18, fill: "#0A1226" }, svg3);
  var t3 = S("text", { x: 396, y: 72, fill: "#E6ECFA", "font-size": 13, "font-weight": 600, "font-family": "IBM Plex Sans, sans-serif" }, svg3);
  t3.textContent = "Pedidos de hoje";
  for (var i3 = 0; i3 < 8; i3++) {
    var y3 = 84 + i3 * 31, g3 = S("g", { opacity: 0 }, svg3);
    S("rect", { x: 394, y: y3, width: 128, height: 25, rx: 7, fill: "#1A2750" }, g3);
    S("rect", { x: 403, y: y3 + 8, width: 58, height: 8, rx: 4, fill: "#5B8CFF", opacity: .7 }, g3);
    S("circle", { cx: 507, cy: y3 + 12.5, r: 8, fill: "#3DDC97" }, g3);
    S("path", { d: "M503 " + (y3 + 12.5) + " l3 3 l6 -6", stroke: "#06102A", "stroke-width": 2, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, g3);
    rows3.push(g3);
  }
  for (var k3 = 7; k3 >= 0; k3--) {
    var pg = S("g", {}, svg3);
    S("rect", { x: -60, y: -75, width: 120, height: 150, rx: 5, fill: "#E9EEF9" }, pg);
    S("rect", { x: -48, y: -62, width: 56, height: 9, rx: 3, fill: "#7A93D6" }, pg);
    for (var l3 = 0; l3 < 5; l3++) S("rect", { x: -48, y: -40 + l3 * 18, width: 56 + Math.round(r3() * 38), height: 6, rx: 3, fill: "#B7C4E6" }, pg);
    P3[k3] = { g: pg, rot: (r3() - .5) * 14, ox: k3 * 1.4, oy: -k3 * 2.6 };
  }
  var c3a = $("#c3a"), c3b = $("#c3b");
  function u3(p) {
    copyP(c3, p, 0.04, 0.34);
    for (var i = 0; i < 8; i++) {
      var t = seg(p, 0.07 + i * 0.088, 0.07 + i * 0.088 + 0.16), e = ease(t), P = P3[i];
      var x = lerp(100 + P.ox, 457, e), y = lerp(205 + P.oy, 200, e) - Math.sin(Math.PI * e) * 70;
      P.g.setAttribute("transform", "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ") rotate(" + lerp(P.rot, 0, e).toFixed(2) + ") scale(" + lerp(1, 0.26, e).toFixed(3) + ")");
      P.g.setAttribute("opacity", t < 0.86 ? 1 : 1 - (t - 0.86) / 0.14);
      rows3[i].setAttribute("opacity", seg(t, 0.82, 1));
    }
    var k = seg(p, 0.86, 0.95);
    c3a.style.opacity = 1 - k; c3b.style.opacity = k;
  }

  /* ---------- cena 4: planilha se organiza ---------- */
  var c4 = copyInit("s4"), svg4 = $("#svg4"), r4 = rng(21);
  var X4 = [10, 140, 240, 340], CWID = [126, 96, 96, 90], RH = 34, Y4 = 14, HEAD = ["Cliente", "Data", "Valor", "Status"];
  var D4 = [
    { m: ["ANA SILVA", "12/10", "R$50", "pago"], c: ["Ana Silva", "12/10/2026", "R$ 50,00", "Pago"] },
    { m: ["joao p", "2026-10-13", "120", "PAGO"], c: ["João Pereira", "13/10/2026", "R$ 120,00", "Pago"] },
    { m: ["Loja Sol", "14 out", "R$ 80,5", "?"], c: ["Loja Sol", "14/10/2026", "R$ 80,50", "Pendente"] },
    { m: ["ana silva", "12/10", "R$50", "pago"], dup: 1 },
    { m: ["Mercado Lua", "15/10", "200.00", "ok"], c: ["Mercado Lua", "15/10/2026", "R$ 200,00", "Pago"] },
    { m: ["joao p", "2026-10-13", "120", "PAGO"], dup: 1 },
    { m: ["  Pedro  ", "16-10", "R$75", "pend."], c: ["Pedro Alves", "16/10/2026", "R$ 75,00", "Pendente"] }
  ];
  var MUD = ["#4A2E5C", "#5C4A1F", "#1F4A5C", "#5C2A2A", "#2E5C3A"];
  var cells4 = [], rank = 0;
  function mkCell(txt, ci, yM, yF, opts) {
    var g = S("g", {}, svg4);
    S("rect", { x: 0, y: 0, width: CWID[ci] - 4, height: RH - 4, rx: 5, fill: opts.head ? "#16244A" : "#14203F" }, g);
    var ov = S("rect", { x: 0, y: 0, width: CWID[ci] - 4, height: RH - 4, rx: 5, fill: opts.head ? "#5B8CFF" : MUD[Math.floor(r4() * MUD.length)], opacity: 0 }, g);
    var tx = S("text", { x: 9, y: RH / 2 - 1, "dominant-baseline": "central", fill: "#E6ECFA", "font-size": 13, "font-family": "IBM Plex Sans, sans-serif", "font-weight": opts.head ? 600 : 400 }, g);
    tx.textContent = txt;
    var o = { g: g, ov: ov, tx: tx, ci: ci, yM: yM, yF: yF, r: r4(), dx: (r4() - .5) * 30, dy: (r4() - .5) * 20, rot: (r4() - .5) * 14, mud: r4() < .55 ? .85 : 0, dup: !!opts.dup, head: !!opts.head, m: opts.m, c: opts.c, cur: "" };
    o.fs = 11 + Math.round(r4() * 4); o.it = r4() < .3;
    cells4.push(o); return o;
  }
  HEAD.forEach(function (h, ci) { mkCell(h, ci, Y4, Y4, { head: 1, m: h, c: h }); });
  D4.forEach(function (row, ri) {
    var yM = Y4 + RH * (1 + ri), yF = row.dup ? yM : Y4 + RH * (1 + rank);
    if (!row.dup) rank++;
    for (var ci = 0; ci < 4; ci++) mkCell(row.m[ci], ci, yM, yF, { dup: row.dup, m: row.m[ci], c: row.dup ? row.m[ci] : row.c[ci] });
  });
  var totG = S("g", {}, svg4), totY = Y4 + RH * (1 + rank) + 6;
  S("rect", { x: 10, y: totY, width: 420 - 10, height: RH - 4, rx: 5, fill: "#1A2F63", stroke: "#5B8CFF", "stroke-width": 1.5 }, totG);
  var tt1 = S("text", { x: 19, y: totY + RH / 2 - 1, "dominant-baseline": "central", fill: "#E6ECFA", "font-size": 13, "font-weight": 600, "font-family": "IBM Plex Sans, sans-serif" }, totG); tt1.textContent = "Total";
  var tt2 = S("text", { x: 250, y: totY + RH / 2 - 1, "dominant-baseline": "central", fill: "#7CF0BB", "font-size": 13, "font-weight": 600, "font-family": "IBM Plex Sans, sans-serif" }, totG); tt2.textContent = "R$ 525,50";
  var c4a = $("#c4a"), c4b = $("#c4b"), c4c = $("#c4c");
  function u4(p) {
    copyP(c4, p, 0.03, 0.32);
    var A = seg(p, 0.06, 0.4), N = seg(p, 0.42, 0.56), Dp = seg(p, 0.5, 0.62), C = ease(seg(p, 0.6, 0.76)), H = seg(p, 0.72, 0.84), T = seg(p, 0.82, 0.94);
    for (var i = 0; i < cells4.length; i++) {
      var c = cells4[i], a = ease(clamp(A * 1.6 - c.r * 0.6));
      var x = X4[c.ci], y = c.head ? c.yM : lerp(c.yM, c.yF, C), w = CWID[c.ci] - 4, h = RH - 4;
      c.g.setAttribute("transform", "translate(" + (x + c.dx * (1 - a) + w / 2).toFixed(1) + " " + (y + c.dy * (1 - a) + h / 2).toFixed(1) + ") rotate(" + (c.rot * (1 - a)).toFixed(2) + ") translate(" + (-w / 2) + " " + (-h / 2) + ")");
      if (c.head) { c.ov.setAttribute("opacity", H); }
      else c.ov.setAttribute("opacity", ((1 - a) * c.mud).toFixed(3));
      var clean = !c.head && (N * 1.4 - c.r * 0.4) > 0.5;
      var txt = clean ? c.c : c.m;
      if (txt !== c.cur) { c.cur = txt; c.tx.textContent = txt; }
      c.tx.setAttribute("font-size", clean || c.head ? 13 : lerp(c.fs, 13, a).toFixed(1));
      c.tx.setAttribute("font-style", !clean && !c.head && c.it && a < 1 ? "italic" : "normal");
      c.g.setAttribute("opacity", c.dup ? 1 - Dp : 1);
    }
    totG.setAttribute("opacity", T);
    totG.setAttribute("transform", "translate(0 " + ((1 - T) * 12).toFixed(1) + ")");
    c4a.classList.toggle("on", N > 0.6); c4b.classList.toggle("on", Dp > 0.5); c4c.classList.toggle("on", T > 0.7);
  }

  /* ---------- cena 5: computador sendo montado ---------- */
  var c5 = copyInit("s5"), svg5 = $("#svg5");
  svg5.innerHTML =
    '<rect x="165" y="50" width="250" height="310" rx="14" fill="#0B1428" stroke="#5B8CFF" stroke-width="3"/>' +
    '<circle id="led5" cx="392" cy="72" r="5" fill="#2A3F78"/>' +
    '<g id="p0"><rect x="182" y="316" width="200" height="34" rx="5" fill="#22346A" stroke="#5B8CFF" stroke-width="1.5"/>' +
    '<path d="M200 326 H240 M200 332 H240 M200 338 H240" stroke="#3F5CA8" stroke-width="2"/>' +
    '<text x="312" y="338" text-anchor="middle" font-size="11" fill="#8FB0FF" font-family="IBM Plex Mono, monospace">FONTE</text></g>' +
    '<g id="p1"><rect x="182" y="68" width="200" height="238" rx="6" fill="#12306B" stroke="#3F6FD8" stroke-width="2"/>' +
    '<path d="M198 88 H300 M198 108 V225 H258 M366 88 V196 M300 222 H366 M198 250 H290" stroke="#2A57B8" stroke-width="2" fill="none"/>' +
    '<circle cx="198" cy="88" r="3" fill="#2A57B8"/><circle cx="366" cy="88" r="3" fill="#2A57B8"/><circle cx="366" cy="196" r="3" fill="#2A57B8"/><circle cx="258" cy="225" r="3" fill="#2A57B8"/></g>' +
    '<g id="p2"><rect x="222" y="112" width="54" height="54" rx="4" fill="#2A4FA8" stroke="#8FB0FF" stroke-width="2"/><rect x="232" y="122" width="34" height="34" rx="2" fill="#1B3677"/>' +
    '<text x="249" y="143" text-anchor="middle" font-size="10" fill="#CFE0FF" font-family="IBM Plex Mono, monospace">CPU</text></g>' +
    '<g id="p3"><g id="fan"><circle cx="249" cy="139" r="34" fill="#0F1830" fill-opacity=".92" stroke="#5B8CFF" stroke-width="2"/>' +
    '<ellipse cx="249" cy="121" rx="9" ry="17" fill="#5B8CFF" fill-opacity=".6"/>' +
    '<ellipse cx="249" cy="121" rx="9" ry="17" fill="#5B8CFF" fill-opacity=".6" transform="rotate(90 249 139)"/>' +
    '<ellipse cx="249" cy="121" rx="9" ry="17" fill="#5B8CFF" fill-opacity=".6" transform="rotate(180 249 139)"/>' +
    '<ellipse cx="249" cy="121" rx="9" ry="17" fill="#5B8CFF" fill-opacity=".6" transform="rotate(270 249 139)"/>' +
    '<circle cx="249" cy="139" r="6" fill="#8FB0FF"/></g></g>' +
    '<g id="p4"><rect x="318" y="92" width="11" height="108" rx="2" fill="#8FB0FF"/><rect x="336" y="92" width="11" height="108" rx="2" fill="#8FB0FF"/>' +
    '<rect x="320" y="104" width="7" height="14" fill="#0F1830"/><rect x="320" y="130" width="7" height="14" fill="#0F1830"/><rect x="338" y="104" width="7" height="14" fill="#0F1830"/><rect x="338" y="130" width="7" height="14" fill="#0F1830"/></g>' +
    '<g id="p5"><rect x="198" y="232" width="100" height="38" rx="5" fill="#1A2B55" stroke="#5B8CFF" stroke-width="1.5"/>' +
    '<text x="248" y="256" text-anchor="middle" font-size="12" fill="#8FB0FF" font-family="IBM Plex Mono, monospace">SSD</text></g>' +
    '<g id="p6"><rect x="165" y="50" width="250" height="310" rx="14" fill="rgba(91,140,255,0.13)" stroke="#8FB0FF" stroke-width="2"/><polygon points="165,250 415,110 415,175 165,315" fill="rgba(255,255,255,0.05)"/></g>' +
    '<text id="boot5" x="290" y="30" text-anchor="middle" font-size="14" fill="#7CF0BB" font-family="IBM Plex Mono, monospace" opacity="0">Sistema iniciado</text>';
  var PART5 = [
    { c: [282, 333], o: [-130, 40], r: 6 }, { c: [282, 187], o: [-165, -25], r: -8 }, { c: [249, 139], o: [-110, -95], r: 12 },
    { c: [249, 139], o: [150, -90], r: -15 }, { c: [332, 146], o: [190, -30], r: 10 }, { c: [248, 251], o: [-150, 115], r: -6 }, { c: [290, 205], o: [170, 0], r: 0 }
  ];
  PART5.forEach(function (P, i) { P.g = $("#p" + i, svg5); });
  var fan5 = $("#fan", svg5), led5 = $("#led5", svg5), boot5 = $("#boot5", svg5), chips5 = $$("#chips5 .chip");
  function u5(p) {
    copyP(c5, p, 0.04, 0.34);
    for (var i = 0; i < PART5.length; i++) {
      var P = PART5[i], t = seg(p, 0.06 + i * 0.105, 0.06 + i * 0.105 + 0.14), e = ease(t);
      P.g.setAttribute("transform", "translate(" + (P.o[0] * (1 - e)).toFixed(1) + " " + (P.o[1] * (1 - e)).toFixed(1) + ") rotate(" + (P.r * (1 - e)).toFixed(2) + " " + P.c[0] + " " + P.c[1] + ")");
      chips5[i].classList.toggle("on", t >= 0.999);
    }
    fan5.setAttribute("transform", "rotate(" + (p * 1440).toFixed(1) + " 249 139)");
    var b = seg(p, 0.88, 0.97);
    boot5.setAttribute("opacity", b); led5.setAttribute("fill", b > 0.1 ? "#3DDC97" : "#2A3F78");
  }

  /* ---------- cena 6: prompt ruim vs prompt estruturado ---------- */
  var c6 = copyInit("s6");
  var T6 = {
    u1: "faz um texto pra minha loja",
    a1: "Claro! Venha conhecer nossa loja. Temos produtos de qualidade e ótimos preços para você.",
    u2: '{\n  "papel": "social media de loja de bairro",\n  "tarefa": "legenda de Instagram",\n  "oferta": "camisetas a R$ 39 até domingo",\n  "tom": "animado e curto",\n  "formato": "legenda + 3 hashtags"\n}',
    a2: "Camisetas a R$ 39 só até domingo! Passe aqui e escolha a sua. #camisetas #promoção #lojadebairro"
  };
  var E6 = { u1: $("#u1"), a1: $("#a1"), u2: $("#u2"), a2: $("#a2"), m1: $("#m1"), m2: $("#m2"), m3: $("#m3"), m4: $("#m4"), t1: $("#t1"), t2: $("#t2"), rounds: $("#rounds"), r1: $("#r1") };
  var shift6 = 0;
  function measure6() { shift6 = E6.r1.offsetHeight + 22; }
  function typeTo(el, box, key, t) {
    var s = T6[key], n = Math.floor(clamp(t) * s.length);
    el.textContent = s.slice(0, n);
    box.style.opacity = t > 0 ? 1 : 0;
    var span = el.parentNode.classList.contains("msg") ? el.parentNode : el;
    span.classList.toggle("typing", t > 0 && t < 1);
  }
  function u6(p) {
    copyP(c6, p, 0.03, 0.3);
    typeTo(E6.u1, E6.m1, "u1", seg(p, 0.04, 0.17));
    typeTo(E6.a1, E6.m2, "a1", seg(p, 0.19, 0.33));
    E6.t1.style.opacity = seg(p, 0.34, 0.4);
    typeTo(E6.u2, E6.m3, "u2", seg(p, 0.5, 0.72));
    typeTo(E6.a2, E6.m4, "a2", seg(p, 0.74, 0.9));
    E6.t2.style.opacity = seg(p, 0.91, 0.97);
    E6.rounds.style.transform ="translateY(" + (-shift6 * ease(seg(p, 0.42, 0.54))).toFixed(1) + "px)";
    E6.r1.style.opacity = 1 - 0.65 * seg(p, 0.44, 0.54);
  }

  /* ---------- motor de scroll ---------- */
  var scenes = [
    { el: $("#s1"), u: u1, always: true }, { el: $("#s2"), u: u2 }, { el: $("#s3"), u: u3 },
    { el: $("#s4"), u: u4 }, { el: $("#s5"), u: u5 }, { el: $("#s6"), u: u6 }
  ];
  var dotsBox = $("#dots"), dotBtns = [], bar = $("#bar"), vh = window.innerHeight;
  scenes.forEach(function (s, i) {
    s.stage = $(".stage", s.el); s.last = -1;
    var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Ir para a cena " + (i + 1));
    b.addEventListener("click", function () {
      if (FLOW) { s.el.scrollIntoView({ behavior: RM ? "auto" : "smooth" }); return; }
      var r = s.el.getBoundingClientRect(), room = r.height - s.stage.offsetHeight;
      window.scrollTo({ top: window.pageYOffset + r.top + room * 0.02, behavior: RM ? "auto" : "smooth" });
    });
    dotsBox.appendChild(b); dotBtns.push(b);
  });
  function onResize() { vh = window.innerHeight; setup1(); measure6(); scenes.forEach(function (s) { s.last = -1; }); }
  window.addEventListener("resize", onResize);

  var prev = performance.now();
  function frame(now) {
    var dt = Math.min(0.05, (now - prev) / 1000); prev = now;
    var active = 0;
    for (var i = 0; i < scenes.length; i++) {
      var s = scenes[i], r = s.el.getBoundingClientRect(), target = null;
      if (r.top <= vh * 0.5) active = i;
      if (FLOW) {
        target = s.started ? clamp((now - s.t0) / 9000) : 0;
      } else if (r.top < vh && r.bottom > 0) {
        var room = r.height - s.stage.offsetHeight;
        target = room > 0 ? clamp(-r.top / room) : 0;
      }
      if (target === null) continue;
      if (s.cur === undefined || FLOW) s.cur = target;
      else {
        s.cur += (target - s.cur) * (1 - Math.exp(-dt * 10));
        if (Math.abs(target - s.cur) < 0.0005) s.cur = target;
      }
      if (s.always || Math.abs(s.cur - s.last) > 0.0004) { s.last = s.cur; s.u(s.cur, dt); }
    }
    dotBtns.forEach(function (b, i) { b.classList.toggle("on", i === active); });
    var max = document.documentElement.scrollHeight - vh;
    bar.style.transform = "scaleX(" + (max > 0 ? clamp(window.pageYOffset / max) : 0).toFixed(4) + ")";
    requestAnimationFrame(frame);
  }

  /* Modo reserva: se a página não consegue rolar (alguns visualizadores embutidos), cada cena anima sozinha quando aparece. Para testar: adicione ?flow ao endereço. */
  var FLOW = false;
  function enableFlow() {
    FLOW = true;
    document.body.classList.add("flow");
    scenes.forEach(function (s) { s.started = false; s.t0 = 0; s.last = -1; });
    var seen = false;
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        seen = true;
        es.forEach(function (e) {
          for (var i = 0; i < scenes.length; i++) {
            if (scenes[i].el === e.target && e.isIntersecting && !scenes[i].started) { scenes[i].started = true; scenes[i].t0 = performance.now(); }
          }
        });
      }, { threshold: 0.3 });
      scenes.forEach(function (s) { io.observe(s.el); });
    }
    setTimeout(function () {
      if (seen) return;
      var t = performance.now();
      scenes.forEach(function (s, i) { if (!s.started) { s.started = true; s.t0 = t + i * 9000; } });
    }, 2500);
    setTimeout(function () { setup1(); measure6(); }, 60);
  }
  function detectFlow() {
    var y0 = window.pageYOffset;
    if (y0 > 0) return;
    window.scrollTo(0, 40);
    requestAnimationFrame(function () {
      var moved = window.pageYOffset > 10;
      window.scrollTo(0, 0);
      if (!moved) enableFlow();
    });
  }

  var started = false;
  function boot() {
    if (started) return;
    started = true;
    setup1(); measure6();
    requestAnimationFrame(frame);
    if (/[?&]flow\b/.test(location.search)) enableFlow(); else setTimeout(detectFlow, 700);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot, boot); else boot();
  setTimeout(function () { if (!cls) boot(); }, 1500);
})();
