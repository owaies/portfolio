'use client'

import { useState } from 'react'
import { Download, FileText, Upload, X, Eye, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { saveRecord } from '../actions'
import { UI_EXPERIENCES, type UIExperienceId } from '@/lib/ui-experiences'

export default function UIExperiencePdfManager({ initialPdfs }: { initialPdfs: Record<UIExperienceId, string> }) {
  const [pdfs, setPdfs] = useState(initialPdfs)
  const [viewer, setViewer] = useState<UIExperienceId | null>(null)
  const [busy, setBusy] = useState<UIExperienceId | null>(null)
  const [message, setMessage] = useState('')

  const upload = async (id: UIExperienceId, file: File) => {
    setMessage('')
    if (file.type !== 'application/pdf') { setMessage('Please choose a PDF file.'); return }
    if (file.size > 20 * 1024 * 1024) { setMessage('PDF files must be 20 MB or smaller.'); return }
    setBusy(id)
    try {
      const supabase = createClient()
      const path = `ui-pdfs/${id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-') || 'portfolio.pdf'}`
      const { error } = await supabase.storage.from('portfolio-images').upload(path, file, { upsert: false, contentType: 'application/pdf', cacheControl: '3600' })
      if (error) throw new Error(`Upload failed: ${error.message}`)
      const url = supabase.storage.from('portfolio-images').getPublicUrl(path).data.publicUrl
      const formData = new FormData()
      formData.set('table', 'site_content')
      formData.set('key', `ui_experience_pdf_${id}`)
      formData.set('value', url)
      await saveRecord(formData)
      setPdfs(prev => ({ ...prev, [id]: url }))
      setMessage(`${UI_EXPERIENCES[id].name} PDF saved.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save PDF.')
    } finally { setBusy(null) }
  }

  const downloadUrl = viewer ? `/api/ui-experience-pdf/${viewer}?download=1` : ''

  return <section style={{ marginBottom: '2rem', padding: '1.25rem', border: '1px solid rgba(148,163,184,.14)', borderRadius: '24px', background: 'rgba(10,12,18,.72)' }}>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
      <div><p className="mono ui-experience-kicker">PDF CENTER</p><h2 style={{ margin: 0, fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}>View & download PDFs</h2><p style={{ margin: '.5rem 0 0', color: '#8791a5', maxWidth: '680px' }}>Give each UI experience its own PDF. View opens a focused popup, while Download starts the file download immediately.</p></div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.45rem', color: '#48d597', fontSize: '.82rem' }}><CheckCircle2 size={15}/> Separate per experience</div>
    </div>
    {message && <div role="status" style={{ marginBottom: '1rem', padding: '.75rem 1rem', borderRadius: '12px', background: 'rgba(34,211,238,.08)', color: '#67e8f9', fontSize: '.9rem' }}>{message}</div>}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: '1rem' }}>
      {(Object.keys(UI_EXPERIENCES) as UIExperienceId[]).map(id => {
        const item = UI_EXPERIENCES[id], pdf = pdfs[id], isBusy = busy === id
        return <article key={id} style={{ border: '1px solid rgba(148,163,184,.12)', borderRadius: '18px', overflow: 'hidden', background: 'rgba(255,255,255,.025)' }}>
          <div style={{ padding: '1rem', minHeight: '92px', background: id === 'organic-intelligence' ? 'linear-gradient(135deg,rgba(24,100,64,.35),rgba(4,18,12,.5))' : id === 'neural-interface' ? 'linear-gradient(135deg,rgba(49,35,115,.35),rgba(5,7,20,.6))' : 'linear-gradient(135deg,rgba(25,79,110,.35),rgba(5,10,20,.6))' }}><span style={{ fontSize: '1.25rem' }}>{item.icon}</span><h3 style={{ margin: '.55rem 0 .2rem' }}>{item.name}</h3><p style={{ margin: 0, color: '#7f8ba0', fontSize: '.8rem' }}>{pdf ? 'Custom PDF configured' : 'No custom PDF yet'}</p></div>
          <div style={{ padding: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', width: '100%', minHeight: '46px', borderRadius: '12px', border: '1px solid rgba(34,211,238,.22)', background: 'rgba(34,211,238,.07)', color: '#67e8f9', cursor: isBusy ? 'wait' : 'pointer', fontWeight: 650 }}>
              <input type="file" accept="application/pdf,.pdf" disabled={isBusy} style={{ display: 'none' }} onChange={event => { const file = event.target.files?.[0]; if (file) void upload(id, file); event.currentTarget.value = '' }} />
              <Upload size={16}/>{isBusy ? 'Uploading…' : pdf ? 'Replace PDF' : 'Upload PDF'}
            </label>
            {pdf && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem', marginTop: '.65rem' }}>
              <button type="button" className="admin-secondary" onClick={() => setViewer(id)} style={{ minHeight: '44px', justifyContent: 'center' }}><Eye size={15}/> View PDF</button>
              <a href={`/api/ui-experience-pdf/${id}?download=1`} className="admin-primary" style={{ minHeight: '44px', justifyContent: 'center', textDecoration: 'none' }}><Download size={15}/> Download</a>
            </div>}
          </div>
        </article>
      })}
    </div>
    {viewer && pdfs[viewer] && <div role="dialog" aria-modal="true" aria-label={`${UI_EXPERIENCES[viewer].name} PDF viewer`} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,.82)', backdropFilter: 'blur(14px)', padding: 'max(12px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 'min(1100px,100%)', height: 'min(92vh,900px)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(148,163,184,.2)', background: '#090b10', display: 'flex', flexDirection: 'column', boxShadow: '0 30px 100px rgba(0,0,0,.6)' }}>
        <header style={{ minHeight: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0 1rem', borderBottom: '1px solid rgba(148,163,184,.12)' }}><div style={{ minWidth: 0 }}><p className="mono" style={{ margin: 0, fontSize: '.68rem', color: '#7d899d' }}>PDF / {UI_EXPERIENCES[viewer].name}</p><strong style={{ display: 'block', marginTop: '.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{UI_EXPERIENCES[viewer].icon} Portfolio PDF</strong></div><div style={{ display: 'flex', gap: '.5rem' }}><a href={downloadUrl} className="admin-primary" style={{ textDecoration: 'none', minHeight: '40px', padding: '0 .85rem' }}><Download size={15}/> Download</a><button type="button" className="admin-icon-button" aria-label="Close PDF viewer" onClick={() => setViewer(null)}><X size={18}/></button></div></header>
        <iframe src={`/api/ui-experience-pdf/${viewer}`} title={`${UI_EXPERIENCES[viewer].name} PDF`} style={{ flex: 1, width: '100%', border: 0, background: '#fff' }} />
      </div>
    </div>}
  </section>
}
