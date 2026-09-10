'use client'

import { useEffect, useState } from 'react'
import { Check, Eye, Sparkles, X, Monitor, Smartphone } from 'lucide-react'
import { publishUIExperience } from '../actions'
import { LOADING_EXPERIENCES } from '@/lib/loading-experiences'
import { UI_EXPERIENCES, type UIExperienceId } from '@/lib/ui-experiences'

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

export default function UIExperienceManager({ active }: { active: UIExperienceId }) {
  const [preview, setPreview] = useState<UIExperienceId | null>(null)
  const [selected, setSelected] = useState<UIExperienceId>(active)
  const [confirm, setConfirm] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')
  const publish = async () => { if (selected===active) return; setError(''); setPublishing(true); try { const result=await publishUIExperience(selected); if(!result.ok) setError(result.error||'Could not update the experience.'); else window.location.reload() } catch(err) { setError(err instanceof Error?err.message:'Could not update the experience.') } finally { setPublishing(false); setConfirm(false) } }
  return <>
    <div className="ui-experience-intro"><div><p className="mono ui-experience-kicker">UI EXPERIENCE</p><h2>Choose how your portfolio looks and feels.</h2><p>Three presentation systems. One content system. Your projects, skills, education, certificates and contact data stay intact while the entire visual world changes.</p></div><div className="ui-experience-current"><span>Current Active Experience</span><strong>{UI_EXPERIENCES[active].icon} {UI_EXPERIENCES[active].name}</strong><small>Public visitors see this experience.</small></div></div>
    {error&&<div className="ui-experience-error">{error}</div>}
    <div className="ui-experience-grid">{(Object.keys(UI_EXPERIENCES) as UIExperienceId[]).map(id=>{const item=UI_EXPERIENCES[id],isActive=active===id,isSelected=selected===id;return <article key={id} className={`ui-experience-card ui-experience-${id} ${isActive?'is-active':''} ${isSelected?'is-selected':''}`}><div className="ui-experience-art"><div className="ui-art-grid"/><div className="ui-art-orb"/><div className="ui-art-label">{item.tagline}</div><div className="ui-art-symbol">{item.icon}</div></div><div className="ui-experience-card-body"><div className="ui-experience-title"><div><span className="ui-experience-icon">{item.icon}</span><div><h3>{item.name}</h3><p>{item.keywords.join(' · ')}</p></div></div>{isActive&&<span className="ui-active-badge"><Check size={12}/> ACTIVE</span>}</div><p className="ui-experience-description">{item.description}</p><AssetStatus id={id}/><div className="ui-experience-actions"><button type="button" className="admin-secondary" onClick={()=>setPreview(id)}><Eye size={13}/> Preview</button><button type="button" className={isSelected?'ui-selected-button':'admin-primary'} onClick={()=>setSelected(id)} disabled={isActive||isSelected}>{isSelected&&!isActive?<Check size={13}/>:<Sparkles size={13}/>} {isActive?'Active':isSelected?'Selected':'Select'}</button></div></div></article>})}</div>
    {selected!==active&&<div className="ui-experience-publish-bar"><div><span>Ready to publish</span><strong>{UI_EXPERIENCES[selected].icon} {UI_EXPERIENCES[selected].name}</strong></div><button type="button" className="admin-primary" onClick={()=>setConfirm(true)} disabled={publishing}>Publish Experience</button></div>}
    {confirm&&<div className="ui-confirm-backdrop" role="dialog" aria-modal="true" aria-labelledby="ui-confirm-title"><div className="ui-confirm-modal"><button type="button" className="admin-icon-button ui-confirm-close" aria-label="Cancel publication" onClick={()=>setConfirm(false)}><X size={17}/></button><span className="ui-confirm-mark">✦</span><p className="mono ui-experience-kicker">CHANGE UI EXPERIENCE?</p><h3 id="ui-confirm-title">Publish this visual experience?</h3><p>This will change the visual experience of the public portfolio.</p><div className="ui-confirm-compare"><div><small>Current</small><strong>{UI_EXPERIENCES[active].icon} {UI_EXPERIENCES[active].name}</strong></div><span>→</span><div><small>New</small><strong>{UI_EXPERIENCES[selected].icon} {UI_EXPERIENCES[selected].name}</strong></div></div><div className="ui-confirm-actions"><button type="button" className="admin-secondary" onClick={()=>setConfirm(false)}>Cancel</button><button type="button" className="admin-primary" onClick={publish} disabled={publishing}>{publishing?'Publishing…':'Publish'}</button></div></div></div>}
    {preview&&<div className="ui-preview-backdrop" role="dialog" aria-modal="true" aria-label={`Preview ${UI_EXPERIENCES[preview].name}`}><div className="ui-preview-modal"><header><div><span className="mono">PREVIEW / UI EXPERIENCE</span><h3>{UI_EXPERIENCES[preview].icon} {UI_EXPERIENCES[preview].name}</h3></div><button type="button" className="admin-icon-button" aria-label="Close preview" onClick={()=>setPreview(null)}><X size={17}/></button></header><div className="ui-preview-frame"><iframe title={`${UI_EXPERIENCES[preview].name} portfolio preview`} src={`/?ui-preview=${preview}`} /></div><footer><span>This is a non-published preview.</span><button type="button" className="admin-primary" onClick={()=>{setSelected(preview);setPreview(null)}}>Use this experience</button></footer></div></div>}
  </>
}
