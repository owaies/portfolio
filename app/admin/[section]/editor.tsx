'use client'

import { useMemo, useState } from 'react'
import { X, Plus, Search, Upload, FileText, Image as ImageIcon, ExternalLink, Trash2, Pencil } from 'lucide-react'
import { saveRecord, deleteRecord } from '../actions'
import { createClient } from '@/lib/supabase/client'
import ProjectForm from '../components/project-form'
import type { Project, Skill, Language, Experience, Education, Certificate, Resume } from '@/types/portfolio'

type SiteContentRecord = { key: string; value: string }
type EditableRecord = Partial<Project & Skill & Language & Experience & Education & Certificate & Resume & SiteContentRecord> & { id?: string }
type FileMap = Record<string, File | null>

const booleanFields = new Set(['featured', 'published', 'active', 'currently_working'])
const textAreaFields = new Set(['short_description', 'detailed_description', 'description', 'details', 'value'])
const imageFields = new Set(['thumbnail', 'preview_image', 'image_url'])
const pdfFields = new Set(['certificate_pdf', 'resume_pdf'])

const bucketFor = (field: string, table: string) => {
  if (field === 'certificate_pdf') return 'certificates'
  if (field === 'resume_pdf') return 'resumes'
  if (field === 'thumbnail' && table === 'projects') return 'project-images'
  if (field === 'thumbnail' && table === 'certificates') return 'portfolio-images'
  if (field === 'preview_image') return 'portfolio-images'
  if (field === 'image_url') return 'gallery'
  return 'portfolio-images'
}

const displayUrl = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

