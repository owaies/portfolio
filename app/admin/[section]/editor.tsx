'use client'

import { useState } from 'react'
import { saveRecord, deleteRecord } from '../actions'
import type { Education, Experience, Language, Project, Resume, Skill, Certificate } from '@/types/portfolio'

const booleanFields = new Set(['featured', 'published', 'active', 'currently_working'])
const textAreaFields = new Set(['short_description', 'detailed_description', 'description', 'details', 'value'])

type SiteContentRecord = { key: string; value: string }
type EditableRecord = Partial<Project & Skill & Language & Experience & Education & Certificate & Resume & SiteContentRecord> & { id?: string }

export default function Editor({ table, columns, rows }: { table: string; columns: string[]; rows: EditableRecord[] }) {
  const [editing, setEditing] = useState<EditableRecord | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const submit = async (formData: FormData) => {
    setBusy(true); setMessage('')
    try {
      await saveRecord(formData)
      setMessage('Saved successfully. Refreshing…')
      window.location.reload()
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Unable to save.')
    } finally { setBusy(false) }
  }

  const remove = async (id: string) => {
    if (!window.confirm('Delete this record permanently?')) return
    const fd = new FormData(); fd.set('table', table); fd.set('id', id)
    try { await deleteRecord(fd); window.location.reload() }
    catch (e) { setMessage(e instanceof Error ? e.message : 'Unable to delete.') }
  }

  return <div>
    {message && <div className="mb-4 rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-3 text-sm text-cyan-200">{message}</div>}
    <div className="mb-6 flex justify-end">
      <button onClick={() => setEditing({})} className="rounded-xl bg-white px-4 py-2 font-semibold text-black">New record</button>
    </div>
    {editing && <div className="glass mb-6 rounded-2xl p-6">
      <form action={submit} className="grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="table" value={table}/>
        {editing.id && <input type="hidden" name="id" value={editing.id}/>} 
        {columns.filter(c => !['id','created_at','updated_at'].includes(c)).map(c => {
          const value = editing[c as keyof EditableRecord]
          if (booleanFields.has(c)) return <label key={c} className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" name={c} value="true" defaultChecked={value === true} className="h-4 w-4"/>{c}</label>
          if (c === 'technologies') return <label key={c} className="text-sm text-slate-400">{c}<input name={c} defaultValue={Array.isArray(value) ? value.join(', ') : String(value ?? '')} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white" placeholder="Python, OpenCV, Supabase"/></label>
          if (textAreaFields.has(c)) return <label key={c} className="text-sm text-slate-400 sm:col-span-2">{c}<textarea name={c} defaultValue={String(value ?? '')} rows={5} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white"/></label>
          return <label key={c} className="text-sm text-slate-400">{c}<input name={c} defaultValue={Array.isArray(value) ? value.join(', ') : String(value ?? '')} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white"/></label>
        })}
        <div className="sm:col-span-2 flex gap-3"><button disabled={busy} className="rounded-xl bg-white px-4 py-2 font-semibold text-black">{busy ? 'Saving…' : 'Save'}</button><button type="button" onClick={() => setEditing(null)} className="glass rounded-xl px-4 py-2">Cancel</button></div>
      </form>
    </div>}
    <div className="space-y-3">
      {rows.map(row => <div key={row.id ?? row.key} className="glass rounded-2xl p-4"><div className="flex flex-wrap items-start justify-between gap-4"><div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">{columns.filter(c => c !== 'id').map(c => <div key={c}><div className="mono text-[10px] uppercase tracking-wider text-slate-500">{c}</div><div className="truncate text-sm text-slate-200">{typeof row[c as keyof EditableRecord] === 'boolean' ? String(row[c as keyof EditableRecord]) : Array.isArray(row[c as keyof EditableRecord]) ? row[c as keyof EditableRecord]?.join(', ') : String(row[c as keyof EditableRecord] ?? '')}</div></div>)}</div><div className="flex shrink-0 gap-2"><button onClick={() => setEditing(row)} className="glass rounded-lg px-3 py-2 text-sm">Edit</button>{row.id && <button onClick={() => remove(row.id!)} className="rounded-lg border border-red-300/20 px-3 py-2 text-sm text-red-300">Delete</button>}</div></div></div>)}
      {rows.length === 0 && <div className="glass rounded-2xl p-10 text-center text-slate-500">No records yet. Create the first one above.</div>}
    </div>
  </div>
}