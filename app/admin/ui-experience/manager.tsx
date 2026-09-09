'use client'

import { useState } from 'react'
import { Check, Eye, Globe2, Sparkles, X } from 'lucide-react'
import { publishUIExperience } from '../actions'
import { UI_EXPERIENCES, type UIExperienceId } from '@/lib/ui-experiences'

export default function UIExperienceManager({ active }: { active: UIExperienceId }) {
  const [preview, setPreview] = useState<UIExperienceId | null>(null)
  const [selected, setSelected] = useState<UIExperienceId>(active)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')

  const publish = async () => {
    if (selected === active) return
    setError('')
    setPublishing(true)
    try {
      const result = await publishUIExperience(selected)
      if (!result.ok) setError(result.error || 'Could not update the experience.')
      else window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the experience.')
    } finally {
      setPublishing(false)
    }
  }

  return <>
    <div className="ui-experience-intro">
      <div>
        <p className="mono ui-experience-kicker">UI EXPERIENCE</p>
        <h2>Choose how your portfolio looks and feels.</h2>
        <p>Three presentation systems. One content system. Your projects, skills, education, certificates and contact data stay intact while the entire visual world changes.</p>
      </div>
      <div className="ui-experience-current"><span>Current Active Experience</span><strong>{UI_EXPERIENCES[active].icon} {UI_EXPERIENCES[active].name}</strong><small>Public visitors see this experience.</small></div>
    </div>

    {error && <div className="ui-experience-error">{error}</div>}

    <div className="ui-experience-grid">
      {(Object.keys(UI_EXPERIENCES) as UIExperienceId[]).map(id => {
        const item = UI_EXPERIENCES[id]
        const isActive = active === id
        const isSelected = selected === id
        return <article key={id} className={`ui-experience-card ui-experience-${id} ${isActive ? 'is-active' : ''} ${isSelected ? 'is-selected' : ''}`}>
          <div className="ui-experience-art"><div className="ui-art-grid" /><div className="ui-art-orb" /><div className="ui-art-label">{item.tagline}</div><div className="ui-art-symbol">{item.icon}</div></div>
          <div className="ui-experience-card-body">
            <div className="ui-experience-title"><div><span className="ui-experience-icon">{item.icon}</span><div><h3>{item.name}</h3><p>{item.keywords.join(' · ')}</p></div></div>{isActive && <span className="ui-active-badge"><Check size={12} /> ACTIVE</span>}</div>
            <p className="ui-experience-description">{item.description}</p>
            <div className="ui-experience-actions"><button type="button" className="admin-secondary" onClick={() => setPreview(id)}><Eye size={13} /> Preview</button><button type="button" className={isSelected ? 'ui-selected-button' : 'admin-primary'} onClick={() => setSelected(id)} disabled={isActive || isSelected}>{isSelected && !isActive ? <Check size={13} /> : <Sparkles size={13} />}{isActive ? 'Active' : isSelected ? 'Selected' : 'Select'}</button></div>
          </div>
        </article>
      })}
    </div>

    {selected !== active && <div className="ui-experience-publish-bar"><div><span>Ready to publish</span><strong>{UI_EXPERIENCES[selected].icon} {UI_EXPERIENCES[selected].name}</strong></div><button type="button" className="admin-primary" onClick={publish} disabled={publishing}>{publishing ? 'Publishing…' : 'Publish Experience'}</button></div>}

    {preview && <div className="ui-preview-backdrop" role="dialog" aria-modal="true" aria-label={`Preview ${UI_EXPERIENCES[preview].name}`}><div className="ui-preview-modal"><header><div><span className="mono">PREVIEW / UI EXPERIENCE</span><h3>{UI_EXPERIENCES[preview].icon} {UI_EXPERIENCES[preview].name}</h3></div><button type="button" className="admin-icon-button" aria-label="Close preview" onClick={() => setPreview(null)}><X size={17} /></button></header><div className="ui-preview-frame"><iframe title={`${UI_EXPERIENCES[preview].name} portfolio preview`} src={`/?ui-preview=${preview}`} /></div><footer><span>This is a non-published preview.</span><button type="button" className="admin-primary" onClick={() => { setSelected(preview); setPreview(null) }}>Use this experience</button></footer></div></div>}
  </>
}
