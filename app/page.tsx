import React from "react"
import Image from "next/image"
import { ArrowDown, ArrowUpRight, Award, BriefcaseBusiness, Code2, Download, ExternalLink, GraduationCap, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import ContactForm from "./contact-form"
import AnimatedRole from "./animated-role"
import type { Certificate, Education, Language, Project, Resume, Skill } from "@/types/portfolio"
import { PROFILE_IMAGE_DATA_URL } from "@/lib/profile-image"

type ContentRow = { key: string; value: string }
type Profile = { avatar_url: string | null }

const fallback: Record<string, string> = {
  hero_subtitle: "Aspiring AIML Engineer at PESITM, building robust machine learning systems and turning data into intelligent, real-world solutions.",
  hero_cgpa: "7.52", hero_projects_count: "3+", hero_certs_count: "5+",
  about_heading: "Turning ideas into intelligent systems",
  about_text_1: "I'm Mohammed Owaies — an aspiring AI/ML Engineer with a deep curiosity for how machines learn and perceive the world. I've deployed real-world projects in object detection and gesture recognition, blending algorithms with clean code.",
  about_text_2: "When I'm not training models, I'm sharpening my fundamentals in data structures, building management systems, or picking up new certifications to stay ahead of the curve in this rapidly evolving field.",
  about_role: "AI/ML Engineer", about_company: "PESITM · Shimoga",
  about_bio: "A driven 4-year B.E. student specializing in Artificial Intelligence & Machine Learning. Passionate about building intelligent systems that solve real-world problems — from computer vision to full-stack ML pipelines.",
  about_location: "Tank Mohalla 4th Cross, Shimoga", about_dob: "28 April 2005", about_degree: "B.E. in AIML, 2023–2027", about_status: "Open to Internships",
  contact_email: "owaies786@gmail.com", contact_phone: "7619329863", contact_location: "Tank Mohalla 4th Cross, Shimoga",
  github_url: "https://github.com/owaies", linkedin_url: "https://www.linkedin.com/in/mohammed-owaies-507b4a398", whatsapp_number: "917619329863",
}

export default async function Home() {
  const supabase = await createClient()
  const { data: content } = await supabase.from("site_content").select("key,value")
  const c = { ...fallback, ...Object.fromEntries((content ?? []).map((row: ContentRow) => [row.key, row.value])) }
  const [projectResult, skillResult, languageResult, educationResult, certificateResult, resumeResult, profileResult] = await Promise.all([
    supabase.from("projects").select("*").eq("published", true).order("display_order").limit(6),
    supabase.from("skills").select("*").eq("active", true).order("display_order").limit(20),
    supabase.from("languages").select("*").eq("active", true).order("display_order"),
    supabase.from("education").select("*").eq("active", true).order("display_order"),
    supabase.from("certificates").select("*").eq("active", true).order("display_order"),
    supabase.from("resumes").select("id,label,resume_pdf,preview_image").eq("active", true).order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("profiles").select("avatar_url").limit(1).maybeSingle(),
  ])
  const projects = (projectResult.data ?? []) as Project[]
  const skills = (skillResult.data ?? []) as Skill[]
  const languages = (languageResult.data ?? []) as Language[]
  const education = (educationResult.data ?? []) as Education[]
  const certificates = (certificateResult.data ?? []) as Certificate[]
  const resume = resumeResult.data as Pick<Resume, "id" | "label" | "resume_pdf" | "preview_image"> | null
  const image = (profileResult.data as Profile | null)?.avatar_url || PROFILE_IMAGE_DATA_URL
  const languageSkills = skills.filter((skill) => skill.category === "Languages")
  const dataSkills = skills.filter((skill) => skill.category !== "Languages")
  const techStack = ["Python", "OpenCV", "Java", "MongoDB", "PHP", "HTML", "CSS", "Git", "DSA", "Scikit-learn", "NumPy", "Matplotlib", "Pandas"]

  return <main className="target-site">
    <div className="target-orb target-orb-cyan" /><div className="target-orb target-orb-purple" />
    <section id="home" className="target-hero"><div className="target-grid" /><div className="target-hero-inner">
      <div className="target-portrait-wrap"><div className="target-portrait-ring target-ring-a" /><div className="target-portrait-ring target-ring-b" /><div className="target-portrait"><Image src={image} alt="Portrait of Mohammed Owaies" fill sizes="420px" className="object-cover" unoptimized priority /></div><div className="target-open"><span /> Open to work</div></div>
      <div className="target-hero-copy"><p className="target-eyebrow">› HELLO, WORLD — I&apos;M</p><h1>MOHAMMED<br /><span>OWAIES</span></h1><AnimatedRole /><p className="target-hero-description">{c.hero_subtitle}</p>
        <div className="target-actions"><a href={c.github_url} target="_blank" rel="noreferrer"><Code2 size={12} /> GitHub</a><a href={c.linkedin_url} target="_blank" rel="noreferrer"><BriefcaseBusiness size={12} /> LinkedIn</a><a className="target-hire" href="#contact"><Mail size={12} /> Hire Me</a><a href={`https://wa.me/${c.whatsapp_number}`} target="_blank" rel="noreferrer" className="target-green"><MessageCircle size={12} /> WhatsApp</a>{resume?.resume_pdf && <a href={`/api/resume/${resume.id}`} target="_blank" rel="noreferrer"><Download size={12} /> Resume</a>}</div>
        <div className="target-stats"><Stat value={c.hero_projects_count} label="PROJECTS DEPLOYED" /><Stat value={c.hero_cgpa} label="CURRENT CGPA" /><Stat value={c.hero_certs_count} label="CERTIFICATIONS" /></div>
      </div><a className="target-scroll" href="#about-copy">SCROLL <ArrowDown size={12} /></a>
    </div></section>

    <section id="about" className="target-section target-about-card-section"><div className="target-about-card"><div className="target-about-icon"><Code2 size={15} /></div><div className="target-about-main"><div className="target-about-top"><strong>{c.about_role}</strong><span>{c.about_company}</span></div><p>{c.about_bio}</p><div className="target-facts"><Fact label="LOCATION" value={c.about_location} /><Fact label="DATE OF BIRTH" value={c.about_dob} /><Fact label="DEGREE" value={c.about_degree} /><Fact label="STATUS" value={c.about_status} /></div></div><div className="target-cgpa"><small>current_cgpa</small><b>{c.hero_cgpa}</b></div></div></section>

    <Section id="about-copy" eyebrow="// 01 — About" title={c.about_heading}><div className="target-about-copy"><p>{c.about_text_1}</p><p>{c.about_text_2}</p><div className="target-traits">{["Problem Solver", "Fast Learner", "Team Player", "Detail Oriented", "Curious Mind"].map((trait) => <span key={trait}>{trait}</span>)}</div></div></Section>
    <Section id="skills" eyebrow="// 02 — Skills" title="Technical Arsenal" subtitle="A curated stack built through hands-on projects, certifications, and relentless practice."><div className="target-skill-groups"><SkillPanel title="Languages" items={languageSkills.length ? languageSkills : skills.slice(0, 5)} accent="cyan" /><SkillPanel title="Databases & Tools" items={dataSkills.length ? dataSkills.slice(0, 5) : skills.slice(5, 10)} accent="purple" /></div><div className="target-tech-stack"><span>// tech_stack</span><div>{techStack.map((tech) => <b key={tech}>{tech}</b>)}</div></div></Section>
    <Section id="projects" eyebrow="// 03 — Projects" title="What I’ve Built" extra={<a className="target-view-all" href={c.github_url} target="_blank" rel="noreferrer">⌘ View all on GitHub ↗</a>}><div className="target-project-grid">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div></Section>
    <Section id="education" eyebrow="// 04 — Education" title="Academic Journey"><div className="target-timeline">{education.map((item, index) => <EducationCard key={item.id} item={item} index={index} cgpa={c.hero_cgpa} />)}</div></Section>
    <Section id="certificates" eyebrow="// 05 — Certificates" title="Verified Credentials"><div className="target-certificate-grid">{certificates.map((certificate, index) => <CertificateCard key={certificate.id} certificate={certificate} index={index} />)}</div></Section>
    <Section id="languages" eyebrow="// 07 — Languages" title="Communication Fluency"><div className="target-language-grid">{languages.map((language, index) => <LanguageCard key={language.id} language={language} index={index} />)}</div></Section>
    <Section id="resume" eyebrow="// 06 — Resume" title="My Resume">{resume?.resume_pdf ? <div className="target-resume-card"><div className="target-resume-preview">{resume.preview_image ? <Image src={resume.preview_image} alt="Resume preview" fill sizes="150px" className="object-contain" unoptimized /> : <Download size={30} />}</div><h3>Resume</h3><p>Download my full resume to learn more about my education, projects, skills, and certifications.</p><div className="target-resume-actions"><a className="target-hire" href={`/api/resume/${resume.id}`} target="_blank" rel="noreferrer"><Download size={12} /> Download Resume</a><a href={`/api/resume/${resume.id}`} target="_blank" rel="noreferrer"><ExternalLink size={12} /> View PDF</a></div></div> : <div className="target-empty">Resume is not published yet.</div>}</Section>
    <Section id="contact" eyebrow="// 08 — Contact" title="Let’s Build Something Together"><div className="target-contact-grid"><div className="target-contact-list"><ContactCard icon={<Mail size={15} />} label="Email" value={c.contact_email} href={`mailto:${c.contact_email}`} /><ContactCard icon={<Phone size={15} />} label="Phone" value={`+91 ${c.contact_phone}`} href={`tel:+91${c.contact_phone}`} /><ContactCard icon={<MessageCircle size={15} />} label="WhatsApp" value={`WhatsApp · ${c.contact_phone}`} href={`https://wa.me/${c.whatsapp_number}`} /><ContactCard icon={<MapPin size={15} />} label="Location" value={c.contact_location} /><ContactCard icon={<Code2 size={15} />} label="GitHub" value="github.com/owaies" href={c.github_url} /><ContactCard icon={<BriefcaseBusiness size={15} />} label="LinkedIn" value={c.linkedin_url.replace("https://", "www.")} href={c.linkedin_url} /></div><ContactForm /></div></Section>
    <footer className="target-footer"><div>MO<span>.</span> <small>AI/ML ENGINEER</small></div><p>© Mohammed Owaies · Built with precision.</p></footer>
  </main>
}

function Section({ id, eyebrow, title, subtitle, extra, children }: { id: string; eyebrow: string; title: string; subtitle?: string; extra?: React.ReactNode; children: React.ReactNode }) { const words = title.split(" "); return <section id={id} className="target-section"><div className="target-section-heading"><p className="target-eyebrow">{eyebrow}</p><h2>{words.map((word, index) => index === words.length - 1 ? <span key={`${word}-${index}`}>{word} </span> : <React.Fragment key={`${word}-${index}`}>{word} </React.Fragment>)}</h2>{subtitle && <p className="target-section-subtitle">{subtitle}</p>}{extra}</div>{children}</section> }
function Stat({ value, label }: { value: string; label: string }) { return <div><b>{value}</b><span>{label}</span></div> }
function Fact({ label, value }: { label: string; value: string }) { return <div><small>{label}</small><b>{value}</b></div> }
function SkillPanel({ title, items, accent }: { title: string; items: Skill[]; accent: "cyan" | "purple" }) { return <div className={`target-skill-panel ${accent}`}><h3><i />{title}</h3>{items.map((skill) => <div className="target-skill" key={skill.id}><div><span>{skill.name}</span><b>{skill.proficiency}%</b></div><div className="target-progress"><i style={{ width: `${Math.min(100, Math.max(0, skill.proficiency))}%` }} /></div></div>)}</div> }
function ProjectCard({ project, index }: { project: Project; index: number }) { return <article className={`target-project-card tone-${index % 5}`}><div className="target-project-head"><span className="target-project-icon"><Code2 size={14} /></span><div><small>● {project.deployment_type === "deployed" ? "DEPLOYED" : "LOCAL"}</small><em>{project.tag || "Project"}</em></div></div><h3>{project.title}</h3><p>{project.detailed_description || project.short_description || "A practical software project built to solve a real-world problem."}</p><div className="target-project-tags">{(project.technologies ?? []).slice(0, 5).map((tech) => <span key={tech}>{tech}</span>)}</div><div className="target-project-links">{project.live_demo_url && <a href={project.live_demo_url} target="_blank" rel="noreferrer"><ExternalLink size={11} /> Live Demo</a>}{project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer"><Code2 size={11} /> Code</a>}<span>{project.live_demo_url ? "Open live ↗" : "View source ↗"}</span></div></article> }
function EducationCard({ item, index, cgpa }: { item: Education; index: number; cgpa: string }) { return <article className={`target-education-card tone-${index % 3}`}><div className="target-education-icon"><GraduationCap size={14} /></div><div><div className="target-education-meta"><span>{item.period}</span><i>{item.status || "In Progress"}</i></div><h3>{item.degree}</h3><p>{item.institution}</p><strong>{item.details}</strong>{index === 0 && <b>Current CGPA: {cgpa}</b>}</div></article> }
function CertificateCard({ certificate, index }: { certificate: Certificate; index: number }) { return <article className={`target-certificate-card tone-${index % 5}`}><div className="target-certificate-image">{certificate.thumbnail ? <Image src={certificate.thumbnail} alt={certificate.title} fill sizes="(max-width:700px) 50vw, 330px" className="object-cover" unoptimized /> : <Award size={28} />}</div><div className="target-certificate-meta"><Award size={12} /><span>{certificate.issue_date || "2024"}</span></div><h3>{certificate.title}</h3><p>{certificate.issuing_organization}</p><div>{certificate.credential_url && <a href={certificate.credential_url} target="_blank" rel="noreferrer"><ExternalLink size={10} /> View PDF</a>}{certificate.certificate_pdf && <a href={certificate.certificate_pdf} target="_blank" rel="noreferrer"><Download size={10} /> Download</a>}</div></article> }
function LanguageCard({ language, index }: { language: Language; index: number }) { const color = language.accent_color || ["#20dfff", "#a855f7", "#ff5f70", "#f5b942"][index % 4]; return <article className="target-language-card" style={{ "--language-accent": color } as React.CSSProperties}><div><b>{language.name}</b><span>{language.proficiency_level}</span></div><i><em style={{ width: `${language.percentage ?? 70}%` }} /></i></article> }
function ContactCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) { const content = <><span className="target-contact-icon">{icon}</span><div><small>{label}</small><b>{value}</b></div><ArrowUpRight size={13} /></>; return href ? <a className="target-contact-card" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{content}</a> : <div className="target-contact-card">{content}</div> }
