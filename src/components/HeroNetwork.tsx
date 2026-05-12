import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  r: number;
  color: string;
};

export function HeroNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let nodes: Node[] = [];
    let raf = 0;

    const NEON = "rgba(140, 220, 255, 1)";
    const MAGENTA = "rgba(240, 120, 220, 1)";
    const WHITE = "rgba(235, 240, 250, 1)";

    const init = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(30, Math.min(40, Math.floor((width * height) / 12000)));
      nodes = Array.from({ length: count }, (_, i) => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const accent = i % 12 === 0 ? MAGENTA : i % 14 === 0 ? NEON : null;
        return {
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: accent ? 2.4 : 1.6,
          color: accent ?? WHITE,
        };
      });
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active =
        mouseRef.current.x >= 0 &&
        mouseRef.current.x <= rect.width &&
        mouseRef.current.y >= 0 &&
        mouseRef.current.y <= rect.height;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const m = mouseRef.current;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        let dx = 0;
        let dy = 0;
        if (m.active) {
          const ddx = n.x - m.x;
          const ddy = n.y - m.y;
          const dist = Math.hypot(ddx, ddy);
          if (dist < 180 && dist > 0.01) {
            const force = (180 - dist) / 180;
            dx = (ddx / dist) * force * 18;
            dy = (ddy / dist) * force * 18;
          }
        }

        const drawX = n.x + dx;
        const drawY = n.y + dy;
        n.drawX = drawX;
        n.drawY = drawY;
      }

      // edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.drawX - b.drawX;
          const dy = a.drawY - b.drawY;
          const dist = Math.hypot(dx, dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.25;
            ctx.strokeStyle = `rgba(140, 200, 240, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.drawX, a.drawY);
            ctx.lineTo(b.drawX, b.drawY);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.fillStyle = n.color;
        if (n.color !== WHITE) {
          ctx.shadowColor = n.color;
          ctx.shadowBlur = 12;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.arc(n.drawX, n.drawY, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };

    init();
    draw();

    const ro = new ResizeObserver(() => init());
    ro.observe(canvas);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-y-0 right-0 w-full md:w-1/2 h-full pointer-events-auto"
    />
  );
}
