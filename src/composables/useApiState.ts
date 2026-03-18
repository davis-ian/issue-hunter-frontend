import { ref } from 'vue'
import { ApiError } from '@/api/client'

export function useApiState<T>(initialValue: T) {
  const data = ref<T>(initialValue)
  const loading = ref(false)
  const error = ref('')

  async function run(executor: () => Promise<T>) {
    loading.value = true
    error.value = ''

    try {
      const nextValue = await executor()
      data.value = nextValue
      return nextValue
    } catch (err) {
      if (err instanceof ApiError) {
        error.value = err.message
      } else if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'Something went wrong.'
      }

      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    run,
  }
}
