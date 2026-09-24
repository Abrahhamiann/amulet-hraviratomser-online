// Single source of truth for every environment-dependent URL in the admin panel.
// Production values come from admin/.env; development always uses local services.

const env = (import.meta as any).env ?? {};

const trimTrailingSlash = (value: unknown) => String(value ?? "").trim().replace(/\/+$/, "");

const read = (key: string, fallback = "") => {
  const value = env[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
};

// REST API root (https://server.amulet.am/api).
export const API_URL = (() => {
  // The checked-in deployment .env points at production. A local Vite session
  // must use the local API so cookies and CORS stay on the same site.
  if (env.MODE === "development") {
    const origin = typeof window !== "undefined" && window.location?.hostname
      ? `${window.location.protocol}//${window.location.hostname}`
      : "http://localhost";
    return `${origin}:5000/api`;
  }
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

export const apiAssetUrl = (value = "") => {
  const source = String(value || "").trim();
  if (!source || /^(?:https?:|data:|asset:)/i.test(source)) return source;
  if (!source.startsWith("/media/")) return source;
  try {
    return new URL(source, API_URL.replace(/\/api\/?$/, "/")).toString();
  } catch {
    return source;
  }
};

// Public site the admin links to (https://amulet.am).
export const CLIENT_URL = (() => {
  if (env.MODE === "development") {
    const origin = typeof window !== "undefined" && window.location?.hostname
      ? `${window.location.protocol}//${window.location.hostname}`
      : "http://localhost";
    return `${origin}:5173`;
  }
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
