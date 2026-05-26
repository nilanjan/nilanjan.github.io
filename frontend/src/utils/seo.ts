const SITE_TITLE = 'Nilanjan Goswami — Principal Computer Architect'
const SITE_DESCRIPTION =
  'Principal Computer Architect with experience in throughput processor and GPU design, accelerator co-design, and PPA exploration. Production silicon at Apple, Meta, Qualcomm, and Samsung.'

function setMeta(name: string, content: string, property = false): void {
  const attr = property ? 'property' : 'name'
  let element = document.querySelector(`meta[${attr}="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

/** Restore full SEO metadata only after human verification. */
export function applyProtectedSeoMeta(): void {
  document.title = SITE_TITLE
  setMeta('description', SITE_DESCRIPTION)
  setMeta('keywords', 'Computer Architecture, Throughput Processor, GPU Architect, Accelerator Design, Mobile GPU, AR VR Graphics, Hardware Architect, PPA, GEM5, Qualcomm')
  setMeta('og:title', SITE_TITLE, true)
  setMeta('og:description', SITE_DESCRIPTION, true)
  setMeta('twitter:title', SITE_TITLE)
  setMeta('twitter:description', 'Principal Computer Architect — throughput processors, GPU design, and accelerator co-design.')
}

export function removeProtectedSeoMeta(): void {
  document.title = 'Nilanjan Goswami — Portfolio'
  setMeta('description', 'Personal portfolio. JavaScript required. Manual human access only.')
}
