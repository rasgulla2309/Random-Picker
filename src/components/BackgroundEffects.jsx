import React, { useEffect, useRef, memo } from 'react';

function BackgroundEffects() {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Subtle gentle golden & emerald sparkle particles
    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      speedY: -(Math.random() * 0.3 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.35 + 0.1,
      color: ['#16a34a', '#eab308', '#22c55e', '#ca8a04'][Math.floor(Math.random() * 4)],
    }));

    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 1;

      // Soft ambient light blooms in corners (like the image)
      const gradLeft = ctx.createRadialGradient(0, 0, 0, 0, 0, canvas.width * 0.4);
      gradLeft.addColorStop(0, 'rgba(220, 252, 231, 0.45)');
      gradLeft.addColorStop(1, 'rgba(240, 246, 242, 0)');
      ctx.fillStyle = gradLeft;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradRight = ctx.createRadialGradient(canvas.width, canvas.height * 0.3, 0, canvas.width, canvas.height * 0.3, canvas.width * 0.45);
      gradRight.addColorStop(0, 'rgba(254, 240, 138, 0.2)');
      gradRight.addColorStop(0.5, 'rgba(220, 252, 231, 0.3)');
      gradRight.addColorStop(1, 'rgba(240, 246, 242, 0)');
      ctx.fillStyle = gradRight;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Micro sparkles
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity * (0.6 + 0.4 * Math.sin(t * 0.03 + p.x));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}

export default memo(BackgroundEffects);
