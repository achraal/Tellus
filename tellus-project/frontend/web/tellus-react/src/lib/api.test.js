import test from "node:test";
import assert from "node:assert/strict";
import {
  apiBase,
  request,
  parseSession,
  parseProducts,
  availability,
  clearLegacyData,
} from "./api.js";

const listing = {
  id: "test-product",
  titre: "Test produce",
  prixAuKg: 2,
  quantite: 15,
  statut: "DISPONIBLE",
};

test("registration supports the Spring plain-text success contract", async () => {
  const result = await request("/auth/register", {
    responseType: "text",
    body: {
      nom: "Test User",
      email: "test@example.test",
      password: "test-password-only",
      role: "ROLE_ACHETEUR",
    },
    fetcher: async (_url, options) => {
      assert.equal(options.headers.Accept, "text/plain");
      assert.equal(options.headers.Authorization, undefined);
      return new Response("Account created", {
        headers: { "content-type": "text/plain;charset=UTF-8" },
      });
    },
  });
  assert.equal(result, "Account created");
});

test("registration rejects HTML fallback and duplicate responses", async () => {
  await assert.rejects(
    request("/auth/register", {
      responseType: "text",
      body: {},
      fetcher: async () =>
        new Response("<html>fallback</html>", {
          headers: { "content-type": "text/html" },
        }),
    }),
    /unexpected response/,
  );
  await assert.rejects(
    request("/auth/register", {
      responseType: "text",
      body: {},
      fetcher: async () => new Response("Duplicate", { status: 409 }),
    }),
    (e) => e.status === 409,
  );
});
test("API addresses require same-origin paths or HTTPS", () => {
  assert.equal(apiBase("/api/"), "/api");
  assert.equal(
    apiBase("https://api.example.test/api"),
    "https://api.example.test/api",
  );
  for (const value of [
    "http://example.test",
    "//example.test",
    "https://user:password@example.test",
    "https://example.test?token=abc",
  ])
    assert.throws(() => apiBase(value));
});
test("login requests send JSON without persistent cookies", async () => {
  let captured;
  await request("/auth/login", {
    body: { email: "test@example.test", password: "test" },
    fetcher: async (url, options) => {
      captured = { url, ...options };
      return Response.json({});
    },
  });
  assert.equal(captured.url, "/api/auth/login");
  assert.equal(captured.method, "POST");
  assert.equal(captured.credentials, "omit");
  assert.equal(captured.headers.Authorization, undefined);
  assert.equal(JSON.parse(captured.body).email, "test@example.test");
});
test("authenticated reads carry a bearer token and bypass caches", async () => {
  await request("/produits", {
    token: "test-token",
    fetcher: async (_url, options) => {
      assert.equal(options.headers.Authorization, "Bearer test-token");
      assert.equal(options.cache, "no-store");
      assert.equal(options.redirect, "error");
      return Response.json([]);
    },
  });
});
test("HTTP failures preserve status without showing raw server content", async () => {
  for (const status of [401, 403, 429, 500])
    await assert.rejects(
      request("/produits", {
        fetcher: async () => new Response("private server stack", { status }),
      }),
      (e) => e.status === status && !e.message.includes("private"),
    );
});
test("network failures become actionable messages", async () => {
  await assert.rejects(
    request("/produits", {
      fetcher: async () => {
        throw Error("network");
      },
    }),
    /Unable to reach Tellus/,
  );
});
test("HTML fallback and malformed JSON never become an empty catalogue", async () => {
  await assert.rejects(
    request("/produits", {
      fetcher: async () =>
        new Response("<html></html>", {
          headers: { "content-type": "text/html" },
        }),
    }),
    /unexpected response/,
  );
  await assert.rejects(
    request("/produits", {
      fetcher: async () =>
        new Response("{", { headers: { "content-type": "application/json" } }),
    }),
    /invalid data/,
  );
});
test("sessions require token, email and a supported server role", () => {
  assert.equal(
    parseSession({
      token: "test",
      email: "test@example.test",
      role: "ROLE_ACHETEUR",
    }).role,
    "ROLE_ACHETEUR",
  );
  for (const value of [
    null,
    {},
    { token: "test", email: "test@example.test", role: "buyer" },
  ])
    assert.throws(() => parseSession(value));
});
test("an empty catalogue stays empty without fixtures", () =>
  assert.deepEqual(parseProducts([]), []));
test("catalogue rejects missing, duplicated and invalid data", () => {
  for (const value of [
    {},
    [listing, listing],
    [{ ...listing, quantite: -1 }],
    [{ ...listing, prixAuKg: "2" }],
    [{ ...listing, titre: "" }],
  ])
    assert.throws(() => parseProducts(value));
});
test("only HTTPS listing photos are accepted", () => {
  assert.equal(
    parseProducts([
      { ...listing, photoUrl: "https://example.test/photo.jpg" },
    ])[0].photo,
    "https://example.test/photo.jpg",
  );
  for (const photoUrl of [
    "javascript:alert(1)",
    "http://example.test/photo.jpg",
    "data:image/png;base64,abc",
  ])
    assert.equal(parseProducts([{ ...listing, photoUrl }])[0].photo, null);
});
test("availability respects stock, server status and upcoming dates", () => {
  const product = parseProducts([listing])[0];
  assert.equal(availability(product, "2026-10-08"), "Available now");
  assert.equal(
    availability({ ...product, date: "2026-10-09" }, "2026-10-08"),
    "Upcoming",
  );
  assert.equal(
    availability({ ...product, stock: 0 }, "2026-10-08"),
    "Unavailable",
  );
  assert.equal(
    availability({ ...product, status: "UNKNOWN" }, "2026-10-08"),
    "Unavailable",
  );
});
test("legacy cleanup only removes the known Tellus fixture keys", () => {
  const removed = [];
  clearLegacyData({ removeItem: (key) => removed.push(key) });
  assert.equal(removed.length, 8);
  assert.ok(removed.includes("tellus.web.v1.orders"));
  assert.ok(removed.every((key) => key.startsWith("tellus.web.v1.")));
});
