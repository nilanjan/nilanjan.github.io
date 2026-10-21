const SITE_TITLE = 'Nilanjan Goswami — Principal Computer Architect'
const SITE_DESCRIPTION =
  'Principal Computer Architect: algorithm–architecture co-design for AI accelerators and GPU compute — transformer inference analysis, low-precision numerics, compute and memory architecture, GPU performance analysis, and PPA modeling. 13+ years of GPU and AI-compute silicon at Qualcomm, Meta, Samsung, and Apple.'

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
  setMeta('keywords', 'Principal Computer Architect, AI Chip Architect, AI Accelerator Architecture, ML Hardware, HW/SW Co-Design, Algorithm-Architecture Co-Design, LLM Inference, Quantization, FP8, MXFP, GPU Compute, On-Device Inference, Vision Transformers, Neural Rendering, PPA Modeling, Roofline, Computer Architecture, GPU Performance Analysis, Performance Modeling, CUDA, GPGPU, OpenMP, Parallel Programming, Inference Optimization, Workload Characterization')
  setMeta('og:title', SITE_TITLE, true)
  setMeta('og:description', SITE_DESCRIPTION, true)
}

export function removeProtectedSeoMeta(): void {
  document.title = SITE_TITLE
  setMeta('description', SITE_DESCRIPTION)
}