export default function Editor({ table, columns, rows }: { table: string; columns: string[]; rows: EditableRecord[] }) {
  const [editing, setEditing] = useState<EditableRecord | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [query, setQuery] = useState('')
  const [files, setFiles] = useState<FileMap>({})

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(row => columns.some(column => String(row[column as keyof EditableRecord] ?? '').toLowerCase().includes(q)))
  }, [columns, query, rows])

  const openEditor = (row: EditableRecord) => { setFiles({}); setMessage(''); setEditing(row) }

  const uploadFile = async (field: string, file: File) => {
    const supabase = createClient()
    const bucket = bucketFor(field, table)
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-')
    const path = `${table}/${crypto.randomUUID()}-${safeName || 'upload'}`
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false, contentType: file.type || undefined })
    if (error) throw new Error(`${field} upload failed: ${error.message}`)
    return { path, publicUrl: supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl }
  }

  const submit = async (formData: FormData) => {
    setBusy(true); setMessage('')
    try {
      for (const field of [...imageFields, ...pdfFields]) {
        const file = files[field]
        if (file) {
          const uploaded = await uploadFile(field, file)
          formData.set(field, imageFields.has(field) ? uploaded.publicUrl : uploaded.path)
        }
      }
      await saveRecord(formData)
      setMessage('Saved successfully. Refreshing…')
      window.location.reload()
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Unable to save.')
      throw e
    } finally { setBusy(false) }
  }

  const submitProject = async (formData: FormData) => {
    setBusy(true); setMessage('')
    try {
      await saveRecord(formData)
      setEditing(null)
      setMessage('Project saved successfully. Refreshing…')
      window.location.reload()
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Unable to save project.')
      throw e
    } finally { setBusy(false) }
  }

  const remove = async (id: string) => {
    if (!window.confirm('Delete this record permanently?')) return
    const fd = new FormData(); fd.set('table', table); fd.set('id', id)
    try { await deleteRecord(fd); window.location.reload() }
    catch (e) { setMessage(e instanceof Error ? e.message : 'Unable to delete.') }
  }

  const renderUploadField = (field: string, value: unknown) => {
    const isPdf = pdfFields.has(field); const selected = files[field]?.name; const current = String(value ?? '')
    return <label key={field} className="admin-field sm:col-span-2"><span>{field.replaceAll('_', ' ')}</span><div className="admin-upload"><input type="file" accept={isPdf ? 'application/pdf,.pdf' : 'image/*'} onChange={e => setFiles(prev => ({ ...prev, [field]: e.target.files?.[0] ?? null }))}/><div className="admin-upload-inner">{isPdf ? <FileText size={22}/> : <ImageIcon size={22}/>}<strong>{selected || (current ? 'Replace uploaded file' : `Click to upload ${isPdf ? 'pdf' : 'image'}`)}</strong><small>{selected || (current ? current : isPdf ? 'PDF files only' : 'JPG, PNG, WEBP and other images')}</small><Upload size={16}/></div></div>{current && !selected && <input type="hidden" name={field} value={current}/>}</label>
  }

  const renderProject = (row: EditableRecord) => {
    const project = row as Project
    const deployed = project.deployment_type === 'deployed'
    const technologies = project.technologies?.filter(Boolean) ?? []
    const accent = project.accent_color || '#00d4ff'
    return <article key={project.id} className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0b10]/90 p-5 shadow-[0_18px_55px_rgba(0,0,0,.2)]">
      <div className="absolute inset-x-0 top-0 h-px" style={{ backgroundColor: accent, opacity: 0.65 }} />
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="mono rounded-full border border-cyan-300/15 bg-cyan-300/5 px-2.5 py-1 text-[10px] uppercase tracking-widest text-cyan-300">{project.tag || 'Project'}</span>
            <span className={`mono rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-widest ${deployed ? 'border-green-400/20 bg-green-400/5 text-green-300' : 'border-blue-400/20 bg-blue-400/5 text-blue-300'}`}>{project.deployment_type || 'local'}</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{project.title || 'Untitled project'}</h3>
          <p className="mt-2 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-slate-400">{project.detailed_description || project.short_description || 'No description provided.'}</p>
          {technologies.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{technologies.map(technology => <span key={technology} className="rounded-lg border border-white/10 bg-white/[.025] px-2.5 py-1 text-xs text-slate-300">{technology}</span>)}</div>}
          <div className="mt-5 flex flex-wrap gap-3 text-xs">
            {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[.02] px-3 py-2 text-slate-300 hover:border-cyan-300/25 hover:text-white"><span className="truncate">GitHub · {displayUrl(project.github_url)}</span><ExternalLink size={13}/></a>}
            {deployed && project.live_demo_url && <a href={project.live_demo_url} target="_blank" rel="noreferrer" className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-xl border border-cyan-300/15 bg-cyan-300/5 px-3 py-2 text-cyan-200 hover:border-cyan-300/30"><ExternalLink size={15}/><span className="truncate">{displayUrl(project.live_demo_url)}</span></a>}
          </div>
        </div>
        <div className="flex shrink-0 gap-2 sm:pt-0">
          <button type="button" onClick={() => openEditor(project)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.025] px-4 py-2.5 text-sm text-slate-300 hover:border-cyan-300/25 hover:text-white"><Pencil size={15}/> Edit</button>
          {project.id && <button type="button" onClick={() => remove(project.id!)} className="inline-flex items-center gap-2 rounded-xl border border-red-400/15 bg-red-400/[.025] px-4 py-2.5 text-sm text-red-300 hover:border-red-400/35"><Trash2 size={15}/> Delete</button>}
        </div>
      </div>
    </article>
  }

  return <div>
    {message && <div className="mb-4 rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-3 text-sm text-cyan-200">{message}</div>}
    <div className="admin-toolbar"><label className="admin-search"><Search size={15}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." aria-label="Search records"/></label><button type="button" onClick={() => openEditor({})} className="admin-add"><Plus size={16}/> Add</button></div>

    {editing && table === 'projects' ? <ProjectForm editing={editing} onClose={() => setEditing(null)} onSubmit={submitProject} busy={busy}/> : editing && <div className="admin-modal-backdrop" role="presentation"><div className="admin-modal" role="dialog" aria-modal="true" aria-label={`${editing.id ? 'Edit' : 'Add'} ${table}`}><div className="admin-modal-header"><div><p className="mono text-[10px] uppercase tracking-widest text-cyan-300">CONTENT EDITOR</p><h3 className="mt-1 text-xl font-bold">{editing.id ? 'Edit' : 'Add New'} {table}</h3></div><button type="button" onClick={() => setEditing(null)} className="admin-icon-button" aria-label="Close editor"><X size={19}/></button></div><form action={submit} className="admin-form"><input type="hidden" name="table" value={table}/>{editing.id && <input type="hidden" name="id" value={editing.id}/>} {columns.filter(c => !['id','created_at','updated_at'].includes(c)).map(c => { const value = editing[c as keyof EditableRecord]; if (imageFields.has(c) || pdfFields.has(c)) return renderUploadField(c, value); if (booleanFields.has(c)) return <label key={c} className="admin-check"><input type="checkbox" name={c} value="true" defaultChecked={value === true}/><span>{c.replaceAll('_',' ')}</span></label>; if (textAreaFields.has(c)) return <label key={c} className="admin-field sm:col-span-2"><span>{c.replaceAll('_',' ')}</span><textarea name={c} defaultValue={String(value ?? '')} rows={c === 'value' ? 6 : 4}/></label>; return <label key={c} className="admin-field"><span>{c.replaceAll('_',' ')}</span><input name={c} defaultValue={Array.isArray(value) ? value.join(', ') : String(value ?? '')} placeholder={c === 'technologies' ? 'Python, OpenCV, Supabase' : ''}/></label> })}<div className="admin-form-actions sm:col-span-2"><button type="submit" disabled={busy} className="admin-primary">{busy ? 'Uploading & Saving…' : editing.id ? 'Save Changes' : 'Save'}</button><button type="button" onClick={() => setEditing(null)} className="admin-secondary">Cancel</button></div></form></div></div>}

    {table === 'projects' ? <div className="grid gap-4">{filteredRows.map(renderProject)}{filteredRows.length === 0 && <div className="admin-empty">{query ? 'No matching projects.' : 'No projects yet. Create the first one above.'}</div>}</div> : <div className="admin-records">{filteredRows.map(row => { const value = row; return <div key={value.id ?? value.key} className="admin-record"><div className="admin-record-fields">{columns.filter(c => c !== 'id').map(c => { const cellValue = value[c as keyof EditableRecord]; const renderedValue = typeof cellValue === 'boolean' ? String(cellValue) : Array.isArray(cellValue) ? cellValue.join(', ') : String(cellValue ?? ''); return <div key={c} className="min-w-0"><div className="mono text-[10px] uppercase tracking-wider text-slate-600">{c.replaceAll('_',' ')}</div><div className="mt-1 truncate text-sm text-slate-200" title={renderedValue}>{renderedValue || '—'}</div></div> })}</div><div className="admin-record-actions"><button type="button" onClick={() => openEditor(value)} className="admin-secondary">Edit</button>{value.id && <button type="button" onClick={() => remove(value.id!)} className="admin-danger">Delete</button>}</div></div> })}{filteredRows.length === 0 && <div className="admin-empty">{query ? 'No matching records.' : 'No records yet. Create the first one above.'}</div>}</div>}
  </div>
}
