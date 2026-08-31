'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { X, Save } from 'lucide-react'
import type { Education } from '@/types/portfolio'

type EducationDraft = Partial<Education> & { id?: string }
type EducationField = 'period' | 'degree' | 'institution' | 'details' | 'status' | 'accent_color' | 'icon' | 'display_order'
type Props = { editing: EducationDraft; onClose: () => void; onSubmit: (formData: FormData) => Promise<void>; busy: boolean }

const ICONS: NonNullable<Education['icon']>[] = ['GraduationCap', 'BookOpen', 'School', 'Award', 'Briefcase']
const STATUSES = ['In Progress', 'Completed']
const isHexColor = (value: string) => /^#[0-9A-Fa-f]{6}$/.test(value)

export default function EducationForm({ editing, onClose, onSubmit, busy }: Props) {
  const [period, setPeriod] = useState(String(editing.period ?? ''))
  const [degree, setDegree] = useState(String(editing.degree ?? ''))
  const [institution, setInstitution] = useState(String(editing.institution ?? ''))
  const [details, setDetails] = useState(String(editing.details ?? ''))
  const [accentColor, setAccentColor] = useState(String(editing.accent_color ?? '#00d4ff'))
  const [status, setStatus] = useState(String(editing.status ?? ''))
  const [icon, setIcon] = useState<Education['icon']>(editing.icon ?? null)
  const [displayOrder, setDisplayOrder] = useState(String(editing.display_order ?? 0))
  const [errors, setErrors] = useState<Partial<Record<EducationField, string>>>({})
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape' && !busy) onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [busy, onClose])

  const validate = () => {
    const next: Partial<Record<EducationField, string>> = {}
    if (!period.trim()) next.period = 'Period is required.'
    if (!degree.trim()) next.degree = 'Degree is required.'
    if (!institution.trim()) next.institution = 'Institution is required.'
    if (accentColor && !isHexColor(accentColor)) next.accent_color = 'Use a 6-digit hexadecimal color such as #00d4ff.'
    if (status && !STATUSES.includes(status)) next.status = 'Select In Progress or Completed.'
    if (icon !== null && !ICONS.includes(icon)) next.icon = 'Select one of the supported icons.'
    const order = Number(displayOrder)
    if (!Number.isInteger(order) || order < 0) next.display_order = 'Display Order must be an integer greater than or equal to 0.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSubmitError(''); if (!validate()) return
    const formData = new FormData(); formData.set('table', 'education')
    if (editing.id) formData.set('id', editing.id)
    formData.set('period', period.trim()); formData.set('degree', degree.trim()); formData.set('institution', institution.trim())
    formData.set('details', details.trim()); formData.set('status', status); formData.set('accent_color', accentColor.toLowerCase())
    formData.set('icon', icon ?? ''); formData.set('display_order', displayOrder)
    try { await onSubmit(formData) } catch (error) { setSubmitError(error instanceof Error ? error.message : 'Unable to save education.') }
  }

  const fieldError = (field: EducationField) => errors[field]
  const fieldClass = 'w-full rounded-[18px] border border-white/10 bg-black/30 px-6 py-4 text-[17px] text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/45 focus:ring-2 focus:ring-cyan-300/5'
  const labelClass = 'flex flex-col gap-3 text-[16px] text-slate-400'

  return <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-3 backdrop-blur-md" role="presentation">
    <div className="flex max-h-[92vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[30px] border border-blue-400/20 bg-[#020617] shadow-[0_30px_100px_rgba(0,0,0,.65),0_0_50px_rgba(71,233,255,.06)]" role="dialog" aria-modal="true" aria-labelledby="education-editor-title">
      <div className="flex shrink-0 items-center justify-between border-b border-white/[.07] bg-[#020617] px-6 py-5 sm:px-8">
        <h3 id="education-editor-title" className="text-[28px] font-bold text-white sm:text-[32px]">{editing.id ? 'Edit Education' : 'Add New Education'}</h3>
        <button type="button" onClick={onClose} disabled={busy} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 text-slate-400 transition hover:text-white" aria-label="Close education editor"><X size={27}/></button>
      </div>
      <form onSubmit={handleSubmit} noValidate className="min-h-0 overflow-y-auto overscroll-contain px-6 py-6 sm:px-8">
        <div className="space-y-7">
          <label className={labelClass}><span className="font-mono">Period</span><input className={fieldClass} name="period" value={period} onChange={e=>setPeriod(e.target.value)} placeholder="Period" required autoFocus/>{fieldError('period')&&<small className="text-red-300">{fieldError('period')}</small>}</label>
          <label className={labelClass}><span>Degree</span><input className={fieldClass} name="degree" value={degree} onChange={e=>setDegree(e.target.value)} placeholder="Degree" required/>{fieldError('degree')&&<small className="text-red-300">{fieldError('degree')}</small>}</label>
          <label className={labelClass}><span>Institution</span><input className={fieldClass} name="institution" value={institution} onChange={e=>setInstitution(e.target.value)} placeholder="Institution" required/>{fieldError('institution')&&<small className="text-red-300">{fieldError('institution')}</small>}</label>
          <label className={labelClass}><span>Detail</span><input className={fieldClass} name="details" value={details} onChange={e=>setDetails(e.target.value)} placeholder="Detail"/></label>
          <label className={labelClass}><span className="font-mono">Accent Color</span><div className="flex min-w-0 gap-3"><input className="h-[58px] w-[58px] shrink-0 rounded-xl border border-white/10 bg-black/30 p-1" type="color" value={isHexColor(accentColor)?accentColor:'#00d4ff'} onChange={e=>setAccentColor(e.target.value)} aria-label="Choose accent color"/><input className={`${fieldClass} min-w-0`} name="accent_color" value={accentColor} onChange={e=>setAccentColor(e.target.value)} placeholder="#00d4ff" spellCheck={false}/></div>{fieldError('accent_color')&&<small className="text-red-300">{fieldError('accent_color')}</small>}</label>
          <label className={labelClass}><span className="font-mono">Status</span><select className={fieldClass} name="status" value={status} onChange={e=>setStatus(e.target.value)}><option value="">Select...</option>{STATUSES.map(item=><option key={item} value={item}>{item}</option>)}</select>{fieldError('status')&&<small className="text-red-300">{fieldError('status')}</small>}</label>
          <label className={labelClass}><span className="font-mono break-words">Icon (GraduationCap, BookOpen, School, Award, Briefcase)</span><input className={fieldClass} name="icon" value={icon ?? ''} onChange={e=>setIcon((e.target.value||null) as Education['icon'])} placeholder="Icon (GraduationCap, BookOpen, School, Award, Briefcase)" list="education-icon-options"/><datalist id="education-icon-options">{ICONS.map(item=><option key={item} value={item}/>)}</datalist>{fieldError('icon')&&<small className="text-red-300">{fieldError('icon')}</small>}</label>
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
