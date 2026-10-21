import { describe, expect, it } from 'vitest'
import patentsData from './patents.json'
import publicationsData from './publications.json'
import type { PatentsData, PublicationsData } from './types'

const { granted, pending, published } = patentsData as PatentsData
const { publications } = publicationsData as PublicationsData

const duplicates = (values: string[]) => values.filter((v, i) => values.indexOf(v) !== i)
const compact = (s: string) => s.toLowerCase().replace(/[^0-9a-z]/g, '')

describe('patents.json', () => {
  const all = [...granted, ...pending, ...published]

  it('has no duplicate titles across granted, pending and published', () => {
    expect(duplicates(all.map((p) => compact(p.title)))).toEqual([])
  })

  it('has no duplicate patent, application or publication numbers', () => {
    const numbers = [
      ...granted.map((p) => p.patentNumber),
      ...pending.flatMap((p) => [p.applicationNumber, p.publicationNumber ?? '']),
      ...published.map((p) => p.publicationNumber),
    ].filter(Boolean).map(compact)
    expect(duplicates(numbers)).toEqual([])
  })
})

describe('publications.json', () => {
  // ponytail: offline shape check only; title-vs-DOI correctness was verified against Crossref by hand.
  it('links every paper to its own DOI (or arXiv)', () => {
    for (const p of publications) {
      if (p.url.startsWith('https://arxiv.org/abs/')) continue
      expect(p.url, p.id).toBe(`https://doi.org/${p.doi}`)
    }
  })

  it('has no duplicate links', () => {
    expect(duplicates(publications.map((p) => p.url.toLowerCase()))).toEqual([])
  })
})
