'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Eye, Sparkles, X, Monitor, Smartphone, Upload, Image as ImageIcon, Camera, Trash2 } from 'lucide-react'
import { publishUIExperience, saveRecord } from '../actions'
import { LOADING_EXPERIENCES } from '@/lib/loading-experiences'
import { UI_EXPERIENCES, type UIExperienceId } from '@/lib/ui-experiences'
import { createClient } from '@/lib/supabase/client'

function AssetStatus({ id }: { id: UIExperienceId }) {
  const [status, setStatus] = useState<'checking' | 'ready' | 'missing'>('checking')
  useEffect(() => {
    let alive = true
    Promise.all([LOADING_EXPERIENCES[id].desktop, LOADING_EXPERIENCES[id].mobile].map(async path => {
      try { const response = await fetch(path, { method: 'HEAD', cache: 'no-store' }); return response.ok } catch { return false }
    })).then(results => { if (alive) setStatus(results.every(Boolean) ? 'ready' : 'missing') })
    return () => { alive = false }
  }, [id])
  const label = status === 'checking' ? 'Checking…' : status === 'ready' ? 'Connected' : 'Awaiting asset'
  return <div className={`ui-loading-assets ui-loading-assets-${status}`}><div><Monitor size={12}/><span>Desktop Loading</span></div><div><Smartphone size={12}/><span>Mobile Loading</span></div><strong>{status === 'ready' ? '✓' : status === 'missing' ? '!' : '…'} {label}</strong></div>
}

function ProfileImageManager({ initialImages }: { initialImages: Record<UIExperienceId, string> }) {
  const [images, setImages] = useState(initialImages)
  const [uploading, setUploading] = useState<UIExperienceId | null>(null)
  const [message, setMessage] = useState('')
  const inputs = useRef<Partial<Record<UIExperienceId, HTMLInputElement | null>>>({})

  const upload = async (id: UIExperienceId, file: File) => {
    setMessage('')
    if (!file.type.startsWith('image/')) { setMessage('Please choose an image file.'); return }
    if (file.size > 8 * 1024 * 1024) { setMessage('Profile images must be 8 MB or smaller.'); return }
    setUploading(id)
    try {
      const supabase = createClient()
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-')
      const path = `profile/${id}/${crypto.randomUUID()}-${safeName || 'profile-image'}`
      const { error: uploadError } = await supabase.storage.from('portfolio-images').upload(path, file, { upsert: false, contentType: file.type, cacheControl: '3600' })
      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)
      const publicUrl = supabase.storage.from('portfolio-images').getPublicUrl(path).data.publicUrl
      const formData = new FormData()
      formData.set('table', 'site_content')
      formData.set('key', `profile_image_${id}`)
      formData.set('value', publicUrl)
      const result = await saveRecord(formData)
      if (!result?.ok) throw new Error(result?.error || 'Could not save the profile image.')
      setImages(prev => ({ ...prev, [id]: publicUrl }))
      setMessage(`${UI_EXPERIENCES[id].name} profile image saved.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save profile image.')
    } finally { setUploading(null) }
  }

  const remove = async (id: UIExperienceId) => {
    setMessage('')
    setUploading(id)
    try {
      const formData = new FormData()
      formData.set('table', 'site_content')
      formData.set('key', `profile_image_${id}`)
      formData.set('value', '')
      const result = await saveRecord(formData)
      if (!result?.ok) throw new Error(result?.error || 'Could not remove the profile image override.')
      setImages(prev => ({ ...prev, [id]: '' }))
      setMessage(`${UI_EXPERIENCES[id].name} now uses the default profile image.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to remove profile image.')
    } finally { setUploading(null) }
  }

  return <section className="ui-profile-manager" aria-labelledby="ui-profile-title">
    <div className="ui-profile-manager-heading">
      <div><p className="mono ui-experience-kicker">PROFILE PICTURE</p><h2 id="ui-profile-title">Your portrait, tailored to each experience.</h2><p>Change the actual profile picture shown on your public portfolio. Each UI experience has its own independent image.</p></div>
      <div className="ui-profile-manager-note"><Camera size={16}/> <span>Separate image per experience</span></div>
    </div>
    {message && <div className="ui-profile-message" role="status">{message}</div>}
    <div className="ui-profile-grid">
      {(Object.keys(UI_EXPERIENCES) as UIExperienceId[]).map(id => {
        const item = UI_EXPERIENCES[id]
        const image = images[id]
        const busy = uploading === id
        return <article key={id} className={`ui-profile-card ui-profile-${id}`}>
          <div className="ui-profile-preview">
            {image ? <img src={`${image}${image.includes('?') ? '&' : '?'}v=${encodeURIComponent(image.slice(-24))}`} alt={`${item.name} profile preview`} /> : <div className="ui-profile-empty"><ImageIcon size={26}/><span>Using default profile picture</span></div>}
            <div className="ui-profile-overlay"><span>{item.icon} {item.name}</span><small>{image ? 'CUSTOM PROFILE PICTURE' : 'DEFAULT PROFILE PICTURE'}</small></div>
          </div>
          <div className="ui-profile-body">
            <div><h3>{item.name}</h3><p>{item.keywords.join(' · ')}</p></div>
            <div className="ui-profile-controls">
              <label className="ui-profile-upload">
                <input ref={element => { inputs.current[id] = element }} type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={busy} onChange={event => { const file = event.target.files?.[0]; if (file) upload(id, file); event.currentTarget.value = '' }}/>
                <Upload size={15}/><span>{busy ? 'Uploading…' : image ? 'Change profile picture' : 'Upload profile picture'}</span>
              </label>
              {image && <button type="button" className="admin-secondary ui-profile-remove" disabled={busy} onClick={() => remove(id)}><Trash2 size={14}/> Remove</button>}
            </div>
          </div>
        </article>
      })}
    </div>
  </section>
}

