const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const defaultHeaders = {
  "Content-Type": "application/json",
};

async function apiRequest(path, options = {}) {
  const { method = "GET", body, headers = {}, ...rest } = options;
  const config = {
    method,
    credentials: "include",
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...rest,
  };

  if (body !== undefined) {
    config.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, config);
  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    if (typeof data === "string") {
      throw new Error(data || response.statusText);
    }

    if (data && typeof data === "object") {
      const message = data.message || data.error || JSON.stringify(data);
      throw new Error(message);
    }

    throw new Error(response.statusText);
  }

  return data;
}

export const get = (path) => apiRequest(path, { method: "GET" });
export const post = (path, body) => apiRequest(path, { method: "POST", body });
export const put = (path, body) => apiRequest(path, { method: "PUT", body });
export const del = (path) => apiRequest(path, { method: "DELETE" });
