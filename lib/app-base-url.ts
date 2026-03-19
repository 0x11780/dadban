/**
 * Origin for same-origin API calls. In the browser we always use the page origin.
 * On the server, `NEXT_PUBLIC_APP_URL` is often `https://…` (public URL). Using that
 * for `fetch` from inside the container can trigger TLS to a peer that only speaks
 * plain HTTP (e.g. internal service or misrouted connection), causing
 * `ERR_SSL_PACKET_LENGTH_TOO_LONG`. Prefer loopback HTTP to this Next process.
 */
export function getServerSideAppOrigin(): string {
  if (process.env.INTERNAL_APP_URL) return process.env.INTERNAL_APP_URL;
  const port = process.env.PORT || "3000";
  return `http://127.0.0.1:${port}`;
}

export function getAppBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return getServerSideAppOrigin();
}