export default function UIExperienceManager({ active, profileImages }: { active: UIExperienceId; profileImages: Record<UIExperienceId, string> }) {
  const [preview, setPreview] = useState<UIExperienceId | null>(null)
  const [selected, setSelected] = useState<UIExperienceId>(active)
  const [confirm, setConfirm] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')
  const publish = async () => { if (selected===active) return; setError(''); setPublishing(true); try { const result=await publishUIExperience(selected); if(!result.ok) setError(result.error||'Could not update the experience.'); else window.location.reload() } catch(err) { setError(err instanceof Error?err.message:'Could not update the experience.') } finally { setPublishing(false); setConfirm(false) } }
  return <>
    <div className="ui-experience-intro"><div><p className="mono ui-experience-kicker">UI EXPERIENCE</p><h2>Choose how your portfolio looks and feels.</h2><p>Three presentation systems. One content system. Your projects, skills, education, certificates and contact data stay intact while the entire visual world changes.</p></div><div className="ui-experience-current"><span>Current Active Experience</span><strong>{UI_EXPERIENCES[active].icon} {UI_EXPERIENCES[active].name}</strong><small>Public visitors see this experience.</small></div></div>
    {error&&<div className="ui-experience-error">{error}</div>}
    <ProfileImageManager initialImages={profileImages} />
    <div className="ui-experience-grid">{(Object.keys(UI_EXPERIENCES) as UIExperienceId[]).map(id=>{const item=UI_EXPERIENCES[id],isActive=active===id,isSelected=selected===id;return <article key={id} className={`ui-experience-card ui-experience-${id} ${isActive?'is-active':''} ${isSelected?'is-selected':''}`}><div className="ui-experience-art"><div className="ui-art-grid"/><div className="ui-art-orb"/><div className="ui-art-label">{item.tagline}</div><div className="ui-art-symbol">{item.icon}</div></div><div className="ui-experience-card-body"><div className="ui-experience-title"><div><span className="ui-experience-icon">{item.icon}</span><div><h3>{item.name}</h3><p>{item.keywords.join(' · ')}</p></div></div>{isActive&&<span className="ui-active-badge"><Check size={12}/> ACTIVE</span>}</div><p className="ui-experience-description">{item.description}</p><AssetStatus id={id}/><div className="ui-experience-actions"><button type="button" className="admin-secondary" onClick={()=>setPreview(id)}><Eye size={13}/> Preview</button><button type="button" className={isSelected?'ui-selected-button':'admin-primary'} onClick={()=>setSelected(id)} disabled={isActive||isSelected}>{isSelected&&!isActive?<Check size={13}/>:<Sparkles size={13}/>} {isActive?'Active':isSelected?'Selected':'Select'}</button></div></div></article>})}</div>
    {selected!==active&&<div className="ui-experience-publish-bar"><div><span>Ready to publish</span><strong>{UI_EXPERIENCES[selected].icon} {UI_EXPERIENCES[selected].name}</strong></div><button type="button" className="admin-primary" onClick={()=>setConfirm(true)} disabled={publishing}>Publish Experience</button></div>}
    {confirm&&<div className="ui-confirm-backdrop" role="dialog" aria-modal="true" aria-labelledby="ui-confirm-title"><div className="ui-confirm-modal"><button type="button" className="admin-icon-button ui-confirm-close" aria-label="Cancel publication" onClick={()=>setConfirm(false)}><X size={17}/></button><span className="ui-confirm-mark">✦</span><p className="mono ui-experience-kicker">CHANGE UI EXPERIENCE?</p><h3 id="ui-confirm-title">Publish this visual experience?</h3><p>This will change the visual experience of the public portfolio.</p><div className="ui-confirm-compare"><div><small>Current</small><strong>{UI_EXPERIENCES[active].icon} {UI_EXPERIENCES[active].name}</strong></div><span>→</span><div><small>New</small><strong>{UI_EXPERIENCES[selected].icon} {UI_EXPERIENCES[selected].name}</strong></div></div><div className="ui-confirm-actions"><button type="button" className="admin-secondary" onClick={()=>setConfirm(false)}>Cancel</button><button type="button" className="admin-primary" onClick={publish} disabled={publishing}>{publishing?'Publishing…':'Publish'}</button></div></div></div>}
    {preview&&<div className="ui-preview-backdrop" role="dialog" aria-modal="true" aria-label={`Preview ${UI_EXPERIENCES[preview].name}`}><div className="ui-preview-modal"><header><div><span className="mono">PREVIEW / UI EXPERIENCE</span><h3>{UI_EXPERIENCES[preview].icon} {UI_EXPERIENCES[preview].name}</h3></div><button type="button" className="admin-icon-button" aria-label="Close preview" onClick={()=>setPreview(null)}><X size={17}/></button></header><div className="ui-preview-frame"><iframe title={`${UI_EXPERIENCES[preview].name} portfolio preview`} src={`/?ui-preview=${preview}`} /></div><footer><span>This is a non-published preview.</span><button type="button" className="admin-primary" onClick={()=>{setSelected(preview);setPreview(null)}}>Use this experience</button></footer></div></div>}
  </>
}
