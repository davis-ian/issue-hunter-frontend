export class ApiError extends Error {
  status: number
  validation?: Record<string, string[]>

  constructor(message: string, status: number, validation?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.validation = validation
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

function buildUrl(path: string, query?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined) {
        continue
      }

      url.searchParams.set(key, String(value))
    }
  }

  return API_BASE_URL ? url.toString() : `${url.pathname}${url.search}`
}

function toErrorMessage(status: number, fallback: string) {
  if (status === 404) {
    return 'Requested resource was not found.'
  }

  if (status === 400) {
    return 'Request validation failed.'
  }

  if (status >= 500) {
    return 'Server error. Please try again.'
  }

  return fallback
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  query?: Record<string, string | number | boolean | undefined>
  body?: unknown
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { query, body, headers, ...init } = options
  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? ((await response.json()) as unknown) : await response.text()

  if (!response.ok) {
    if (payload && typeof payload === 'object') {
      const problem = payload as { title?: string; errors?: Record<string, string[]> }
      const message = problem.title || toErrorMessage(response.status, 'Request failed.')
      throw new ApiError(message, response.status, problem.errors)
    }

    const message = typeof payload === 'string' && payload.trim() ? payload : toErrorMessage(response.status, 'Request failed.')
    throw new ApiError(message, response.status)
  }

  return payload as T
}
