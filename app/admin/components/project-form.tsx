'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { X, Save } from 'lucide-react'
import type { Project } from '@/types/portfolio'

type ProjectDraft = Partial<Project> & { id?: string }
type ProjectField = 'title' | 'description' | 'tag' | 'deployment_type' | 'github_url' | 'live_demo_url' | 'tag_color' | 'icon' | 'accent_color' | 'technologies' | 'display_order'
type Props = { editing: ProjectDraft; onClose: () => void; onSubmit: (formData: FormData) => Promise<void>; busy: boolean }

const ICONS: NonNullable<Project['icon']>[] = ['Eye', 'Layers', 'Monitor', 'HelpCircle', 'Scissors', 'Code', 'Cpu', 'Boxes', 'Database']
const DEPLOYMENT_TYPES: NonNullable<Project['deployment_type']>[] = ['deployed', 'local']
const TAG_COLORS: NonNullable<Project['tag_color']>[] = ['green', 'blue', 'yellow']
const isHexColor = (value: string) => /^#[0-9A-Fa-f]{6}$/.test(value)
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export default function ProjectForm({ editing, onClose, onSubmit, busy }: Props) {
  const [title, setTitle] = useState(String(editing.title ?? ''))
  const [description, setDescription] = useState(String(editing.detailed_description ?? editing.short_description ?? ''))
  const [tag, setTag] = useState(String(editing.tag ?? 'Project'))
  const [deploymentType, setDeploymentType] = useState<NonNullable<Project['deployment_type']> | ''>(editing.deployment_type ?? 'local')
  const [githubUrl, setGithubUrl] = useState(String(editing.github_url ?? ''))
  const [liveDemoUrl, setLiveDemoUrl] = useState(String(editing.live_demo_url ?? ''))
  const [tagColor, setTagColor] = useState<Project['tag_color']>(editing.tag_color ?? null)
  const [icon, setIcon] = useState<Project['icon']>(editing.icon ?? null)
  const [accentColor, setAccentColor] = useState(editing.accent_color ?? '#00d4ff')
  const [technologies, setTechnologies] = useState(Array.isArray(editing.technologies) ? editing.technologies.join(', ') : '')
  const [displayOrder, setDisplayOrder] = useState(String(editing.display_order ?? 0))
  const [errors, setErrors] = useState<Partial<Record<ProjectField, string>>>({})
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape' && !busy) onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [busy, onClose])

  const validate = () => {
    const next: Partial<Record<ProjectField, string>> = {}
    if (!title.trim()) next.title = 'Title is required.'
    if (!description.trim()) next.description = 'Description is required.'
    if (githubUrl.trim()) {
      try { const url = new URL(githubUrl.trim()); if (!['http:', 'https:'].includes(url.protocol)) throw new Error() }
      catch { next.github_url = 'Enter a valid HTTP or HTTPS URL.' }
    }
    if (deploymentType === 'deployed') {
      if (!liveDemoUrl.trim()) next.live_demo_url = 'Live / Deployed URL is required for deployed projects.'
      else {
        try { const url = new URL(liveDemoUrl.trim()); if (!['http:', 'https:'].includes(url.protocol)) throw new Error() }
        catch { next.live_demo_url = 'Enter a valid HTTP or HTTPS URL.' }
      }
    }
    if (!DEPLOYMENT_TYPES.includes(deploymentType as NonNullable<Project['deployment_type'])) next.deployment_type = 'Select deployed or local.'
    if (tagColor !== null && !TAG_COLORS.includes(tagColor)) next.tag_color = 'Select green, blue, or yellow.'
    if (icon !== null && !ICONS.includes(icon)) next.icon = 'Select one of the supported icons.'
    if (!isHexColor(accentColor)) next.accent_color = 'Use a 6-digit hexadecimal color such as #00d4ff.'
    const order = Number(displayOrder)
    if (!Number.isInteger(order) || order < 0) next.display_order = 'Display Order must be an integer greater than or equal to 0.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSubmitError(''); if (!validate()) return
    const formData = new FormData(); formData.set('table', 'projects')
    if (editing.id) formData.set('id', editing.id)
    formData.set('title', title.trim()); formData.set('slug', editing.slug ?? slugify(title)); formData.set('detailed_description', description.trim())
    formData.set('tag', tag.trim() || 'Project'); formData.set('deployment_type', deploymentType); formData.set('github_url', githubUrl.trim())
    formData.set('live_demo_url', deploymentType === 'deployed' ? liveDemoUrl.trim() : ''); formData.set('tag_color', tagColor ?? ''); formData.set('icon', icon ?? '')
    formData.set('accent_color', accentColor.toLowerCase()); formData.set('technologies', technologies); formData.set('display_order', displayOrder)
    try { await onSubmit(formData) } catch (error) { setSubmitError(error instanceof Error ? error.message : 'Unable to save project.') }
  }

  const fieldError = (field: ProjectField) => errors[field]
  const fieldClass = 'w-full rounded-[18px] border border-white/10 bg-black/30 px-6 py-4 text-[17px] text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/45 focus:ring-2 focus:ring-cyan-300/5'
  const labelClass = 'flex flex-col gap-3 text-[16px] text-slate-400'

  return <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-3 backdrop-blur-md" role="presentation">
    <div className="flex max-h-[92vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[30px] border border-blue-400/20 bg-[#020617] shadow-[0_30px_100px_rgba(0,0,0,.65),0_0_50px_rgba(71,233,255,.06)]" role="dialog" aria-modal="true" aria-labelledby="project-editor-title">
      <div className="flex shrink-0 items-center justify-between border-b border-white/[.07] bg-[#020617] px-6 py-5 sm:px-8">
        <h3 id="project-editor-title" className="text-[28px] font-bold text-white sm:text-[32px]">{editing.id ? 'Edit Project' : 'Add New Projects'}</h3>
        <button type="button" onClick={onClose} disabled={busy} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 text-slate-400 transition hover:text-white" aria-label="Close project editor"><X size={27}/></button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="min-h-0 overflow-y-auto overscroll-contain px-6 py-6 sm:px-8">
        <div className="space-y-7">
          <label className={labelClass}><span>Title</span><input className={fieldClass} name="title" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required autoFocus/>{fieldError('title')&&<small className="text-red-300">{fieldError('title')}</small>}</label>
          <label className={labelClass}><span>Description</span><textarea className={`${fieldClass} min-h-[145px] resize-y`} name="detailed_description" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" required rows={5}/>{fieldError('description')&&<small className="text-red-300">{fieldError('description')}</small>}</label>
          <label className={labelClass}><span>Tag</span><input className={fieldClass} name="tag" value={tag} onChange={e=>setTag(e.target.value)} placeholder="Project"/></label>
          <label className={labelClass}><span className="font-mono">Deployment Type</span><select className={fieldClass} name="deployment_type" value={deploymentType} onChange={e=>setDeploymentType(e.target.value as NonNullable<Project['deployment_type']> | '')}><option value="">Select...</option><option value="deployed">deployed</option><option value="local">local</option></select>{fieldError('deployment_type')&&<small className="text-red-300">{fieldError('deployment_type')}</small>}</label>
          <label className={labelClass}><span>GitHub URL</span><input className={fieldClass} name="github_url" type="url" value={githubUrl} onChange={e=>setGithubUrl(e.target.value)} placeholder="GitHub URL" inputMode="url"/>{fieldError('github_url')&&<small className="text-red-300">{fieldError('github_url')}</small>}</label>
          {deploymentType === 'deployed' && <label className={labelClass}><span className="font-mono">Live / Deployed URL</span><input className={fieldClass} name="live_demo_url" type="url" value={liveDemoUrl} onChange={e=>setLiveDemoUrl(e.target.value)} placeholder="Live / Deployed URL" inputMode="url" required/>{fieldError('live_demo_url')&&<small className="text-red-300">{fieldError('live_demo_url')}</small>}</label>}
          <label className={labelClass}><span className="font-mono">Tag Color</span><select className={fieldClass} name="tag_color" value={tagColor ?? ''} onChange={e=>setTagColor((e.target.value||null) as Project['tag_color'])}><option value="">Select...</option><option value="green">green</option><option value="blue">blue</option><option value="yellow">yellow</option></select>{fieldError('tag_color')&&<small className="text-red-300">{fieldError('tag_color')}</small>}</label>
          <label className={labelClass}><span className="font-mono break-words">Icon (Eye, Layers, Monitor, HelpCircle, Scissors, Code, Cpu, Boxes, Database)</span><input className={fieldClass} name="icon" value={icon ?? ''} onChange={e=>setIcon((e.target.value||null) as Project['icon'])} placeholder="Icon (Eye, Layers, Monitor, HelpCircle, Scissors, Code, Cpu, Boxes, Database)" list="project-icon-options"/><datalist id="project-icon-options">{ICONS.map(item=><option key={item} value={item}/>)}</datalist>{fieldError('icon')&&<small className="text-red-300">{fieldError('icon')}</small>}</label>
          <label className={labelClass}><span className="font-mono">Accent Color</span><div className="flex min-w-0 gap-3"><input className="h-[58px] w-[58px] shrink-0 rounded-xl border border-white/10 bg-black/30 p-1" type="color" value={isHexColor(accentColor)?accentColor:'#00d4ff'} onChange={e=>setAccentColor(e.target.value)} aria-label="Choose accent color"/><input className={`${fieldClass} min-w-0`} name="accent_color" value={accentColor} onChange={e=>setAccentColor(e.target.value)} placeholder="#00d4ff" spellCheck={false}/></div>{fieldError('accent_color')&&<small className="text-red-300">{fieldError('accent_color')}</small>}</label>
          <label className={labelClass}><span className="font-mono">Tech Stack (comma-separated)</span><input className={fieldClass} name="technologies" value={technologies} onChange={e=>setTechnologies(e.target.value)} placeholder="comma, separated, values"/></label>
          <label className={labelClass}><span className="font-mono">Display Order</span><input className={fieldClass} name="display_order" type="number" min={0} step={1} value={displayOrder} onChange={e=>setDisplayOrder(e.target.value)}/>{fieldError('display_order')&&<small className="text-red-300">{fieldError('display_order')}</small>}</label>
          {submitError&&<div className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-200" role="alert">{submitError}</div>}
        </div>
        <div className="sticky bottom-0 mt-8 flex justify-end gap-3 border-t border-white/[.06] bg-[#020617] pt-5">
          <button type="button" onClick={onClose} disabled={busy} className="rounded-xl border border-white/10 bg-white/[.02] px-6 py-3 text-base text-slate-400 transition hover:text-white">Cancel</button>
          <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-7 py-3 text-base font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"><Save size={19}/>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </div>
  </div>
}
