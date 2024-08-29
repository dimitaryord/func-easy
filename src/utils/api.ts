export async function apiWrapper<T = any>(
  url: string,
  method: string,
  body?: object,
  options?: RequestInit,
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

    const response = await fetch(url, mergedOptions)

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
): Promise<T> {
  return await apiWrapper<T>(url, "GET", undefined, options)
}

export async function post<T = any>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  return await apiWrapper<T>(url, "POST", undefined, options)
}

export async function put<T = any>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  return await apiWrapper<T>(url, "PUT", undefined, options)
}

export async function del<T = any>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  return await apiWrapper<T>(url, "DELETE", undefined, options)
}

export async function options<T = any>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  return await apiWrapper<T>(url, "OPTIONS", undefined, options)
}

export default {
  get,
  post,
  put,
  delete: del,
  options,
}
