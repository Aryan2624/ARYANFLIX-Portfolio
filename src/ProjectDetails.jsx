import React, {useEffect, useRef, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {ArrowUpRight, ChevronRight, Code2, ExternalLink, Github, X, BookOpen, RefreshCw, CalendarDays, Globe2, CheckCircle2} from 'lucide-react';
import {GITHUB_PROFILE, getRepositoryReadme} from './githubProjects';

function formatDate(date) {
  if (!date) return null;
  const value = new Date(date);
  return Number.isNaN(value.getTime()) ? null : value.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});
}
function externalSafeUrl(href, repo, branch='main', image=false) {
  if (!href) return null;
  try {
    if (href.startsWith('#')) return `${repo}#${href.slice(1)}`;
    if (/^https?:\/\//i.test(href)) {
      const parsed = new URL(href);
      return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : null;
    }
    if (href.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(href)) return null;
    const relative=href.replace(/^\.\//,'').replace(/^\//,'');
    const root=image ? `https://raw.githubusercontent.com/${new URL(repo).pathname.slice(1)}/${branch}/` : `${repo}/blob/${branch}/`;
    const url=new URL(relative,root);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch {return null;}
}

function RepositoryReadme({project}) {
  const [state,setState]=useState({status:'loading',markdown:null,message:null});
  const [retry,setRetry]=useState(0);
  useEffect(()=>{
    const controller=new AbortController();
    setState({status:'loading',markdown:null,message:null});
    getRepositoryReadme(project.repo,{signal:controller.signal}).then(result=>{
      if(!controller.signal.aborted)setState({status:'loaded',markdown:result.markdown,message:result.message});
    }).catch(error=>{if(!controller.signal.aborted)setState({status:'error',markdown:null,message:error.message||'README could not be loaded.'})});
    return ()=>controller.abort();
  },[project.repo,retry]);
  const branch=project.githubData?.defaultBranch || 'main';
  return <section className="pd-story-section pd-readme-section" aria-labelledby="pd-readme-heading">
    <div className="pd-section-title"><span>GITHUB DOCUMENTATION / LIVE</span><h3 id="pd-readme-heading">Read the project README.</h3></div>
    <p className="pd-readme-caption">The documentation below is fetched from this repository on GitHub, not rewritten or invented by the portfolio.</p>
    {state.status==='loading'&&<div className="pd-readme-message" role="status"><RefreshCw size={18} className="github-spinning"/> Loading documentation from GitHub…</div>}
    {state.status==='error'&&<div className="pd-readme-message" role="status"><span>{state.message}</span><button type="button" onClick={()=>setRetry(v=>v+1)}>RETRY <RefreshCw size={14}/></button></div>}
    {state.status==='loaded'&&(!state.markdown ? <div className="pd-readme-message"><BookOpen size={18}/>{state.message || 'README not available.'}</div>
      : <div className="pd-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{
          a:({node,href,children,...rest})=>{const url=externalSafeUrl(href,project.repo,branch);return url ? <a href={url} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a> : <span>{children}</span>},
          img:({src,alt})=>{const url=externalSafeUrl(src,project.repo,branch,true);return url ? <img src={url} alt={alt || 'Project README image'} loading="lazy"/> : null;},
        }}>{state.markdown}</ReactMarkdown></div>)}
    {state.message&&state.markdown&&<p className="pd-readme-caption">{state.message}</p>}
    <a className="pd-readme-github" href={project.repo+'#readme'} target="_blank" rel="noopener noreferrer"><Github size={16}/> READ ON GITHUB <ArrowUpRight size={15}/></a>
  </section>;
}

