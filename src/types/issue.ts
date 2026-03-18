export interface Issue {
  id: number
  githubIssueId: number
  repository: string
  issueNumber: number
  title: string
  url: string
  state: string
  labels: string
  githubCreatedAt: string
  githubUpdatedAt: string
  firstSeenAt: string
  lastSeenAt: string
}

export interface IssuesResponse {
  total: number
  results: Issue[]
}
