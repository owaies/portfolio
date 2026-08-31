import Link from 'next/link'
import { ArrowDown, ArrowUpRight, Award, BriefcaseBusiness, Code2, Cpu, Download, ExternalLink, FolderKanban, GraduationCap, Mail, MessageCircle, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ContactForm from './contact-form'
import type { Certificate, Education, Experience, Language, Project, Resume, Skill } from '@/types/portfolio'
import { PROFILE_IMAGE_DATA_URL } from '@/lib/profile-image'

type SiteContent = { key: string; value: string }
type Profile = { avatar_url: string | null; full_name: string | null }
type GalleryItem = { id:string; image_url:string; caption:string|null; display_order:number; featured:boolean; published:boolean }

const fallback = {
  hero_subtitle:'Aspiring AI/ML Engineer at PESITM, building robust machine learning systems and turning data into intelligent, real-world solutions.',
  hero_cgpa:'7.52', hero_projects_count:'3+', hero_certs_count:'12+',
  about_heading:'Turning ideas into intelligent systems',
  about_text_1:'I’m Mohammed Owaies, an aspiring AI/ML Engineer focused on building practical software that connects data, algorithms and user needs.',
  about_text_2:'I enjoy machine learning, computer vision, data structures and real-world project work, while continuously sharpening my engineering fundamentals.',
  about_card_bio:'AI/ML • Computer Vision • DSA • Software Development'
}

export default async function Home(){
  const supabase=await createClient()
  const {data:content}=await supabase.from('site_content').select('key,value')
  const c={...fallback,...Object.fromEntries((content??[]).map((x: SiteContent)=>[x.key,x.value]))} as Record<string,string>
  const [{data:projects},{data:skills},{data:languages},{data:experience},{data:education},{data:certificates},{data:resume},{data:gallery}] = await Promise.all([
    supabase.from('projects').select('*').eq('published',true).order('display_order').limit(6),
    supabase.from('skills').select('*').eq('active',true).order('display_order').limit(20),
    supabase.from('languages').select('*').eq('active',true).order('display_order'),
    supabase.from('experience').select('*').eq('active',true).order('display_order'),
    supabase.from('education').select('*').eq('active',true).order('display_order'),
    supabase.from('certificates').select('*').eq('active',true).order('display_order'),
    supabase.from('resumes').select('id,label,resume_pdf,preview_image').eq('active',true).order('updated_at',{ascending:false}).limit(1).maybeSingle(),
    supabase.from('gallery').select('*').eq('published',true).order('display_order').limit(12),
  ])
  const profileResult=await supabase.from('profiles').select('avatar_url,full_name').limit(1).maybeSingle()
  const profile:Profile|null=profileResult.data
  const image=profile?.avatar_url || PROFILE_IMAGE_DATA_URL
  const projectRows:Project[]=(projects??[]) as Project[]
  const skillRows:Skill[]=(skills??[]) as Skill[]
  const languageRows:Language[]=(languages??[]) as Language[]
  const experienceRows:Experience[]=(experience??[]) as Experience[]
  const educationRows:Education[]=(education??[]) as Education[]
  const certificateRows:Certificate[]=(certificates??[]) as Certificate[]
  const galleryRows:GalleryItem[]=(gallery??[]) as GalleryItem[]
  const resumeRow:Pick<Resume,'id'|'label'|'resume_pdf'|'preview_image'>|null=resume

  return <main className="grid-bg min-h-screen">
    <div className="glow-orb left-[-220px] top-[320px]"/><div className="glow-orb purple right-[-230px] top-[950px]"/>
    <section id="home" className="container relative flex min-h-[calc(100vh-70px)] items-center py-16 lg:py-20">
      <div className="grid w-full items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <p className="mono mb-5 text-sm tracking-[.08em] text-cyan-300">› HELLO, WORLD — I&apos;M</p>
          <h1 className="text-[clamp(4rem,8vw,7rem)] font-extrabold leading-[.86] tracking-[-.045em]">MOHAMMED<br/><span className="gradient-text">OWAIES</span></h1>
          <div className="mono mt-7 flex items-center gap-3 text-base text-slate-400 sm:text-lg"><span className="text-slate-600">&lt;</span><span className="text-cyan-300">AI/ML Engineer</span><span className="text-slate-600">/&gt;</span></div>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">{c.hero_subtitle}</p>
          <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
            <a href="https://github.com/owaies" target="_blank" rel="noreferrer" className="glass inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm transition hover:border-cyan-300/30"><Code2 size={16}/>GitHub</a>
            <a href="https://www.linkedin.com/in/mohammed-owaies-507b4a398" target="_blank" rel="noreferrer" className="glass inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm transition hover:border-cyan-300/30"><BriefcaseBusiness size={16}/>LinkedIn</a>
            <a href="#contact" className="pulse-glow inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-[#031015] transition hover:bg-cyan-200"><Mail size={16}/>Hire Me</a>
            <a href="https://wa.me/917619329863" target="_blank" rel="noreferrer" className="glass inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm text-emerald-300 transition hover:border-emerald-300/30"><MessageCircle size={16}/>WhatsApp</a>
            {resumeRow?.resume_pdf&&<a href={`/api/resume/${resumeRow.id}`} target="_blank" rel="noreferrer" className="glass inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm text-cyan-200 transition hover:border-cyan-300/30"><Download size={16}/>Resume</a>}
          </div>
          <div className="mt-8 flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-400/[.05] px-4 py-2 text-sm text-emerald-300 w-fit"><span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.7)]"/>Open to work</div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-white/[.07] pt-6">
            <Stat n={c.hero_projects_count} label="Projects deployed"/><Stat n={c.hero_cgpa} label="Current CGPA"/><Stat n={c.hero_certs_count} label="Certifications"/>
          </div>
        </div>
        <div className="float flex justify-center lg:justify-end">
          <div className="hero-image-ring">
            <div className="hero-image flex h-64 w-64 items-center justify-center overflow-hidden bg-black/70 sm:h-[400px] sm:w-[400px]"><img src={image} alt="Mohammed Owaies" className="hero-image h-full w-full"/></div>
          </div>
        </div>
      </div>
      <a href="#about" className="scroll-cue absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex">SCROLL<ArrowDown size={15} className="text-cyan-300"/></a>
    </section>
    <section id="about" className="container py-24 lg:py-32"><SectionTitle eyebrow="01 / ABOUT" title={c.about_heading}/><div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]"><div className="glass rounded-3xl p-7 sm:p-9"><p className="text-lg leading-8 text-slate-300">{c.about_text_1}</p><p className="mt-5 text-lg leading-8 text-slate-400">{c.about_text_2}</p></div><div className="glass rounded-3xl p-7 sm:p-9"><Cpu className="mb-5 text-cyan-300" size={34}/><p className="mono text-sm leading-7 text-slate-400">{c.about_card_bio}</p></div></div></section>
    <section id="skills" className="container py-24 lg:py-32"><SectionTitle eyebrow="02 / SKILLS" title="Tools I build with"/><div className="grid gap-5 lg:grid-cols-2">{[skillRows.filter(s=>s.display_order%2===1),skillRows.filter(s=>s.display_order%2===0)].map((group,i)=><div key={i} className="glass rounded-3xl p-7 sm:p-9">{group.map(s=><div key={s.id} className="mb-7 last:mb-0"><div className="mb-2 flex justify-between gap-4"><span className="font-semibold text-slate-200">{s.name}</span><span className="mono text-xs text-cyan-300">{s.proficiency}%</span></div><div className="h-1 rounded-full bg-white/[.07]"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-500" style={{width:`${s.proficiency}%`}}/></div></div>)}</div>)}</div><div className="mt-14 text-center"><p className="mono text-xs text-slate-600">// tech_stack</p><div className="mt-5 flex flex-wrap justify-center gap-2">{skillRows.map(s=><span key={s.id} className="rounded-full border border-white/[.08] bg-white/[.015] px-4 py-2 text-sm text-slate-300">{s.name}</span>)}</div></div></section>
    <section id="projects" className="container py-24 lg:py-32"><SectionTitle eyebrow="03 / PROJECTS" title="What I&apos;ve built"/><div className="grid gap-5 md:grid-cols-2">{projectRows.map(p=><article key={p.id} className="glass overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/20"><div className="aspect-[16/8] overflow-hidden bg-gradient-to-br from-cyan-300/10 via-blue-400/5 to-purple-400/10">{p.thumbnail?<img src={p.thumbnail} alt={p.title} className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"/>:<div className="flex h-full items-end p-7"><Code2 className="text-cyan-300" size={42}/></div>}</div><div className="p-6 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="mono text-[10px] uppercase tracking-widest text-cyan-300">{p.category||'Project'}</p><h3 className="mt-2 text-xl font-bold">{p.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{p.short_description}</p></div><ArrowUpRight className="shrink-0 text-slate-600"/></div><div className="mt-5 flex flex-wrap gap-2">{(p.technologies??[]).map(t=><span key={t} className="rounded-full border border-white/[.08] px-2.5 py-1 text-xs text-slate-400">{t}</span>)}</div><div className="mt-6 flex flex-wrap gap-3"><Link href={`/projects/${p.slug}`} className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-[#031015]">Details</Link>{p.github_url&&<a href={p.github_url} target="_blank" rel="noreferrer" className="glass rounded-full px-4 py-2 text-sm">GitHub ↗</a>}{p.live_demo_url&&<a href={p.live_demo_url} target="_blank" rel="noreferrer" className="glass rounded-full px-4 py-2 text-sm">Live Demo ↗</a>}</div></div></article>)}</div></section>
    <section id="certificates" className="container py-24 lg:py-32"><SectionTitle eyebrow="04 / CREDENTIALS" title="Verified Credentials"/><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{certificateRows.map(x=><article key={x.id} className="glass overflow-hidden rounded-3xl"><div className="aspect-[16/9] overflow-hidden bg-white/[.03]">{x.thumbnail?<img src={x.thumbnail} alt={x.title} className="h-full w-full object-cover"/>:<div className="flex h-full items-center justify-center"><Award size={42} className="text-cyan-300/70"/></div>}</div><div className="p-5"><h3 className="font-bold leading-6">{x.title}</h3><p className="mt-2 text-sm text-slate-500">{x.issuing_organization}</p>{x.issue_date&&<p className="mono mt-2 text-[10px] text-cyan-300">{x.issue_date}</p>}{x.credential_url&&<a href={x.credential_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs text-cyan-300">View credential <ExternalLink size={13}/></a>}</div></article>)}</div></section>
    <section id="education" className="container py-24 lg:py-32"><SectionTitle eyebrow="05 / EDUCATION" title="Learning timeline"/><div className="grid gap-4 lg:grid-cols-3">{educationRows.map(e=><div key={e.id} className="glass rounded-2xl p-6"><div className="flex gap-4"><GraduationCap className="mt-1 shrink-0 text-cyan-300" size={20}/><div><p className="mono text-[10px] text-cyan-300">{e.period}</p><h3 className="mt-2 font-bold">{e.degree}</h3><p className="mt-1 text-sm text-slate-400">{e.institution}</p><p className="mt-3 text-xs leading-6 text-slate-500">{e.details}</p></div></div></div>)}</div></section>
    <section id="experience" className="container py-24 lg:py-32"><SectionTitle eyebrow="06 / EXPERIENCE" title="Experience"/>{experienceRows.length?<div className="space-y-4">{experienceRows.map(e=><div key={e.id} className="glass rounded-2xl p-6"><p className="mono text-xs text-cyan-300">{e.period}</p><h3 className="mt-2 text-xl font-bold">{e.role}</h3><p className="text-slate-400">{e.company}{e.location?` • ${e.location}`:''}</p><p className="mt-3 leading-7 text-slate-400">{e.description}</p>{e.technologies && e.technologies.length>0&&<div className="mt-4 flex flex-wrap gap-2">{e.technologies.map(t=><span key={t} className="rounded-full border border-white/[.08] px-2.5 py-1 text-xs text-slate-400">{t}</span>)}</div>}</div>)}</div>:<div className="glass rounded-2xl p-7 text-slate-500">No experience entries yet.</div>}</section>
    <section id="languages" className="container py-24 lg:py-32"><SectionTitle eyebrow="07 / LANGUAGES" title="Languages"/><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{languageRows.map(l=><div key={l.id} className="glass rounded-2xl p-6"><h3 className="font-bold">{l.name}</h3><p className="mono mt-2 text-xs text-cyan-300">{l.proficiency_level}</p></div>)}</div></section>
    <section id="gallery" className="container py-24 lg:py-32"><SectionTitle eyebrow="08 / GALLERY" title="Selected moments"/><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{galleryRows.map(g=><figure key={g.id} className="glass overflow-hidden rounded-3xl">{g.image_url&&<img src={g.image_url} alt={g.caption||'Gallery image'} className="aspect-[4/3] h-full w-full object-cover"/>}{g.caption&&<figcaption className="p-4 text-sm text-slate-400">{g.caption}</figcaption>}</figure>)}</div></section>
    <section id="resume" className="container py-24 lg:py-32"><SectionTitle eyebrow="09 / RESUME" title="My Resume"/><div className="glass overflow-hidden rounded-3xl p-6 sm:p-8">{resumeRow?.preview_image&&<img src={resumeRow.preview_image} alt="Resume preview" className="mb-6 w-full rounded-2xl border border-white/[.07]"/>}<div className="max-w-2xl"><p className="mono text-sm text-cyan-300">DOCUMENT / Resume</p><h3 className="mt-4 text-2xl font-bold sm:text-4xl">A concise view of my work</h3><p className="mt-4 text-base leading-7 text-slate-400">The active resume is managed through the portfolio control room and served securely from the private Supabase storage bucket.</p><div className="mt-7 flex flex-wrap gap-3">{resumeRow?.resume_pdf&&<a href={`/api/resume/${resumeRow.id}`} target="_blank" rel="noreferrer" className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-[#031015] inline-flex items-center gap-2"><ExternalLink size={16}/>View Resume</a>}{resumeRow?.resume_pdf&&<a href={`/api/resume/${resumeRow.id}?download=1`} className="glass rounded-full px-5 py-3 text-sm inline-flex items-center gap-2"><Download size={16}/>Download</a>}</div></div></div></section>
    <section id="contact" className="container py-24 lg:py-32"><SectionTitle eyebrow="10 / CONTACT" title="Let&apos;s build something useful."/><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><div><p className="max-w-lg text-lg leading-8 text-slate-400">Have a project, collaboration, internship, or role in mind? Send a message and let&apos;s talk.</p><div className="mt-7 flex flex-wrap gap-3"><a href="mailto:owaies786@gmail.com" className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm"><Mail size={16}/>Email</a><a href="https://wa.me/917619329863" target="_blank" rel="noreferrer" className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm text-emerald-300"><MessageCircle size={16}/>WhatsApp</a></div></div><ContactForm/></div></section>
  </main>
}

function SectionTitle({eyebrow,title}:{eyebrow:string,title:string}){return <div className="mb-12"><p className="mono text-sm text-cyan-300">{eyebrow}</p><h2 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-6xl">{title}</h2></div>}
function Stat({n,label}:{n:string,label:string}){return <div><div className="text-2xl font-bold text-white sm:text-3xl">{n}</div><div className="mt-1 text-[10px] uppercase tracking-widest text-slate-600">{label}</div></div>}
