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
    return { ws: $$(".w", h), p: $(".copy > .cb", sc) };
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

  /* ---------- cena 1: partículas formam um computador; 0 e 1 só na tela ---------- */
  var cvP = $("#cv"), cxP = cvP.getContext("2d"), cvS = $("#cvs"), cxS = cvS.getContext("2d");
  var c1 = copyInit("s1"), hint = $("#hint");
  var DPR = 1, W1 = 0, H1 = 0, tsec = 0;
  var PN = 0, pSX, pSY, pTX, pTY, pAX, pAY, pDL, pPH, pSZ, pTA, pGrp = [], pal = [];
  var scr = { x: 0, y: 0, w: 0, h: 0 }, cells = [], fsz = 12, lastF = -1;
  var COMP_ASP = 1.04;

  /* Desenha um computador com acabamento metálico. O resultado vira o "molde" das partículas. */
  function paintComputer(g, W, H) {
    var u = W / 100;
    function rr(x, y, w, h, r) {
      x *= u; y *= u; w *= u; h *= u; r *= u;
      g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
      g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
    }
    function lg(x0, y0, x1, y1, st) {
      var gr = g.createLinearGradient(x0 * u, y0 * u, x1 * u, y1 * u);
      st.forEach(function (s) { gr.addColorStop(s[0], s[1]); }); return gr;
    }
    g.clearRect(0, 0, W, H);
    /* sombra no chão */
    g.save(); g.translate(50 * u, 101.5 * u); g.scale(1, 0.06);
    var sh = g.createRadialGradient(0, 0, 1, 0, 0, 54 * u);
    sh.addColorStop(0, "rgba(70,110,210,.55)"); sh.addColorStop(1, "rgba(70,110,210,0)");
    g.fillStyle = sh; g.fillRect(-60 * u, -60 * u, 120 * u, 120 * u); g.restore();
    /* pescoço do suporte */
    g.beginPath(); g.moveTo(43 * u, 65 * u); g.lineTo(57 * u, 65 * u); g.lineTo(55.5 * u, 82 * u); g.lineTo(44.5 * u, 82 * u); g.closePath();
    g.fillStyle = lg(43, 0, 57, 0, [[0, "#7886A6"], [.3, "#E9EFFB"], [.62, "#B3BFD8"], [1, "#6F7D9D"]]); g.fill();
    /* base do suporte */
    rr(29, 81, 42, 3.4, 1.7); g.fillStyle = lg(0, 81, 0, 84.4, [[0, "#F4F7FD"], [.5, "#B9C5DD"], [1, "#7C8AAA"]]); g.fill();
    /* corpo do monitor */
    rr(6, 2, 88, 64, 3); g.fillStyle = lg(0, 2, 0, 66, [[0, "#F2F6FD"], [.45, "#C6D1E6"], [1, "#8997B6"]]); g.fill();
    g.save(); rr(6, 2, 88, 64, 3); g.clip();
    g.fillStyle = lg(6, 0, 94, 0, [[0, "rgba(255,255,255,.35)"], [.25, "rgba(255,255,255,0)"], [.8, "rgba(80,96,138,0)"], [1, "rgba(80,96,138,.35)"]]);
    g.fillRect(6 * u, 2 * u, 88 * u, 64 * u);
    g.fillStyle = lg(0, 58, 0, 66, [[0, "rgba(110,124,160,0)"], [1, "rgba(110,124,160,.5)"]]); g.fillRect(6 * u, 58 * u, 88 * u, 8 * u);
    g.restore();
    g.lineWidth = .5 * u; g.strokeStyle = "rgba(255,255,255,.95)"; rr(6.3, 2.3, 87.4, 63.4, 2.8); g.stroke();
    /* moldura interna e furo da tela (a tela é desenhada em outra camada) */
    rr(8.8, 4.8, 82.4, 54.4, 1.8); g.fillStyle = "#3C4868"; g.fill();
    g.globalCompositeOperation = "destination-out"; rr(9.9, 5.9, 80.2, 52.2, 1.2); g.fillStyle = "#000"; g.fill(); g.globalCompositeOperation = "source-over";
    /* detalhes: câmera e logotipo no queixo */
    g.fillStyle = "#2B3552"; g.beginPath(); g.arc(50 * u, 3.5 * u, .55 * u, 0, 7); g.fill();
    g.fillStyle = "rgba(96,110,146,.95)"; g.beginPath(); g.arc(50 * u, 62.3 * u, 1.3 * u, 0, 7); g.fill();
    /* teclado em perspectiva */
    var TL = [26, 88], TR = [74, 88], BR = [81, 99], BL = [19, 99];
    function P(a, b) {
      var xl = TL[0] + (BL[0] - TL[0]) * b, xr = TR[0] + (BR[0] - TR[0]) * b;
      return [(xl + (xr - xl) * a) * u, (TL[1] + (BL[1] - TL[1]) * b) * u];
    }
    g.beginPath(); g.moveTo(TL[0] * u, TL[1] * u); g.lineTo(TR[0] * u, TR[1] * u); g.lineTo(BR[0] * u, BR[1] * u); g.lineTo(BL[0] * u, BL[1] * u); g.closePath();
    g.fillStyle = lg(0, 88, 0, 99, [[0, "#B0BDD8"], [1, "#7886A8"]]); g.fill();
    g.lineWidth = .35 * u; g.strokeStyle = "rgba(255,255,255,.55)"; g.stroke();
    var rowsK = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1.3, 1.3, 1.3, 6.4, 1.3, 1.3, 1.3]];
    for (var r = 0; r < rowsK.length; r++) {
      var ws = rowsK[r], tot = ws.reduce(function (a, b) { return a + b; }, 0), acc = 0;
      var v0 = .1 + .78 * (r / rowsK.length) + .025, v1 = .1 + .78 * ((r + 1) / rowsK.length) - .025;
      for (var c = 0; c < ws.length; c++) {
        var a0 = .04 + .92 * (acc / tot) + .008, a1 = .04 + .92 * ((acc + ws[c]) / tot) - .008; acc += ws[c];
        var q0 = P(a0, v0), q1 = P(a1, v0), q2 = P(a1, v1), q3 = P(a0, v1);
        g.beginPath(); g.moveTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]); g.lineTo(q2[0], q2[1]); g.lineTo(q3[0], q3[1]); g.closePath();
        g.fillStyle = r === rowsK.length - 1 ? "#E4EBF8" : "#F3F7FE"; g.fill();
      }
    }
    /* mouse */
    g.save(); g.translate(90 * u, 94 * u); g.scale(1, 1.5);
    g.fillStyle = lg(87, 0, 93, 0, [[0, "#EDF2FB"], [1, "#8E9CBA"]]); g.beginPath(); g.arc(0, 0, 3 * u, 0, 7); g.fill(); g.restore();
    g.strokeStyle = "rgba(110,124,160,.8)"; g.lineWidth = .35 * u;
    g.beginPath(); g.moveTo(90 * u, 89.8 * u); g.lineTo(90 * u, 93 * u); g.stroke();
  }

  function setup1() {
    var st = cvP.parentNode.getBoundingClientRect();
    W1 = st.width; H1 = st.height; if (!W1 || !H1) return;
    DPR = Math.min(2, window.devicePixelRatio || 1);
    [cvP, cvS].forEach(function (c) { c.width = Math.round(W1 * DPR); c.height = Math.round(H1 * DPR); });
    var vr = $("#v1").getBoundingClientRect(), sr = cvP.getBoundingClientRect();
    var bx = vr.left - sr.left, by = vr.top - sr.top, bw = vr.width, bh = vr.height;
    var size = Math.floor(Math.min(bw, bh / COMP_ASP, 640)), Wc = size, Hc = Math.round(size * COMP_ASP);
    var x0 = bx + (bw - Wc) / 2, y0 = by + (bh - Hc) / 2;
    var off = document.createElement("canvas"); off.width = Wc; off.height = Hc;
    var og = off.getContext("2d"); paintComputer(og, Wc, Hc);
    var data = og.getImageData(0, 0, Wc, Hc).data, area = 0, i;
    for (i = 3; i < data.length; i += 4) area += data[i] / 255;
    var N = (Wc > 380 ? 12000 : 6500), step = Math.max(2, Math.sqrt(area / N)), list = [];
    var u = Wc / 100;
    for (var gy = 0; gy < Hc; gy += step) for (var gx = 0; gx < Wc; gx += step) {
      var px = gx + Math.random() * step, py = gy + Math.random() * step;
      if (px >= Wc || py >= Hc) continue;
      var o = ((py | 0) * Wc + (px | 0)) * 4, a = data[o + 3] / 255;
      if (a < 0.04 || Math.random() > a) continue;
      var j = 0.92 + Math.random() * 0.16;
      var r = Math.min(255, data[o] * j + 6), g2 = Math.min(255, data[o + 1] * j + 8), b = Math.min(255, data[o + 2] * j + 14);
      list.push({ tx: x0 + px, ty: y0 + py, r: r, g: g2, b: b, ta: 0.55 + 0.45 * a, sz: 1.5 + Math.random() * 1.0 });
    }
    var dust = 150;
    for (i = 0; i < dust; i++) list.push({ tx: 0, ty: 0, r: 143, g: 176, b: 255, ta: 0.3, sz: 1 + Math.random() * 1.2, dust: 1 });
    list.forEach(function (q) {
      q.key = (q.r >> 3) << 10 | (q.g >> 3) << 5 | (q.b >> 3);
      q.sx = W1 * (0.28 + 0.8 * Math.random()); q.sy = Math.random() * H1;
      if (q.dust) { q.tx = q.sx; q.ty = q.sy; }
    });
    list.sort(function (a, b) { return a.key - b.key; });
    PN = list.length;
    pSX = new Float32Array(PN); pSY = new Float32Array(PN); pTX = new Float32Array(PN); pTY = new Float32Array(PN);
    pAX = new Float32Array(PN); pAY = new Float32Array(PN); pDL = new Float32Array(PN); pPH = new Float32Array(PN);
    pSZ = new Float32Array(PN); pTA = new Float32Array(PN); pGrp = []; pal = [];
    var lastKey = -1;
    for (i = 0; i < PN; i++) {
      var q = list[i];
      if (q.key !== lastKey) {
        lastKey = q.key;
        pal.push("rgb(" + ((q.key >> 10 & 31) * 8 + 4) + "," + ((q.key >> 5 & 31) * 8 + 4) + "," + ((q.key & 31) * 8 + 4) + ")");
        pGrp.push(i);
      }
      pSX[i] = q.sx; pSY[i] = q.sy; pTX[i] = q.tx; pTY[i] = q.ty;
      var dx = q.tx - q.sx, dy = q.ty - q.sy, len = Math.sqrt(dx * dx + dy * dy) || 1, amp = (Math.random() - 0.5) * 150;
      pAX[i] = -dy / len * amp; pAY[i] = dx / len * amp;
      pDL[i] = q.dust ? 9 : ((q.ty - y0) / Hc) * 0.34 + Math.random() * 0.16;
      pPH[i] = Math.random() * 6.283; pSZ[i] = q.sz; pTA[i] = q.ta;
    }
    pGrp.push(PN);
    /* tela: grade de 0 e 1 */
    scr = { x: x0 + 9.9 * u, y: y0 + 5.9 * u, w: 80.2 * u, h: 52.2 * u };
    var rowsS = Math.max(8, Math.round(scr.h / 17));
    fsz = scr.h / rowsS;
    var colsS = Math.max(8, Math.floor(scr.w / (fsz * 0.62)));
    cells = [];
    for (var rr2 = 0; rr2 < rowsS; rr2++) for (var cc = 0; cc < colsS; cc++) {
      cells.push({ x: scr.x + (cc + 0.5) * (scr.w / colsS), y: scr.y + (rr2 + 0.5) * (scr.h / rowsS), ch: Math.random() < .5 ? "0" : "1", rf: rr2 / rowsS, rnd: Math.random(), br: Math.random() < 0.18, al: 0.3 + Math.random() * 0.7 });
    }
    lastF = -1;
  }

  function drawParticles(f) {
    cxP.setTransform(DPR, 0, 0, DPR, 0, 0);
    cxP.clearRect(0, 0, W1, H1);
    var drift = !RM, tt = f * 1.5, i, gI, g0, g1;
    for (gI = 0; gI < pal.length; gI++) {
      cxP.fillStyle = pal[gI]; g0 = pGrp[gI]; g1 = pGrp[gI + 1];
      for (i = g0; i < g1; i++) {
        var t = tt - pDL[i]; t = t < 0 ? 0 : (t > 1 ? 1 : t);
        var e = t * t * (3 - 2 * t), sw = Math.sin(3.14159 * e);
        var x = pSX[i] + (pTX[i] - pSX[i]) * e + pAX[i] * sw, y = pSY[i] + (pTY[i] - pSY[i]) * e + pAY[i] * sw;
        if (drift && e < 1) { x += Math.sin(tsec * 0.8 + pPH[i]) * 3.5 * (1 - e); y += Math.cos(tsec * 0.7 + pPH[i]) * 3.5 * (1 - e); }
        var sz = pSZ[i] * (0.7 + 0.3 * e);
        cxP.globalAlpha = (0.22 + 0.78 * e) * pTA[i];
        cxP.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      }
    }
    cxP.globalAlpha = 1;
  }

  function drawScreen(s) {
    cxS.setTransform(DPR, 0, 0, DPR, 0, 0);
    cxS.clearRect(0, 0, W1, H1);
    if (s <= 0.001) return;
    var cxm = scr.x + scr.w / 2, cym = scr.y + scr.h / 2, R = Math.max(scr.w, scr.h) * 1.05;
    var gl = cxS.createRadialGradient(cxm, cym, 6, cxm, cym, R);
    gl.addColorStop(0, "rgba(91,140,255," + (0.34 * s) + ")"); gl.addColorStop(1, "rgba(91,140,255,0)");
    cxS.fillStyle = gl; cxS.fillRect(cxm - R, cym - R, R * 2, R * 2);
    cxS.save();
    cxS.beginPath(); cxS.rect(scr.x, scr.y, scr.w, scr.h); cxS.clip();
    var bg = cxS.createLinearGradient(0, scr.y, 0, scr.y + scr.h);
    bg.addColorStop(0, "#0E2358"); bg.addColorStop(1, "#050B20");
    cxS.globalAlpha = Math.min(1, s * 1.6); cxS.fillStyle = bg; cxS.fillRect(scr.x, scr.y, scr.w, scr.h);
    cxS.font = "500 " + fsz.toFixed(1) + "px 'IBM Plex Mono', monospace"; cxS.textAlign = "center"; cxS.textBaseline = "middle";
    var flick = !RM && s >= 1 ? 0.012 : 0, k;
    for (k = 0; k < 2; k++) {
      cxS.fillStyle = k ? "#DCE8FF" : "#6F98FF";
      for (var i = 0; i < cells.length; i++) {
        var c = cells[i]; if ((c.br ? 1 : 0) !== k) continue;
        var a = clamp(s * 2.2 - c.rf * 1.1 - c.rnd * 0.3);
        if (a <= 0) continue;
        if (flick && Math.random() < flick) c.ch = c.ch === "0" ? "1" : "0";
        cxS.globalAlpha = a * c.al; cxS.fillText(c.ch, c.x, c.y);
      }
    }
    cxS.globalAlpha = Math.min(1, s * 2);
    var sh = cxS.createLinearGradient(scr.x, scr.y, scr.x + scr.w * 0.7, scr.y + scr.h);
    sh.addColorStop(0, "rgba(255,255,255,.10)"); sh.addColorStop(0.35, "rgba(255,255,255,0)");
    cxS.fillStyle = sh; cxS.fillRect(scr.x, scr.y, scr.w, scr.h);
    cxS.restore(); cxS.globalAlpha = 1;
  }

  function u1(p, dt) {
    copyP(c1, p, 0.18, 0.58);
    hint.style.opacity = 1 - seg(p, 0.02, 0.1);
    if (!PN) return;
    tsec += dt || 0.016;
    var f = seg(p, 0.04, 0.66), s = ease(seg(p, 0.62, 0.9));
    if (f < 0.999 || lastF < 0.999) drawParticles(f);
    lastF = f;
    drawScreen(s);
  }

  /* ---------- cena 2: o código em Python vira a página ---------- */
  var c2 = copyInit("s2"), code2 = $("#code2"), term2 = $("#term2"), paint2 = $("#paint2"), scan2 = $("#scan2"), stat2 = $("#stat2"), stat2t = $("#stat2t");
  var PY = [
    "from flask import Flask",
    "app = Flask(__name__)",
    "",
    "produtos = [",
    '    {"nome": "Camisetas"},',
    '    {"nome": "Tênis"},',
    '    {"nome": "Bonés"},',
    "]",
    "",
    '@app.route("/")',
    "def home():",
    "    return render_template(",
    '        "loja.html",',
    '        titulo="Sua loja aberta 24h",',
    "        produtos=produtos,",
    "    )"
  ];
  var KW = /^(from|import|def|return|if|for|in|class|True|False|None)$/;
  function tok(line) {
    var out = [], re = /(#.*$)|("[^"]*"|'[^']*')|(@[\w.]+)|(\b\d+\.?\d*\b)|([A-Za-zÀ-ÿ_]\w*)|(\s+|.)/g, m, prev = "";
    while ((m = re.exec(line))) {
      var t = m[0], c = "";
      if (m[1]) c = "cm"; else if (m[2]) c = "str"; else if (m[3]) c = "dec"; else if (m[4]) c = "num";
      else if (m[5]) { if (KW.test(t)) c = "kw"; else if (prev === "def") c = "fn"; else if (line.charAt(re.lastIndex) === "(") c = "call"; }
      out.push([c, t]);
      if (m[5]) prev = t; else if (!/^\s+$/.test(t)) prev = "";
    }
    return out;
  }
  var L2 = PY.map(tok), TOT2 = 0;
  PY.forEach(function (l) { TOT2 += l.length; });
  var TERM = ["$ python app.py", "Rodando em http://sualoja.com.br"], TERMTOT = TERM[0].length + TERM[1].length;
  var rv2 = $$("[data-rv]", paint2), last2 = -1, lastT2 = -1;
  function u2(p) {
    copyP(c2, p, 0.04, 0.34);
    var typed = Math.floor(seg(p, 0.05, 0.52) * TOT2), tt = Math.floor(seg(p, 0.55, 0.65) * TERMTOT);
    var w = ease(seg(p, 0.68, 0.93));
    /* medidas primeiro, escritas depois */
    var pageH = paint2.offsetHeight || 1, thr = rv2.map(function (el) { return (el.offsetTop + el.offsetHeight / 2) / pageH + (+el.getAttribute("data-d") || 0) * 0.035; });
    if (typed !== last2) {
      last2 = typed;
      var rem = typed, out = [];
      for (var i = 0; i < L2.length && rem > 0; i++) {
        var toks = L2[i], len = PY[i].length, n = Math.min(rem, len), used = 0;
        var line = '<span class="ln">' + (i + 1) + "</span>";
        for (var k = 0; k < toks.length && used < n; k++) {
          var take = Math.min(toks[k][1].length, n - used);
          line += '<span class="' + toks[k][0] + '">' + esc(toks[k][1].slice(0, take)) + "</span>"; used += take;
        }
        if (rem - n <= 0 && typed < TOT2) line += '<span class="cur"></span>';
        out.push(line); rem -= n;
      }
      code2.innerHTML = out.join("\n");
    }
    if (tt !== lastT2) {
      lastT2 = tt;
      var a = TERM[0], b = TERM[1], h = '<span class="prompt">' + esc(a.slice(0, Math.min(tt, a.length))) + "</span>";
      if (tt > a.length) h += '\n<span class="ok">' + esc(b.slice(0, tt - a.length)) + "</span>";
      term2.innerHTML = h;
    }
    term2.style.opacity = seg(p, 0.545, 0.56);
    paint2.style.clipPath = "inset(0 0 " + ((1 - w) * 100).toFixed(2) + "% 0)";
    scan2.style.top = (w * 100).toFixed(2) + "%";
    scan2.style.opacity = w > 0.001 && w < 0.999 ? 1 : 0;
    for (var j = 0; j < rv2.length; j++) {
      var r = ease(seg(w, thr[j] * 0.84 - 0.04, thr[j] * 0.84 + 0.12));
      rv2[j].style.opacity = r.toFixed(3);
      rv2[j].style.transform = "translateY(" + ((1 - r) * 14).toFixed(1) + "px)";
    }
    var st = p < 0.54 ? "escrevendo código" : p < 0.68 ? "executando app.py" : w < 0.999 ? "montando a página" : "no ar";
    if (stat2.getAttribute("data-s") !== st) { stat2.setAttribute("data-s", st); stat2t.textContent = st; stat2.classList.toggle("live", st === "no ar"); }
  }

  /* ---------- cena 3: pilha de papéis vira a tela do celular (canvas) ---------- */
  var c3 = copyInit("s3"), cv3 = $("#cv3"), cx3 = cv3.getContext("2d"), c3a = $("#c3a"), c3b = $("#c3b");
  var LW = 600, LH = 430, K3 = 1, DPR3 = 1, SC = 1, PHN = { x: 398, y: 35, w: 176, h: 360 }, STK = { x: 150, y: 238 };
  var PAP = [], phoneSpr = null;
  var FS = "'IBM Plex Sans', system-ui, sans-serif", FM = "'IBM Plex Mono', ui-monospace, monospace", FH = "'Segoe Script','Bradley Hand','Snell Roundhand','Comic Sans MS',cursive";
  var ROWS3 = [
    ["João", "ligação", "15:45", "#5B8CFF"], ["Conta de luz", "pagar", "Hoje", "#F5B84B"],
    ["Loja Sol", "pagar", "R$ 332,20", "#3DDC97"], ["Mercado Lua", "pago", "R$ 120,00", "#B58BFF"],
    ["Pedro Alves", "12/10", "R$ 75,00", "#FF8F8F"], ["Clara Dias", "agenda", "10/10", "#5BD0FF"],
    ["Bar do Zé", "1047", "R$ 340,00", "#F58BD0"], ["Lúcia Reis", "1048", "R$ 95,00", "#9BE15D"]
  ];
  var PT = ["stain", "table", "agenda", "lined", "invoice", "receipt", "pink", "yellow"];
  var PS = { stain: [118, 150], table: [118, 150], agenda: [118, 150], lined: [118, 150], invoice: [118, 150], receipt: [66, 172], pink: [80, 80], yellow: [84, 84] };
  var PO = { stain: [4, 6, -6], table: [-6, -2, 5], agenda: [8, -4, -9], lined: [-4, 4, 8], invoice: [6, 2, -4], receipt: [-36, -6, -11], pink: [38, 36, 10], yellow: [-26, -46, -8] };

  function rrp(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }
  function hand(g, x, y, len, seed, col, lw) {
    var r = rng(seed);
    g.save(); g.strokeStyle = col; g.lineWidth = lw || 1.05; g.lineCap = "round"; g.lineJoin = "round"; g.globalAlpha = 0.9;
    g.beginPath(); g.moveTo(x, y);
    for (var d = 0; d < len; d += 2.5) {
      var ny = y + Math.sin(d * 1.9) * 1.4 + (r() - 0.5) * 2.2 - (r() < 0.12 ? 2.8 : 0);
      if (r() < 0.1) { d += 3; g.moveTo(x + d, ny); } else g.lineTo(x + d, ny);
    }
    g.stroke(); g.restore();
  }
  function shadowOn(g, blur, dy, a) { g.shadowColor = "rgba(0,0,0," + a + ")"; g.shadowBlur = blur * SC; g.shadowOffsetY = dy * SC; g.shadowOffsetX = dy * 0.3 * SC; }
  function sheet(g, w, h, c1, c2, cut) {
    g.save(); shadowOn(g, 12, 5, 0.5);
    g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0);
    if (cut) { g.lineTo(w, h - cut); g.lineTo(w - cut, h); } else g.lineTo(w, h);
    g.lineTo(0, h); g.closePath();
    var gr = g.createLinearGradient(0, 0, w * 0.6, h); gr.addColorStop(0, c1); gr.addColorStop(1, c2);
    g.fillStyle = gr; g.fill(); g.restore();
    g.save(); g.lineWidth = 0.6; g.strokeStyle = "rgba(0,0,0,.12)"; g.stroke(); g.restore();
    var cr = g.createLinearGradient(0, h * 0.5, 0, h * 0.5 + 3); cr.addColorStop(0, "rgba(0,0,0,.07)"); cr.addColorStop(1, "rgba(255,255,255,.35)");
    g.fillStyle = cr; g.fillRect(0, h * 0.5, w, 3);
    if (cut) {
      g.save(); g.beginPath(); g.moveTo(w, h - cut); g.lineTo(w - cut, h); g.lineTo(w - cut, h - cut); g.closePath();
      var f = g.createLinearGradient(w - cut, h - cut, w, h); f.addColorStop(0, "#FFFFFF"); f.addColorStop(1, "#CDD1DC");
      g.shadowColor = "rgba(0,0,0,.3)"; g.shadowBlur = 3 * SC; g.shadowOffsetY = 1 * SC; g.fillStyle = f; g.fill(); g.restore();
    }
  }
  function postit(g, w, h, c1, c2, l1, l2, seed) {
    g.save(); shadowOn(g, 10, 4, 0.45);
    var gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, c1); gr.addColorStop(1, c2);
    g.fillStyle = gr; g.fillRect(0, 0, w, h); g.restore();
    g.fillStyle = "rgba(255,255,255,.28)"; g.fillRect(0, 0, w, 11);
    var cv = g.createLinearGradient(0, h - 16, 0, h); cv.addColorStop(0, "rgba(0,0,0,0)"); cv.addColorStop(1, "rgba(0,0,0,.16)");
    g.fillStyle = cv; g.fillRect(0, h - 16, w, 16);
    g.fillStyle = "#3B2C12"; g.font = "600 11px " + FH; g.textBaseline = "alphabetic";
    g.fillText(l1, 8, 32); g.fillText(l2, 8, 47);
    hand(g, 8, 60, 46, seed, "#3B2C12", 1);
  }
  var PD = {
    lined: function (g, w, h) {
      sheet(g, w, h, "#FFFEF8", "#F0EEE2", 0);
      g.lineWidth = 0.6; g.strokeStyle = "rgba(120,160,225,.85)";
      for (var y = 26; y < h - 6; y += 9.5) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
      g.strokeStyle = "rgba(225,110,110,.9)"; g.beginPath(); g.moveTo(21, 0); g.lineTo(21, h); g.stroke();
      for (var hy = 12; hy < h - 6; hy += 15) { g.fillStyle = "rgba(10,18,40,.8)"; g.beginPath(); g.arc(7, hy, 2.3, 0, 7); g.fill(); g.strokeStyle = "rgba(0,0,0,.25)"; g.lineWidth = 0.5; g.stroke(); }
      g.fillStyle = "#25398A"; g.font = "700 11px " + FH; g.fillText("Pedidos 12/10", 26, 19);
      var k = 0; for (var yy = 35.5; yy < h - 10; yy += 9.5, k++) {
        hand(g, 26, yy - 2, 34 + ((k * 37) % 44), 40 + k, "#2A3E8A", 1);
        if (k % 2 === 0) hand(g, w - 30, yy - 2, 18, 90 + k, "#2A3E8A", 1);
      }
    },
    table: function (g, w, h) {
      sheet(g, w, h, "#FFFFFF", "#EEF1F7", 11);
      g.fillStyle = "#DDE4F4"; g.fillRect(6, 8, w - 12, 12);
      g.fillStyle = "#3C4C78"; g.font = "600 5.2px " + FS; g.textBaseline = "middle";
      g.fillText("CLIENTE", 9, 14.5); g.fillText("DATA", 56, 14.5); g.fillText("VALOR", 80, 14.5); g.fillText("OK", 105, 14.5);
      var cols = [6, 54, 78, 102, w - 6], rr = rng(5);
      g.strokeStyle = "rgba(90,110,160,.35)"; g.lineWidth = 0.5;
      for (var r = 0; r <= 9; r++) { var y = 20 + r * 12; g.beginPath(); g.moveTo(6, y); g.lineTo(w - 6, y); g.stroke(); }
      for (var c = 0; c < cols.length; c++) { g.beginPath(); g.moveTo(cols[c], 8); g.lineTo(cols[c], 128); g.stroke(); }
      for (var r2 = 0; r2 < 9; r2++) {
        var cy = 26 + r2 * 12;
        g.fillStyle = "#9AA5C2"; g.fillRect(9, cy - 1.2, 18 + rr() * 18, 2.4); g.fillRect(57, cy - 1.2, 12 + rr() * 6, 2.4); g.fillRect(81, cy - 1.2, 10 + rr() * 8, 2.4);
        if (r2 % 3 !== 1) { g.strokeStyle = "#2A3E8A"; g.lineWidth = 1.1; g.beginPath(); g.moveTo(106, cy); g.lineTo(108.5, cy + 2.6); g.lineTo(113, cy - 2.8); g.stroke(); }
      }
      g.strokeStyle = "#D63B3B"; g.lineWidth = 1.3; g.beginPath(); g.ellipse(88, 62, 15, 6.4, -0.08, 0, 6.28); g.stroke();
    },
    agenda: function (g, w, h) {
      sheet(g, w, h, "#FFFFFF", "#EFF1F6", 11);
      g.fillStyle = "#2F4FA0"; g.fillRect(0, 0, w, 24);
      g.fillStyle = "#FFFFFF"; g.font = "700 8.5px " + FS; g.textBaseline = "alphabetic"; g.fillText("AGENDA", 8, 15);
      g.font = "500 6px " + FM; g.textAlign = "right"; g.fillText("OUTUBRO", w - 8, 15); g.textAlign = "left";
      var ds = ["D", "S", "T", "Q", "Q", "S", "S"], cw = (w - 12) / 7, n = 1;
      g.fillStyle = "#6B7799"; g.font = "600 5px " + FS; g.textAlign = "center";
      for (var d = 0; d < 7; d++) g.fillText(ds[d], 6 + cw * (d + 0.5), 34);
      g.font = "500 5.6px " + FM;
      for (var r = 0; r < 5; r++) for (var c = 0; c < 7; c++) {
        var x = 6 + cw * (c + 0.5), y = 46 + r * 19; g.fillStyle = "#4B5675"; if (n <= 31) g.fillText(String(n), x, y); n++;
        g.strokeStyle = "rgba(90,110,160,.3)"; g.lineWidth = 0.5; g.strokeRect(6 + cw * c, 38 + r * 19, cw, 19);
      }
      g.textAlign = "left";
      g.strokeStyle = "#D63B3B"; g.lineWidth = 1.2; g.beginPath(); g.arc(6 + cw * 3.5, 84, 7.5, 0, 7); g.stroke();
      hand(g, 6 + cw * 1 + 1, 56, 11, 12, "#2A3E8A", 1); hand(g, 6 + cw * 4 + 1, 75, 12, 14, "#2A3E8A", 1); hand(g, 6 + cw * 5 + 1, 113, 11, 15, "#2A3E8A", 1);
    },
    stain: function (g, w, h) {
      sheet(g, w, h, "#FBF8EF", "#EDE8D8", 0);
      g.lineWidth = 0.55; g.strokeStyle = "rgba(120,150,200,.55)";
      for (var y = 18; y < h - 6; y += 9.5) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
      for (var k = 0, yy = 16; yy < h - 12; yy += 9.5, k++) hand(g, 10, yy, 40 + ((k * 29) % 58), 200 + k, "#233A86", 1);
      var rg = g.createRadialGradient(78, 96, 4, 78, 96, 30); rg.addColorStop(0, "rgba(120,80,40,.0)"); rg.addColorStop(0.7, "rgba(120,80,40,.09)"); rg.addColorStop(1, "rgba(120,80,40,0)");
      g.fillStyle = rg; g.beginPath(); g.arc(78, 96, 30, 0, 7); g.fill();
      g.strokeStyle = "rgba(112,70,28,.5)"; g.lineWidth = 2.4; g.beginPath(); g.arc(78, 96, 22, 0.2, 5.9); g.stroke();
      g.strokeStyle = "rgba(112,70,28,.22)"; g.lineWidth = 1.2; g.beginPath(); g.arc(78.5, 96.5, 23.6, 1, 6.2); g.stroke();
      g.fillStyle = "rgba(112,70,28,.35)"; g.beginPath(); g.arc(98, 124, 2.2, 0, 7); g.fill(); g.beginPath(); g.arc(56, 70, 1.3, 0, 7); g.fill();
    },
    invoice: function (g, w, h) {
      sheet(g, w, h, "#FFFFFF", "#F1F2F6", 11);
      g.fillStyle = "#274690"; g.fillRect(0, 0, w, 24);
      g.fillStyle = "#FFFFFF"; g.font = "700 8px " + FS; g.textBaseline = "alphabetic"; g.fillText("NOTA FISCAL", 8, 15);
      g.font = "500 6px " + FM; g.textAlign = "right"; g.fillText("Nº 1042", w - 8, 15); g.textAlign = "left";
      var lb = ["Cliente", "Produto", "Qtd.", "Valor"], vals = [40, 52, 14, 34];
      g.fillStyle = "#5B6682"; g.font = "500 5.6px " + FS;
      for (var i = 0; i < 4; i++) {
        var y = 40 + i * 14; g.fillText(lb[i] + ":", 8, y);
        g.fillStyle = "#9AA5C2"; g.fillRect(40, y - 3.4, vals[i], 2.8); g.fillStyle = "#5B6682";
        g.strokeStyle = "rgba(90,110,160,.3)"; g.lineWidth = 0.5; g.beginPath(); g.moveTo(8, y + 4); g.lineTo(w - 8, y + 4); g.stroke();
      }
      g.fillStyle = "#1F2A4A"; g.font = "600 6.6px " + FM; g.fillText("TOTAL  R$ 120,00", 8, 124);
      g.save(); g.translate(80, 100); g.rotate(-0.32);
      g.strokeStyle = "rgba(205,45,45,.8)"; g.lineWidth = 1.9; rrp(g, -26, -11, 52, 22, 3); g.stroke();
      g.fillStyle = "rgba(205,45,45,.8)"; g.font = "800 14px " + FS; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("PAGO", 0, 1); g.restore();
      g.textAlign = "left"; g.textBaseline = "alphabetic";
      var rr = rng(9); g.fillStyle = "rgba(255,255,255,.5)";
      for (var s = 0; s < 36; s++) { g.beginPath(); g.arc(54 + rr() * 52, 90 + rr() * 22, 0.7, 0, 7); g.fill(); }
    },
    receipt: function (g, w, h) {
      g.save(); shadowOn(g, 12, 5, 0.5);
      g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(w, h - 5);
      for (var x = w, up = false; x > 0; x -= 5.5, up = !up) g.lineTo(x - 2.75, up ? h - 5 : h);
      g.lineTo(0, h - 5); g.closePath();
      var gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, "#FCFAF3"); gr.addColorStop(1, "#E9E6DA"); g.fillStyle = gr; g.fill(); g.restore();
      g.fillStyle = "#2B2B2B"; g.textBaseline = "alphabetic"; g.textAlign = "center"; g.font = "700 7.4px " + FM; g.fillText("LOJA SOL", w / 2, 14);
      g.font = "400 4px " + FM; g.fillText("CNPJ 12.345.678/0001-90", w / 2, 21); g.fillText("- - - - - - - - - - - - -", w / 2, 29);
      var it = [["CAMISETA", "39,90"], ["BONÉ", "49,90"], ["MEIA", "12,50"], ["TÊNIS", "199,90"], ["CINTO", "29,90"]];
      g.font = "400 5px " + FM;
      for (var i = 0; i < it.length; i++) { g.textAlign = "left"; g.fillText(it[i][0], 6, 40 + i * 9); g.textAlign = "right"; g.fillText(it[i][1], w - 6, 40 + i * 9); }
      g.textAlign = "center"; g.fillText("- - - - - - - - - - - - -", w / 2, 88);
      g.font = "700 6.4px " + FM; g.textAlign = "left"; g.fillText("TOTAL", 6, 99); g.textAlign = "right"; g.fillText("332,20", w - 6, 99);
      g.font = "400 4.6px " + FM; g.textAlign = "left"; g.fillText("PAGO COM PIX", 6, 109);
      var r = rng(3), bx = 8; g.fillStyle = "#222";
      while (bx < w - 8) { var bw = 0.6 + r() * 1.6; g.fillRect(bx, 124, bw, 22); bx += bw + 0.6 + r() * 1.4; }
      g.textAlign = "center"; g.font = "400 4px " + FM; g.fillText("7891234567890", w / 2, 155); g.textAlign = "left";
    },
    yellow: function (g, w, h) { postit(g, w, h, "#FFEC7A", "#F6CF3A", "ligar p/", "o João!!", 31); },
    pink: function (g, w, h) { postit(g, w, h, "#FFA9C6", "#F57BA6", "pagar a", "conta de luz", 33); }
  };

  function bake(w, h, pad, fn) {
    var c = document.createElement("canvas"); c.width = Math.ceil((w + pad * 2) * SC); c.height = Math.ceil((h + pad * 2) * SC);
    var g = c.getContext("2d"); g.scale(SC, SC); g.translate(pad, pad); fn(g, w, h);
    return { c: c, w: w, h: h, pad: pad };
  }
  function bakePhone() {
    return bake(PHN.w, PHN.h, 40, function (g, w, h) {
      g.save(); shadowOn(g, 30, 14, 0.7);
      rrp(g, 0, 0, w, h, 34); g.fillStyle = "#0A0F22"; g.fill(); g.restore();
      var fr = g.createLinearGradient(0, 0, w, 0);
      fr.addColorStop(0, "#7683A8"); fr.addColorStop(0.12, "#E7EDF9"); fr.addColorStop(0.5, "#98A6C9"); fr.addColorStop(0.88, "#D6DEF0"); fr.addColorStop(1, "#6E7C9F");
      rrp(g, 0, 0, w, h, 34); g.fillStyle = fr; g.fill();
      rrp(g, 2.6, 2.6, w - 5.2, h - 5.2, 31.5); g.fillStyle = "#0B0F1E"; g.fill();
      var bt = g.createLinearGradient(0, 0, 0, 1); 
      g.fillStyle = fr;
      g.fillRect(-2.4, 74, 2.8, 20); g.fillRect(-2.4, 108, 2.8, 34); g.fillRect(-2.4, 150, 2.8, 34); g.fillRect(w - 0.4, 116, 2.8, 56);
      rrp(g, 8, 8, w - 16, h - 16, 26); g.fillStyle = "#0A1330"; g.fill();
    });
  }

  function layout3(narrow) {
    if (narrow) { LW = 380; LH = 470; PHN.x = 198; PHN.y = 16; STK.x = 96; STK.y = 382; }
    else { LW = 600; LH = 430; PHN.x = 398; PHN.y = 35; STK.x = 150; STK.y = 238; }
  }
  function setup3() {
    var v = cv3.parentNode, vr = v.getBoundingClientRect(), sw = $(".swap", v);
    var aw = vr.width, ah = vr.height - (sw ? sw.offsetHeight + 12 : 0);
    if (!aw || ah < 80) return;
    layout3(aw < 480);
    var cw = Math.floor(Math.min(aw, ah * LW / LH, 760)), ch = Math.round(cw * LH / LW);
    DPR3 = Math.min(2, window.devicePixelRatio || 1); K3 = cw / LW; SC = K3 * DPR3;
    cv3.style.width = cw + "px"; cv3.style.height = ch + "px";
    cv3.width = Math.round(cw * DPR3); cv3.height = Math.round(ch * DPR3);
    var PF = aw < 480 ? 1.05 : 1.3;
    PAP = PT.map(function (t, i) {
      var sz = PS[t], o = PO[t];
      return { spr: bake(sz[0] * PF, sz[1] * PF, 24, function (g, w, h) { g.scale(PF, PF); PD[t](g, sz[0], sz[1]); }), x0: STK.x + o[0] * PF, y0: STK.y + o[1] * PF - i * 1.2, rot: o[2] * Math.PI / 180, t: 0 };
    });
    phoneSpr = bakePhone();
  }

  function bez(a, b, c, t) { var m = 1 - t; return m * m * a + 2 * m * t * b + t * t * c; }
  function drawSprite(g, s, x, y, rot, sc, al) {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc, sc); g.globalAlpha = al;
    g.drawImage(s.c, -(s.w / 2 + s.pad), -(s.h / 2 + s.pad), s.w + 2 * s.pad, s.h + 2 * s.pad); g.restore();
  }
  function drawScreen3(g, rowP, toast, saved) {
    var sx = PHN.x + 8, sy = PHN.y + 8, sw = 160, sh = 344;
    g.save(); rrp(g, sx, sy, sw, sh, 26); g.clip();
    var bg = g.createLinearGradient(0, sy, 0, sy + sh); bg.addColorStop(0, "#112357"); bg.addColorStop(1, "#080F26"); g.fillStyle = bg; g.fillRect(sx, sy, sw, sh);
    g.textBaseline = "alphabetic"; g.fillStyle = "#E6ECFA"; g.font = "600 9px " + FS; g.textAlign = "left"; g.fillText("9:41", sx + 18, sy + 22);
    g.fillStyle = "#E6ECFA"; rrp(g, sx + sw - 34, sy + 14.5, 15, 7.5, 2); g.globalAlpha = 0.9; g.fill(); g.globalAlpha = 1; g.fillRect(sx + sw - 18.4, sy + 16.8, 1.5, 3);
    for (var b = 0; b < 4; b++) g.fillRect(sx + sw - 54 + b * 3.4, sy + 21.5 - b * 1.8, 2.2, 1.8 + b * 1.8);
    g.fillStyle = "#FFFFFF"; g.font = "700 12.5px " + FS; g.fillText("Pedidos de hoje", sx + 10, sy + 46);
    var done = 0; for (var i = 0; i < 8; i++) if (rowP[i] >= 0.999) done++;
    g.fillStyle = "rgba(91,140,255,.22)"; rrp(g, sx + sw - 44, sy + 35, 34, 15, 7.5); g.fill();
    g.fillStyle = "#9DBBFF"; g.font = "600 8.5px " + FM; g.textAlign = "center"; g.fillText(done + "/8", sx + sw - 27, sy + 45.6); g.textAlign = "left";
    for (var n = 0; n < 8; n++) {
      var rp = rowP[n]; if (rp <= 0) continue;
      var e = ease(rp), ry = sy + 56 + n * 31, rx = sx + 7 + (1 - e) * -14, R = ROWS3[n];
      g.globalAlpha = e;
      g.fillStyle = "#18295A"; rrp(g, rx, ry, sw - 14, 27, 8); g.fill();
      g.fillStyle = R[3]; g.beginPath(); g.arc(rx + 13, ry + 13.5, 8.5, 0, 7); g.fill();
      g.fillStyle = "#0A1330"; g.font = "700 9px " + FS; g.textAlign = "center"; g.fillText(R[0].charAt(0), rx + 13, ry + 16.6); g.textAlign = "left";
      g.fillStyle = "#FFFFFF"; g.font = "600 9.4px " + FS; g.fillText(R[0], rx + 26, ry + 12);
      g.fillStyle = "#8FA0C8"; g.font = "400 7.4px " + FS; g.fillText("Pedido " + R[1], rx + 26, ry + 21.5);
      g.fillStyle = "#DCE6FF"; g.font = "500 8px " + FM; g.textAlign = "right"; g.fillText(R[2], rx + sw - 14 - 26, ry + 21.3); g.textAlign = "left";
      var pop = 0.6 + 0.4 * ease(clamp((rp - 0.3) / 0.7)); g.save(); g.translate(rx + sw - 14 - 12, ry + 13.5); g.scale(pop, pop);
      g.fillStyle = "#2FCB86"; g.beginPath(); g.arc(0, 0, 6.2, 0, 7); g.fill();
      g.strokeStyle = "#06231A"; g.lineWidth = 1.6; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(-2.8, 0.2); g.lineTo(-0.7, 2.4); g.lineTo(3, -2.2); g.stroke(); g.restore();
      g.globalAlpha = 1;
    }
    if (toast > 0) {
      var te = ease(toast), ty = sy + sh - 36 + (1 - te) * 20;
      g.globalAlpha = te; g.fillStyle = "#17795A"; rrp(g, sx + 10, ty, sw - 20, 24, 12); g.fill();
      g.fillStyle = "#EFFFF8"; g.font = "600 8.6px " + FS; g.textAlign = "center"; g.fillText("Tudo salvo e organizado", sx + sw / 2 + 5, ty + 15); g.textAlign = "left";
      g.strokeStyle = "#EFFFF8"; g.lineWidth = 1.5; g.lineCap = "round"; g.beginPath(); g.moveTo(sx + 20, ty + 12.2); g.lineTo(sx + 22.6, ty + 14.8); g.lineTo(sx + 27, ty + 9.6); g.stroke();
      g.globalAlpha = 1;
    }
    g.fillStyle = "rgba(255,255,255,.55)"; rrp(g, sx + sw / 2 - 24, sy + sh - 8, 48, 3.4, 1.7); g.fill();
    var gl = g.createLinearGradient(sx, sy, sx + sw * 0.9, sy + sh * 0.7); gl.addColorStop(0, "rgba(255,255,255,.10)"); gl.addColorStop(0.4, "rgba(255,255,255,0)");
    g.fillStyle = gl; g.fillRect(sx, sy, sw, sh);
    g.restore();
    g.fillStyle = "#000"; rrp(g, PHN.x + PHN.w / 2 - 30, PHN.y + 14, 60, 17, 8.5); g.fill();
    g.fillStyle = "#16224A"; g.beginPath(); g.arc(PHN.x + PHN.w / 2 + 20, PHN.y + 22.5, 3.4, 0, 7); g.fill();
    g.fillStyle = "#2A4A9A"; g.beginPath(); g.arc(PHN.x + PHN.w / 2 + 20, PHN.y + 22.5, 1.4, 0, 7); g.fill();
  }

  function u3(p) {
    copyP(c3, p, 0.04, 0.34);
    if (!PAP.length) return;
    var g = cx3, i, n;
    g.setTransform(DPR3 * K3, 0, 0, DPR3 * K3, 0, 0); g.imageSmoothingQuality = "high";
    g.clearRect(0, 0, LW, LH);
    var prog = seg(p, 0.06, 0.84), pcx = PHN.x + PHN.w / 2, pcy = PHN.y + PHN.h / 2;
    var gr0 = Math.max(40, Math.min(pcx, LW - pcx, pcy, LH - pcy) - 4);
    var gl = g.createRadialGradient(pcx, pcy, 10, pcx, pcy, gr0); gl.addColorStop(0, "rgba(91,140,255," + (0.12 + 0.26 * prog) + ")"); gl.addColorStop(1, "rgba(91,140,255,0)");
    g.fillStyle = gl; g.fillRect(pcx - gr0, pcy - gr0, gr0 * 2, gr0 * 2);
    var dr = Math.max(40, Math.min(150, STK.x, LH - STK.y, STK.y) - 4);
    var dk = g.createRadialGradient(STK.x, STK.y, 10, STK.x, STK.y, dr); dk.addColorStop(0, "rgba(130,160,235,.10)"); dk.addColorStop(1, "rgba(130,160,235,0)");
    g.fillStyle = dk; g.fillRect(STK.x - dr, STK.y - dr, dr * 2, dr * 2);
    /* tempo de cada papel: o de cima sai primeiro */
    var rowP = [], T = [];
    for (n = 0; n < 8; n++) { var s0 = 0.06 + n * 0.088; T[n] = seg(p, s0, s0 + 0.17); rowP[n] = seg(T[n], 0.8, 1); }
    for (i = 0; i < 8; i++) { var pi = PAP[i], tt = T[7 - i]; if (tt <= 0) drawSprite(g, pi.spr, pi.x0, pi.y0, pi.rot, 1, 1); }
    g.drawImage(phoneSpr.c, PHN.x - phoneSpr.pad, PHN.y - phoneSpr.pad, phoneSpr.w + 2 * phoneSpr.pad, phoneSpr.h + 2 * phoneSpr.pad);
    drawScreen3(g, rowP, seg(p, 0.86, 0.93), 0);
    for (i = 0; i < 8; i++) {
      var q = PAP[i], n2 = 7 - i, t = T[n2]; if (t <= 0 || t >= 1) continue;
      var e = ease(t), tx = PHN.x + 8 + 7 + 13, ty = PHN.y + 8 + 56 + n2 * 31 + 13.5;
      var cx = (q.x0 + tx) / 2, cy = Math.min(q.y0, ty) - 95 - n2 * 3;
      var bump = Math.sin(Math.PI * seg(t, 0, 0.3)), sc = (1 + (0.16 - 1)) * 0 + (1 + (0.15 - 1) * e) * (1 + 0.12 * bump);
      var rot = q.rot * (1 - e) + Math.sin(Math.PI * e) * 0.38 * (n2 % 2 ? 1 : -1);
      drawSprite(g, q.spr, bez(q.x0, cx, tx, e), bez(q.y0, cy, ty, e), rot, sc, t < 0.78 ? 1 : 1 - seg(t, 0.78, 1));
    }
    var k = seg(p, 0.88, 0.95);
    c3a.style.opacity = 1 - k; c3b.style.opacity = k;
  }

  /* ---------- cena 4: planilha bagunçada vira tabela organizada ---------- */
  var c4 = copyInit("s4"), xlw = $("#xlw"), xlSheet = $("#xlSheet"), xlGut = $("#xlGut"), xlName = $("#xlName"), xlFx = $("#xlFx"), xlStat = $("#xlStat"), xlSum = $("#xlSum"), xlSaved = $("#xlSaved");
  var c4a = $("#c4a"), c4b = $("#c4b"), c4c = $("#c4c"), r4 = rng(21);
  var FR = [3.2, 2.2, 2.1, 1.9], FRT = 11, N4 = 11;
  function mk(tag, cls, parent, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined) e.textContent = txt; if (parent) parent.appendChild(e); return e; }
  for (var gi = 1; gi <= N4; gi++) mk("i", "", xlGut, gi);
  (function () { var acc = 0; for (var c = 0; c < 4; c++) { acc += FR[c]; mk("b", "vl", xlSheet).style.left = (acc / FRT * 100) + "%"; } })();
  var HEAD4 = ["Cliente", "Data", "Valor", "Status"];
  var DATA4 = [
    { m: ["ANA SILVA", "12/10", "R$50", "pago"], c: ["Ana Silva", "12/10/2026", "R$ 50,00", "Pago"], v: 50 },
    { m: ["joao p", "2026-10-13", "120", "PAGO"], c: ["João Pereira", "13/10/2026", "R$ 120,00", "Pago"], v: 120 },
    { m: ["Loja Sol", "14 out", "R$ 80,5", "?"], c: ["Loja Sol", "14/10/2026", "R$ 80,50", "Pendente"], v: 80.5 },
    { m: ["ana silva", "12/10", "R$50", "pago"], dup: 1 },
    { m: ["", "", "", ""], empty: 1 },
    { m: ["Mercado Lua", "15/10", "200.00", "ok"], c: ["Mercado Lua", "15/10/2026", "R$ 200,00", "Pago"], v: 200 },
    { m: ["joao p", "2026-10-13", "120", "PAGO"], dup: 1 },
    { m: ["   Pedro", "16-10", "#VALOR!", "pend."], c: ["Pedro Alves", "16/10/2026", "R$ 75,00", "Pendente"], v: 75 },
    { m: ["Clara Dias", "########", "60,00", "paga"], c: ["Clara Dias", "17/10/2026", "R$ 60,00", "Pago"], v: 60 },
    { m: ["Bar do Zé", "17/10", "R$ 340", "PENDENTE"], c: ["Bar do Zé", "17/10/2026", "R$ 340,00", "Pendente"], v: 340 }
  ];
  var ROWS4 = [], okIdx = 0;
  function mkRow(cls) {
    var el = mk("div", "xr " + (cls || ""), xlSheet), cells = [];
    for (var c = 0; c < 5; c++) { var ce = mk("div", "xc c" + c, el); cells.push({ el: ce, sp: c < 4 ? mk("span", "", ce) : null, clean: null, fl: -1 }); }
    return { el: el, cells: cells };
  }
  var hdr = mkRow("h0"); hdr.kind = "head";
  HEAD4.forEach(function (t, c) { hdr.cells[c].sp.textContent = t; });
  DATA4.forEach(function (d, i) {
    var r = mkRow(""); r.kind = d.empty ? "empty" : d.dup ? "dup" : "ok"; r.d = d; r.i = i;
    if (r.kind === "ok") { r.ok = okIdx++; }
    for (var c = 0; c < 4; c++) {
      var ce = r.cells[c], cl = ce.el.classList, x;
      cl.add("m"); ce.sp.textContent = d.m[c];
      if (d.empty) continue;
      x = r4(); if (x < 0.13) cl.add("vy"); else if (x < 0.25) cl.add("vp"); else if (x < 0.35) cl.add("vb");
      if (r4() < 0.12) cl.add("red"); if (r4() < 0.14) cl.add("it"); if (r4() < 0.12) cl.add("bo");
      x = r4(); if (x < 0.16) cl.add("vc"); else if (x < 0.28) cl.add("vr"); else if (x < 0.36) cl.add("vlf");
      x = r4(); if (x < 0.16) cl.add("vs"); else if (x < 0.28) cl.add("vg");
      if (c === 2) { if (d.m[2].charAt(0) === "#") cl.add("er"); else cl.add("tn"); }
    }
    if (r.kind === "ok") { r.db = mk("i", "db", r.cells[2].el); r.bw = d.v / 340 * 100; }
    ROWS4.push(r);
  });
  var tot = mkRow("tot"); tot.cells[0].sp.textContent = "Total"; tot.cells[2].sp.textContent = "R$ 0,00";
  var sel = mk("div", "sel col", xlSheet), sel2 = mk("div", "sel", xlSheet);
  var RH4 = 1.8, lastS4 = {};
  function brl(v) { return "R$ " + v.toFixed(2).replace(".", ","); }
  function colRect(c) { var l = 0, i; for (i = 0; i < c; i++) l += FR[i]; return [l / FRT * 100, FR[c] / FRT * 100]; }
  function setTxt(el, key, t) { if (lastS4[key] !== t) { lastS4[key] = t; el.textContent = t; } }
  function u4(p) {
    copyP(c4, p, 0.03, 0.32);
    var A = ease(seg(p, 0.04, 0.2)), cf = [seg(p, 0.26, 0.34), seg(p, 0.34, 0.42), seg(p, 0.42, 0.5), seg(p, 0.5, 0.58)];
    var D1 = seg(p, 0.6, 0.66), D2 = ease(seg(p, 0.66, 0.74)), H = seg(p, 0.75, 0.8), T = seg(p, 0.81, 0.87), B = ease(seg(p, 0.88, 0.97));
    var xl = $("#xl");
    xl.style.opacity = A.toFixed(3); xl.style.transform = "translateY(" + ((1 - A) * 26).toFixed(1) + "px) scale(" + (0.965 + 0.035 * A).toFixed(3) + ")";
    hdr.el.style.top = "0em"; hdr.el.style.height = RH4 + "em"; hdr.el.style.opacity = A;
    hdr.el.classList.toggle("hd", H > 0.5);
    var y = 1, i, c, r;
    for (i = 0; i < ROWS4.length; i++) {
      r = ROWS4[i];
      var hf = r.kind === "ok" ? 1 : 1 - D2;
      r.el.style.top = (y * RH4).toFixed(3) + "em"; r.el.style.height = (RH4 * hf).toFixed(3) + "em";
      var ra = clamp(seg(p, 0.05, 0.2) * 1.8 - i * 0.09);
      r.el.style.opacity = (r.kind === "ok" ? ra : ra * (1 - D2)).toFixed(3);
      y += hf;
      if (r.kind === "dup") r.el.classList.toggle("dm", D1 > 0.3);
      if (r.kind === "ok") {
        r.el.classList.toggle("bd", H > 0.5 && r.ok % 2 === 1);
        for (c = 0; c < 4; c++) {
          var ce = r.cells[c], clean = cf[c] > 0.5;
          if (clean !== ce.clean) {
            ce.clean = clean; ce.el.classList.toggle("m", !clean); ce.sp.textContent = clean ? r.d.c[c] : r.d.m[c];
            if (c === 3) { ce.el.classList.toggle("cok", clean && r.d.c[3] === "Pago"); ce.el.classList.toggle("cpd", clean && r.d.c[3] !== "Pago"); }
          }
          var fl = cf[c] > 0 && cf[c] < 1 ? Math.sin(Math.PI * cf[c]) : 0, fk = fl.toFixed(2);
          if (ce.fl !== fk) { ce.fl = fk; ce.el.style.setProperty("--fl", fk); }
        }
        r.db.style.width = (r.bw * 0.62 * B).toFixed(1) + "%";
      }
    }
    tot.el.style.top = (y * RH4).toFixed(3) + "em"; tot.el.style.height = RH4 + "em"; tot.el.style.opacity = T.toFixed(3);
    var sum = 925.5 * ease(T);
    setTxt(tot.cells[2].sp, "tot", brl(sum));
    /* seleção que percorre as colunas */
    var sp = (p - 0.26) / 0.08, on = p > 0.24 && p < 0.6;
    if (on) {
      var ix = clamp(Math.floor(sp), 0, 3), fr = sp - Math.floor(sp), mv = ix > 0 ? ease(clamp(fr * 3)) : 1;
      var a = colRect(ix > 0 ? ix - 1 : 0), b = colRect(ix), L = lerp(a[0], b[0], mv), Wd = lerp(a[1], b[1], mv);
      sel.style.left = L + "%"; sel.style.width = Wd + "%"; sel.style.top = RH4 + "em"; sel.style.height = (RH4 * 10) + "em";
    }
    sel.style.opacity = on ? 1 : 0;
    var on2 = T > 0.3 && B < 0.01 || (T > 0.3 && p < 0.9), cr = colRect(2);
    sel2.style.left = cr[0] + "%"; sel2.style.width = cr[1] + "%"; sel2.style.top = (y * RH4) + "em"; sel2.style.height = RH4 + "em"; sel2.style.opacity = on2 ? 1 : 0;
    /* barra de fórmulas e status */
    var nm = "A1", fx = "Cliente", st = "Pronto";
    var cn = ["A", "B", "C", "D"], fxs = ["=PRI.MAIÚSCULA(ARRUMAR(A2))", "=DATA.VALOR(B2)", "=VALOR(C2)", "=PRI.MAIÚSCULA(D2)"], sts = ["Padronizando nomes…", "Padronizando datas…", "Convertendo valores…", "Padronizando status…"];
    if (p >= 0.24 && p < 0.58) { var k = clamp(Math.floor(sp), 0, 3); nm = cn[k] + "2:" + cn[k] + "11"; fx = fxs[k]; st = sts[k]; }
    else if (p >= 0.58 && p < 0.75) { nm = "A2:D11"; fx = "=CONT.SE(A:A;A2)>1"; st = D2 < 0.99 ? "Removendo duplicados…" : "2 duplicados removidos · 7 linhas mantidas"; }
    else if (p >= 0.75 && p < 0.81) { nm = "A1:D1"; fx = "Cliente"; st = "Formatando como tabela…"; }
    else if (p >= 0.81) { nm = "C9"; fx = "=SOMA(C2:C8)"; st = T < 0.99 ? "Calculando…" : "Pronto"; }
    setTxt(xlName, "nm", nm); setTxt(xlFx, "fx", fx); setTxt(xlStat, "st", st);
    setTxt(xlSum, "sum", T > 0.5 ? "Média: R$ 132,21   Soma: R$ 925,50" : "");
    var sv = B > 0.95; if (lastS4.sv !== sv) { lastS4.sv = sv; xlSaved.textContent = sv ? "✓ salvo" : "● não salvo"; xlSaved.classList.toggle("saved", sv); }
    c4a.classList.toggle("on", p > 0.58); c4b.classList.toggle("on", D2 > 0.5); c4c.classList.toggle("on", T > 0.7);
  }

  /* ---------- cena 5: PC aberto sendo montado, peça por peça ---------- */
  var c5 = copyInit("s5"), svg5 = $("#svg5"), chips5 = $$("#chips5 .chip");
  var MONO5 = 'font-family="IBM Plex Mono, monospace"', SANS5 = 'font-family="IBM Plex Sans, sans-serif"';
  function fan5(id, cx, cy, r, n, col) {
    var b = '<g id="' + id + '">', i;
    for (i = 0; i < n; i++) b += '<path d="M' + cx + " " + cy + " C" + (cx + r * 0.15) + " " + (cy - r * 0.45) + " " + (cx + r * 0.66) + " " + (cy - r * 0.8) + " " + (cx + r * 0.36) + " " + (cy - r * 0.94) + " C" + (cx + r * 0.04) + " " + (cy - r * 0.96) + " " + (cx - r * 0.2) + " " + (cy - r * 0.55) + " " + cx + " " + cy + ' Z" fill="' + col + '" transform="rotate(' + (i * 360 / n).toFixed(1) + " " + cx + " " + cy + ')"/>';
    return b + '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.22) + '" fill="url(#hub5)"/></g>';
  }
  function fins(x, y, w, h, vertical, step) {
    var s = "", k;
    if (vertical) for (k = step; k < w; k += step) s += '<line x1="' + (x + k) + '" y1="' + (y + 2) + '" x2="' + (x + k) + '" y2="' + (y + h - 2) + '"/>';
    else for (k = step; k < h; k += step) s += '<line x1="' + (x + 2) + '" y1="' + (y + k) + '" x2="' + (x + w - 2) + '" y2="' + (y + k) + '"/>';
    return '<g stroke="rgba(255,255,255,.16)" stroke-width="1">' + s + "</g>";
  }
  var S5 = [], i5;
  S5.push('<defs>',
    '<linearGradient id="case5" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2A3560"/><stop offset=".5" stop-color="#121A36"/><stop offset="1" stop-color="#232E55"/></linearGradient>',
    '<linearGradient id="psu5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34406C"/><stop offset="1" stop-color="#171E3A"/></linearGradient>',
    '<linearGradient id="pcb5" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1B2347"/><stop offset="1" stop-color="#0F1530"/></linearGradient>',
    '<linearGradient id="heat5" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6275B0"/><stop offset=".5" stop-color="#3B4B82"/><stop offset="1" stop-color="#27335F"/></linearGradient>',
    '<linearGradient id="metal5" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4F7FD"/><stop offset=".5" stop-color="#B7C3DC"/><stop offset="1" stop-color="#7C8AAA"/></linearGradient>',
    '<linearGradient id="gold5" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F6DA85"/><stop offset="1" stop-color="#B8902E"/></linearGradient>',
    '<linearGradient id="cu5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0A678"/><stop offset="1" stop-color="#A9552F"/></linearGradient>',
    '<linearGradient id="gpu5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E3B6C"/><stop offset="1" stop-color="#151C38"/></linearGradient>',
    '<linearGradient id="glass5" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9DB6FF" stop-opacity=".16"/><stop offset=".5" stop-color="#9DB6FF" stop-opacity=".04"/><stop offset="1" stop-color="#9DB6FF" stop-opacity=".12"/></linearGradient>',
    '<radialGradient id="hub5"><stop offset="0" stop-color="#E6ECFA"/><stop offset="1" stop-color="#6275B0"/></radialGradient>',
    '<radialGradient id="shd5"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>',
    '<pattern id="lga5" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#B8902E"/></pattern>',
    '<clipPath id="cav5"><rect x="176" y="30" width="288" height="380" rx="8"/></clipPath>',
    '</defs>',
    '<ellipse cx="320" cy="432" rx="190" ry="9" fill="url(#shd5)"/>',
    '<rect x="188" y="424" width="26" height="8" rx="2" fill="#0B1020"/><rect x="426" y="424" width="26" height="8" rx="2" fill="#0B1020"/>',
    '<rect x="160" y="14" width="320" height="412" rx="14" fill="url(#case5)" stroke="#4A5C96" stroke-width="1.6"/>',
    '<rect x="176" y="30" width="288" height="380" rx="8" fill="#060A16"/>',
    '<circle id="led5" cx="452" cy="22" r="3" fill="#2A3F78"/>',
    '<g clip-path="url(#cav5)">',
    /* sombra da fonte e furos de organização de cabos */
    '<rect x="176" y="346" width="288" height="64" fill="#0A1022"/><g stroke="#16204A" stroke-width="2">' + (function () { var s = "", k; for (k = 0; k < 9; k++) s += '<line x1="' + (352 + k * 11) + '" y1="356" x2="' + (352 + k * 11) + '" y2="400"/>'; return s; })() + "</g>",
    '<rect x="448" y="112" width="12" height="26" rx="5" fill="#0E1530" stroke="#1F2B52"/><rect x="448" y="178" width="12" height="26" rx="5" fill="#0E1530" stroke="#1F2B52"/><rect x="448" y="244" width="12" height="26" rx="5" fill="#0E1530" stroke="#1F2B52"/>',
    /* 0: fonte */
    '<g id="q0"><rect x="186" y="352" width="164" height="52" rx="5" fill="url(#psu5)" stroke="#4A5C96"/>',
    '<circle cx="268" cy="378" r="20" fill="#0A0F1D" stroke="#5B6FA8"/><circle cx="268" cy="378" r="13" fill="none" stroke="#2C3A68"/><circle cx="268" cy="378" r="6" fill="none" stroke="#2C3A68"/><path d="M248 378 H288 M268 358 V398 M254 364 L282 392 M282 364 L254 392" stroke="#2C3A68"/>',
    '<text x="324" y="372" text-anchor="end" ' + MONO5 + ' font-size="11" font-weight="600" fill="#E6ECFA">650W</text><text x="324" y="383" text-anchor="end" ' + MONO5 + ' font-size="6" fill="#8FA0C4">80+ BRONZE</text>',
    '<rect x="192" y="360" width="26" height="34" rx="2" fill="#0A0F1D"/><g fill="#2C3A68"><rect x="195" y="364" width="9" height="5"/><rect x="206" y="364" width="9" height="5"/><rect x="195" y="372" width="9" height="5"/><rect x="206" y="372" width="9" height="5"/><rect x="195" y="380" width="9" height="5"/><rect x="206" y="380" width="9" height="5"/></g></g>',
    /* 1: placa-mãe */
    '<g id="q1"><rect x="214" y="48" width="236" height="292" rx="6" fill="rgba(0,0,0,.45)" transform="translate(4 6)"/>',
    '<rect x="212" y="46" width="236" height="292" rx="6" fill="url(#pcb5)" stroke="#2C3A68"/>',
    '<g stroke="#1F2B52" stroke-width="1.2" fill="none"><path d="M228 200 H252 V250 H300"/><path d="M228 214 H246 V262 H300"/><path d="M360 190 V226 H420"/><path d="M366 190 V232 H424"/><path d="M230 300 H350 V316 H388"/><path d="M230 306 H344 V322 H388"/><path d="M262 190 H340"/></g>',
    '<rect x="190" y="58" width="24" height="88" fill="#18204A" stroke="#3A4A7A"/><g fill="#0A0F1D" stroke="#4A5C96" stroke-width=".6"><rect x="194" y="63" width="16" height="9"/><rect x="194" y="76" width="16" height="9"/><rect x="194" y="89" width="16" height="9"/><rect x="194" y="102" width="16" height="9"/></g><circle cx="202" cy="124" r="3" fill="#5B8CFF"/><circle cx="202" cy="134" r="3" fill="#3DDC97"/>',
    '<rect x="256" y="56" width="124" height="28" rx="3" fill="url(#heat5)" stroke="#6275B0" stroke-width=".6"/>' + fins(256, 56, 124, 28, true, 6),
    '<rect x="222" y="92" width="28" height="108" rx="3" fill="url(#heat5)" stroke="#6275B0" stroke-width=".6"/>' + fins(222, 92, 28, 108, false, 6),
    '<rect x="254" y="96" width="88" height="88" rx="4" fill="#0B1022" stroke="#8795B3" stroke-width="1.4"/><rect x="260" y="102" width="76" height="76" fill="url(#lga5)" opacity=".55"/>',
    '<g fill="#2A3560" stroke="#8795B3" stroke-width=".6"><circle cx="262" cy="190" r="2.4"/><circle cx="272" cy="190" r="2.4"/><circle cx="282" cy="190" r="2.4"/><circle cx="350" cy="96" r="2.4"/><circle cx="350" cy="108" r="2.4"/><circle cx="350" cy="120" r="2.4"/><circle cx="382" cy="92" r="2.4"/></g>',
    (function () { var s = "", k; for (k = 0; k < 4; k++) { var x = 378 + k * 14; s += '<rect x="' + x + '" y="58" width="10" height="130" rx="1.5" fill="#0A0F1D" stroke="#2C3A68" stroke-width=".8"/><rect x="' + (x - 1) + '" y="52" width="12" height="6" rx="1" fill="#2C3A68"/><rect x="' + (x - 1) + '" y="188" width="12" height="6" rx="1" fill="#2C3A68"/>'; } return s; })(),
    '<rect x="428" y="200" width="18" height="62" rx="2" fill="#0A0F1D" stroke="#4A5C96"/><g fill="#B8902E">' + (function () { var s = "", r, c; for (r = 0; r < 12; r++) for (c = 0; c < 2; c++) s += '<rect x="' + (431 + c * 7) + '" y="' + (203 + r * 4.8) + '" width="4.6" height="3" />'; return s; })() + "</g>",
    '<rect x="430" y="272" width="16" height="8" rx="1.5" fill="#0A0F1D" stroke="#4A5C96" stroke-width=".7"/><rect x="430" y="284" width="16" height="8" rx="1.5" fill="#0A0F1D" stroke="#4A5C96" stroke-width=".7"/>',
    '<rect x="262" y="206" width="80" height="12" rx="2" fill="#0A0F1D" stroke="#2C3A68"/><circle cx="346" cy="212" r="3" fill="url(#gold5)"/>',
    '<rect x="226" y="228" width="162" height="10" rx="2" fill="#0A0F1D" stroke="#2C3A68"/><rect x="226" y="292" width="162" height="10" rx="2" fill="#0A0F1D" stroke="#2C3A68"/>',
    '<rect x="392" y="308" width="44" height="30" rx="3" fill="url(#heat5)" stroke="#6275B0" stroke-width=".6"/>' + fins(392, 308, 44, 30, false, 5) + '<path d="M414 316 l6 7 l-6 7 l-6 -7 Z" fill="none" stroke="#C3CFEA" stroke-width="1" opacity=".7"/>',
    '<circle cx="362" cy="318" r="10" fill="#C9D2E6" stroke="#8E9CBA"/><circle cx="362" cy="318" r="6" fill="#9AA8C4"/>',
    '<text x="232" y="326" ' + MONO5 + ' font-size="7" fill="#5C6D9E">B660M · PRO</text><text x="232" y="334" ' + MONO5 + ' font-size="5.5" fill="#3F4F80">ATX · DDR4 · PCIe 4.0</text>',
    '<g fill="#8E9CBA"><circle cx="222" cy="56" r="2.6"/><circle cx="438" cy="56" r="2.6"/><circle cx="222" cy="328" r="2.6"/><circle cx="438" cy="328" r="2.6"/><circle cx="224" cy="262" r="2.6"/></g></g>',
    /* 2: processador */
    '<g id="q2"><rect x="260" y="102" width="76" height="76" rx="3" fill="#1D3866" stroke="#8795B3" stroke-width=".8"/><rect x="268" y="110" width="60" height="60" rx="6" fill="url(#metal5)" stroke="#5A6A8E" stroke-width=".8"/><text x="298" y="136" text-anchor="middle" ' + SANS5 + ' font-size="9" font-weight="700" fill="#4E5E82">CORE</text><text x="298" y="150" text-anchor="middle" ' + SANS5 + ' font-size="12" font-weight="700" fill="#4E5E82">i5</text><text x="298" y="162" text-anchor="middle" ' + MONO5 + ' font-size="5.5" fill="#6A7A9E">12600K · 4.9GHz</text><path d="M262 104 l8 0 l-8 8 Z" fill="url(#gold5)"/></g>',
    /* 3: cooler */
    '<g id="q3"><rect x="254" y="86" width="88" height="8" rx="2" fill="url(#cu5)"/><rect x="262" y="82" width="72" height="5" rx="2" fill="url(#cu5)"/>',
    '<rect x="248" y="92" width="100" height="100" rx="12" fill="url(#heat5)" stroke="#8795B3" stroke-width="1"/><circle cx="298" cy="142" r="42" fill="#080D1C" stroke="#2C3A68"/><circle id="ring5a" class="ring5" cx="298" cy="142" r="40" fill="none" stroke="#5B8CFF" stroke-width="2.4" opacity=".55"/>',
    fan5("fanA", 298, 142, 36, 9, "#33447C"),
    '<g fill="#C3CFEA"><circle cx="256" cy="100" r="2"/><circle cx="340" cy="100" r="2"/><circle cx="256" cy="184" r="2"/><circle cx="340" cy="184" r="2"/></g></g>',
    /* 4: memória */
    '<g id="q4">' + (function () { var s = "", xs = [392, 420], k; for (k = 0; k < 2; k++) { var x = xs[k]; s += '<rect x="' + (x - 1) + '" y="52" width="12" height="136" rx="2" fill="#10183A" stroke="#4A5C96" stroke-width=".7"/><rect x="' + x + '" y="62" width="10" height="104" rx="1.5" fill="url(#heat5)"/><rect x="' + (x + 1.5) + '" y="55" width="7" height="6" rx="1" fill="#5B8CFF" opacity=".85"/><g stroke="rgba(255,255,255,.2)">' + (function () { var t = "", y; for (y = 70; y < 164; y += 7) t += '<line x1="' + x + '" y1="' + y + '" x2="' + (x + 10) + '" y2="' + y + '"/>'; return t; })() + '</g><rect x="' + x + '" y="170" width="10" height="16" fill="url(#gold5)"/>'; } return s; })() + "</g>",
    /* 5: ssd m.2 */
    '<g id="q5"><rect x="258" y="203" width="84" height="16" rx="2" fill="#16224A" stroke="#5B8CFF" stroke-width=".9"/><rect x="258" y="203" width="7" height="16" fill="url(#gold5)"/><g fill="#0A0F1D" stroke="#9AA8C4" stroke-width=".6"><rect x="268" y="206" width="19" height="10"/><rect x="290" y="206" width="19" height="10"/><rect x="312" y="206" width="14" height="10"/></g><text x="297" y="214" text-anchor="middle" ' + MONO5 + ' font-size="4.5" fill="#8FB0FF">NVMe</text><circle cx="338" cy="211" r="2.6" fill="#C3CFEA"/></g>',
    /* 6: placa de vídeo */
    '<g id="q6"><rect x="218" y="230" width="226" height="62" rx="7" fill="rgba(0,0,0,.45)"/><rect x="214" y="224" width="226" height="62" rx="7" fill="url(#gpu5)" stroke="#6275B0" stroke-width="1"/><rect x="214" y="224" width="226" height="5" rx="2.5" fill="#5B8CFF" opacity=".5"/><circle cx="268" cy="257" r="24" fill="#080D1C" stroke="#2C3A68"/><circle class="ring5" cx="268" cy="257" r="23" fill="none" stroke="#5B8CFF" stroke-width="1.8" opacity=".55"/>' + fan5("fanB", 268, 257, 21, 7, "#33447C") + '<circle cx="332" cy="257" r="24" fill="#080D1C" stroke="#2C3A68"/><circle class="ring5" cx="332" cy="257" r="23" fill="none" stroke="#5B8CFF" stroke-width="1.8" opacity=".55"/>' + fan5("fanC", 332, 257, 21, 7, "#33447C"),
    '<text x="408" y="262" text-anchor="middle" ' + MONO5 + ' font-size="9" font-weight="600" fill="#C3CFEA">8 GB</text><text x="408" y="272" text-anchor="middle" ' + MONO5 + ' font-size="5.5" fill="#6A7A9E">GDDR6</text><rect x="426" y="232" width="14" height="20" rx="2" fill="#0A0F1D" stroke="#4A5C96" stroke-width=".7"/><rect x="226" y="286" width="150" height="3" fill="url(#gold5)"/></g>',
    /* 7: cabos */
    '<path id="cb1" d="M338 378 C404 384 458 372 458 332 L458 288 C458 274 448 266 440 264" fill="none" stroke="#0A0F1D" stroke-width="10" stroke-linecap="round" stroke-dasharray="0 1000"/>',
    '<path id="cb1b" d="M338 378 C404 384 458 372 458 332 L458 288 C458 274 448 266 440 264" fill="none" stroke="#3A4A7A" stroke-width="6" stroke-linecap="round" stroke-dasharray="0 1000"/>',
    '<path id="cb2" d="M338 366 C416 368 440 356 440 330 L440 304 C440 296 436 292 430 290" fill="none" stroke="#0A0F1D" stroke-width="8" stroke-linecap="round" stroke-dasharray="0 1000"/>',
    '<path id="cb2b" d="M338 366 C416 368 440 356 440 330 L440 304 C440 296 436 292 430 290" fill="none" stroke="#5B6FA8" stroke-width="4" stroke-linecap="round" stroke-dasharray="0 1000"/>',
    '</g>',
    /* vidro lateral */
    '<g id="glass5" opacity="0"><rect x="176" y="30" width="288" height="380" rx="8" fill="url(#glass5)" stroke="#9DB6FF" stroke-opacity=".5"/><g clip-path="url(#cav5)"><polygon id="shine5" points="176,30 236,30 176,150" fill="#fff" opacity=".1"/><polygon points="464,410 404,410 464,300" fill="#fff" opacity=".05"/></g><g fill="#C3CFEA"><circle cx="186" cy="40" r="3"/><circle cx="454" cy="40" r="3"/><circle cx="186" cy="400" r="3"/><circle cx="454" cy="400" r="3"/></g></g>');
  /* etiquetas das peças */
  var LB5 = [
    { t: "Fonte 650 W", x1: 154, x2: 186, y: 378, side: "l" },
    { t: "Placa-mãe", x1: 154, x2: 213, y: 170, side: "l" },
    { t: "Processador", x1: 154, x2: 262, y: 116, side: "l" },
    { t: "Cooler", x1: 486, x2: 348, y: 100, side: "r" },
    { t: "Memória 16 GB", x1: 486, x2: 432, y: 130, side: "r" },
    { t: "SSD 512 GB", x1: 154, x2: 262, y: 211, side: "l" },
    { t: "Placa de vídeo", x1: 486, x2: 440, y: 262, side: "r" },
    { t: "Cabos", x1: 486, x2: 458, y: 330, side: "r" }
  ];
  LB5.forEach(function (L, i) {
    var left = L.side === "l";
    S5.push('<g id="lb' + i + '" opacity="0"><line x1="' + L.x1 + '" y1="' + L.y + '" x2="' + L.x2 + '" y2="' + L.y + '" stroke="#8FB0FF" stroke-opacity=".55" stroke-width="1"/><circle cx="' + L.x2 + '" cy="' + L.y + '" r="2.6" fill="#8FB0FF"/><text x="' + (left ? L.x1 - 5 : L.x1 + 5) + '" y="' + (L.y + 4) + '" text-anchor="' + (left ? "end" : "start") + '" ' + SANS5 + ' font-size="11.5" font-weight="500" fill="#C9D6F5">' + L.t + "</text></g>");
  });
  svg5.innerHTML = S5.join("");
  var P5 = [
    { ox: -150, oy: 70, r: -5, cx: 270, cy: 378 }, { ox: -170, oy: -12, r: 4, cx: 330, cy: 190 }, { ox: 0, oy: -150, r: 7, cx: 298, cy: 140 },
    { ox: 130, oy: -130, r: -7, cx: 298, cy: 142 }, { ox: 0, oy: -170, r: 0, cx: 410, cy: 120 }, { ox: -160, oy: 24, r: -4, cx: 300, cy: 211 },
    { ox: 190, oy: 40, r: 3, cx: 330, cy: 255 }
  ];
  P5.forEach(function (P, i) { P.g = $("#q" + i, svg5); P.lb = $("#lb" + i, svg5); });
  var cabL = [$("#cb1", svg5), $("#cb1b", svg5), $("#cb2", svg5), $("#cb2b", svg5)], cabLen = cabL.map(function (e) { return e.getTotalLength(); });
  var lbCab = $("#lb7", svg5), glass5 = $("#glass5", svg5), shine5 = $("#shine5", svg5), led5 = $("#led5", svg5);
  var fanEls = [["fanA", 298, 142, 1], ["fanB", 268, 257, -1], ["fanC", 332, 257, 1]].map(function (f) { return { g: $("#" + f[0], svg5), cx: f[1], cy: f[2], d: f[3] }; });
  var rings5 = $$(".ring5", svg5);
  function u5(p) {
    copyP(c5, p, 0.04, 0.34);
    var i, t, e, last = 0;
    for (i = 0; i < P5.length; i++) {
      var P = P5[i], s0 = 0.05 + i * 0.095;
      t = seg(p, s0, s0 + 0.12); e = 1 - Math.pow(1 - t, 3);
      P.g.setAttribute("transform", "translate(" + (P.ox * (1 - e)).toFixed(1) + " " + (P.oy * (1 - e)).toFixed(1) + ") rotate(" + (P.r * (1 - e)).toFixed(2) + " " + P.cx + " " + P.cy + ")");
      P.g.setAttribute("opacity", seg(t, 0, 0.3).toFixed(3));
      P.lb.setAttribute("opacity", seg(t, 0.75, 1).toFixed(3));
    }
    var cb = seg(p, 0.05 + 7 * 0.095, 0.05 + 7 * 0.095 + 0.1);
    cabL.forEach(function (el, k) { var L = cabLen[k] * (k < 2 ? ease(cb) : ease(clamp(cb * 1.15 - 0.1))); el.setAttribute("stroke-dasharray", L.toFixed(1) + " 1000"); });
    lbCab.setAttribute("opacity", seg(cb, 0.8, 1).toFixed(3));
    var gp = ease(seg(p, 0.83, 0.9)), b = seg(p, 0.91, 0.98);
    glass5.setAttribute("opacity", seg(p, 0.83, 0.86).toFixed(3));
    glass5.setAttribute("transform", "translate(" + ((1 - gp) * 330).toFixed(1) + " 0)");
    shine5.setAttribute("transform", "translate(" + (seg(p, 0.9, 1) * 190).toFixed(1) + " " + (seg(p, 0.9, 1) * 90).toFixed(1) + ")");
    var spin = p * 2600 + b * p * 1800;
    fanEls.forEach(function (f) { f.g.setAttribute("transform", "rotate(" + (spin * f.d).toFixed(1) + " " + f.cx + " " + f.cy + ")"); });
    var hue = (p * 900) % 360;
    rings5.forEach(function (r) { r.setAttribute("stroke", b > 0.02 ? "hsl(" + hue.toFixed(0) + ",90%,62%)" : "#5B8CFF"); r.setAttribute("opacity", (0.55 + 0.45 * b).toFixed(2)); });
    led5.setAttribute("fill", b > 0.05 ? "#3DDC97" : "#2A3F78");
    chips5[0].classList.toggle("on", p > 0.5); chips5[1].classList.toggle("on", p > 0.9); chips5[2].classList.toggle("on", b > 0.85);
  }

  /* ---------- cena 6: o mesmo pedido com um prompt comum e com um prompt bem montado ---------- */
  var c6 = copyInit("s6"), body6 = $("#c6body"), thread6 = $("#c6thread"), th6 = $("#th6"), cin = $("#cin"), cph = $("#cph"), csend = $("#csend");
  var KEY6 = ["k1", "k2", "k3", "k4", "k5"].map(function (id) { return $("#" + id); });
  var CRIT = ["Preço da oferta", "Prazo (até domingo)", "Tom da loja", "Formato Instagram", "3 hashtags"];
  var PROMPT1 = "faz um texto pra minha loja";
  var PROMPT2 = '{\n  "papel": "social media de loja de bairro",\n  "tarefa": "legenda de Instagram",\n  "oferta": "camisetas a R$ 39 até domingo",\n  "tom": "animado, direto, até 3 linhas",\n  "formato": "legenda + 3 hashtags",\n  "evitar": "clichês como melhores preços"\n}';
  function jhl(s) { return esc(s).replace(/("[^"\n]*"?)(\s*:)?/g, function (m, str, col) { return '<span class="' + (col ? "jk" : "js") + '">' + str + "</span>" + (col || ""); }); }
  $("#j4").innerHTML = jhl(PROMPT2);
  function words6(parent, text, store) { text.split(" ").forEach(function (w) { var s = document.createElement("span"); s.className = "w6"; s.textContent = w + " "; parent.appendChild(s); store.push(s); }); }
  function el6(tag, cls, parent) { var e = document.createElement(tag); if (cls) e.className = cls; if (parent) parent.appendChild(e); return e; }
  function scoreBlock(parent, good) {
    var d = el6("div", "c6-score", parent);
    d.innerHTML = '<div class="c6-sh"><span>Atende ao que você precisava?</span><b class="' + (good ? "gd" : "bd") + '">0/5</b></div><div class="c6-ch"></div>';
    var box = $(".c6-ch", d), chips = CRIT.map(function (t) { var c = el6("span", "c6-c " + (good ? "ok" : "x"), box); c.textContent = t; return c; });
    return { el: d, chips: chips, num: $("b", d), n: -1 };
  }
  var A1 = { words: [], n: 0 }, A2 = { words: [], n: 0 }, B2 = $("#b2"), B5 = $("#b5"), NOTE1, S1, S2;
  (function () {
    var p, w;
    p = el6("p", "", B2); words6(p, "Claro! Aqui vai um texto para a sua loja:", A1.words);
    p = el6("p", "bd", B2); words6(p, "Bem-vindo à nossa loja!", A1.words);
    p = el6("p", "", B2); words6(p, "Aqui você encontra", A1.words);
    w = el6("span", "weak", p); words6(w, "os melhores produtos com os melhores preços.", A1.words);
    w = el6("span", "weak", p); words6(w, "Qualidade e atendimento que você merece,", A1.words);
    words6(p, "com opções para", A1.words);
    w = el6("span", "weak", p); words6(w, "todos os gostos.", A1.words);
    p = el6("p", "", B2); words6(p, "Venha nos visitar e confira! Se quiser, posso adaptar o texto.", A1.words);
    NOTE1 = el6("p", "c6-note", B2); NOTE1.textContent = "Genérico: esse texto serviria para qualquer loja do mundo.";
    S1 = scoreBlock(B2, false);
    p = el6("p", "", B5); words6(p, "Aqui está a legenda, no formato que você pediu:", A2.words);
    var post = el6("div", "c6-post", B5);
    post.innerHTML = '<div class="c6-ph"><span class="c6-pav">S</span><div><b>sualoja</b><small>Loja de roupas</small></div></div>' +
      '<svg class="c6-img" viewBox="0 0 320 118" aria-hidden="true"><defs><linearGradient id="pbg6" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#18285A"/><stop offset="1" stop-color="#0D1738"/></linearGradient></defs><rect width="320" height="118" fill="url(#pbg6)"/>' +
      '<g transform="translate(66 64)"><path d="M-28 -34 L-12 -40 Q0 -30 12 -40 L28 -34 L44 -12 L30 -2 L24 -9 L24 38 L-24 38 L-24 -9 L-30 -2 L-44 -12 Z" fill="#5B8CFF"/><path d="M-12 -40 Q0 -28 12 -40" fill="none" stroke="#3B62C8" stroke-width="3"/></g>' +
      '<g transform="translate(150 64)"><path d="M-28 -34 L-12 -40 Q0 -30 12 -40 L28 -34 L44 -12 L30 -2 L24 -9 L24 38 L-24 38 L-24 -9 L-30 -2 L-44 -12 Z" fill="#7ED7C1"/><path d="M-12 -40 Q0 -28 12 -40" fill="none" stroke="#4FB39B" stroke-width="3"/></g>' +
      '<g transform="translate(234 64)"><path d="M-28 -34 L-12 -40 Q0 -30 12 -40 L28 -34 L44 -12 L30 -2 L24 -9 L24 38 L-24 38 L-24 -9 L-30 -2 L-44 -12 Z" fill="#FF9F7A"/><path d="M-12 -40 Q0 -28 12 -40" fill="none" stroke="#D9774F" stroke-width="3"/></g>' +
      '<g transform="translate(284 30) rotate(8)"><circle r="25" fill="#F5C84B"/><text y="-1" text-anchor="middle" font-family="IBM Plex Sans, sans-serif" font-size="15" font-weight="800" fill="#2A1E00">R$ 39</text><text y="11" text-anchor="middle" font-family="IBM Plex Sans, sans-serif" font-size="7.5" font-weight="600" fill="#2A1E00">até domingo</text></g></svg>' +
      '<div class="c6-act"><svg viewBox="0 0 24 24"><path d="M12 21C5 16 2 12 2 8.500 2 5.500 4.300 3.500 7 3.500c1.900 0 3.400 1 5 3 1.600-2 3.100-3 5-3 2.700 0 5 2 5 5C22 12 19 16 12 21z"/></svg><svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.600 7.100L3 21l1.900-5.400A8 8 0 1 1 21 12z"/></svg></div>' +
      '<div class="c6-cap"><span id="cap6"></span><span class="ht" id="ht6"></span></div>';
    words6($("#cap6", post), "Camisetas a R$ 39 só até domingo! Passa aqui e escolhe a sua antes que acabe.", A2.words);
    words6($("#ht6", post), "#camisetas #promoção #lojadebairro", A2.words);
    S2 = scoreBlock(B5, true);
  })();
  var M6 = null, th6h = 32, padB6 = 14, lastC6 = "", lastTh = "";
  function measure6() {
    M6 = KEY6.map(function (el) { return { top: el.offsetTop, h: el.offsetHeight }; });
    th6h = th6.offsetHeight || 32;
    padB6 = parseFloat(getComputedStyle(thread6).paddingBottom) || 14;
  }
  function revealA(A, bub, r) {
    var n = Math.floor(r * A.words.length + 1e-6);
    if (n !== A.n) { var lo = Math.min(n, A.n), hi = Math.max(n, A.n); for (var i = lo; i < hi; i++) A.words[i].style.opacity = i < n ? 1 : 0; A.n = n; }
    var f = r <= 0 ? 0 : Math.min(1, r * 1.1 + 0.05);
    bub.style.clipPath = "inset(0 0 " + ((1 - f) * 100).toFixed(2) + "% 0)";
    return f;
  }
  function setScore(S, r, good) {
    var shown = Math.floor(r * 5 + 1e-6);
    S.el.style.opacity = r > 0 ? 1 : 0;
    if (shown !== S.n) { S.n = shown; S.chips.forEach(function (c, i) { c.style.opacity = i < shown ? 1 : 0; c.style.transform = i < shown ? "none" : ""; }); S.num.textContent = (good ? shown : 0) + "/5"; }
  }
  function u6(p) {
    copyP(c6, p, 0.03, 0.3);
    if (!M6) measure6();
    /* campo de mensagem */
    var text = "", mode = "plain";
    if (p < 0.14) text = PROMPT1.slice(0, Math.floor(seg(p, 0.04, 0.13) * PROMPT1.length));
    else if (p >= 0.56 && p < 0.71) { mode = "json"; text = PROMPT2.slice(0, Math.floor(seg(p, 0.56, 0.7) * PROMPT2.length)); }
    var key = mode + ":" + text.length;
    if (key !== lastC6) {
      lastC6 = key;
      if (mode === "json") cin.innerHTML = jhl(text); else cin.textContent = text;
      cin.classList.toggle("json", mode === "json");
      cin.classList.toggle("typing", text.length > 0);
      cph.style.display = text.length ? "none" : "block";
      csend.classList.toggle("on", text.length > 0);
    }
    /* mensagens */
    var dim = seg(p, 0.54, 0.62), v1 = ease(seg(p, 0.14, 0.16)), v3 = ease(seg(p, 0.5, 0.54)), v4 = ease(seg(p, 0.71, 0.73));
    var f2 = revealA(A1, B2, seg(p, 0.2, 0.34)), f5 = revealA(A2, B5, seg(p, 0.77, 0.9));
    var o1 = 1 - 0.5 * dim;
    KEY6[0].style.opacity = (v1 * o1).toFixed(3); KEY6[0].style.transform = "translateY(" + ((1 - v1) * 10).toFixed(1) + "px)";
    KEY6[1].style.opacity = (f2 > 0 ? o1 : 0).toFixed(3);
    KEY6[2].style.opacity = v3.toFixed(3);
    KEY6[3].style.opacity = v4.toFixed(3); KEY6[3].style.transform = "translateY(" + ((1 - v4) * 10).toFixed(1) + "px)";
    KEY6[4].style.opacity = f5 > 0 ? 1 : 0;
    var a1 = seg(p, 0.35, 0.4);
    B2.classList.toggle("annot", a1 > 0.15); NOTE1.style.opacity = a1.toFixed(2);
    setScore(S1, seg(p, 0.4, 0.47), false); setScore(S2, seg(p, 0.9, 0.97), true);
    /* pontos de "pensando" */
    var th = p >= 0.16 && p < 0.2 ? 1 : p >= 0.73 && p < 0.77 ? 4 : 0;
    if (th) th6.style.top = M6[th].top + "px";
    th6.style.opacity = th ? 1 : 0;
    /* rolagem do chat: o fim da conversa fica sempre à vista */
    var rv = [v1, f2, v3, v4, f5], bottom = 0, i;
    for (i = 0; i < 5; i++) if (rv[i] > 0.001) bottom = Math.max(bottom, M6[i].top + M6[i].h * rv[i]);
    if (th) bottom = Math.max(bottom, M6[th].top + th6h);
    var shift = Math.max(0, bottom + padB6 - body6.clientHeight);
    thread6.style.transform = "translateY(" + (-shift).toFixed(1) + "px)";
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
  function onResize() { vh = window.innerHeight; setup1(); setup3(); measure6(); scenes.forEach(function (s) { s.last = -1; }); }
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
    setTimeout(function () { setup1(); setup3(); measure6(); }, 60);
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
    setup1(); setup3(); measure6();
    requestAnimationFrame(frame);
    if (/[?&]flow\b/.test(location.search)) enableFlow(); else setTimeout(detectFlow, 700);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot, boot); else boot();
  setTimeout(function () { if (!started) boot(); }, 1500);
})();
