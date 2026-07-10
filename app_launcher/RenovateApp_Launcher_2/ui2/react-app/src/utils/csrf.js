export function getCsrfToken() {
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export async function ensureCsrfCookie() {
  try {
    await fetch('/login/', { credentials: 'include' });
  } catch {
    // Django may be offline during static UI work.
  }
}
