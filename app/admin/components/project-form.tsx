'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { X, Save, Upload, Image as ImageIcon } from 'lucide-react'
import type { Project } from '@/types/portfolio'
import { createClient } from '@/lib/supabase/client'

type ProjectDraft = Partial<Project> & { id?: string }
type ProjectField = 'description' | 'title' | 'tag' | 'deployment_type' | 'github_url' | 'live_demo_url' | 'icon' | 'display_order' | 'forge_color'
type Props = { editing: ProjectDraft; onClose: () => void; onSubmit: (formData: FormData) => Promise<void>; busy: boolean }

const ICONS: NonNullable<Project['icon']>[] = ['Eye', 'Layers', 'Monitor', 'HelpCircle', 'Scissors', 'Code', 'Cpu', 'Boxes', 'Database']
const DEPLOYMENT_TYPES: NonNullable<Project['deployment_type']>[] = ['deployed', 'local']
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export default function ProjectForm({ editing, onClose, onSubmit, busy }: Props) {
  const [title, setTitle] = useState(String(editing.title ?? ''))
  const [description, setDescription] = useState(String(editing.detailed_description ?? editing.short_description ?? ''))
  const [tag, setTag] = useState(String(editing.tag ?? 'Project'))
  const [deploymentType, setDeploymentType] = useState<NonNullable<Project['deployment_type']> | ''>(editing.deployment_type ?? 'local')
  const [githubUrl, setGithubUrl] = useState(String(editing.github_url ?? ''))
  const [liveDemoUrl, setLiveDemoUrl] = useState(String(editing.live_demo_url ?? ''))
  const [icon, setIcon] = useState<Project['icon']>(editing.icon ?? null)
  const [technologies, setTechnologies] = useState(Array.isArray(editing.technologies) ? editing.technologies.join(', ') : '')
  const [displayOrder, setDisplayOrder] = useState(String(editing.display_order ?? 0))
  const [thumbnail, setThumbnail] = useState(String(editing.thumbnail ?? ''))
  const [forgeColor, setForgeColor] = useState(String(editing.accent_color ?? '#00D4FF'))
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(String(editing.thumbnail ?? ''))
  const [uploadError, setUploadError] = useState('')
  const [errors, setErrors] = useState<Partial<Record<ProjectField, string>>>({})
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape' && !busy) onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [busy, onClose])

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview(thumbnail)
      return
    }
    const objectUrl = URL.createObjectURL(selectedImage)
    setImagePreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedImage, thumbnail])

  const handleImageChange = (file: File | null) => {
    setUploadError('')
    if (!file) return setSelectedImage(null)
    if (!file.type.startsWith('image/')) return setUploadError('Please select an image file.')
    if (file.size > 10 * 1024 * 1024) return setUploadError('Project images must be 10 MB or smaller.')
    setSelectedImage(file)
  }

  const validate = () => {
    const next: Partial<Record<ProjectField, string>> = {}
    if (!title.trim()) next.title = 'Title is required.'
    if (!description.trim()) next.description = 'Description is required.'
    if (githubUrl.trim()) {
      try { const url = new URL(githubUrl.trim()); if (!['http:', 'https:'].includes(url.protocol)) throw new Error() }
      catch { next.github_url = 'Enter a valid HTTP or HTTPS URL.' }
    }
    if (!DEPLOYMENT_TYPES.includes(deploymentType as NonNullable<Project['deployment_type']>)) next.deployment_type = 'Select deployed or local.'
    if (deploymentType === 'deployed') {
      if (!liveDemoUrl.trim()) next.live_demo_url = 'Live / Deployed URL is required for deployed projects.'
      else {
        try { const url = new URL(liveDemoUrl.trim()); if (!['http:', 'https:'].includes(url.protocol)) throw new Error() }
        catch { next.live_demo_url = 'Enter a valid HTTP or HTTPS URL.' }
      }
    }
    if (icon !== null && !ICONS.includes(icon)) next.icon = 'Select one of the supported icons.'
    const order = Number(displayOrder)
    if (!Number.isInteger(order) || order < 0) next.display_order = 'Display Order must be an integer greater than or equal to 0.'
    if (!/^#[0-9A-Fa-f]{6}$/.test(forgeColor)) next.forge_color = 'Use a 6-digit hex color such as #00D4FF.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError('')
    setUploadError('')
    if (!validate()) return

    const formData = new FormData()
    formData.set('table', 'projects')
    if (editing.id) formData.set('id', editing.id)
    formData.set('title', title.trim())
    formData.set('slug', editing.slug ?? slugify(title))
    formData.set('detailed_description', description.trim())
    formData.set('short_description', description.trim())
    formData.set('tag', tag.trim() || 'Project')
    formData.set('deployment_type', deploymentType)
    formData.set('github_url', githubUrl.trim())
    formData.set('live_demo_url', deploymentType === 'deployed' ? liveDemoUrl.trim() : '')
    formData.set('icon', icon ?? '')
    formData.set('technologies', technologies)
    formData.set('display_order', displayOrder)
    formData.set('forge_color', forgeColor.toUpperCase())

    try {
      if (selectedImage) {
        const supabase = createClient()
        const safeName = selectedImage.name.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-')
        const path = `projects/${crypto.randomUUID()}-${safeName || 'project-image'}`
        const { error } = await supabase.storage.from('project-images').upload(path, selectedImage, {
          upsert: false,
          contentType: selectedImage.type || undefined,
        })
        if (error) throw new Error(`Project image upload failed: ${error.message}`)
        const { data } = supabase.storage.from('project-images').getPublicUrl(path)
        if (!data.publicUrl) throw new Error('Unable to create a public project image URL.')
        formData.set('thumbnail', data.publicUrl)
      } else if (thumbnail) {
        formData.set('thumbnail', thumbnail)
      }
      await onSubmit(formData)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to save project.')
    }
  }

  const fieldError = (field: ProjectField) => errors[field]
  const fieldClass = 'w-full rounded-[18px] border border-white/10 bg-black/30 px-6 py-4 text-[17px] text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/45 focus:ring-2 focus:ring-cyan-300/5'
  const labelClass = 'flex flex-col gap-3 text-[16px] text-slate-400'

  return <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-3 backdrop-blur-md">
    <div className="flex max-h-[92vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[30px] border border-blue-400/20 bg-[#020617] shadow-[0_30px_100px_rgba(0,0,0,.65),0_0_50px_rgba(71,233,255,.06)]" role="dialog" aria-modal="true" aria-labelledby="project-editor-title">
      <div className="flex shrink-0 items-center justify-between border-b border-white/[.07] bg-[#020617] px-6 py-5 sm:px-8">
        <h3 id="project-editor-title" className="text-[28px] font-bold text-white sm:text-[32px]">{editing.id ? 'Edit Project' : 'Add New Projects'}</h3>
        <button type="button" onClick={onClose} disabled={busy} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 text-slate-400 transition hover:text-white" aria-label="Close project editor"><X size={27}/></button>
      </div>
      <form onSubmit={handleSubmit} noValidate className="min-h-0 overflow-y-auto overscroll-contain px-6 py-6 sm:px-8">
        <div className="space-y-7">
          <label className={labelClass}><span>Title</span><input className={fieldClass} name="title" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required autoFocus/>{fieldError('title')&&<small className="text-red-300">{fieldError('title')}</small>}</label>
          <label className={labelClass}><span>Description</span><textarea className={`${fieldClass} min-h-[145px] resize-y`} name="detailed_description" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" required rows={5}/>{fieldError('description')&&<small className="text-red-300">{fieldError('description')}</small>}</label>
          <div className="flex flex-col gap-3 text-[16px] text-slate-400"><span>Project Image</span><div className="rounded-[22px] border border-white/10 bg-black/20 p-4"><div className="relative aspect-[16/9] w-full overflow-hidden rounded-[16px] border border-white/10 bg-slate-950">{imagePreview ? <img src={imagePreview} alt="Project image preview" className="h-full w-full object-cover"/> : <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-600"><ImageIcon size={34}/><span className="text-sm">No project image selected</span></div>}</div><label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/5 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/35 hover:bg-cyan-300/10"><Upload size={17}/>{selectedImage ? 'Replace Project Image' : thumbnail ? 'Replace Project Image' : 'Upload Project Image'}<input type="file" accept="image/*" className="sr-only" onChange={e=>handleImageChange(e.target.files?.[0] ?? null)}/></label>{uploadError&&<small className="mt-2 block text-red-300">{uploadError}</small>}<p className="mt-2 text-xs text-slate-600">JPG, PNG, WEBP and other browser-supported images · max 10 MB</p></div></div>
          <div className="rounded-[22px] border border-fuchsia-400/15 bg-fuchsia-400/[.025] p-5"><div className="mb-4"><span className="font-mono text-[16px] text-fuchsia-200">Obsidian Forge · Project Grid Color</span><p className="mt-1 text-xs text-slate-500">Used only by the Obsidian Forge project grid. Other experiences ignore this color.</p></div><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><div className="flex min-w-0 flex-1 items-center gap-3"><input aria-label="Obsidian Forge project grid color" type="color" value={forgeColor} onChange={e=>setForgeColor(e.target.value.toUpperCase())} className="h-14 w-16 shrink-0 cursor-pointer rounded-xl border border-white/10 bg-transparent p-1"/><input className={fieldClass} value={forgeColor} onChange={e=>setForgeColor(e.target.value.toUpperCase())} placeholder="#00D4FF" maxLength={7}/></div></div>{fieldError('forge_color')&&<small className="mt-2 block text-red-300">{fieldError('forge_color')}</small>}</div>
          <label className={labelClass}><span>Tag</span><input className={fieldClass} name="tag" value={tag} onChange={e=>setTag(e.target.value)} placeholder="Project"/></label>
          <label className={labelClass}><span className="font-mono">Deployment Type</span><select className={fieldClass} name="deployment_type" value={deploymentType} onChange={e=>setDeploymentType(e.target.value as NonNullable<Project['deployment_type']> | '')}><option value="">Select...</option><option value="deployed">deployed</option><option value="local">local</option></select>{fieldError('deployment_type')&&<small className="text-red-300">{fieldError('deployment_type')}</small>}</label>
          {deploymentType === 'deployed' && <label className={labelClass}><span className="font-mono">Live / Deployed URL</span><input className={fieldClass} name="live_demo_url" type="url" value={liveDemoUrl} onChange={e=>setLiveDemoUrl(e.target.value)} placeholder="Live / Deployed URL" inputMode="url" required/>{fieldError('live_demo_url')&&<small className="text-red-300">{fieldError('live_demo_url')}</small>}</label>}
          <label className={labelClass}><span>GitHub URL</span><input className={fieldClass} name="github_url" type="url" value={githubUrl} onChange={e=>setGithubUrl(e.target.value)} placeholder="GitHub URL" inputMode="url"/>{fieldError('github_url')&&<small className="text-red-300">{fieldError('github_url')}</small>}</label>
          <label className={labelClass}><span className="font-mono break-words">Icon (Eye, Layers, Monitor, HelpCircle, Scissors, Code, Cpu, Boxes, Database)</span><input className={fieldClass} name="icon" value={icon ?? ''} onChange={e=>setIcon((e.target.value||null) as Project['icon'])} placeholder="Icon (Eye, Layers, Monitor, HelpCircle, Scissors, Code, Cpu, Boxes, Database)" list="project-icon-options"/><datalist id="project-icon-options">{ICONS.map(item=><option key={item} value={item}/>)}</datalist>{fieldError('icon')&&<small className="text-red-300">{fieldError('icon')}</small>}</label>
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
