(() => {
  const MODAL_ID = 'certificate-pdf-viewer'

  const ensureModal = () => {
    let modal = document.getElementById(MODAL_ID)
    if (modal) return modal

    modal = document.createElement('div')
    modal.id = MODAL_ID
    modal.setAttribute('aria-hidden', 'true')
    modal.innerHTML = `
      <div class="certificate-pdf-backdrop" data-certificate-close="true"></div>
      <section class="certificate-pdf-dialog" role="dialog" aria-modal="true" aria-labelledby="certificate-pdf-title">
        <header class="certificate-pdf-header">
          <div class="certificate-pdf-heading">
            <span class="certificate-pdf-kicker">CERTIFICATE / PDF VIEWER</span>
            <h2 id="certificate-pdf-title">Certificate</h2>
            <p id="certificate-pdf-issuer"></p>
          </div>
          <button type="button" class="certificate-pdf-close" data-certificate-close="true" aria-label="Close PDF viewer">×</button>
        </header>
        <div class="certificate-pdf-frame-wrap">
          <div class="certificate-pdf-loading" id="certificate-pdf-loading">Loading certificate…</div>
          <iframe id="certificate-pdf-frame" title="Certificate PDF" loading="eager"></iframe>
        </div>
        <footer class="certificate-pdf-footer">
          <button type="button" class="certificate-pdf-secondary" data-certificate-close="true">Close</button>
          <a id="certificate-pdf-download" class="certificate-pdf-download" href="#" download>
            <span aria-hidden="true">↓</span> Download PDF
          </a>
        </footer>
      </section>
    `

    const style = document.createElement('style')
    style.textContent = `
      #${MODAL_ID}{position:fixed;inset:0;z-index:2147483000;display:none;align-items:center;justify-content:center;padding:16px;box-sizing:border-box}
      #${MODAL_ID}[aria-hidden="false"]{display:flex}
      #${MODAL_ID} .certificate-pdf-backdrop{position:absolute;inset:0;background:rgba(2,5,10,.88);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
      #${MODAL_ID} .certificate-pdf-dialog{position:relative;z-index:1;width:min(1120px,100%);height:min(92dvh,900px);display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(255,255,255,.12);border-radius:24px;background:#07090e;box-shadow:0 30px 100px rgba(0,0,0,.65);color:#e8edf7}
      #${MODAL_ID} .certificate-pdf-header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.09);background:rgba(8,11,18,.96)}
      #${MODAL_ID} .certificate-pdf-heading{min-width:0}
      #${MODAL_ID} .certificate-pdf-kicker{display:block;margin-bottom:5px;font:600 10px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.22em;color:#59d7e8}
      #${MODAL_ID} #certificate-pdf-title{margin:0;font:700 20px/1.25 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #${MODAL_ID} #certificate-pdf-issuer{margin:4px 0 0;color:#8792a7;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #${MODAL_ID} .certificate-pdf-close{width:42px;height:42px;flex:0 0 42px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:rgba(255,255,255,.03);color:#dce4f2;font-size:28px;line-height:1;cursor:pointer}
      #${MODAL_ID} .certificate-pdf-close:hover{background:rgba(255,255,255,.08)}
      #${MODAL_ID} .certificate-pdf-frame-wrap{position:relative;flex:1;min-height:0;background:#151922}
      #${MODAL_ID} #certificate-pdf-frame{display:block;width:100%;height:100%;border:0;background:#fff}
      #${MODAL_ID} .certificate-pdf-loading{position:absolute;inset:0;z-index:0;display:grid;place-items:center;color:#8792a7;font-size:14px;background:#10141c}
      #${MODAL_ID} .certificate-pdf-frame{position:relative;z-index:1}
      #${MODAL_ID} .certificate-pdf-footer{display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid rgba(255,255,255,.09);background:rgba(8,11,18,.96)}
      #${MODAL_ID} .certificate-pdf-footer button,#${MODAL_ID} .certificate-pdf-footer a{min-height:42px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:0 18px;border-radius:12px;font:600 13px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-decoration:none;cursor:pointer;box-sizing:border-box}
      #${MODAL_ID} .certificate-pdf-secondary{border:1px solid rgba(255,255,255,.12);background:transparent;color:#c5cede}
      #${MODAL_ID} .certificate-pdf-download{border:1px solid rgba(55,214,232,.45);background:#16c7d8;color:#031116}
      #${MODAL_ID} .certificate-pdf-download:hover{background:#2bd5e4}
      body.certificate-pdf-open{overflow:hidden}
      @media(max-width:640px){
        #${MODAL_ID}{padding:0}
        #${MODAL_ID} .certificate-pdf-dialog{width:100%;height:100dvh;border:0;border-radius:0}
        #${MODAL_ID} .certificate-pdf-header{padding:14px 15px}
        #${MODAL_ID} #certificate-pdf-title{font-size:17px}
        #${MODAL_ID} .certificate-pdf-footer{padding:12px 15px;padding-bottom:max(12px,env(safe-area-inset-bottom));display:grid;grid-template-columns:1fr 1.35fr}
        #${MODAL_ID} .certificate-pdf-footer button,#${MODAL_ID} .certificate-pdf-footer a{width:100%}
      }
    `
    document.head.appendChild(style)
    document.body.appendChild(modal)

    modal.addEventListener('click', (event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      if (target.closest('[data-certificate-close="true"]')) closeModal()
    })

    modal.querySelector('#certificate-pdf-frame')?.addEventListener('load', () => {
      const loading = modal.querySelector('#certificate-pdf-loading')
      if (loading instanceof HTMLElement) loading.style.display = 'none'
    })

    return modal
  }

  const openModal = (viewHref, downloadHref, title, issuer) => {
    const modal = ensureModal()
    const frame = modal.querySelector('#certificate-pdf-frame')
    const loading = modal.querySelector('#certificate-pdf-loading')
    const titleEl = modal.querySelector('#certificate-pdf-title')
    const issuerEl = modal.querySelector('#certificate-pdf-issuer')
    const download = modal.querySelector('#certificate-pdf-download')

    if (titleEl) titleEl.textContent = title || 'Certificate'
    if (issuerEl) {
      issuerEl.textContent = issuer || ''
      issuerEl.style.display = issuer ? '' : 'none'
    }
    if (loading instanceof HTMLElement) loading.style.display = 'grid'
    if (frame instanceof HTMLIFrameElement) {
      frame.src = viewHref
    }
    if (download instanceof HTMLAnchorElement) {
      download.href = downloadHref
      download.target = '_self'
      download.removeAttribute('rel')
    }

    modal.setAttribute('aria-hidden', 'false')
    document.body.classList.add('certificate-pdf-open')
    const closeButton = modal.querySelector('.certificate-pdf-close')
    if (closeButton instanceof HTMLElement) closeButton.focus()
  }

  const closeModal = () => {
    const modal = document.getElementById(MODAL_ID)
    if (!modal) return
    modal.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('certificate-pdf-open')
    const frame = modal.querySelector('#certificate-pdf-frame')
    if (frame instanceof HTMLIFrameElement) frame.src = 'about:blank'
  }

  const prepareCertificates = () => {
    document.querySelectorAll('.target-certificate-card').forEach((card) => {
      const view = Array.from(card.querySelectorAll('a')).find((link) => link.textContent?.toLowerCase().includes('view pdf'))
      const download = Array.from(card.querySelectorAll('a')).find((link) => link.textContent?.toLowerCase().includes('download'))
      if (!view || !download) return

      const viewHref = view.getAttribute('href') || ''
      if (!viewHref) return
      const downloadHref = download.getAttribute('href') || `${viewHref}${viewHref.includes('?') ? '&' : '?'}download=1`

      view.dataset.certificateView = viewHref
      view.dataset.certificateDownload = downloadHref
      view.removeAttribute('target')
      view.removeAttribute('rel')
      download.target = '_self'
      download.removeAttribute('rel')
    })
  }

  const handleView = (event) => {
    const target = event.target
    if (!(target instanceof Element)) return
    const view = target.closest('a[data-certificate-view]')
    if (!(view instanceof HTMLAnchorElement)) return

    const card = view.closest('.target-certificate-card')
    if (!card) return

    event.preventDefault()
    const title = card.querySelector('h3')?.textContent?.trim() || 'Certificate'
    const issuer = card.querySelector('.target-certificate-meta span')?.textContent?.trim() || ''
    const viewHref = view.dataset.certificateView || view.href
    const downloadHref = view.dataset.certificateDownload || `${viewHref}${viewHref.includes('?') ? '&' : '?'}download=1`
    openModal(viewHref, downloadHref, title, issuer)
  }

  document.addEventListener('click', handleView)
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal()
  })

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', prepareCertificates, { once: true })
  } else {
    prepareCertificates()
  }

  const observer = new MutationObserver(prepareCertificates)
  observer.observe(document.body, { childList: true, subtree: true })
})()