export default function ProjectDetails({project, onClose}) {
  const panelRef=useRef(null);
  const focusedBefore=useRef(null);
  const Icon=project.icon;
  const hasStory=!!(project.features?.length);
  useEffect(()=>{
    focusedBefore.current=document.activeElement;
    panelRef.current?.focus();
    return ()=>focusedBefore.current?.focus?.();
  },[project.id]);
  const trapKeys=event=>{
    if(event.key!=='Tab'||!panelRef.current)return;
    const focusable=[...panelRef.current.querySelectorAll('button:not([disabled]),a[href],[tabindex="0"]')];
    if(!focusable.length)return;
    const first=focusable[0],last=focusable.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    else if(document.activeElement===panelRef.current){event.preventDefault();first.focus()}
  };
  return <div className="project-detail-backdrop" onMouseDown={e=>{if(e.currentTarget===e.target)onClose()}}>
    <article className="project-detail" role="dialog" aria-modal="true" aria-labelledby="project-detail-title" aria-describedby="project-detail-summary" tabIndex={-1} ref={panelRef} onKeyDown={trapKeys}>
      <div className="pd-poster" style={{'--project-accent':project.color}}>
        <div className="pd-poster-grid" aria-hidden="true"/><div className="pd-poster-head"><span>ARYANFLIX <b>{project.featured?'ORIGINALS':'GITHUB LIBRARY'}</b></span><span>{project.featured?'FEATURED PROJECT':'SOURCE REPOSITORY'}</span></div>
        <button type="button" className="pd-close" onClick={onClose} aria-label="Close project details"><X size={20}/></button>
        <div className="pd-poster-copy"><div className="pd-kicker"><span/> {project.category}</div><h2 id="project-detail-title">{project.title}</h2><p id="project-detail-summary">{project.desc}</p>
        <div className="pd-chapter-label">PROJECT FILE / {project.featured ? project.id : 'GITHUB'} <span>SCROLL FOR THE DETAILS ↓</span></div></div>
        <div className="pd-poster-symbol" aria-hidden="true"><div className="pd-symbol-orbit"/><Icon size={120} strokeWidth={0.7}/></div>
      </div>
      <div className="pd-story">
        <div className="pd-overview"><div className="pd-section-title"><span>01 / PROJECT OVERVIEW</span><h3>What is this project?</h3></div><p className="pd-lead">{project.overview || project.desc}</p>
          <div className="pd-status"><span className="pd-status-pulse"/>{project.status || 'PORTFOLIO PROJECT'}</div></div>
        {hasStory&&<><div className="pd-divider"/><section className="pd-story-section pd-problem-section"><div className="pd-section-title"><span>THE PROBLEM & THE APPROACH</span><h3>Why build it?</h3></div><div className="pd-why-grid"><div><span>THE CHALLENGE</span><p>{project.problem}</p></div><div><span>THE APPROACH</span><p>{project.approach}</p></div></div></section>
          <div className="pd-divider"/><section className="pd-story-section"><div className="pd-section-title"><span>02 / INSIDE THE BUILD</span><h3>What's in it?</h3></div><div className="pd-feature-grid">{project.features.map((feature,i)=><div className="pd-feature" key={feature.title}><span className="pd-feature-number">0{i+1}</span><h4>{feature.title}</h4><p>{feature.text}</p></div>)}</div></section>
          <div className="pd-divider"/><section className="pd-story-section"><div className="pd-section-title"><span>03 / PROJECT WORKFLOW</span><h3>How it works</h3></div><div className="pd-workflow">{project.workflow.map((step,i)=><React.Fragment key={step}><div className="pd-workflow-step"><span>0{i+1}</span><b>{step}</b></div>{i<project.workflow.length-1&&<ChevronRight className="pd-flow-arrow" size={17}/>}</React.Fragment>)}</div></section></>}
        {project.githubData&&<><div className="pd-divider"/><section className="pd-story-section"><div className="pd-section-title"><span>LIVE REPOSITORY METADATA</span><h3>Repository information</h3></div><div className="pd-gh-meta">
          <span><Code2 size={16}/> {project.githubData.language||'Language not specified'}</span>
          {project.githubData.updated&&<span><CalendarDays size={16}/> Updated {formatDate(project.githubData.updated)}</span>}
          <span><CheckCircle2 size={16}/>{project.githubData.archived?'Archived':project.githubData.fork?'Forked repository':'Public repository'}</span>
          {project.githubData.website&&<a href={project.githubData.website} target="_blank" rel="noopener noreferrer"><Globe2 size={16}/> Live website <ArrowUpRight size={14}/></a>}
          </div></section></>}
        {(project.tags||[]).length>0&&<><div className="pd-divider"/><section className="pd-story-section"><div className="pd-section-title"><span>TECHNOLOGY & TOPICS</span><h3>Built with / tagged as</h3></div><div className="pd-stack">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div></section></>}
        {project.repo&&<><div className="pd-divider"/><RepositoryReadme key={project.repo} project={project}/></>}
        <section className="pd-source" aria-labelledby="pd-source-heading"><div className="pd-source-icon"><Code2 size={23}/></div><div className="pd-source-copy"><span>THE SOURCE</span><h3 id="pd-source-heading">Explore the code.</h3>
          <p>{project.repo?'Open the original repository to browse the complete source, files, branches, commits, and documentation.':'No matching publicly accessible repository has been linked for this featured project.'}</p>
          {project.note&&<p className="pd-disclaimer">{project.note}</p>}
          {project.repo?<a className="pd-source-button" href={project.repo} target="_blank" rel="noopener noreferrer"><Github size={18}/> VIEW SOURCE CODE <ArrowUpRight size={18}/></a>
            :<a className="pd-source-button pd-source-secondary" href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer"><Github size={18}/> EXPLORE GITHUB <ExternalLink size={16}/></a>}
        </div></section>
        <div className="pd-foot"><span>ARYANFLIX / {project.featured?'FEATURED CASE STUDY':'REPOSITORY CASE STUDY'}</span><button type="button" onClick={onClose}>BACK TO PROJECTS <X size={14}/></button></div>
      </div>
    </article>
  </div>;
}
