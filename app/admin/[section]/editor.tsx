'use client'

import { useMemo, useState } from 'react'
import { X, Plus, Search, Upload, FileText, Image as ImageIcon } from 'lucide-react'
import { saveRecord, deleteRecord } from '../actions'
import { createClient } from '@/lib/supabase/client'
import type { Education, Experience, Language, Project, Resume, Skill, Certificate } from '@/types/portfolio'

const booleanFields = new Set(['featured', 'published', 'active', 'currently_working'])
const textAreaFields = new Set(['short_description', 'detailed_description', 'description', 'details', 'value'])
const imageFields = new Set(['thumbnail', 'preview_image', 'image_url'])
const pdfFields = new Set(['certificate_pdf', 'resume_pdf'])

type SiteContentRecord = { key: string; value: string }
type EditableRecord = Partial<Project & Skill & Language & Experience & Education & Certificate & Resume & SiteContentRecord> & { id?: string }

const bucketFor = (field: string, table: string) => {
  if (field === 'certificate_pdf') return 'certificates'
  if (field === 'resume_pdf') return 'resumes'
  if (field === 'thumbnail' && table === 'projects') return 'project-images'
  if (field === 'thumbnail' && table === 'certificates') return 'portfolio-images'
  if (field === 'preview_image') return 'portfolio-images'
  if (field === 'image_url') return 'gallery'
  return 'portfolio-images'
}

export default function Editor({ table, columns, rows }: { table: string; columns: string[]; rows: EditableRecord[] }) {
  const [editing, setEditing] = useState<EditableRecord | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [query, setQuery] = useState('')
  const [files, setFiles] = useState<Record<string, File | null>>({})

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(row => columns.some(column => String(row[column as keyof EditableRecord] ?? '').toLowerCase().includes(q)))
  }, [columns, query, rows])

  const openEditor = (row: EditableRecord) => {
    setFiles({})
    setMessage('')
    setEditing(row)
  }

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
    setBusy(true)
    setMessage('')
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
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id: string) => {
    if (!window.confirm('Delete this record permanently?')) return
    const fd = new FormData()
    fd.set('table', table)
    fd.set('id', id)
    try {
      await deleteRecord(fd)
      window.location.reload()
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Unable to delete.')
    }
  }

  const renderUploadField = (field: string, value: unknown) => {
    const isPdf = pdfFields.has(field)
    const selected = files[field]?.name
    const current = String(value ?? '')
    return (
      <label key={field} className="admin-field sm:col-span-2">
        <span>{field.replaceAll('_', ' ')}</span>
        <div className="admin-upload">
          <input
            type="file"
            accept={isPdf ? 'application/pdf,.pdf' : 'image/*'}
            onChange={e => setFiles(prev => ({ ...prev, [field]: e.target.files?.[0] ?? null }))}
          />
          <div className="admin-upload-inner">
            {isPdf ? <FileText size={22} /> : <ImageIcon size={22} />}
            <strong>{selected || (current ? 'Replace uploaded file' : `Click to upload ${isPdf ? 'pdf' : 'image'}`)}</strong>
            <small>{selected || (current ? current : isPdf ? 'PDF files only' : 'JPG, PNG, WEBP and other images')}</small>
            <Upload size={16} />
          </div>
        </div>
        {current && !selected && <input type="hidden" name={field} value={current} />}
      </label>
    )
  }

  return <div>
    {message && <div className="mb-4 rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-3 text-sm text-cyan-200">{message}</div>}
    <div className="admin-toolbar">
      <label className="admin-search"><Search size={15}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." aria-label="Search records"/></label>
      <button type="button" onClick={() => openEditor({})} className="admin-add"><Plus size={16}/> Add</button>
    </div>

    {editing && <div className="admin-modal-backdrop" role="presentation">
      <div className="admin-modal" role="dialog" aria-modal="true" aria-label={`${editing.id ? 'Edit' : 'Add'} ${table}`}>
        <div className="admin-modal-header">
          <div><p className="mono text-[10px] uppercase tracking-widest text-cyan-300">CONTENT EDITOR</p><h3 className="mt-1 text-xl font-bold">{editing.id ? 'Edit' : 'Add New'} {table}</h3></div>
          <button type="button" onClick={() => setEditing(null)} className="admin-icon-button" aria-label="Close editor"><X size={19}/></button>
        </div>
        <form action={submit} className="admin-form">
          <input type="hidden" name="table" value={table}/>
          {editing.id && <input type="hidden" name="id" value={editing.id}/>} 
          {columns.filter(c => !['id','created_at','updated_at'].includes(c)).map(c => {
            const value = editing[c as keyof EditableRecord]
            if (imageFields.has(c) || pdfFields.has(c)) return renderUploadField(c, value)
            if (booleanFields.has(c)) return <label key={c} className="admin-check"><input type="checkbox" name={c} value="true" defaultChecked={value === true}/><span>{c.replaceAll('_',' ')}</span></label>
            if (textAreaFields.has(c)) return <label key={c} className="admin-field sm:col-span-2"><span>{c.replaceAll('_',' ')}</span><textarea name={c} defaultValue={String(value ?? '')} rows={c === 'value' ? 6 : 4}/></label>
            return <label key={c} className="admin-field"><span>{c.replaceAll('_',' ')}</span><input name={c} defaultValue={Array.isArray(value) ? value.join(', ') : String(value ?? '')} placeholder={c === 'technologies' ? 'Python, OpenCV, Supabase' : ''}/></label>
          })}
          <div className="admin-form-actions sm:col-span-2"><button type="submit" disabled={busy} className="admin-primary">{busy ? 'Uploading & Saving…' : editing.id ? 'Save Changes' : 'Save'}</button><button type="button" onClick={() => setEditing(null)} className="admin-secondary">Cancel</button></div>
        </form>
      </div>
    </div>}

    <div className="admin-records">
      {filteredRows.map(row => {
        const value = row
        return <div key={value.id ?? value.key} className="admin-record"><div className="admin-record-fields">{columns.filter(c => c !== 'id').map(c => {
          const cellValue = value[c as keyof EditableRecord]
          const renderedValue = typeof cellValue === 'boolean' ? String(cellValue) : Array.isArray(cellValue) ? cellValue.join(', ') : String(cellValue ?? '')
          return <div key={c} className="min-w-0"><div className="mono text-[10px] uppercase tracking-wider text-slate-600">{c.replaceAll('_',' ')}</div><div className="mt-1 truncate text-sm text-slate-200" title={renderedValue}>{renderedValue || '—'}</div></div>
        })}</div><div className="admin-record-actions"><button type="button" onClick={() => openEditor(value)} className="admin-secondary">Edit</button>{value.id && <button type="button" onClick={() => remove(value.id!)} className="admin-danger">Delete</button>}</div></div>
      })}
      {filteredRows.length === 0 && <div className="admin-empty">{query ? 'No matching records.' : 'No records yet. Create the first one above.'}</div>}
    </div>
  </div>
}
