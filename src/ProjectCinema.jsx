import React,{useRef} from 'react';
import {ArrowDown, ArrowUpRight, Github, Sparkles, MousePointer2} from 'lucide-react';
import {projects} from './projectData';
import ProjectOrbit from './ProjectOrbit';
import './projectCinema.css';
import './projectRoom.css';

export default function ProjectCinema({onOpen,totalCount,stories=projects}){
 const stage=useRef(null);
 const onMove=e=>{if(!stage.current||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const r=stage.current.getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  stage.current.style.setProperty('--parallax-x',`${x*26}px`);
  stage.current.style.setProperty('--parallax-y',`${y*15}px`);
 };
 const reset=()=>{if(stage.current){stage.current.style.setProperty('--parallax-x','0px');stage.current.style.setProperty('--parallax-y','0px')}};
 return <div className="pc-wrap reveal" aria-labelledby="pc-title">
   <div className="pc-title-row"><div><span className="pc-overline"><span className="pc-live-dot"/> ARYANFLIX ORIGINALS / THE MOVING PROJECT UNIVERSE</span>
     <h3 id="pc-title">Watch the projects <em>move.</em></h3>
     <p>Six projects travel continuously around the 3D room. Hover over a screen to pause the orbit, click to open its case study, or select the GitHub icon for the source code. Use the playback controls to explore at your own pace.</p>
    </div><span className="pc-title-counter">02 / APPS & PROJECTS</span></div>
   <div ref={stage} className="room-frame" onPointerMove={onMove} onPointerLeave={reset}>
    <div className="room-background" aria-hidden="true"><img src="/images/aryan-projects.webp" alt="" loading="lazy"/></div>
    <div className="room-space" aria-hidden="true"><span/><span/><span/></div>
    <div className="room-title" aria-hidden="true"><span>ARYAN M DUBEY</span><strong>PROJECTS IN MOTION / INTERACTIVE 3D GALLERY</strong></div>
    <ProjectOrbit projects={stories} onOpen={onOpen}/>
    <img className="room-person" src="/images/aryan-standee.webp" alt="" aria-hidden="true" loading="lazy" draggable="false" />
    <div className="room-floor" aria-hidden="true"><i/><i/><i/></div>
    <span className="room-hint"><MousePointer2 size={14}/> HOVER TO HOLD / CLICK TO EXPLORE</span>
   </div>
   <div className="pc-featured-grid" aria-label="Featured projects quick access">
    {stories.map((p,index)=>{const Icon=p.icon;return <article key={p.id} className="pc-featured-item"><button type="button" className="pc-featured-open" onClick={()=>onOpen({...p,featured:true})}><span className="pc-featured-icon"><Icon size={20}/></span><span className="pc-featured-text"><small>APP / {String(index+1).padStart(2,'0')}</small><strong>{p.title}</strong><span>{p.category}</span></span><ArrowUpRight className="pc-featured-arrow" size={20}/></button>{p.repo&&<a className="pc-featured-repo" href={p.repo} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} repository`}><Github size={17}/></a>}</article>})}
   </div>
   <div className="pc-after"><span><Sparkles size={15}/> 6 MOVING FEATURED SCREENS / {totalCount} PROJECTS IN THE LIBRARY</span><a href="#project-archive">EXPLORE THE COMPLETE GITHUB ARCHIVE <ArrowDown size={15}/></a></div>
   <p className="pc-image-notice">Project screens are real clickable interface elements animated along a 3D-perspective path. Your supplied cinematic artwork is the background, with your standing figure in a separate foreground layer. On phones, swipe through project cards.</p>
 </div>;
}
