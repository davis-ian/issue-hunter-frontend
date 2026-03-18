import { request } from '@/api/client'
import type { SearchProfile, SearchProfilePayload } from '@/types/search'

export function listSearches() {
  return request<SearchProfile[]>('/api/searches', {
    method: 'GET',
  })
}

export function getSearchById(id: number) {
  return request<SearchProfile>(`/api/searches/${id}`, {
    method: 'GET',
  })
}

export function createSearch(payload: SearchProfilePayload) {
  return request<SearchProfile>('/api/searches', {
    method: 'POST',
    body: payload,
  })
}

export function updateSearch(id: number, payload: SearchProfilePayload) {
  return request<SearchProfile>(`/api/searches/${id}`, {
    method: 'PUT',
    body: payload,
  })
}
