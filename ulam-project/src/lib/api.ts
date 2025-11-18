export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  window.location.origin + "/api";

/**
 * Helper to build full API URLs.
 * Example: buildApiUrl("/provinces/1")
 */
export function buildApiUrl(path: string): string {
  if (path.startsWith("http")) return path;
  if (!path.startsWith("/")) path = "/" + path;
  return `${API_BASE_URL}${path}`;
}
