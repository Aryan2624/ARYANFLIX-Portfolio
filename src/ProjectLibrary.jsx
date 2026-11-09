import ProjectCinema from './ProjectCinema';
import React, {useEffect, useMemo, useState} from 'react';
import {ArrowUpRight, ArrowRight, Github, BookOpen, Search, X, Layers3, ExternalLink, RefreshCw, Wifi, WifiOff, ChevronDown, Code2} from 'lucide-react';
import {projects as curatedProjects} from './projectData';
import {GITHUB_PROFILE, getAllPublicRepositories, mergeProjects} from './githubProjects';
import snapshot from './generated/repoSnapshot.json';

const filters = ['All projects', 'Featured', 'GitHub repositories', 'Original projects', 'Forks', 'Python', 'JavaScript / TypeScript', 'Other languages'];
const snapshotRepos = snapshot.account?.toLowerCase() === 'aryan2624' && Array.isArray(snapshot.repositories) ? snapshot.repositories : [];

function matchesFilter(project, filter) {
  if (filter === 'Featured') return !!project.featured;
  if (filter === 'GitHub repositories') return !!project.githubData;
  if (filter === 'Original projects') return !!project.githubData && !project.githubData.fork;
  if (filter === 'Forks') return !!project.githubData?.fork;
  const lang = (project.githubData?.language || '').toLowerCase();
  if (filter === 'Python') return lang === 'python' || (!project.githubData && project.tags.some(t=>t.toLowerCase()==='python'));
  if (filter === 'JavaScript / TypeScript') return ['javascript','typescript'].includes(lang) || (!project.githubData && project.tags.some(t=>['javascript','typescript','react'].includes(t.toLowerCase())));
  if (filter === 'Other languages') return !!project.githubData && !!lang && !['python','javascript','typescript'].includes(lang);
  return true;
}

function ProjectCard({project, number, total, onOpen}) {
  const Icon = project.icon;
  const chips = (project.tags || []).slice(0,4);
  const inside = project.features?.slice(0,3) || [];
  return <article className="project-card project-library-card">
    <button className="project-art library-art" type="button" style={{'--art':project.color}} onClick={()=>onOpen(project)} aria-label={'Explore '+project.title}>
      <div className="art-grid"/><div className="art-halo"/><Icon size={80} strokeWidth={0.8}/>
      <span className="art-num"><span>ARYANFLIX {project.featured ? 'FEATURED' : 'GITHUB'}</span><b>{String(number).padStart(2,'0')} / {String(total).padStart(2,'0')}</b></span>
      <span className="library-art-bottom"><span className="art-title">{project.title}</span><span className="library-art-open"><ArrowUpRight size={19}/></span></span>
    </button>
    <div className="project-body library-card-body">
      <div className="library-category"><span className="micro">{project.category}</span><span className="library-index">{project.githubData ? 'GITHUB / PUBLIC' : 'CURATED'}</span></div>
      <h3>{project.title}</h3><p className="library-description">{project.desc}</p>
      {inside.length ? <div className="library-inside"><span>INSIDE THIS PROJECT</span><ul>{inside.map(f=><li key={f.title}>{f.title}</li>)}</ul></div>
        : <div className="library-repo-facts"><span><Code2 size={14}/>{project.githubData?.language || 'Source repository'}</span><span>{project.githubData?.fork ? 'FORKED' : project.githubData?.archived ? 'ARCHIVED' : 'OPEN SOURCE VIEW'}</span></div>}
      <div className="tags library-tags">{chips.map(t=><span key={t}>{t}</span>)}{!chips.length&&<span>Repository details</span>}</div>
      <div className="library-card-actions"><button type="button" className="library-details-btn" onClick={()=>onOpen(project)}><BookOpen size={15}/> READ PROJECT DETAILS <ArrowRight size={15}/></button>
        {project.repo ? <a className="library-github-btn" href={project.repo} target="_blank" rel="noopener noreferrer" aria-label={'Open '+project.title+' source code on GitHub'}><Github size={17}/><span>SOURCE CODE</span><ExternalLink size={13}/></a>
          : <span className="library-no-repo"><Layers3 size={15}/> NOT PUBLICLY LINKED</span>}
      </div>
    </div>
  </article>;
}

