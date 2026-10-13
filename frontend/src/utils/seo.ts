const SITE_TITLE = 'Nilanjan Goswami — AI Chip Architect'
const SITE_DESCRIPTION =
  'AI chip architect: algorithm–architecture co-design for AI accelerators — transformer inference analysis, low-precision numerics, compute and memory architecture, and PPA modeling. 13+ years of GPU and AI-compute silicon at Qualcomm, Meta, Samsung, and Apple.'

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
  setMeta('keywords', 'AI Chip Architect, AI Accelerator Architecture, ML Hardware, HW/SW Co-Design, Algorithm-Architecture Co-Design, LLM Inference, Quantization, FP8, MXFP, GPU Compute, Neural Rendering, PPA Modeling, Roofline, Computer Architecture')
  setMeta('og:title', SITE_TITLE, true)
  setMeta('og:description', SITE_DESCRIPTION, true)
}

export function removeProtectedSeoMeta(): void {
  document.title = SITE_TITLE
  setMeta('description', SITE_DESCRIPTION)
}
