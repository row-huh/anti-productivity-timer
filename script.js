document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('form');
  const hoursInput = document.getElementById('hours');
  const minsInput = document.getElementById('minutes');
  let intervalId = null;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    startAcceleratedTimer();
  });

  function startAcceleratedTimer() {
    clearInterval(intervalId);
    const hours = parseInt(hoursInput.value || '0', 10);
    const minutes = parseInt(minsInput.value || '0', 10);
    const totalMinutes = Math.max(0, (hours * 60) + minutes);
    if (!totalMinutes) {
      alert('Enter a non-zero duration (hours or minutes).');
      return;
    }


    let remainingSeconds = totalMinutes;


    let display = document.getElementById('countdown-display');
    if (!display) {
      display = document.createElement('div');
      display.id = 'countdown-display';
      display.style.marginTop = '12px';
      display.style.fontSize = '18px';
      display.style.fontWeight = '600';
      document.getElementById('timer').appendChild(display);
    }

    updateDisplay();

    intervalId = setInterval(() => {
      remainingSeconds -= 1;
      updateDisplay();
      if (remainingSeconds <= 0) {
        clearInterval(intervalId);
        onTimerFinish(totalMinutes);
      }
    }, 1000);

    function updateDisplay() {
      display.textContent = `Pretend session: ${totalMinutes} minute(s) — finishing in ${remainingSeconds} second(s)`;
    }
  }

  function onTimerFinish(totalMinutes) {
    playBeep();
    showCelebration(totalMinutes);
  }


  function playBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880;
      g.gain.value = 0.001;
      o.connect(g);
      g.connect(ctx.destination);

      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      setTimeout(() => { o.stop(); ctx.close(); }, 400);
    } catch (err) {

      const a = new Audio();

      a.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=';
      a.play().catch(() => {});
    }
  }


  function showCelebration(totalMinutes) {

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.left = 0;
    overlay.style.top = 0;
    overlay.style.right = 0;
    overlay.style.bottom = 0;
    overlay.style.zIndex = 9999;
    overlay.style.pointerEvents = 'none';
    document.body.appendChild(overlay);


    const banner = document.createElement('div');
    banner.style.position = 'absolute';
    banner.style.left = '50%';
    banner.style.top = '18%';
    banner.style.transform = 'translateX(-50%)';
    banner.style.background = 'rgba(255,255,255,0.95)';
    banner.style.padding = '24px 32px';
    banner.style.borderRadius = '12px';
    banner.style.boxShadow = '0 8px 30px rgba(0,0,0,0.25)';
    banner.style.fontSize = '26px';
    banner.style.fontWeight = '700';
    banner.style.color = '#111';
    banner.style.pointerEvents = 'auto';
    banner.textContent = `You worked ${totalMinutes} minute(s)! 🎉`;
    overlay.appendChild(banner);

    const emojiContainer = document.createElement('div');
    emojiContainer.style.position = 'absolute';
    emojiContainer.style.left = '50%';
    emojiContainer.style.top = '38%';
    emojiContainer.style.transform = 'translateX(-50%)';
    emojiContainer.style.pointerEvents = 'none';
    overlay.appendChild(emojiContainer);

    const emojis = ['🎉','🥳','✨','🏆','👏','🍾'];
    for (let i=0;i<16;i++) {
      const el = document.createElement('div');
      el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      el.style.position = 'absolute';
      el.style.left = (Math.random()*80 - 40) + '%';
      el.style.top = '0%';
      el.style.fontSize = (18 + Math.random()*36) + 'px';
      el.style.opacity = 0.95;
      el.style.transform = `translateY(0) rotate(${Math.random()*60-30}deg)`;
      emojiContainer.appendChild(el);
      // animate
      const duration = 2200 + Math.random()*1800;
      el.animate([
        { transform: `translateY(0) translateX(0) rotate(${Math.random()*20-10}deg)`, opacity: 1 },
        { transform: `translateY(-${50 + Math.random()*300}px) translateX(${Math.random()*200-100}px) rotate(${Math.random()*720-360}deg)`, opacity: 0 }
      ], { duration, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }


    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.left = 0;
    canvas.style.top = 0;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    overlay.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const confetti = [];
    const colors = ['#ff3b30','#ff9500','#ffcc00','#4cd964','#5ac8fa','#5856d6'];
    for (let i=0;i<160;i++) {
      confetti.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height - canvas.height,
        r: 6 + Math.random()*10,
        d: Math.random()*Math.PI*2,
        color: colors[Math.floor(Math.random()*colors.length)],
        tilt: Math.random()*10-10,
        tiltSpeed: Math.random()*0.1+0.05,
        speed: 2 + Math.random()*4
      });
    }

    let confettiAnim = true;
    function renderConfetti() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for (let i=0;i<confetti.length;i++) {
        const p = confetti[i];
        p.y += p.speed;
        p.x += Math.sin(p.d) * 0.5;
        p.tilt += p.tiltSpeed;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(p.x + Math.sin(p.tilt)*10, p.y, p.r, p.r*0.6, p.tilt, 0, Math.PI*2);
        ctx.fill();
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random()*canvas.width;
        }
      }
      if (confettiAnim) requestAnimationFrame(renderConfetti);
    }
    renderConfetti();

    setTimeout(() => {
      confettiAnim = false;
      overlay.remove();
    }, 6000);
  }
});


document.getElementById('form').addEventListener('click', start())


function start() {
    hours = Number(hours.value)
    minutes = Number(minutes.value)
    
    console.log("hours: ", hours)
    console.log("Minutes: ", minutes)
}