export default function ProjectLibrary({onOpen}) {
  const [filter, setFilter] = useState('All projects');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [refreshToken, setRefreshToken] = useState(0);
  const [sync, setSync] = useState({state:'loading',repos:snapshotRepos,error:null,warning:null});
  useEffect(()=>{
    const controller = new AbortController();
    setSync(prev=>({...prev,state:'loading',error:null}));
    getAllPublicRepositories({signal:controller.signal})
      .then(({repositories,warning})=>{if(!controller.signal.aborted)setSync({state:'success',repos:repositories,error:null,warning})})
      .catch(error=>{if(!controller.signal.aborted)setSync(prev=>({...prev,state:prev.repos.length?'snapshot':'error',error:error.message||'Could not load GitHub projects.'}))});
    return ()=>controller.abort();
  },[refreshToken]);

  const allProjects = useMemo(()=>sync.repos.length ? mergeProjects(curatedProjects,sync.repos) : curatedProjects.map(p=>({...p,featured:true,origin:'featured'})),[sync.repos]);
  const matching = useMemo(()=>{
    const query=search.trim().toLowerCase();
    const results=allProjects.filter(p=>matchesFilter(p,filter)&&(!query||[
      p.title,p.category,p.desc,...(p.tags||[]),...(p.features||[]).map(f=>f.title),...(p.githubData?.topics||[])
    ].filter(Boolean).join(' ').toLowerCase().includes(query)));
    if(sort==='name') return [...results].sort((a,b)=>a.title.localeCompare(b.title));
    if(sort==='updated') return [...results].sort((a,b)=>new Date(b.githubData?.updated||0)-new Date(a.githubData?.updated||0));
    return [...results].sort((a,b)=>Number(!!b.featured)-Number(!!a.featured)||new Date(b.githubData?.updated||0)-new Date(a.githubData?.updated||0));
  },[allProjects,filter,search,sort]);
  // Every matching repository appears immediately. There is no twelve-card limit.
  const visibleProjects=matching;
  const total=allProjects.length;
  const syncSuccess=sync.state==='success';
  const hasRepos=sync.repos.length>0;
  const repositoryCount=sync.repos.length;
  const featuredCount=curatedProjects.length;
  return <section className="section projects project-library" id="projects" aria-labelledby="projects-title">
    <div className="project-library-heading reveal"><div><span className="eyebrow"><span className="red-line"/> 02 / THE APPS / THE PROJECT UNIVERSE</span>
      <h2 id="projects-title">A universe of <em>projects.</em></h2>
      <p className="section-sub">The cinematic project room and a complete source-code archive—{featuredCount} featured case studies and the full public repository library on <a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer">Aryan's GitHub</a>. Open a project to read about it, inspect the repository README, and access the source.</p>
    </div><div className="project-library-counter" aria-label={`${total} projects currently listed`}><strong>{String(total).padStart(2,'0')}</strong><span>PROJECTS<br/>IN THE LIBRARY</span></div></div>

    <ProjectCinema onOpen={onOpen} totalCount={total} stories={allProjects.filter(p=>p.featured).slice(0,6)}/>
    <div id="project-archive" className="pc-archive-intro"><span>02.1 / OPEN SOURCE / THE FULL ARCHIVE</span><h3>Browse every <em>repository.</em></h3><p>Search, filter and inspect the projects. Open any card to view its documentation, stack, implementation details and source.</p></div>
    <div className={'github-sync-status '+(sync.state==='error'?'github-sync-error':'')} role="status" aria-live="polite">
      <div className="github-sync-main">{sync.state==='loading' ? <RefreshCw size={16} className="github-spinning"/> : hasRepos ? <Wifi size={16}/> : <WifiOff size={16}/>}
        <span>{sync.state==='loading' ? `REFRESHING GITHUB — ${repositoryCount} SAVED REPOSITORIES AVAILABLE` : syncSuccess ? `${repositoryCount} PUBLIC REPOSITORIES LOADED FROM GITHUB` : sync.state==='snapshot' ? `${repositoryCount} SAVED GITHUB REPOSITORIES — LIVE REFRESH UNAVAILABLE` : 'GITHUB SYNC UNAVAILABLE — ONLY FEATURED PROJECTS VISIBLE'}</span>
      </div>
      <div className="github-sync-actions"><a href={GITHUB_PROFILE+'?tab=repositories'} target="_blank" rel="noopener noreferrer">ALL ON GITHUB <ArrowUpRight size={14}/></a><button type="button" onClick={()=>setRefreshToken(v=>v+1)} disabled={sync.state==='loading'} title="Refresh GitHub repository list"><RefreshCw size={14}/> REFRESH</button></div>
    </div>
    {(sync.state==='error'||sync.state==='snapshot')&&<p className="github-sync-note">{sync.error} {sync.state==='snapshot'?'Using the last saved GitHub repository snapshot.':'The full repository list is unavailable until sync succeeds.'} On your development machine, run <code>npm run sync:github</code> and restart Vite to save a local snapshot.</p>}
    {syncSuccess&&sync.warning&&<p className="github-sync-note">{sync.warning}</p>}

    <div className="project-library-tools"><div className="project-filter-tabs" role="group" aria-label="Filter projects">{filters.map(t=><button key={t} type="button" className={filter===t?'selected':''} aria-pressed={filter===t} onClick={()=>setFilter(t)}>{t}</button>)}</div>
      <label className="project-search"><Search size={16} aria-hidden="true"/><span className="sr-only">Search projects</span><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search all projects or technologies..."/>{search&&<button type="button" onClick={()=>setSearch('')} aria-label="Clear search"><X size={15}/></button>}</label>
      <label className="project-sort"><span>SORT</span><select aria-label="Sort projects" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured first</option><option value="updated">Recently updated</option><option value="name">Alphabetical</option></select></label>
    </div>
    <div className="project-results-line" role="status"><span><i/> ALL {matching.length} MATCHING PROJECTS SHOWN</span><span>{repositoryCount} GITHUB REPOS · {featuredCount} FEATURED · SELECT A CARD TO EXPLORE</span></div>
    {matching.length ? <><div className="project-library-grid">{visibleProjects.map((p,i)=><ProjectCard key={p.githubData?.fullName||p.id} project={p} number={i+1} total={total} onOpen={onOpen}/>)}</div>
      </>
      : <div className="project-empty"><Search size={27}/><h3>No matching projects</h3><p>Try another keyword or return to the full project archive.</p><button type="button" onClick={()=>{setFilter('All projects');setSearch('')}}>SHOW ALL PROJECTS <ArrowUpRight size={16}/></button></div>}
    <p className="project-library-footnote">GitHub repository titles, descriptions, languages, and source links come from the public GitHub API or a saved local snapshot. All matching repositories are shown without pagination. Detailed README documentation is retrieved when you open a project. Unpublished or private projects cannot be fetched automatically; featured entries are maintained separately.</p>
  </section>;
}
