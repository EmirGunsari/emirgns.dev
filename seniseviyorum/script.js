(() => {
  // 75 dilde "seni seviyorum"
  const WORDS = [
    "Seni seviyorum", "I love you", "Te quiero", "Je t'aime", "Ich liebe dich", "Ti amo",
    "Eu te amo", "Я тебя люблю", "我爱你", "愛してる", "사랑해", "أحبك",
    "Σ' αγαπώ", "Ik hou van je", "Jag älskar dig", "Jeg elsker deg", "Jeg elsker dig",
    "Minä rakastan sinua", "Kocham cię", "Miluji tě", "Ľúbim ťa", "Szeretlek", "Te iubesc",
    "Обичам те", "Волим те", "Ljubim te", "Volim te", "Mīlu tevi", "Aš tave myliu",
    "Ma armastan sind", "Ég elska þig", "Gràdh agam ort", "Rwy'n dy garu di", "Tá grá agam duit",
    "Mahal kita", "Aku cinta kamu", "Saya cintakan awak", "Tôi yêu bạn", "ผมรักคุณ",
    "मैं तुमसे प्यार करता हूँ", "আমি তোমাকে ভালোবাসি", "நான் உன்னை காதலிக்கிறேன்",
    "నేను నిన్ను ప్రేమిస్తున్నాను", "ನಾನು ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತೇನೆ", "എനിക്ക് നിന്നെ ഇഷ്ടമാണ്",
    "මම ඔබට ආදරෙයි", "میں تم سے پیار کرتا ہوں", "دوستت دارم", "אני אוהב אותך",
    "Mən səni sevirəm", "Мен сені сүйемін", "Men seni sevaman", "მიყვარხარ", "Ես սիրում եմ քեզ",
    "Ma hubbi", "Nakupenda", "Ninakupenda", "Mo nifẹ rẹ", "Ndinokuda", "Ngiyakuthanda",
    "Ek is lief vir jou", "Mahal na mahal kita", "T'estimo", "Maite zaitut",
    "Të dua", "Te zakam", "Aloha au iā 'oe", "Ua alofa ia te oe",
    "Nagligivaget", "Wo ai ni", "Ngiyakuthanda kakhulu", "Mi amas vin", "Te amo mucho",
    "Es tevi mīlu", "Те сакам"
  ].slice(0, 75);

  const MAIN = "Sinem Seni Seviyorum";
  const START_DELAY = 2000; // ms: animasyon başlamadan önce bekleme

  const canvas = document.getElementById("heart");
  const ctx = canvas.getContext("2d");
  let W, H, dpr, items = [], t0 = performance.now(), main = null;

  // Kalp denklemi (parametrik); noktanın içeride olup olmadığını kontrol eder
  const heartPoint = (t) => ({
    x: 16 * Math.sin(t) ** 3,
    y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
  });
  const poly = [];
  for (let i = 0; i < 400; i++) poly.push(heartPoint((i / 400) * Math.PI * 2));
  const inside = (x, y) => {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if ((a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) c = !c;
    }
    return c;
  };

  function layout() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const scale = Math.min(W / 36, H / 34);      // kalp birimi -> piksel
    const cx = W / 2, cy = H / 2 - scale * 0.9;   // kalp merkezi
    const toPx = (p) => ({ x: cx + p.x * scale, y: cy + p.y * scale });

    // Orta yazı için ayrılan alan
    const mainSize = Math.max(12, scale * 1.05);
    ctx.font = `800 ${mainSize}px system-ui, "Segoe UI", sans-serif`;
    const mw = ctx.measureText(MAIN).width;
    const mainBox = { x: cx - mw / 2 - 10, y: cy - mainSize * 0.9, w: mw + 20, h: mainSize * 1.8 };
    main = { text: MAIN, x: cx, y: cy, size: mainSize };

    const placed = [mainBox];
    const hit = (b) => placed.some((p) => b.x < p.x + p.w && b.x + b.w > p.x && b.y < p.y + p.h && b.y + b.h > p.y);
    items = [];

    const baseSize = Math.max(7, scale * 0.5);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    // Büyükten küçüğe, dil dil yerleştir; her dil birden çok kez geçebilir ki kalp dolsun
    const queue = [];
    for (let pass = 0; pass < 14; pass++) WORDS.forEach((w) => queue.push({ w, k: rnd() }));
    queue.sort((a, b) => b.k - a.k);
    for (const { w: word, k } of queue) {
      const size = baseSize * (0.7 + k * 0.9);
      ctx.font = `600 ${size}px system-ui, "Segoe UI", sans-serif`;
      const w = ctx.measureText(word).width, h = size * 1.1;
      for (let tries = 0; tries < 220; tries++) {
        const ux = (rnd() * 2 - 1) * 17.5, uy = (rnd() * 2 - 1) * 16;
        const c = toPx({ x: ux, y: uy });
        // kelimenin 4 köşesi de kalbin içinde olmalı
        const corners = [[-w / 2, -h / 2], [w / 2, -h / 2], [-w / 2, h / 2], [w / 2, h / 2]];
        if (!corners.every(([dx, dy]) => inside((c.x + dx - cx) / scale, (c.y + dy - cy) / scale))) continue;
        const box = { x: c.x - w / 2 - 2, y: c.y - h / 2, w: w + 4, h: h };
        if (hit(box)) continue;
        placed.push(box);
        items.push({ word, x: c.x, y: c.y, size, delay: 0, hue: rnd() });
        break;
      }
    }
    // Merkezden dışa doğru belirme sırası
    items.sort((a, b) => Math.hypot(a.x - cx, a.y - cy) - Math.hypot(b.x - cx, b.y - cy));
    items.forEach((it, i) => (it.delay = START_DELAY + 300 + (i / items.length) * 3800 + rnd() * 250));
    main.cx = cx; main.cy = cy;
  }

  const ease = (x) => 1 - Math.pow(1 - x, 3);

  function frame(now) {
    const t = now - t0;
    ctx.clearRect(0, 0, W, H);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";

    // Kalp atışı: sadece hafif nabız
    const beat = 1 + 0.006 * Math.sin(t / 700) ** 4;
    ctx.save();
    ctx.translate(main.cx, main.cy); ctx.scale(beat, beat); ctx.translate(-main.cx, -main.cy);

    for (const it of items) {
      const k = Math.min(Math.max((t - it.delay) / 700, 0), 1);
      if (k <= 0) continue;
      const a = ease(k);
      const flicker = 0.78 + 0.22 * Math.sin(t / 900 + it.x * 0.05 + it.y * 0.03);
      ctx.globalAlpha = a * flicker;
      ctx.font = `600 ${it.size * (0.85 + 0.15 * a)}px system-ui, "Segoe UI", sans-serif`;
      ctx.fillStyle = `hsl(${352 + it.hue * 12}, 85%, ${52 + it.hue * 10}%)`;
      ctx.fillText(it.word, it.x, it.y + (1 - a) * 8);
    }

    // Ortadaki vurgulu yazı: altın/pembe, parıltılı
    const mk = ease(Math.min(Math.max((t - (START_DELAY + 4200)) / 1200, 0), 1));
    if (mk > 0) {
      const pulse = 0.5 + 0.5 * Math.sin(t / 500);
      ctx.globalAlpha = mk;
      ctx.shadowColor = `rgba(255, 40, 70, ${0.6 + 0.3 * pulse})`;
      ctx.shadowBlur = 10 + 8 * pulse;
      ctx.fillStyle = "#ff2442";
      ctx.font = `800 ${main.size * (0.92 + 0.08 * mk)}px system-ui, "Segoe UI", sans-serif`;
      ctx.fillText(main.text, main.x, main.y);
      ctx.shadowBlur = 0;
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  let resizeTimer;
  addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { layout(); t0 = performance.now() - (START_DELAY + 6500); }, 150); });
  layout();
  requestAnimationFrame(frame);
})();
