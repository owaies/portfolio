'use client'

import { useState } from 'react'
import { X, Upload, Image as ImageIcon, Save } from 'lucide-react'

type ProjectRecord = Record<string, unknown> & { id?: string }
type FileMap = Record<string, File | null>

type Props = {
  editing: ProjectRecord
  onClose: () => void
  onSubmit: (formData: FormData, files: FileMap) => Promise<void>
  busy: boolean
}

export default function ProjectForm({ editing, onClose, onSubmit, busy }: Props) {
  const [files, setFiles] = useState<FileMap>({})
  const value = (key: string) => editing[key]
  const setFile = (key: string, file: File | null) => setFiles(prev => ({ ...prev, [key]: file }))

  return (
    <div className="admin-modal-backdrop" role="presentation">
      <div className="project-editor-modal" role="dialog" aria-modal="true" aria-label={`${editing.id ? 'Edit' : 'Add New'} project`}>
        <div className="project-editor-header">
          <div><p className="mono project-editor-kicker">CONTENT EDITOR</p><h3>{editing.id ? 'Edit Project' : 'Add New projects'}</h3></div>
          <button type="button" onClick={onClose} className="admin-icon-button" aria-label="Close editor"><X size={25} /></button>
        </div>

        <form action={fd => onSubmit(fd, files)} className="project-editor-form">
          <input type="hidden" name="table" value="projects" />
          {editing.id && <input type="hidden" name="id" value={editing.id} />}

          <label className="project-field"><span>Title</span><input name="title" defaultValue={String(value('title') ?? '')} /></label>
          <label className="project-field"><span>Slug</span><input name="slug" defaultValue={String(value('slug') ?? '')} /></label>
          <label className="project-field"><span>Short Description</span><textarea name="short_description" defaultValue={String(value('short_description') ?? '')} rows={4} /></label>
          <label className="project-field"><span>Detailed Description</span><textarea name="detailed_description" defaultValue={String(value('detailed_description') ?? '')} rows={5} /></label>
          <label className="project-field"><span>Technologies</span><input name="technologies" defaultValue={Array.isArray(value('technologies')) ? (value('technologies') as string[]).join(', ') : String(value('technologies') ?? '')} placeholder="Python, OpenCV, Supabase" /></label>
          <label className="project-field"><span>Category</span><input name="category" defaultValue={String(value('category') ?? '')} /></label>

          <label className="project-field"><span>Thumbnail</span>
            <div className="project-upload"><input type="file" accept="image/*" onChange={e => setFile('thumbnail', e.target.files?.[0] ?? null)} /><div><ImageIcon size={30}/><strong>{files.thumbnail?.name || 'Click To Upload Image'}</strong><small>JPG, PNG, WEBP And Other Images</small><Upload size={20}/></div></div>
            {value('thumbnail') && !files.thumbnail && <small className="project-current">Current image is kept unless replaced.</small>}
          </label>

          <label className="project-field"><span>Github Url</span><input name="github_url" type="url" defaultValue={String(value('github_url') ?? '')} /></label>
          <label className="project-field"><span>Live Demo Url</span><input name="live_demo_url" type="url" defaultValue={String(value('live_demo_url') ?? '')} /></label>
          <label className="project-check"><input type="checkbox" name="featured" value="true" defaultChecked={value('featured') === true}/><span>featured</span></label>
          <label className="project-field"><span>Display Order</span><input name="display_order" type="number" defaultValue={String(value('display_order') ?? 0)} /></label>
          <label className="project-check"><input type="checkbox" name="published" value="true" defaultChecked={value('published') !== false}/><span>published</span></label>

          <div className="project-editor-actions"><button type="submit" disabled={busy} className="project-save"><Save size={19}/>{busy ? 'Saving…' : 'Save'}</button><button type="button" onClick={onClose} className="project-cancel">Cancel</button></div>
        </form>
      </div>
    </div>
  )
}
