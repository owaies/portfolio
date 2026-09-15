(() => {
  const init = () => {
    document.querySelectorAll('body[data-ui-experience="obsidian-forge"] .target-certificate-card').forEach((card) => {
      if (card.dataset.chromaBound === 'true') return
      card.dataset.chromaBound = 'true'
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect()
        card.style.setProperty('--certificate-mouse-x', `${event.clientX - rect.left}px`)
        card.style.setProperty('--certificate-mouse-y', `${event.clientY - rect.top}px`)
      }, { passive: true })
    })
  }
  init()
  new MutationObserver(init).observe(document.body, { childList: true, subtree: true })
})()
