(()=>{
  // Starfield
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let w, h, stars;
  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  function resize(){
    w = canvas.width = innerWidth * DPR;
    h = canvas.height = innerHeight * DPR;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    build();
  }

  function build(){
    const count = Math.floor((w*h)/(22000*DPR));
    stars = new Array(count).fill(0).map(()=> ({
      x: Math.random()*w,
      y: Math.random()*h,
      z: Math.random()*1 + 0.2,
      r: Math.random()*1.4 + 0.3,
      a: Math.random()*0.6 + 0.3,
      vx: (Math.random()-0.5)*0.15,
      vy: (Math.random()-0.5)*0.15
    }));
  }

  function step(){
    ctx.clearRect(0,0,w,h);
    for(const s of stars){
      s.x += s.vx * s.z; s.y += s.vy * s.z;
      if(s.x < 0) s.x = w; if(s.x > w) s.x = 0;
      if(s.y < 0) s.y = h; if(s.y > h) s.y = 0;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r*DPR, 0, Math.PI*2);
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r*6*DPR);
      glow.addColorStop(0, `rgba(0,255,229,${0.9*s.a})`);
      glow.addColorStop(1, `rgba(0,255,229,0)`);
      ctx.fillStyle = glow;
      ctx.fill();
    }
    requestAnimationFrame(step);
  }

  resize(); step();
  addEventListener('resize', resize);

  // Smooth fade-in on intersect
  const io = new IntersectionObserver((entries)=>{
    for(const e of entries){
      if(e.isIntersecting){
        e.target.style.transform = 'translateY(0)';
        e.target.style.opacity = '1';
        io.unobserve(e.target);
      }
    }
  }, {threshold:0.14});

  document.querySelectorAll('.card, .kwc, .hero h1, .hero p').forEach(el=>{
    el.style.transform='translateY(14px)';
    el.style.opacity='0';
    el.style.transition='all .6s ease';
    io.observe(el);
  });

  // Scroll to CTA
  const buyBtn = document.getElementById('buyBtn');
  buyBtn?.addEventListener('click', ()=>{
    document.getElementById('inquire').scrollIntoView({behavior:'smooth', block:'center'});
  });

  // Simple email copy helper
  const copyEl = document.getElementById('copyEmail');
  copyEl?.addEventListener('click', ()=>{
    const email = 'contact@opnn.ai';
    navigator.clipboard.writeText(email).then(()=>{
      copyEl.innerText = 'Copied ✓';
      setTimeout(()=> copyEl.innerText = 'Copy Email', 1200);
    });
  });
})();