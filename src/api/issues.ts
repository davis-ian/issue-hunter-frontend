import { request } from '@/api/client'
import type { IssuesResponse } from '@/types/issue'

export interface ListIssuesParams {
  pageNumber: number
  pageSize: number
  search?: string
}

export function listIssues(params: ListIssuesParams) {
  return request<IssuesResponse>('/api/issues', {
    method: 'GET',
    query: {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      search: params.search,
    },
  })
}
