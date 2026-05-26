export interface GrantedPatent {
  id: string
  title: string
  patentNumber: string
  grantDate: string
  inventors: string[]
}

export interface PendingPatent {
  id: string
  title: string
  applicationNumber: string
  filingDate: string
  inventors: string[]
}

export interface PatentsData {
  granted: GrantedPatent[]
  pending: PendingPatent[]
  focusAreas: string[]
}

export interface Publication {
  id: string
  title: string
  authors: string[]
  venue: string
  year: number
  type: string
  impact: string
  featured: boolean
  url: string
  doi: string
  keywords: string[]
}

export interface PublicationsData {
  communityLeadership: string[]
  scholarStats: {
    citations: number
    hIndex: number
    i10Index: number
  }
  publications: Publication[]
}
