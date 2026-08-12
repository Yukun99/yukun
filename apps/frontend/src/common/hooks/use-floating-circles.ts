import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useRef } from 'react';

const SIZE_MIN = 3;
const SIZE_MAX = 16;
const SPEED_MIN = 5;
const SPEED_MAX = 7.5;
const MAX_DELTA = 0.05;
const PLACEMENT_ATTEMPTS = 200;

type Body = { x: number; y: number; vx: number; vy: number; r: number; size: number };

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const setSpeed = (b: Body, speed: number) => {
  const current = Math.hypot(b.vx, b.vy);
  if (current === 0) return;
  b.vx = (b.vx / current) * speed;
  b.vy = (b.vy / current) * speed;
};

const spawnBodies = (count: number, width: number, height: number, pxPerVmin: number): Body[] => {
  const bodies: Body[] = [];

  for (let i = 0; i < count; i++) {
    const size = rand(SIZE_MIN, SIZE_MAX);
    const r = (size * pxPerVmin) / 2;
    const angle = rand(0, Math.PI * 2);
    const speed = rand(SPEED_MIN, SPEED_MAX) * pxPerVmin;
    let x = 0;
    let y = 0;

    for (let attempt = 0; attempt < PLACEMENT_ATTEMPTS; attempt++) {
      x = rand(r, width - r);
      y = rand(r, height - r);
      if (bodies.every((b) => Math.hypot(b.x - x, b.y - y) >= b.r + r)) break;
    }

    bodies.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r, size });
  }

  return bodies;
};

// collision detection and calculation between 2 bodies
const collide = (first: Body, second: Body) => {
  // collision check -> hypot of distanceX & distanceY < radius total
  const dx = second.x - first.x;
  const dy = second.y - first.y;
  const dist = Math.hypot(dx, dy);
  const minDist = first.r + second.r;
  if (dist === 0 || dist >= minDist) return;

  const ndx = dx / dist;
  const ndy = dy / dist;
  const overlap = (minDist - dist) / 2;

  // move items away from overlap by half of overlap amount, along direction of overlap
  first.x -= ndx * overlap;
  first.y -= ndy * overlap;
  second.x += ndx * overlap;
  second.y += ndy * overlap;

  // prevent stuck balls from previous collision speed resolution
  // previous collision may already have caused separation, if so don't touch
  const approach = -((second.vx - first.vx) * ndx + (second.vy - first.vy) * ndy);
  if (approach < 0) return;

  // calculate new velocity values from collision
  const speedA = Math.hypot(first.vx, first.vy);
  const speedB = Math.hypot(second.vx, second.vy);
  const normalA = first.vx * ndx + first.vy * ndy;
  const normalB = second.vx * ndx + second.vy * ndy;

  first.vx += (normalB - normalA) * ndx;
  first.vy += (normalB - normalA) * ndy;
  second.vx += (normalA - normalB) * ndx;
  second.vy += (normalA - normalB) * ndy;

  // Prevent speed drift from normal swapping by scaling speed back down to original
  setSpeed(first, speedA);
  setSpeed(second, speedB);
};

const useFloatingCircles = (count: number) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let bodies: Body[] = [];
    let width = 0;
    let height = 0;
    let pxPerVmin = 0;
    let frame = 0;
    let last = 0;

    // draw function to draw any updates to balls. translate3d should work well since it runs on GPU
    const draw = () => {
      bodies.forEach((body, i) => {
        const node = nodesRef.current[i];
        if (node)
          node.style.transform = `translate3d(${body.x - body.r}px, ${body.y - body.r}px, 0)`;
      });
    };

    // body properties values assignment/reassignment on container resize
    const layout = () => {
      // get container dimensions
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;

      // scalar to make bodies appear as same scale / velocity regardless of resolution
      const nextPxPerVmin = Math.min(w, h) / 100;

      // assign/reassign speed and velocity values for bodies on init/resize
      if (bodies.length) {
        const scaleX = w / width;
        const scaleY = h / height;
        const scaleSpeed = nextPxPerVmin / pxPerVmin;
        bodies.forEach((body) => {
          body.x *= scaleX;
          body.y *= scaleY;
          body.vx *= scaleSpeed;
          body.vy *= scaleSpeed;
        });
      } else {
        bodies = spawnBodies(count, w, h, nextPxPerVmin);
      }

      width = w;
      height = h;
      pxPerVmin = nextPxPerVmin;

      // assign random size + position & ref to bodies on init/resize
      bodies.forEach((body, i) => {
        body.r = (body.size * pxPerVmin) / 2;
        body.x = clamp(body.x, body.r, width - body.r);
        body.y = clamp(body.y, body.r, height - body.r);
        const node = nodesRef.current[i];
        if (node) {
          node.style.width = `${body.r * 2}px`;
          node.style.height = `${body.r * 2}px`;
        }
      });

      draw();
    };

    // assign new position of body from velocity and previous positon of body + collision
    const step = (delta: number) => {
      for (const body of bodies) {
        body.x += body.vx * delta;
        body.y += body.vy * delta;

        if (body.x - body.r < 0) {
          body.x = body.r;
          body.vx = Math.abs(body.vx);
        } else if (body.x + body.r > width) {
          body.x = width - body.r;
          body.vx = -Math.abs(body.vx);
        }

        if (body.y - body.r < 0) {
          body.y = body.r;
          body.vy = Math.abs(body.vy);
        } else if (body.y + body.r > height) {
          body.y = height - body.r;
          body.vy = -Math.abs(body.vy);
        }
      }

      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) collide(bodies[i], bodies[j]);
      }
    };

    // animation looper
    const tick = (time: number) => {
      // time since last calculation
      const delta = Math.min((time - last) / 1000, MAX_DELTA);
      // save current time as last time for next loop
      last = time;
      step(delta);
      draw();
      // call next loop
      frame = requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(layout);
    observer.observe(container);
    layout();

    // initial loop setup
    if (!reduceMotion) {
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }

    // loop stop on unmount / resize
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [count, reduceMotion]);

  return { containerRef, nodesRef };
};

export default useFloatingCircles;