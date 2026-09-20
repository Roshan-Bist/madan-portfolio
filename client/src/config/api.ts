/** Base URL for the backend API (no trailing slash). Example: http://localhost:3004 */
export const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '';

/** Resolve uploaded/static asset paths against the API origin. */
export function assetUrl(path?: string | null): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
