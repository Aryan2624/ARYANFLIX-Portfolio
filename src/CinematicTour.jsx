import ProjectOrbit from './ProjectOrbit';
import React, {useEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {ArrowRight,ChevronLeft,ChevronRight,Pause,Play,SkipForward} from 'lucide-react';
import {projects} from './projectData';
import './cinematicTour.css';

const ACTS=[
 {id:'arrival',eyebrow:'01 / ARRIVAL',name:'THE ARRIVAL',duration:6500},
 {id:'skills',eyebrow:'02 / THE TOOLS',name:'THE SKILL UNIVERSE',duration:6500},
 {id:'timeline',eyebrow:'03 / THE STORY',name:'THE JOURNEY',duration:6500},
 {id:'projects',eyebrow:'04 / THE BUILDS',name:'THE PROJECT ROOM',duration:9200},
 {id:'finale',eyebrow:'05 / THE NEXT CHAPTER',name:'ENTER ARYANFLIX',duration:0}
];
const SKILLS=[['PYTHON','PROGRAMMING'],['TENSORFLOW','DEEP LEARNING'],['REACT','INTERFACES'],['FASTAPI','BACKENDS'],['SCIKIT-LEARN','MACHINE LEARNING'],['SQL','DATA']];
const CHAPTERS=[['01','THE FUNDAMENTALS','Programming, AI & algorithms'],['02','BUILDING PROJECTS','From concepts to applications'],['03','ENGINEERING AI','Models, APIs and useful systems'],['04','THE NEXT FRONTIER','Growing toward AI engineering']];
export default function CinematicTour({onFinish,onOpenProject,modalOpen,reduced}){
 const [act,setAct]=useState(0);const [playing,setPlaying]=useState(!reduced);
 const [hoverPause,setHoverPause]=useState(false);const root=useRef(null);const touchStart=useRef(null);
 const current=ACTS[act];
 useEffect(()=>{
  if(!playing||hoverPause||modalOpen||reduced||act===ACTS.length-1)return;
  const timer=window.setTimeout(()=>setAct(n=>Math.min(n+1,ACTS.length-1)),current.duration);
  return ()=>window.clearTimeout(timer);
 },[act,playing,hoverPause,modalOpen,reduced,current.duration]);
 useEffect(()=>{
  const node=root.current;if(!node||reduced)return;
  const figures=node.querySelectorAll('.film-figure');
  const items=node.querySelectorAll('.film-entrance');
  const ctx=gsap.context(()=>{
   gsap.fromTo(items,{y:42,autoAlpha:0,filter:'blur(10px)'},{y:0,autoAlpha:1,filter:'blur(0px)',duration:1.18,ease:'power3.out',stagger:.095,clearProps:'filter'});
   gsap.fromTo(figures,{y:65,scale:.82,autoAlpha:0},{y:0,scale:1,autoAlpha:1,duration:2.15,ease:'power2.out'});
   const cameraMoves=[[-90,20,1.24,0,0,1.02],[65,10,1.1,-28,0,1.02],[-48,8,1.09,22,-12,1.02],[0,0,.89,18,-5,1.04],[50,0,1.13,0,0,1]];
   const [fromX,fromY,fromScale,toX,toY,toScale]=cameraMoves[act];
   gsap.fromTo('.film-world',{x:fromX,y:fromY,scale:fromScale},{x:toX,y:toY,scale:toScale,duration:Math.max(5,current.duration/1000),ease:'sine.inOut'});
  },node);
  return ()=>ctx.revert();
 },[act,reduced]);
 useEffect(()=>{
  const onKey=e=>{
   if(modalOpen)return;
   if(e.key==='Escape'){onFinish();return;}
   if(e.key==='ArrowRight'){e.preventDefault();setAct(a=>Math.min(a+1,ACTS.length-1));setPlaying(false);}
   if(e.key==='ArrowLeft'){e.preventDefault();setAct(a=>Math.max(a-1,0));setPlaying(false);}
  };
  window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);
 },[modalOpen,onFinish]);
 useEffect(()=>{
  document.body.classList.add('tour-active');
  return()=>document.body.classList.remove('tour-active');
 },[]);
 useEffect(()=>{
   if(modalOpen)return;
   let lastWheel=0;
   const wheel=e=>{
     if(Math.abs(e.deltaY)<18)return;
     e.preventDefault();
     const now=Date.now();if(now-lastWheel<950)return;
     lastWheel=now;setPlaying(false);
     setAct(a=>Math.max(0,Math.min(ACTS.length-1,a+(e.deltaY>0?1:-1))));
   };
   window.addEventListener('wheel',wheel,{passive:false});return()=>window.removeEventListener('wheel',wheel);
 },[modalOpen]);
 const touchBegin=e=>{touchStart.current=e.touches?.[0]?.clientY??null};
 const touchEnd=e=>{if(touchStart.current==null||modalOpen)return;const dy=touchStart.current-(e.changedTouches?.[0]?.clientY??touchStart.current);touchStart.current=null;if(Math.abs(dy)>65){setPlaying(false);setAct(a=>Math.max(0,Math.min(ACTS.length-1,a+(dy>0?1:-1))))}};
 const next=()=>{setPlaying(false);setAct(a=>Math.min(a+1,ACTS.length-1));};
 const previous=()=>{setPlaying(false);setAct(a=>Math.max(a-1,0));};
 const openProject=p=>{setPlaying(false);onOpenProject(p);};
 return <div ref={root} className={`cinema-tour cinema-act-${current.id}`} onTouchStart={touchBegin} onTouchEnd={touchEnd} role="region" aria-label="ARYANFLIX cinematic introduction">
   <div className="film-background" aria-hidden="true"><div className="film-stars"/><div className="film-horizon"/><div className="film-laser"/><div className="film-grain"/></div>
   <div className="film-top-bar"><span>ARYAN<span className="film-red">FLIX</span> <small>AN ARYAN M DUBEY ORIGINAL</small></span><span className="film-top-right"><i/> CINEMATIC EXPERIENCE · 2026</span></div>
   <div className="film-world" key={current.id}>
    <div className="film-room" aria-hidden="true"><div className="film-room-rim"/><div className="film-floor"><span/><span/><span/></div></div>
    {act===0&&<div className="film-act-content film-arrival">
       <p className="film-kicker film-entrance">WELCOME TO MY WORLD</p><h1 className="film-massive film-entrance">ARYAN<span>.</span></h1>
       <p className="film-arrival-caption film-entrance">IDEAS <i/> CODE <i/> IMPACT</p>
       <p className="film-small-label film-entrance">ONE PERSON. INFINITE POSSIBILITIES.</p>
      </div>}
    {act===1&&<div className="film-act-content film-skills">
       <p className="film-kicker film-entrance">THE TOOLS BEHIND THE VISION</p><h2 className="film-scene-title film-entrance">MY <em>UNIVERSE.</em></h2>
       <div className="film-orbital-ring ring-outer"/><div className="film-orbital-ring ring-inner"/>
       <div className="film-skills-shell">{SKILLS.map(([name,description],i)=><span key={name} className={'film-skill-chip film-skill-'+i+' film-entrance'}><strong>{name}</strong><small>{description}</small></span>)}</div>
       <span className="film-lower-legend film-entrance">MACHINE LEARNING <b>/</b> DEVELOPMENT <b>/</b> INTELLIGENT SYSTEMS</span>
      </div>}
    {act===2&&<div className="film-act-content film-timeline-scene">
       <p className="film-kicker film-entrance">EVERY BUILD IS PART OF THE JOURNEY</p><h2 className="film-scene-title film-entrance">THE <em>STORY.</em></h2>
       <div className="film-journey-line" aria-hidden="true"/>
       <div className="film-journey-steps">{CHAPTERS.map(([num,title,desc])=><div className="film-journey-step film-entrance" key={num}><span>{num}</span><strong>{title}</strong><small>{desc}</small></div>)}</div>
       <span className="film-lower-legend film-entrance">LEARN <b>→</b> BUILD <b>→</b> EVOLVE</span>
      </div>}
    {act===3&&<div className="film-act-content film-projects-scene">
       <div className="film-proj-heading film-entrance"><span>WELCOME TO THE PROJECT ROOM</span><strong>6 PROJECTS ORBITING · CLICK TO EXPLORE</strong></div>
       <div className="film-project-wall" onPointerEnter={()=>setHoverPause(true)} onPointerLeave={()=>setHoverPause(false)}><ProjectOrbit projects={projects} onOpen={openProject} compact controls={false} reduced={reduced}/></div>
       <span className="film-lower-legend film-entrance">REAL PROJECT STORIES <b>/</b> TECHNOLOGIES <b>/</b> SOURCE CODE</span>
      </div>}
    {act===4&&<div className="film-act-content film-finale">
      <p className="film-kicker film-entrance">THE NEXT CHAPTER STARTS HERE</p><h2 className="film-massive film-entrance">ARYAN<span>FLIX</span></h2>
      <p className="film-finale-desc film-entrance">Building intelligent solutions with AI.</p>
      <button type="button" className="film-enter film-entrance" onClick={onFinish}>EXPLORE THE COMPLETE PORTFOLIO <ArrowRight size={20}/></button>
      </div>}
    <div className="film-figure" aria-hidden="true"><img src="/images/aryan-standee.webp" alt="" fetchPriority="high" draggable="false"/></div>
   </div>
   <div key={"transition-"+current.id} className="film-transition" aria-hidden="true"/>
   <div className="film-bottom-bar">
    <div className="film-chapter-control"><span>SCENE 0{act+1} / 0{ACTS.length}</span><strong>{current.name}</strong></div>
    <div className="film-progress" aria-label="Jump to a scene">{ACTS.map((a,i)=><button key={a.id} type="button" aria-current={act===i?'step':undefined} aria-label={'Scene '+(i+1)+': '+a.name} className={act===i?'active':''} onClick={()=>{setAct(i);setPlaying(false)}}><span/></button>)}</div>
    <div className="film-transport">
     <button type="button" onClick={previous} disabled={act===0} aria-label="Previous scene"><ChevronLeft size={19}/></button>
     <button type="button" onClick={()=>setPlaying(p=>!p)} aria-label={playing?'Pause scene playback':'Play scene playback'} disabled={act===ACTS.length-1 || reduced}>{playing?<Pause size={17}/>:<Play size={17}/>}</button>
     <button type="button" onClick={next} disabled={act===ACTS.length-1} aria-label="Next scene"><ChevronRight size={19}/></button>
     <button type="button" className="film-skip" onClick={onFinish}>ENTER SITE <SkipForward size={15}/></button>
    </div>
   </div>
   <p className="film-screenreader">Use the scene controls to explore the cinematic presentation, or enter the main portfolio. Project panels open detailed case studies.</p>
 </div>;
}
