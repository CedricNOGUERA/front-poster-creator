export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const token = sessionStorage.getItem('token');
  const headers = new Headers(init?.headers);

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  // If init.body is an instance of FormData, let the browser set Content-Type.
  // Otherwise, if a Content-Type is provided in init.headers, it will be used.
  // If no Content-Type is provided for non-FormData, it defaults based on body type (e.g., application/json for JSON.stringify).
  if (init?.body instanceof FormData) {
    headers.delete('Content-Type');
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    sessionStorage.removeItem('token');
    // Consider a more global way to alert and redirect if needed,
    // for now, throwing an error is the most flexible for SPA components to handle.
    // alert('Votre session a expiré. Veuillez vous reconnecter.'); // Avoid direct alert in a service
    // window.location.href = '/login'; // Avoid direct navigation in a service for SPAs
    throw new AuthError('Votre session a expiré. Veuillez vous reconnecter.');
  }

  return response;
} 