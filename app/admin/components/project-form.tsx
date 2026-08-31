'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { X, Save } from 'lucide-react'
import type { Project } from '@/types/portfolio'

type ProjectDraft = Partial<Project> & { id?: string }
type ProjectField = 'title' | 'description' | 'tag' | 'deployment_type' | 'github_url' | 'tag_color' | 'icon' | 'accent_color' | 'technologies' | 'display_order'
type Props = {
  editing: ProjectDraft
  onClose: () => void
  onSubmit: (formData: FormData) => Promise<void>
  busy: boolean
}

const ICONS: NonNullable<Project['icon']>[] = ['Eye', 'Layers', 'Monitor', 'HelpCircle', 'Scissors', 'Code', 'Cpu', 'Boxes', 'Database']
const DEPLOYMENT_TYPES: NonNullable<Project['deployment_type']>[] = ['deployed', 'local']
const TAG_COLORS: NonNullable<Project['tag_color']>[] = ['green', 'blue', 'yellow']

const isHexColor = (value: string) => /^#[0-9A-Fa-f]{6}$/.test(value)

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export default function ProjectForm({ editing, onClose, onSubmit, busy }: Props) {
  const [title, setTitle] = useState(String(editing.title ?? ''))
  const [description, setDescription] = useState(String(editing.detailed_description ?? editing.short_description ?? ''))
  const [tag, setTag] = useState(String(editing.tag ?? 'Project'))
  const [deploymentType, setDeploymentType] = useState<NonNullable<Project['deployment_type']>>(editing.deployment_type ?? 'local')
  const [githubUrl, setGithubUrl] = useState(String(editing.github_url ?? ''))
  const [tagColor, setTagColor] = useState<Project['tag_color']>(editing.tag_color ?? null)
  const [icon, setIcon] = useState<Project['icon']>(editing.icon ?? null)
  const [accentColor, setAccentColor] = useState(editing.accent_color ?? '#00d4ff')
  const [technologies, setTechnologies] = useState(Array.isArray(editing.technologies) ? editing.technologies.join(', ') : '')
  const [displayOrder, setDisplayOrder] = useState(String(editing.display_order ?? 0))
  const [errors, setErrors] = useState<Partial<Record<ProjectField, string>>>({})
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [busy, onClose])

  const validate = () => {
    const next: Partial<Record<ProjectField, string>> = {}
    if (!title.trim()) next.title = 'Title is required.'
    if (!description.trim()) next.description = 'Description is required.'
    if (githubUrl.trim()) {
      try {
        const url = new URL(githubUrl.trim())
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error()
      } catch {
        next.github_url = 'Enter a valid HTTP or HTTPS URL.'
      }
    }
    if (!DEPLOYMENT_TYPES.includes(deploymentType)) next.deployment_type = 'Select deployed or local.'
    if (tagColor !== null && !TAG_COLORS.includes(tagColor)) next.tag_color = 'Select green, blue, or yellow.'
    if (icon !== null && !ICONS.includes(icon)) next.icon = 'Select one of the supported icons.'
    if (!isHexColor(accentColor)) next.accent_color = 'Use a 6-digit hexadecimal color such as #00d4ff.'
    const order = Number(displayOrder)
    if (!Number.isInteger(order) || order < 0) next.display_order = 'Display Order must be an integer greater than or equal to 0.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError('')
    if (!validate()) return

    const formData = new FormData()
    formData.set('table', 'projects')
    if (editing.id) formData.set('id', editing.id)
    formData.set('title', title.trim())
    formData.set('slug', editing.slug ?? slugify(title))
    formData.set('detailed_description', description.trim())
    formData.set('tag', tag.trim() || 'Project')
    formData.set('deployment_type', deploymentType)
    formData.set('github_url', githubUrl.trim())
    formData.set('tag_color', tagColor ?? '')
    formData.set('icon', icon ?? '')
    formData.set('accent_color', accentColor.toLowerCase())
    formData.set('technologies', technologies)
    formData.set('display_order', displayOrder)

    try {
      await onSubmit(formData)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to save project.')
    }
  }

  const fieldError = (field: ProjectField) => errors[field]

  return (
    <div className="admin-modal-backdrop project-modal-backdrop" role="presentation">
      <div
        className="project-editor-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-editor-title"
        onClick={event => event.stopPropagation()}
      >
        <div className="project-editor-header">
          <h3 id="project-editor-title">{editing.id ? 'Edit Project' : 'Add New Projects'}</h3>
          <button type="button" onClick={onClose} className="admin-icon-button" aria-label="Close project editor" disabled={busy}>
            <X size={25} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="project-editor-form" noValidate>
          <input type="hidden" name="slug" value={editing.slug ?? ''} readOnly />

          <label className="project-field">
            <span>Title</span>
            <input name="title" value={title} onChange={event => setTitle(event.target.value)} placeholder="Title" required autoFocus />
            {fieldError('title') && <small className="project-field-error">{fieldError('title')}</small>}
          </label>

          <label className="project-field">
            <span>Description</span>
            <textarea name="detailed_description" value={description} onChange={event => setDescription(event.target.value)} placeholder="Description" rows={5} required />
            {fieldError('description') && <small className="project-field-error">{fieldError('description')}</small>}
          </label>

          <label className="project-field">
            <span>Tag</span>
            <input name="tag" value={tag} onChange={event => setTag(event.target.value)} placeholder="Project" />
          </label>

          <label className="project-field">
            <span>Deployment Type</span>
            <select name="deployment_type" value={deploymentType} onChange={event => setDeploymentType(event.target.value as NonNullable<Project['deployment_type']>)}>
              <option value="local">local</option>
              <option value="deployed">deployed</option>
            </select>
            {fieldError('deployment_type') && <small className="project-field-error">{fieldError('deployment_type')}</small>}
          </label>

          <label className="project-field">
            <span>GitHub URL</span>
            <input name="github_url" type="url" value={githubUrl} onChange={event => setGithubUrl(event.target.value)} placeholder="GitHub URL" inputMode="url" />
            {fieldError('github_url') && <small className="project-field-error">{fieldError('github_url')}</small>}
          </label>

          <label className="project-field">
            <span>Tag Color</span>
            <select name="tag_color" value={tagColor ?? ''} onChange={event => setTagColor((event.target.value || null) as Project['tag_color'])}>
              <option value="">Select...</option>
              <option value="green">green</option>
              <option value="blue">blue</option>
              <option value="yellow">yellow</option>
            </select>
            {fieldError('tag_color') && <small className="project-field-error">{fieldError('tag_color')}</small>}
          </label>

          <label className="project-field">
            <span>Icon (Eye, Layers, Monitor, HelpCircle, Scissors, Code, Cpu, Boxes, Database)</span>
            <input name="icon" value={icon ?? ''} onChange={event => setIcon((event.target.value || null) as Project['icon'])} placeholder="Icon (Eye, Layers, Monitor, HelpCircle, Scissors, Code, Cpu, Boxes, Database)" list="project-icon-options" />
            <datalist id="project-icon-options">
              {ICONS.map(item => <option key={item} value={item} />)}
            </datalist>
            {fieldError('icon') && <small className="project-field-error">{fieldError('icon')}</small>}
          </label>

          <label className="project-field">
            <span>Accent Color</span>
            <div className="project-color-row">
              <input
                className="project-color-picker"
                type="color"
                value={isHexColor(accentColor) ? accentColor : '#00d4ff'}
                onChange={event => setAccentColor(event.target.value)}
                aria-label="Choose accent color"
              />
              <input
                className="project-color-text"
                name="accent_color"
                value={accentColor}
                onChange={event => setAccentColor(event.target.value)}
                placeholder="#00d4ff"
                spellCheck={false}
              />
            </div>
            {fieldError('accent_color') && <small className="project-field-error">{fieldError('accent_color')}</small>}
          </label>

          <label className="project-field">
            <span>Tech Stack (comma-separated)</span>
            <input name="technologies" value={technologies} onChange={event => setTechnologies(event.target.value)} placeholder="comma, separated, values" />
          </label>

          <label className="project-field">
            <span>Display Order</span>
            <input name="display_order" type="number" min={0} step={1} value={displayOrder} onChange={event => setDisplayOrder(event.target.value)} />
            {fieldError('display_order') && <small className="project-field-error">{fieldError('display_order')}</small>}
          </label>

          {submitError && <div className="project-submit-error" role="alert">{submitError}</div>}

          <div className="project-editor-actions">
            <button type="button" onClick={onClose} className="project-cancel" disabled={busy}>Cancel</button>
            <button type="submit" disabled={busy} className="project-save">
              <Save size={19} />
              {busy ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
