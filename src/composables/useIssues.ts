import { computed, ref } from 'vue'
import { listIssues } from '@/api/issues'
import { useApiState } from '@/composables/useApiState'
import type { IssuesResponse } from '@/types/issue'

interface UseIssuesOptions {
  initialPageNumber?: number
  initialPageSize?: number
  initialSearch?: string
}

export function useIssues(options: UseIssuesOptions = {}) {
  const state = useApiState<IssuesResponse>({ total: 0, results: [] })

  const pageNumber = ref(options.initialPageNumber ?? 0)
  const pageSize = ref(options.initialPageSize ?? 20)
  const search = ref(options.initialSearch ?? '')

  const issues = computed(() => state.data.value.results)
  const total = computed(() => state.data.value.total)
  const maxPage = computed(() => Math.max(0, Math.ceil(total.value / pageSize.value) - 1))

  async function fetchIssues() {
    const response = await state.run(() =>
      listIssues({
        pageNumber: pageNumber.value,
        pageSize: pageSize.value,
        search: search.value || undefined,
      }),
    )

    console.log('issues response', response)
    console.log('issues total', response.total)
    console.table(response.results)
  }

  async function applySearch(value?: string) {
    if (value !== undefined) {
      search.value = value
    }

    pageNumber.value = 0
    await fetchIssues()
  }

  async function nextPage() {
    pageNumber.value = Math.min(pageNumber.value + 1, maxPage.value)
    await fetchIssues()
  }

  async function previousPage() {
    pageNumber.value = Math.max(pageNumber.value - 1, 0)
    await fetchIssues()
  }

  return {
    issues,
    total,
    pageNumber,
    pageSize,
    search,
    maxPage,
    loading: state.loading,
    error: state.error,
    fetchIssues,
    applySearch,
    nextPage,
    previousPage,
  }
}
