type Params = Record<string, string | number | boolean | undefined>

function buildUrlWithParams(url: string, params?: Params): string {
  if (!params) {
    return url
  }

  const urlObj = new URL(url)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      urlObj.searchParams.append(key, String(value))
    }
  })

  return urlObj.toString()
}

export async function apiWrapper<T = any>(
  url: string,
  method: string,
  body?: object,
  options?: RequestInit,
  params?: Params,
): Promise<T> {
  try {
    const defaultOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }

    if (options) {
      options.headers = {
        ...defaultOptions.headers,
        ...options.headers,
      }
    }

    const mergedOptions = { ...defaultOptions, ...options }

    if (body) {
      mergedOptions.body = JSON.stringify(body)
    }

    const finalUrl = buildUrlWithParams(url, params)

    const response = await fetch(finalUrl, mergedOptions)

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    console.error("An error occurred:", error)
    throw error
  }
}

export async function get<T = any>(
  url: string,
  options?: RequestInit,
  params?: Params,
): Promise<T> {
  return await apiWrapper<T>(url, "GET", undefined, options, params)
}

export async function post<T = any>(
  url: string,
  body: object,
  options?: RequestInit,
  params?: Params,
): Promise<T> {
  return await apiWrapper<T>(url, "POST", body, options, params)
}

export async function put<T = any>(
  url: string,
  body: object,
  options?: RequestInit,
  params?: Params,
): Promise<T> {
  return await apiWrapper<T>(url, "PUT", body, options, params)
}

export async function del<T = any>(
  url: string,
  options?: RequestInit,
  params?: Params,
): Promise<T> {
  return await apiWrapper<T>(url, "DELETE", undefined, options, params)
}

export async function options<T = any>(
  url: string,
  options?: RequestInit,
  params?: Params,
): Promise<T> {
  return await apiWrapper<T>(url, "OPTIONS", undefined, options, params)
}

export default {
  get,
  post,
  put,
  del,
  options,
}
