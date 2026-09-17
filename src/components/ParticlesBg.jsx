import React, { useEffect, useRef } from 'react';

const ParticlesBg = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking & shockwave ripples
    const mouse = {
      x: width / 2,
      y: height / 3,
      targetX: width / 2,
      targetY: height / 3,
      radius: 170,
      active: false
    };

    const ripples = [];

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleClick = (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: 180,
        alpha: 0.9
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    // Color palette for VAJRA energy theme
    const nodeColors = [
      '#FF3131', // Neon Red
      '#FF4D4D', // Bright Scarlet
      '#FF1A53', // Deep Crimson
      '#FFA439', // Amber Spark
      '#FFFFFF'  // Star White
    ];

    // Constellation Particles
    const particleCount = Math.min(Math.floor((width * height) / 9500), 120);
    const particles = [];
    const maxConnectionDistance = 145;

    class NodeParticle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = init ? Math.random() * width : (Math.random() > 0.5 ? 0 : width);
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.1;
        this.vy = (Math.random() - 0.5) * 1.1;
        this.radius = Math.random() * 2.2 + 1.4;
        this.color = nodeColors[Math.floor(Math.random() * nodeColors.length)];
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
        this.pulseVal = Math.random() * Math.PI;
      }

      update() {
        this.pulseVal += this.pulseSpeed;
        const scale = 1 + Math.sin(this.pulseVal) * 0.25;

        // Mouse magnetic pull / repulsion
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius && dist > 1) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 1.2;
            this.y += (dy / dist) * force * 1.2;
          }
        }

        // Ripple blast interaction
        for (let r of ripples) {
          const dx = this.x - r.x;
          const dy = this.y - r.y;
          const dist = Math.hypot(dx, dy);
          if (Math.abs(dist - r.radius) < 30) {
            this.x += (dx / (dist || 1)) * 4;
            this.y += (dy / (dist || 1)) * 4;
          }
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        else if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        else if (this.y > height) this.y = 0;

        this.currentRadius = this.radius * scale;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Floating Rising Embers (VAJRA Fire & Energy Sparks)
    const emberCount = 35;
    const embers = [];

    class EnergyEmber {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : height + 10;
        this.vy = -(Math.random() * 1.4 + 0.6);
        this.vx = (Math.random() - 0.5) * 0.8;
        this.sway = Math.random() * Math.PI * 2;
        this.swaySpeed = Math.random() * 0.03 + 0.015;
        this.size = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.7 + 0.3;
        this.fadeSpeed = Math.random() * 0.006 + 0.003;
      }

      update() {
        this.y += this.vy;
        this.sway += this.swaySpeed;
        this.x += Math.sin(this.sway) * 0.7 + this.vx;
        this.alpha -= this.fadeSpeed;

        if (this.y < -10 || this.alpha <= 0) {
          this.reset(false);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 75, 43, ${Math.max(this.alpha, 0)})`;
        ctx.shadowColor = '#FF3131';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new NodeParticle());
    }

    for (let i = 0; i < emberCount; i++) {
      embers.push(new EnergyEmber());
    }

    // Time ticker for background ambient glow pulses
    let time = 0;

    const animate = () => {
      time += 0.01;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      // 1. Deep space backdrop with dynamic radial energy glow
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, width, height);

      // Ambient Cyber Red Nebula Glow 1
      const orb1X = width * 0.3 + Math.sin(time * 0.7) * 90;
      const orb1Y = height * 0.4 + Math.cos(time * 0.5) * 80;
      const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, width * 0.45);
      grad1.addColorStop(0, 'rgba(255, 20, 50, 0.16)');
      grad1.addColorStop(0.5, 'rgba(180, 0, 40, 0.08)');
      grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Ambient Cyber Indigo Nebula Glow 2
      const orb2X = width * 0.75 + Math.cos(time * 0.6) * 100;
      const orb2Y = height * 0.7 + Math.sin(time * 0.4) * 90;
      const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 10, orb2X, orb2Y, width * 0.4);
      grad2.addColorStop(0, 'rgba(120, 20, 200, 0.10)');
      grad2.addColorStop(0.6, 'rgba(15, 10, 40, 0.04)');
      grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 2. Animate and draw shockwave ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 5.5;
        r.alpha -= 0.025;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 49, 49, ${r.alpha})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#FF3131';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // 3. Connect constellation particles with dynamic laser lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxConnectionDistance) {
            const opacity = 1 - dist / maxConnectionDistance;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);

            // Double gradient line for rich neon cyber glow
            ctx.strokeStyle = `rgba(255, 49, 49, ${opacity * 0.42})`;
            ctx.lineWidth = opacity > 0.6 ? 1.4 : 0.8;
            ctx.stroke();
          }
        }

        // Connect to mouse cursor with bright energy tether
        if (mouse.active) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const opacity = 1 - dist / mouse.radius;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 80, 80, ${opacity * 0.75})`;
            ctx.lineWidth = 1.6;
            ctx.shadowColor = '#FF3131';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }

        particles[i].update();
        particles[i].draw();
      }

      // 4. Update & draw rising energy embers
      for (let ember of embers) {
        ember.update();
        ember.draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="particles-canvas"
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0
      }}
    />
  );
};

export default ParticlesBg;
