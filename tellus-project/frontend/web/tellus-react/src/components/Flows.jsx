import { useCallback, useEffect, useRef, useState } from "react";
import Modal from "./Modal.jsx";

const money = (value, currency) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} (currency unspecified)`;
  }
};
const statuses = {
  EN_ATTENTE: "Awaiting confirmation",
  VALIDEE: "Confirmed for pickup",
  REFUSEE: "Declined",
  ANNULEE: "Cancelled",
  LIVREE: "Collected",
};
function useResource(api, path, revision = 0) {
  const [state, setState] = useState({ data: null, error: "", loading: true });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, error: "", loading: true });
    api(path, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted)
          setState({ data, error: "", loading: false });
      })
      .catch((e) => {
        if (!controller.signal.aborted)
          setState({ data: null, error: e.message, loading: false });
      });
    return () => controller.abort();
  }, [api, path, revision, retry]);
  return { ...state, reload: () => setRetry((v) => v + 1) };
}
function Resource({ state, children }) {
  if (state.loading)
    return (
      <p role="status" className="service-notice">
        Loading…
      </p>
    );
  if (state.error)
    return (
      <div role="alert" className="service-notice">
        <p>{state.error}</p>
        <button className="button" onClick={state.reload}>
          Try again
        </button>
      </div>
    );
  return children;
}
export function Orders({ api, farmer, revision, onChange }) {
  const state = useResource(api, "/commandes", revision);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const change = async (order, statut) => {
    setBusy(order.id);
    setError("");
    try {
      await api(`/commandes/${encodeURIComponent(order.id)}/status`, {
        method: "PATCH",
        body: { statut, version: order.version },
      });
      state.reload();
      onChange();
    } catch (e) {
      setError(e.message);
      if (e.status === 409) state.reload();
    } finally {
      setBusy("");
    }
  };
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>{farmer ? "Your sales" : "Your orders"}</h2>
        <button className="button" onClick={state.reload}>
          Refresh
        </button>
      </div>
      {error && (
        <p role="alert" className="field-error">
          {error}
        </p>
      )}
      <Resource state={state}>
        {state.data?.length ? (
          <div className="flow-list">
            {state.data.map((o) => (
              <article className="flow-card" key={o.id}>
                <div className="section-heading">
                  <h3>{o.produitTitre || "Produce order"}</h3>
                  <span className="badge">
                    {statuses[o.statut] || o.statut}
                  </span>
                </div>
                <p>
                  {o.quantite} kg · {money(o.prixTotal, o.currency)}
                </p>
                <p className="muted">
                  Order {o.id} · {new Date(o.dateCommande).toLocaleString()}
                </p>
                <p>Pickup: {o.pickupLocation || "Contact the grower"}</p>
                {farmer && (
                  <p>
                    Buyer: {o.buyerName} · {o.buyerPhone}
                  </p>
                )}
                <div className="flow-actions">
                  {(farmer
                    ? o.statut === "EN_ATTENTE"
                      ? [
                          ["VALIDEE", "Accept"],
                          ["REFUSEE", "Decline"],
                        ]
                      : o.statut === "VALIDEE"
                        ? [["LIVREE", "Mark collected"]]
                        : []
                    : o.statut === "EN_ATTENTE"
                      ? [["ANNULEE", "Cancel request"]]
                      : []
                  ).map(([status, label]) => (
                    <button
                      className="button"
                      disabled={Boolean(busy)}
                      key={status}
                      onClick={() => change(o, status)}
                    >
                      {busy === o.id ? "Saving…" : label}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No orders yet</h3>
            <p>
              {farmer
                ? "Buyer requests will appear here."
                : "Browse produce and request pickup from your basket."}
            </p>
          </div>
        )}
      </Resource>
    </section>
  );
}
export function Growers({ api, onBrowse }) {
  const state = useResource(api, "/growers");
  return (
    <section className="panel">
      <Resource state={state}>
        <div className="flow-list">
          {state.data?.length ? (
            state.data.map((g) => (
              <article className="flow-card" key={g.id}>
                <h2>{g.entreprise || g.nom}</h2>
                <p>{g.nom}</p>
                <button className="button" onClick={() => onBrowse(g.id)}>
                  Browse this grower’s produce
                </button>
              </article>
            ))
          ) : (
            <p>No growers have joined yet.</p>
          )}
        </div>
      </Resource>
    </section>
  );
}
function ListingForm({ initial, api, onClose, onSaved }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef(initial?.clientRequestId || crypto.randomUUID());
  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const payload = {
      titre: String(f.get("titre")).trim(),
      quantite: Number(f.get("quantite")),
      prixAuKg: Number(f.get("prixAuKg")),
      currency: String(f.get("currency")).toUpperCase(),
      minimumKg: Number(f.get("minimumKg")),
      dateDisponibilite: f.get("dateDisponibilite"),
      pickupLocation: String(f.get("pickupLocation")).trim(),
      label: f.get("label"),
      photoUrl: f.get("photoUrl"),
      clientRequestId: requestId.current,
      version: initial?.version ?? null,
      latitude: initial?.location?.coordinates?.[1] ?? null,
      longitude: initial?.location?.coordinates?.[0] ?? null,
    };
    try {
      await api(
        initial ? `/produits/${encodeURIComponent(initial.id)}` : "/produits",
        { method: initial ? "PUT" : "POST", body: payload },
      );
      onSaved();
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title={initial ? "Edit harvest" : "Publish a harvest"}
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <form onSubmit={submit} aria-busy={busy}>
        {[
          ["titre", "Produce name", "text", true],
          ["quantite", "Available stock (kg)", "number", true],
          ["prixAuKg", "Price per kg", "number", true],
          ["currency", "Currency (ISO code, e.g. MAD)", "text", true],
          ["minimumKg", "Minimum order (kg)", "number", true],
          ["dateDisponibilite", "Available from", "date", true],
          ["pickupLocation", "Pickup address", "text", true],
          ["label", "Grower label (optional)", "text", false],
          ["photoUrl", "Photo HTTPS URL (optional)", "url", false],
        ].map(([name, label, type, required]) => (
          <label className="field" key={name}>
            {label}
            <input
              name={name}
              type={type}
              required={required}
              disabled={busy}
              defaultValue={
                initial?.[name] ??
                (name === "minimumKg"
                  ? 1
                  : name === "dateDisponibilite"
                    ? new Date().toLocaleDateString("en-CA")
                    : "")
              }
              min={
                type === "number" ? (name === "quantite" ? 0 : 0.01) : undefined
              }
              max={type === "number" ? 1000000 : undefined}
              step={type === "number" ? "0.01" : undefined}
              maxLength={
                name === "currency"
                  ? 3
                  : name === "photoUrl"
                    ? 2048
                    : name === "pickupLocation"
                      ? 240
                      : 120
              }
            />
          </label>
        ))}
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <button className="button primary full-width" disabled={busy}>
          {busy ? "Saving…" : "Save harvest"}
        </button>
      </form>
    </Modal>
  );
}
export function Harvests({ api, onChange }) {
  const state = useResource(api, "/produits/mine");
  const [editor, setEditor] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const saved = () => {
    state.reload();
    onChange();
  };
  const withdraw = async (id) => {
    setBusy(true);
    setError("");
    try {
      await api(`/produits/${encodeURIComponent(id)}`, { method: "DELETE" });
      saved();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Your published harvests</h2>
        <button className="button primary" onClick={() => setEditor({})}>
          Add harvest
        </button>
      </div>
      {error && (
        <p role="alert" className="field-error">
          {error}
        </p>
      )}
      <Resource state={state}>
        <div className="flow-list">
          {state.data?.length ? (
            state.data.map((p) => (
              <article className="flow-card" key={p.id}>
                <h3>{p.titre}</h3>
                <p>
                  {p.quantite} kg available · {money(p.prixAuKg, p.currency)} /
                  kg
                </p>
                <p className="muted">
                  Minimum {p.minimumKg ?? 1} kg · Pickup:{" "}
                  {p.pickupLocation || "Complete your listing"}
                </p>
                <div className="flow-actions">
                  <button className="button" onClick={() => setEditor(p)}>
                    Edit
                  </button>
                  <button
                    className="button"
                    disabled={busy}
                    onClick={() => setEditor({ withdraw: p })}
                  >
                    Withdraw
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p>Publish your first harvest to reach buyers.</p>
          )}
        </div>
      </Resource>
      {editor?.withdraw ? (
        <Modal
          title="Withdraw this harvest?"
          onClose={() => {
            if (!busy) setEditor(null);
          }}
        >
          <p>
            {editor.withdraw.titre} will leave the catalogue. Existing orders
            remain available.
          </p>
          <button
            className="button primary"
            disabled={busy}
            onClick={async () => {
              await withdraw(editor.withdraw.id);
              setEditor(null);
            }}
          >
            Withdraw harvest
          </button>
        </Modal>
      ) : (
        editor && (
          <ListingForm
            initial={editor.id ? editor : null}
            api={api}
            onClose={() => setEditor(null)}
            onSaved={saved}
          />
        )
      )}
    </section>
  );
}
export function Notifications({ api, revision }) {
  const state = useResource(api, "/notifications", revision);
  const [error, setError] = useState("");
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Notifications</h2>
        <button
          className="button"
          onClick={async () => {
            try {
              await api("/notifications/read", { method: "PATCH" });
              state.reload();
            } catch (e) {
              setError(e.message);
            }
          }}
        >
          Mark all as read
        </button>
      </div>
      {error && (
        <p role="alert" className="field-error">
          {error}
        </p>
      )}
      <Resource state={state}>
        <div className="flow-list">
          {state.data?.length ? (
            state.data.map((n) => (
              <article className="flow-card" key={n.id}>
                <h3>
                  {n.title} {!n.read && <span className="badge">New</span>}
                </h3>
                <p>{n.message}</p>
                <small className="muted">
                  {new Date(n.createdAt).toLocaleString()}
                </small>
              </article>
            ))
          ) : (
            <p>Your order updates will appear here.</p>
          )}
        </div>
      </Resource>
    </section>
  );
}
export function Account({ api, onPasswordChanged }) {
  const state = useResource(api, "/account");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      if (busy) return;
      const form = e.currentTarget;
      const f = new FormData(form);
      setBusy(true);
      setNotice("");
      try {
        const password = f.has("currentPassword");
        if (password && f.get("newPassword") !== f.get("confirmation"))
          throw Error("Passwords do not match.");
        await api(password ? "/account/password" : "/account", {
          method: "PUT",
          body: password
            ? {
                currentPassword: f.get("currentPassword"),
                newPassword: f.get("newPassword"),
              }
            : {
                nom: f.get("nom"),
                entreprise: f.get("entreprise"),
                phone: f.get("phone"),
                latitude: state.data?.latitude ?? null,
                longitude: state.data?.longitude ?? null,
              },
        });
        setNotice(password ? "Password updated." : "Profile saved.");
        if (password) {
          form.reset();
          onPasswordChanged();
        } else state.reload();
      } catch (e) {
        setNotice(e.message);
      } finally {
        setBusy(false);
      }
    },
    [api, busy, state, onPasswordChanged],
  );
  return (
    <Resource state={state}>
      {notice && (
        <p role="status" className="service-notice">
          {notice}
        </p>
      )}
      <form onSubmit={submit}>
        <h3>Profile</h3>
        {[
          ["nom", "Full name"],
          ["entreprise", "Business or farm"],
          ["phone", "Phone"],
        ].map(([name, label]) => (
          <label className="field" key={name}>
            {label}
            <input
              name={name}
              defaultValue={state.data?.[name] || ""}
              required={name === "nom"}
              maxLength={name === "nom" ? 80 : name === "phone" ? 40 : 120}
              disabled={busy}
            />
          </label>
        ))}
        <button className="button" disabled={busy}>
          Save profile
        </button>
      </form>
      <form onSubmit={submit}>
        <h3>Change password</h3>
        {[
          ["currentPassword", "Current password"],
          ["newPassword", "New password (12–128 characters)"],
          ["confirmation", "Confirm new password"],
        ].map(([name, label]) => (
          <label className="field" key={name}>
            {label}
            <input
              type="password"
              name={name}
              required
              minLength={name === "currentPassword" ? 1 : 12}
              maxLength={name === "currentPassword" ? 1024 : 128}
              autoComplete={
                name === "currentPassword" ? "current-password" : "new-password"
              }
              disabled={busy}
            />
          </label>
        ))}
        <button className="button" disabled={busy}>
          Update password
        </button>
      </form>
    </Resource>
  );
}
export function Checkout({
  api,
  cart,
  products,
  session,
  pending,
  onDone,
  onConflict,
  onBusy,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lines = cart.map((item) => ({
    item,
    p: products.find((p) => p.id === item.id),
  }));
  const valid = lines.every(
    ({ item, p }) =>
      p &&
      p.currency &&
      p.pickup &&
      p.date &&
      p.status === "DISPONIBLE" &&
      p.date <= new Date().toLocaleDateString("en-CA") &&
      item.quantity >= p.minimum &&
      item.quantity <= p.stock,
  );
  const submit = async (e) => {
    e.preventDefault();
    if (busy || (!valid && !pending.current)) return;
    const f = new FormData(e.currentTarget);
    const payload = pending.current || {
      requestId: crypto.randomUUID(),
      buyerName: String(f.get("buyerName")).trim(),
      buyerPhone: String(f.get("buyerPhone")).trim(),
      items: lines.map(({ item, p }) => ({
        produitId: item.id,
        quantite: item.quantity,
        expectedPrice: p?.price,
        currency: p?.currency,
      })),
    };
    if (!pending.current) pending.current = payload;
    setBusy(true);
    onBusy(true);
    setError("");
    try {
      await api("/commandes", { body: pending.current });
      pending.current = null;
      onDone();
    } catch (e) {
      setError(e.message);
      if ([400, 403, 409].includes(e.status)) {
        pending.current = null;
        onConflict();
      }
    } finally {
      setBusy(false);
      onBusy(false);
    }
  };
  if (session.role !== "ROLE_ACHETEUR")
    return <p className="service-notice">Ordering requires a buyer account.</p>;
  return (
    <form onSubmit={submit}>
      <h3>Request pickup</h3>
      <p className="field-hint">
        Stock is reserved when you submit. The grower confirms your request. Pay
        and arrange pickup directly; no payment is taken here.
      </p>
      <div className="flow-list">
        {lines.map(({ item, p }) => (
          <p key={item.id}>
            {p?.name}:{" "}
            {p ? money(item.quantity * p.price, p.currency) : "Unavailable"}
            <br />
            <small>Pickup: {p?.pickup || "Not specified"}</small>
          </p>
        ))}
      </div>
      {!valid && (
        <p className="field-error">
          Refresh the catalogue and check stock, minimum quantities and pickup
          details.
        </p>
      )}
      <label className="field">
        Your name
        <input
          name="buyerName"
          required
          maxLength={80}
          disabled={busy || Boolean(pending.current)}
          defaultValue={pending.current?.buyerName || ""}
        />
      </label>
      <label className="field">
        Contact phone
        <input
          name="buyerPhone"
          type="tel"
          required
          maxLength={40}
          disabled={busy || Boolean(pending.current)}
          defaultValue={pending.current?.buyerPhone || ""}
        />
      </label>
      {error && (
        <p role="alert" className="field-error">
          {error}
        </p>
      )}
      <button
        className="button primary full-width"
        disabled={busy || (!valid && !pending.current)}
      >
        {busy
          ? "Submitting…"
          : pending.current
            ? "Retry the same request"
            : "Submit order request"}
      </button>
    </form>
  );
}
