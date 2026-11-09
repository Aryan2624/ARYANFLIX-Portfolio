import React, {useEffect, useRef, useState} from 'react';
import {ArrowUpRight, ChevronLeft, ChevronRight, Github, Pause, Play, Code2} from 'lucide-react';
import './orbitProjects.css';

/* A true position-changing 3D carousel rather than a floating-card animation.
 * rAF updates DOM transforms directly (no per-frame React re-renders).
 * The scene automatically stops rendering while out of view or tab-hidden.
 */
export default function ProjectOrbit({projects=[], onOpen, compact=false, reduced: reducedProp, controls=true}) {
  const root = useRef(null);
  const slots = useRef([]);
  const phase = useRef(-0.34);
  const lastFrame = useRef(0);
  const hovering = useRef(false);
  const inView = useRef(true);
  const playingRef = useRef(true);
  const [playing, setPlaying] = useState(true);
  const [prefersReduced, setPrefersReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const reduced = Boolean(reducedProp || prefersReduced);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listen = e => setPrefersReduced(e.matches);
    query.addEventListener('change', listen);
    return () => query.removeEventListener('change', listen);
  }, []);
  useEffect(() => { playingRef.current = playing; }, [playing]);

  const drawRef = useRef(() => {});
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    let rafId = 0;
    let mobile = window.matchMedia('(max-width: 720px)').matches;
    let width = host.clientWidth;
    let height = host.clientHeight;
    const draw = () => {
      if (mobile) {
        for (const el of slots.current) if (el) {
          el.style.transform = '';
          el.style.opacity = '';
          el.style.zIndex = '';
        }
        return;
      }
      const count = projects.length || 1;
      const horizontal = width * (compact ? .377 : .382);
      const vertical = height * (compact ? .235 : .23);
      for (let i = 0; i < projects.length; i++) {
        const el = slots.current[i];
        if (!el) continue;
        const theta = phase.current + (i * Math.PI * 2 / count);
        const x = width * .5 + Math.sin(theta) * horizontal;
        const y = height * .49 + Math.cos(theta) * vertical * .63 + Math.sin(theta * 2) * vertical * .14;
        const depth = Math.cos(theta);
        const scale = .75 + (depth + 1) * .155;
        const z = depth * 220 - 45;
        const yaw = -Math.sin(theta) * 27;
        const roll = Math.sin(theta * 2) * 2.2;
        el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) translate(-50%, -50%) rotateY(${yaw}deg) rotateZ(${roll}deg) scale(${scale})`;
        el.style.opacity = String(.65 + (depth + 1) * .175);
        el.style.zIndex = String(Math.round(10 + (depth + 1) * 3));
      }
    };
    drawRef.current = draw;
    const tick = now => {
      const delta = lastFrame.current ? Math.min(now - lastFrame.current, 45) : 16;
      lastFrame.current = now;
      if (!mobile && inView.current && !document.hidden && playingRef.current && !hovering.current && !reduced) {
        phase.current += delta * .00028;
        if (phase.current > Math.PI * 2) phase.current -= Math.PI * 2;
      }
      if (inView.current && !document.hidden) draw();
      rafId = window.requestAnimationFrame(tick);
    };
    const resize = () => {
      mobile = window.matchMedia('(max-width: 720px)').matches;
      width = host.clientWidth;
      height = host.clientHeight;
      draw();
    };
    const observer = new IntersectionObserver(entries => {
      inView.current = entries[0]?.isIntersecting ?? true;
      lastFrame.current = 0;
      if (inView.current) draw();
    }, {rootMargin: '120px'});
    observer.observe(host);
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    draw();
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      ro.disconnect();
      drawRef.current = () => {};
      lastFrame.current = 0;
    };
  }, [projects.length, compact, reduced]);

  const step = direction => {
    phase.current += direction * (Math.PI * 2 / Math.max(projects.length, 1));
    drawRef.current();
  };
  const open = project => onOpen({...project, featured: true});
  return <div ref={root} className={`orb-universe ${compact ? 'orb-compact' : 'orb-full'} ${reduced ? 'orb-reduced' : ''}`} aria-label="Moving, interactive project carousel">
    <div className="orb-guide" aria-hidden="true" />
    <div className="orb-guide orb-guide-second" aria-hidden="true" />
    {projects.map((p,i) => {
      const Icon = p.icon || Code2;
      return <div key={p.id || p.title} className="orb-slot" ref={el => { slots.current[i] = el; }}
          onMouseEnter={() => {hovering.current = true;}}
          onMouseLeave={() => {hovering.current = false;}}
          onFocusCapture={() => {hovering.current = true;}}
          onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) hovering.current = false; }}>
        <article className="orb-card">
          <button className="orb-card-open" type="button" onClick={() => open(p)} aria-label={`Read details of ${p.title}`}>
            <span className="orb-visual" style={{'--orb-accent':p.color || '#e50924'}}>
              <span className="orb-art-grid"/><Icon size={36} strokeWidth={1.2}/><span className="orb-art-light"/>
            </span>
            <span className="orb-info">
              <small>PROJECT / {String(i+1).padStart(2,'0')}</small>
              <strong>{p.title}</strong>
              <span>{p.category || p.desc}</span>
              <em>VIEW PROJECT DETAILS <ArrowUpRight size={13}/></em>
            </span>
          </button>
          {p.repo && <a className="orb-git" href={p.repo} target="_blank" rel="noopener noreferrer" title={`GitHub source code for ${p.title}`} aria-label={`GitHub source code for ${p.title}`}><Github size={18}/></a>}
        </article>
      </div>;
    })}
    {controls && <div className="orb-controls" aria-label="Project animation controls">
      <button type="button" onClick={() => step(-1)} title="Previous project position" aria-label="Move projects backward"><ChevronLeft size={17}/></button>
      <button type="button" onClick={() => setPlaying(value => !value)} title={playing ? 'Pause moving projects' : 'Play moving projects'} aria-label={playing ? 'Pause moving projects' : 'Play moving projects'}>{playing && !reduced ? <Pause size={16}/> : <Play size={16}/>}</button>
      <button type="button" onClick={() => step(1)} title="Next project position" aria-label="Move projects forward"><ChevronRight size={17}/></button>
      <span className="orb-status"><i className={playing && !reduced ? 'orb-online' : ''}/> {reduced ? 'MOTION REDUCED' : playing ? 'ORBIT IN MOTION' : 'PAUSED'}</span>
    </div>}
  </div>;
}
