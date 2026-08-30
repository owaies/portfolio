import Link from 'next/link'
import { Github, Linkedin, Mail, MessageCircle, ArrowUpRight, Cpu, Database, Eye, Code2, GraduationCap } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

const fallback = {
  hero_subtitle: 'Aspiring AI/ML Engineer at PESITM, building robust machine learning systems and turning data into intelligent, real-world solutions.',
  hero_cgpa: '7.52', hero_projects_count: '3+', hero_certs_count: '5+',
  about_heading: 'Turning ideas into intelligent systems',
  about_text_1: 'I’m Mohammed Owaies, an aspiring AI/ML Engineer focused on building practical software that connects data, algorithms and user needs.',
  about_text_2: 'I enjoy machine learning, computer vision, data structures and real-world project work, while continuously sharpening my engineering fundamentals.',
  about_card_bio: 'AI/ML • Computer Vision • DSA • Software Development',
}

async function getContent() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('site_content').select('key,value').in('key', Object.keys(fallback))
    return Object.fromEntries((data ?? []).map(x => [x.key, x.value])) as Record<string,string>
  } catch { return fallback }
}

export default async function Home() {
  const c = { ...fallback, ...(await getContent()) }
  const supabase = await createClient()
  const [{ data: projects }, { data: skills }, { data: education }] = await Promise.all([
    supabase.from('projects').select('*').eq('published', true).order('display_order').limit(6),
    supabase.from('skills').select('*').eq('active', true).order('display_order').limit(10),
    supabase.from('education').select('*').eq('active', true).order('display_order'),
  ])

  return <main className="grid-bg min-h-screen">
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="#home" className="mono font-bold tracking-widest">MO<span className="text-cyan-300">.</span></Link>
        <nav className="hidden gap-6 text-sm text-slate-300 md:flex">{['about','skills','projects','education','resume','contact'].map(x => <a key={x} href={`#${x}`} className="hover:text-white">{x[0].toUpperCase()+x.slice(1)}</a>)}</nav>
        <div className="flex gap-2"><a className="glass rounded-full px-3 py-2 text-sm" href="https://wa.me/917619329863" target="_blank">WhatsApp</a><a className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-black" href="#contact">Get in Touch</a></div>
      </div>
    </header>

    <section id="home" className="container flex min-h-[88vh] items-center py-20">
      <div className="grid w-full items-center gap-12 lg:grid-cols-[1.45fr_.8fr]">
        <div>
          <p className="mono mb-4 text-sm text-cyan-300">HELLO, WORLD — I&apos;M</p>
          <h1 className="text-6xl font-extrabold leading-[.9] tracking-tight sm:text-8xl">MOHAMMED<br/><span className="gradient-text">OWAIES</span></h1>
          <div className="glass mt-8 max-w-2xl rounded-2xl p-5"><p className="mono text-sm leading-7 text-slate-300">&gt; {c.hero_subtitle}</p></div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="https://github.com/owaies" target="_blank" className="glass rounded-full px-5 py-3">GitHub ↗</a>
            <a href="https://www.linkedin.com/in/mohammed-owaies-507b4a398" target="_blank" className="glass rounded-full px-5 py-3">LinkedIn ↗</a>
            <a href="#contact" className="rounded-full bg-white px-5 py-3 font-semibold text-black">Hire Me</a>
            <a href="https://wa.me/917619329863" target="_blank" className="glass rounded-full px-5 py-3">WhatsApp</a>
          </div>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-sm text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-300"/> Open to work</div>
        </div>
        <div className="float justify-self-center"><div className="rounded-full border border-cyan-300/20 bg-gradient-to-br from-cyan-300/20 via-blue-400/10 to-purple-400/20 p-2 shadow-[0_0_100px_rgba(71,233,255,.15)]"><div className="flex h-64 w-64 items-center justify-center rounded-full bg-black/60 sm:h-80 sm:w-80"><span className="text-center text-slate-400">Profile photo<br/><small className="mono">Upload via CMS</small></span></div></div></div>
      </div>
    </section>

    <section className="container grid gap-4 pb-16 sm:grid-cols-3"><Stat n={c.hero_projects_count} label="Projects Deployed"/><Stat n={c.hero_cgpa} label="Current CGPA"/><Stat n={c.hero_certs_count} label="Certifications"/></section>

    <section id="about" className="container py-24"><SectionTitle eyebrow="01 / ABOUT" title={c.about_heading}/><div className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]"><div className="glass rounded-3xl p-7"><p className="text-lg leading-8 text-slate-300">{c.about_text_1}</p><p className="mt-5 text-lg leading-8 text-slate-300">{c.about_text_2}</p></div><div className="glass rounded-3xl p-7"><div className="mb-5 text-cyan-300"><Cpu size={34}/></div><p className="mono text-sm leading-7 text-slate-300">{c.about_card_bio}</p></div></div></section>

    <section id="skills" className="container py-24"><SectionTitle eyebrow="02 / SKILLS" title="Tools I build with"/><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(skills ?? []).map((s:any) => <div key={s.id} className="glass rounded-2xl p-5"><div className="flex items-center justify-between"><span className="font-semibold">{s.name}</span><span className="mono text-xs text-cyan-300">{s.proficiency}%</span></div><div className="mt-4 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-purple-400" style={{width:`${s.proficiency}%`}}/></div><p className="mt-3 text-xs text-slate-500">{s.category}</p></div>)}</div></section>

    <section id="projects" className="container py-24"><SectionTitle eyebrow="03 / PROJECTS" title="Selected work"/><div className="grid gap-5 md:grid-cols-2">{(projects ?? []).map((p:any) => <article key={p.id} className="glass overflow-hidden rounded-3xl"><div className="aspect-[16/9] bg-gradient-to-br from-cyan-300/10 via-blue-400/5 to-purple-400/10 p-6"><div className="flex h-full items-end"><Code2 className="text-cyan-300" size={40}/></div></div><div className="p-6"><div className="flex items-start justify-between gap-4"><div><h3 className="text-xl font-bold">{p.title}</h3><p className="mt-2 text-slate-400">{p.short_description}</p></div><ArrowUpRight className="text-slate-500"/></div><div className="mt-4 flex flex-wrap gap-2">{(p.technologies ?? []).map((t:string)=><span key={t} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-300">{t}</span>)}</div></div></article>)}</div></section>

    <section id="education" className="container py-24"><SectionTitle eyebrow="04 / EDUCATION" title="Learning timeline"/><div className="space-y-4">{(education ?? []).map((e:any)=><div key={e.id} className="glass rounded-2xl p-6"><div className="flex gap-4"><GraduationCap className="mt-1 text-cyan-300"/><div><p className="mono text-xs text-cyan-300">{e.period}</p><h3 className="mt-1 text-xl font-bold">{e.degree}</h3><p className="text-slate-400">{e.institution}</p><p className="mt-3 text-sm leading-6 text-slate-400">{e.details}</p></div></div></div>)}</div></section>

    <section id="experience" className="container py-24"><SectionTitle eyebrow="05 / EXPERIENCE" title="Open to opportunities"/><div className="glass rounded-3xl p-8 text-slate-300">No professional employment history is listed yet. This section stays honest until a real role is added through the admin CMS.</div></section>

    <section id="resume" className="container py-24"><SectionTitle eyebrow="06 / RESUME" title="My Resume"/><div className="glass rounded-3xl p-8"><p className="text-slate-400">The active resume is managed from the admin dashboard and stored securely in Supabase Storage.</p><a href="#contact" className="mt-5 inline-flex rounded-full bg-white px-5 py-3 font-semibold text-black">Request / View Resume</a></div></section>

    <section id="contact" className="container py-24"><SectionTitle eyebrow="07 / CONTACT" title="Let&apos;s build something useful"/><div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><div className="glass rounded-3xl p-7 space-y-4 text-slate-300"><a href="mailto:owaies786@gmail.com" className="flex gap-3"><Mail/>owaies786@gmail.com</a><a href="https://wa.me/917619329863" target="_blank" className="flex gap-3"><MessageCircle/>7619329863</a><a href="https://github.com/owaies" target="_blank" className="flex gap-3"><Github/>github.com/owaies</a><a href="https://www.linkedin.com/in/mohammed-owaies-507b4a398" target="_blank" className="flex gap-3"><Linkedin/>LinkedIn</a><div className="pt-3 text-sm leading-6 text-slate-500">Tank Mohalla 4th Cross<br/>Shivamogga, Karnataka, India 577201</div></div><ContactForm/></div></section>

    <footer className="border-t border-white/10 py-8"><div className="container flex flex-col justify-between gap-3 text-sm text-slate-500 sm:flex-row"><span>© {new Date().getFullYear()} Mohammed Owaies</span><span className="mono">AI/ML ENGINEER</span></div></footer>
  </main>
}

function Stat({n,label}:{n:string,label:string}){return <div className="glass rounded-2xl p-5"><div className="text-3xl font-bold gradient-text">{n}</div><div className="mt-1 text-sm text-slate-400">{label}</div></div>}
function SectionTitle({eyebrow,title}:{eyebrow:string,title:string}){return <div className="mb-10"><p className="mono text-xs text-cyan-300">{eyebrow}</p><h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{title}</h2></div>}
function ContactForm(){return <form action="/api/contact" method="post" className="glass rounded-3xl p-7"><div className="grid gap-4 sm:grid-cols-2"><Field name="name" label="Name"/><Field name="email" label="Email" type="email"/></div><Field name="subject" label="Subject"/><label className="mt-4 block text-sm text-slate-400">Message<textarea name="message" required rows={6} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-4 outline-none focus:border-cyan-300/50"/></label><input name="website" tabIndex={-1} autoComplete="off" className="hidden"/><button className="mt-5 rounded-full bg-white px-6 py-3 font-semibold text-black">Send Message</button></form>}
function Field({name,label,type='text'}:{name:string,label:string,type?:string}){return <label className="mt-4 block text-sm text-slate-400">{label}<input name={name} type={type} required className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-4 outline-none focus:border-cyan-300/50"/></label>}
