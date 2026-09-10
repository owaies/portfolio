(() => {
  const certificatePath = (href) => {
    try {
      const url = new URL(href, window.location.origin)
      const marker = '/storage/v1/object/public/certificates/'
      const markerIndex = url.pathname.indexOf(marker)
      if (markerIndex >= 0) return decodeURIComponent(url.pathname.slice(markerIndex + marker.length))
      const pathname = decodeURIComponent(url.pathname.replace(/^\/+/, ''))
      return pathname.startsWith('certificates/') ? pathname : ''
    } catch {
      return ''
    }
  }

  const wireCertificates = () => {
    document.querySelectorAll('.target-certificate-card').forEach((card) => {
      const links = Array.from(card.querySelectorAll('a'))
      const download = links.find((link) => link.textContent?.toLowerCase().includes('download'))
      if (!download) return

      const path = certificatePath(download.getAttribute('href') || '')
      if (!path) return

      const viewHref = `/api/certificate?path=${encodeURIComponent(path)}`
      const downloadHref = `${viewHref}&download=1`
      download.href = downloadHref
      download.target = '_self'
      download.removeAttribute('rel')

      let view = links.find((link) => link.textContent?.toLowerCase().includes('view pdf'))
      if (view) {
        view.href = viewHref
        view.target = '_blank'
        view.rel = 'noreferrer'
      } else {
        view = document.createElement('a')
        view.href = viewHref
        view.target = '_blank'
        view.rel = 'noreferrer'
        view.innerHTML = '<span aria-hidden="true">↗</span> View PDF'
        download.parentElement?.insertBefore(view, download)
      }
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireCertificates, { once: true })
  } else {
    wireCertificates()
  }

  const observer = new MutationObserver(wireCertificates)
  observer.observe(document.body, { childList: true, subtree: true })
})()
