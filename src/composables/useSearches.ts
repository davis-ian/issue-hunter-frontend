import { ref } from 'vue'
import { createSearch, listSearches, updateSearch } from '@/api/searches'
import { ApiError } from '@/api/client'
import { useApiState } from '@/composables/useApiState'
import type { SearchProfile, SearchProfilePayload } from '@/types/search'

export function useSearches() {
  const state = useApiState<SearchProfile[]>([])
  const saving = ref(false)
  const validationErrors = ref<Record<string, string[]>>({})

  async function fetchSearches() {
    await state.run(() => listSearches())
  }

  async function saveSearch(payload: SearchProfilePayload, id?: number) {
    saving.value = true
    validationErrors.value = {}
    state.error.value = ''

    try {
      if (id === undefined) {
        await createSearch(payload)
      } else {
        await updateSearch(id, payload)
      }

      await fetchSearches()
    } catch (err) {
      if (err instanceof ApiError && err.validation) {
        validationErrors.value = Object.fromEntries(
          Object.entries(err.validation).map(([key, value]) => [key.charAt(0).toLowerCase() + key.slice(1), value]),
        )
      }

      throw err
    } finally {
      saving.value = false
    }
  }

  return {
    profiles: state.data,
    loading: state.loading,
    error: state.error,
    saving,
    validationErrors,
    fetchSearches,
    saveSearch,
  }
}
