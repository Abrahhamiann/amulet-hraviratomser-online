// Single source of truth for every environment-dependent URL in the admin panel.
// Change values in admin/.env only — never hardcode a host elsewhere.

const env = (import.meta as any).env ?? {};

const trimTrailingSlash = (value: unknown) => String(value ?? "").trim().replace(/\/+$/, "");

const read = (key: string, fallback = "") => {
  const value = env[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
};

// REST API root (https://server.amulet.am/api).
export const API_URL = (() => {
  const configured = trimTrailingSlash(read("VITE_API_URL"));
  if (configured) {
    try {
      const apiUrl = new URL(configured);
      const pageHost = typeof window !== "undefined" ? window.location.hostname : "";
      const isLoopbackApi = ["localhost", "127.0.0.1", "::1"].includes(apiUrl.hostname);
      // Dev only: reach the API through whichever host the page was opened with.
      if (isLoopbackApi && pageHost) {
        apiUrl.hostname = pageHost;
        return trimTrailingSlash(apiUrl.toString());
      }
    } catch {
      return configured;
    }
    return configured;
  }

  if (typeof window !== "undefined" && window.location?.hostname) {
    return `${window.location.protocol}//${window.location.hostname}:5000/api`;
  }
  return "http://127.0.0.1:5000/api";
})();

// Public site the admin links to (https://amulet.am).
export const CLIENT_URL = (() => {
  const configured = trimTrailingSlash(read("VITE_CLIENT_URL"));
  if (configured) return configured;
  if (typeof window !== "undefined" && window.location?.hostname) {
    return `${window.location.protocol}//${window.location.hostname}:5173`;
  }
  return "http://localhost:5173";
})();

// Absolute link to a page of the public site: clientLink('/invite/abc').
export const clientLink = (path = "") => {
  const suffix = String(path || "");
  if (!suffix) return CLIENT_URL;
  return `${CLIENT_URL}${suffix.startsWith("/") ? "" : "/"}${suffix}`;
};
