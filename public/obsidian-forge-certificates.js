(() => {
  const bind = () => {
    document.querySelectorAll('body[data-ui-experience="obsidian-forge"] .target-certificate-card').forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect()
        card.style.setProperty('--certificate-mouse-x', `${event.clientX - rect.left}px`)
        card.style.setProperty('--certificate-mouse-y', `${event.clientY - rect.top}px`)
      }, { passive: true })
    })
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true })
  else bind()
})()
