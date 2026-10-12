export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.status = status;
  }
}

export function apiBase(value = "/api") {
  const base = value.trim().replace(/\/$/, "");
  if (base.startsWith("/") && !base.startsWith("//") && !/[?#]/.test(base))
    return base;
  const url = new URL(base);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  )
    throw new Error("Use an HTTPS API URL or a same-origin path.");
  return base;
}

export async function request(
  path,
  {
    token,
    body,
    signal,
    base = "/api",
    fetcher = fetch,
    responseType = "json",
    method,
  } = {},
) {
  let response;
  const timeout = AbortSignal.timeout(15000);
  try {
    response = await fetcher(`${apiBase(base)}${path}`, {
      method: method || (body === undefined ? "GET" : "POST"),
      headers: {
        Accept: responseType === "text" ? "text/plain" : "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
      cache: "no-store",
      credentials: "omit",
      redirect: "error",
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiError(
      "Unable to reach Tellus. Check your connection and try again.",
    );
  }
  if (!response.ok) {
    const message =
      response.status === 401
        ? "Your session has expired. Please sign in again."
        : response.status === 403
          ? "You do not have access to this service."
          : response.status === 429
            ? "Too many requests. Please wait and try again."
            : response.status === 409
              ? "Stock, price or order status changed. Refresh and review before trying again."
              : response.status === 400
                ? "Check the required fields, quantities, dates and currency."
                : "The service is unavailable. Please try again later.";
    throw new ApiError(message, response.status);
  }
  if (response.status === 204) return null;
  if (responseType === "text") {
    if (!response.headers.get("content-type")?.includes("text/plain"))
      throw new ApiError(
        "The service returned an unexpected response. Please try again later.",
      );
    return await response.text();
  }
  if (!response.headers.get("content-type")?.includes("application/json"))
    throw new ApiError(
      "The service returned an unexpected response. Please try again later.",
    );
  try {
    return await response.json();
  } catch {
    throw new ApiError("The service returned invalid data.");
  }
}

export function parseSession(value) {
  if (
    !value ||
    typeof value.token !== "string" ||
    !value.token ||
    typeof value.email !== "string" ||
    !value.email.includes("@") ||
    !["ROLE_ACHETEUR", "ROLE_AGRICULTEUR", "ROLE_ADMIN"].includes(value.role)
  )
    throw new ApiError(
      "Unable to verify this account. Please contact support.",
    );
  return { token: value.token, email: value.email, role: value.role };
}

export function parseProducts(value) {
  if (!Array.isArray(value))
    throw new ApiError("The catalogue returned invalid data.");
  const ids = new Set();
  return value.map((p) => {
    if (
      !p ||
      typeof p.id !== "string" ||
      !p.id ||
      ids.has(p.id) ||
      typeof p.titre !== "string" ||
      !p.titre.trim() ||
      !Number.isFinite(p.prixAuKg) ||
      p.prixAuKg < 0 ||
      !Number.isFinite(p.quantite) ||
      p.quantite < 0
    )
      throw new ApiError(
        "The catalogue returned incomplete data. Please try again later.",
      );
    ids.add(p.id);
    const date =
      typeof p.dateDisponibilite === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(p.dateDisponibilite) &&
      Number.isFinite(Date.parse(p.dateDisponibilite)) &&
      new Date(p.dateDisponibilite).toISOString().slice(0, 10) ===
        p.dateDisponibilite
        ? p.dateDisponibilite
        : null;
    let photo = null;
    try {
      const url = new URL(p.photoUrl);
      if (url.protocol === "https:" && !url.username && !url.password)
        photo = url.href;
    } catch {
      /* Missing photos use a neutral placeholder. */
    }
    return {
      id: p.id,
      name: p.titre.trim(),
      price: p.prixAuKg,
      stock: p.quantite,
      date,
      label: typeof p.label === "string" ? p.label : "",
      photo,
      status: p.statut,
      currency:
        typeof p.currency === "string" && /^[A-Z]{3}$/.test(p.currency)
          ? p.currency
          : "",
      minimum:
        Number.isFinite(p.minimumKg) && p.minimumKg > 0 ? p.minimumKg : 1,
      pickup: typeof p.pickupLocation === "string" ? p.pickupLocation : "",
      growerId: p.agriculteurId,
      raw: p,
    };
  });
}

export function availability(
  product,
  today = [
    new Date().getFullYear(),
    String(new Date().getMonth() + 1).padStart(2, "0"),
    String(new Date().getDate()).padStart(2, "0"),
  ].join("-"),
) {
  if (product.stock <= 0 || product.status !== "DISPONIBLE")
    return "Unavailable";
  if (product.date && product.date > today) return "Upcoming";
  return "Available now";
}

export function clearLegacyData(storage) {
  for (const key of [
    "role",
    "theme",
    "profile",
    "orders",
    "cart",
    "saved",
    "activity",
    "harvests",
  ])
    storage.removeItem(`tellus.web.v1.${key}`);
}
