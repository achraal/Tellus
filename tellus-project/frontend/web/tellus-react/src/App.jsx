import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./components/Icon.jsx";
import { Landscape } from "./components/Artwork.jsx";
import Modal from "./components/Modal.jsx";
import { useDrawer } from "./hooks/useDrawer.js";
import {
  Account,
  Checkout,
  Growers,
  Harvests,
  Notifications,
  Orders,
} from "./components/Flows.jsx";
import {
  request,
  parseProducts,
  parseSession,
  availability,
  clearLegacyData,
} from "./lib/api.js";

const API = import.meta.env.VITE_API_BASE_URL || "/api";
const currency = import.meta.env.VITE_CURRENCY || "";
const pages = {
  overview: "Overview",
  marketplace: "Marketplace",
  orders: "My orders",
  producers: "Our growers",
  settings: "Settings",
  harvests: "My harvests",
  notifications: "Notifications",
};
const route = () =>
  Object.hasOwn(pages, location.hash.slice(1))
    ? location.hash.slice(1)
    : "overview";
const price = (value, code = currency) =>
  code && /^[A-Z]{3}$/.test(code)
    ? new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: code,
      }).format(value)
    : new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(
        value,
      );
const dateLabel = (value) =>
  value
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
        new Date(value + "T12:00:00"),
      )
    : "Not provided";

function Empty({ title, text, retry }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name="leaf" size={28} />
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
      {retry && (
        <button className="button primary" onClick={retry}>
          Try again
        </button>
      )}
    </div>
  );
}
function Photo({ product }) {
  const [failed, setFailed] = useState(false);
  return product.photo && !failed ? (
    <img
      className="product-photo"
      src={product.photo}
      alt={product.name}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  ) : (
    <div className="photo-placeholder">
      <Icon name="leaf" size={40} />
      <span>No photo provided</span>
    </div>
  );
}
function ProductCard({ product, saved, onSave, onOpen }) {
  return (
    <article className="product-card">
      <div className="product-picture green">
        <button
          className="save-button"
          aria-label={`${saved ? "Unsave" : "Save"} ${product.name}`}
          aria-pressed={saved}
          onClick={() => onSave(product.id)}
        >
          <Icon name="heart" size={18} />
        </button>
        <button
          className="art-button"
          aria-label={`View ${product.name}`}
          onClick={() => onOpen(product)}
        >
          <Photo product={product} />
        </button>
        <span className="harvest-label">{availability(product)}</span>
      </div>
      <div className="product-body">
        <h3>
          <button onClick={() => onOpen(product)}>{product.name}</button>
        </h3>
        <div className="product-meta">
          <span>{product.stock.toLocaleString()} kg listed</span>
          <span>
            {product.date
              ? `Available from ${dateLabel(product.date)}`
              : "Availability date not provided"}
          </span>
        </div>
        <div className="product-bottom">
          <span className="price">
            {price(product.price, product.currency)}
            <small> / kg{!product.currency && " · currency unspecified"}</small>
          </span>
          <button
            className="product-add"
            aria-label={`Details for ${product.name}`}
            onClick={() => onOpen(product)}
          >
            <Icon name="arrow" size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
function SignIn({ onSignIn, notice }) {
  const [signup, setSignup] = useState(() => location.hash === "#signup");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const controller = useRef(null);
  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    const update = () => {
      controller.current?.abort();
      setBusy(false);
      setError("");
      setSuccess("");
      setSignup(location.hash === "#signup");
    };
    addEventListener("hashchange", update);
    return () => removeEventListener("hashchange", update);
  }, []);
  useEffect(() => {
    document.title = signup ? "Create account — Tellus" : "Sign in — Tellus";
  }, [signup]);
  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const form = event.currentTarget;
    if (signup && data.get("password") !== data.get("confirmation")) {
      setError("Passwords do not match.");
      return;
    }
    if (signup && !String(data.get("nom")).trim()) {
      setError("Enter your full name.");
      return;
    }
    setBusy(true);
    setError("");
    controller.current = new AbortController();
    const active = controller.current;
    try {
      if (signup) {
        await request("/auth/register", {
          base: API,
          body: {
            nom: String(data.get("nom")).trim(),
            entreprise: String(data.get("entreprise") || "").trim(),
            email: String(data.get("email")).trim(),
            password: data.get("password"),
            role: data.get("role"),
          },
          responseType: "text",
          signal: active.signal,
        });
        if (active.signal.aborted) return;
        form.reset();
        history.replaceState(null, "", "#signin");
        setSignup(false);
        setSuccess("Your account has been created. Sign in to continue.");
        return;
      }
      const result = await request("/auth/login", {
        base: API,
        body: {
          email: String(data.get("email")).trim(),
          password: data.get("password"),
        },
        signal: active.signal,
      });
      if (!active.signal.aborted) onSignIn(parseSession(result));
    } catch (e) {
      if (!active.signal.aborted)
        setError(
          signup && (e.status === 400 || e.status === 409)
            ? "We couldn’t create this account. Check your details, or sign in if you already have an account."
            : e.status === 401 || e.status === 403
              ? "Email or password is incorrect."
              : e.message,
        );
    } finally {
      if (!active.signal.aborted) setBusy(false);
    }
  };
  return (
    <main className="auth-page">
      <section className="auth-story">
        <a className="brand" href="#overview">
          <img src="/tellus-logo.png" alt="" />
          <span>tellus.</span>
        </a>
        <div>
          <span className="eyebrow">GROWING BETTER, TOGETHER</span>
          <h1>
            A little closer
            <br />
            to the source.
          </h1>
          <p>Your connection to growers and fresh produce.</p>
        </div>
        <Landscape />
      </section>
      <section className="auth-form">
        <div>
          <span className="eyebrow">YOUR TELLUS ACCOUNT</span>
          <h2>{signup ? "Create your account" : "Welcome back"}</h2>
          <p className="muted">
            {signup
              ? "Join the people growing better, together."
              : "Sign in to your workspace."}
          </p>
          {(success || (!signup && notice)) && (
            <p role="status" className="service-notice">
              {success || notice}
            </p>
          )}
          <form
            key={signup ? "signup" : "signin"}
            onSubmit={submit}
            aria-busy={busy}
          >
            {signup && (
              <>
                <label className="field">
                  Full name
                  <input
                    name="nom"
                    autoComplete="name"
                    required
                    maxLength={80}
                    disabled={busy}
                  />
                </label>
                <label className="field">
                  Account type
                  <select
                    name="role"
                    defaultValue="ROLE_ACHETEUR"
                    disabled={busy}
                  >
                    <option value="ROLE_ACHETEUR">
                      Buyer — source produce
                    </option>
                    <option value="ROLE_AGRICULTEUR">
                      Grower — sell produce
                    </option>
                  </select>
                </label>
                <label className="field">
                  Business or farm name (optional)
                  <input
                    name="entreprise"
                    autoComplete="organization"
                    maxLength={120}
                    disabled={busy}
                  />
                </label>
              </>
            )}
            <label className="field">
              Email
              <input
                name="email"
                type="email"
                autoComplete={signup ? "email" : "username"}
                required
                maxLength={254}
                disabled={busy}
              />
            </label>
            <label className="field">
              Password
              <input
                name="password"
                type="password"
                autoComplete={signup ? "new-password" : "current-password"}
                required
                minLength={signup ? 12 : undefined}
                maxLength={signup ? 128 : 1024}
                aria-describedby={signup ? "password-hint" : undefined}
                disabled={busy}
              />
            </label>
            {signup && (
              <>
                <p id="password-hint" className="field-hint">
                  Use 12–128 characters. A long, unique passphrase works well.
                </p>
                <label className="field">
                  Confirm password
                  <input
                    name="confirmation"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={12}
                    maxLength={128}
                    disabled={busy}
                  />
                </label>
              </>
            )}
            {error && (
              <p role="alert" className="field-error">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="button primary full-width"
              disabled={busy}
            >
              {busy
                ? signup
                  ? "Creating account…"
                  : "Signing in…"
                : signup
                  ? "Create account"
                  : "Sign in"}
              <Icon name="arrow" size={18} />
            </button>
          </form>
          <p className="auth-switch">
            {signup ? "Already have an account? " : "New to Tellus? "}
            <a href={signup ? "#signin" : "#signup"}>
              {signup ? "Sign in" : "Create an account"}
            </a>
          </p>
          <p className="field-hint">
            {signup
              ? "Buy fresh produce for pickup, or publish your harvests."
              : "Sessions end when you reload or close this page."}
          </p>
        </div>
      </section>
    </main>
  );
}
function Workspace({ session, onSignOut, theme, setTheme }) {
  const [page, setPage] = useState(route);
  const [products, setProducts] = useState([]);
  const [load, setLoad] = useState("loading");
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("name");
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState([]);
  const [cart, setCart] = useState([]);
  const [modal, setModal] = useState(null);
  const [basketBusy, setBasketBusy] = useState(false);
  const [orderRevision, setOrderRevision] = useState(0);
  const [growerFilter, setGrowerFilter] = useState("");
  const pendingCheckout = useRef(null);
  const [success, setSuccess] = useState("");
  const api = useCallback(
    async (path, options = {}) => {
      try {
        return await request(path, {
          ...options,
          base: API,
          token: session.token,
        });
      } catch (e) {
        if (e.status === 401)
          onSignOut("Your session has expired. Please sign in again.");
        throw e;
      }
    },
    [session.token, onSignOut],
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobile, setMobile] = useState(
    () => matchMedia("(max-width: 800px)").matches,
  );
  const drawer = useRef(null);
  const toggle = useRef(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useDrawer(mobile && menuOpen, drawer, toggle, closeMenu);
  const farmer = session.role === "ROLE_AGRICULTEUR";
  useEffect(() => {
    const media = matchMedia("(max-width: 800px)");
    const update = () => setMobile(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const update = () => {
      setPage(route());
      closeMenu();
    };
    addEventListener("hashchange", update);
    return () => removeEventListener("hashchange", update);
  }, [closeMenu]);
  useEffect(() => {
    document.title = `${pages[page]} — Tellus`;
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [page]);
  useEffect(() => {
    const controller = new AbortController();
    setLoad("loading");
    setError("");
    setProducts([]);
    request("/produits", {
      base: API,
      token: session.token,
      signal: controller.signal,
    })
      .then((value) => {
        if (!controller.signal.aborted) {
          setProducts(parseProducts(value));
          setLoad("ready");
        }
      })
      .catch((e) => {
        if (controller.signal.aborted) return;
        if (e.status === 401) {
          onSignOut("Your session has expired. Please sign in again.");
          return;
        }
        setError(e.message);
        setLoad("error");
      });
    return () => controller.abort();
  }, [session.token, revision, onSignOut]);
  const navigate = (id) => {
    location.hash = id;
    setPage(id);
    closeMenu();
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const reset = () => {
    setQuery("");
    setFilter("All");
    setSavedOnly(false);
    setSort("name");
    setGrowerFilter("");
  };
  const toggleSaved = (id) =>
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  const shown = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(query.trim().toLowerCase()) &&
        (filter === "All" || availability(p) === filter) &&
        (!savedOnly || saved.includes(p.id)),
    )
    .filter((p) => !growerFilter || p.growerId === growerFilter)
    .sort(
      sort === "price"
        ? (a, b) => a.price - b.price
        : (a, b) => a.name.localeCompare(b.name),
    );
  const catalogue = (list) =>
    load === "loading" ? (
      <div className="empty-state" role="status">
        Loading the latest produce…
      </div>
    ) : load === "error" ? (
      <div role="alert">
        <Empty
          title="We couldn’t load the catalogue"
          text={error}
          retry={() => setRevision((v) => v + 1)}
        />
      </div>
    ) : !list.length ? (
      <Empty
        title={
          products.length ? "No matching produce" : "No produce listed yet"
        }
        text={
          products.length
            ? "Remove a filter or try another search."
            : "Published grower listings will appear here."
        }
      />
    ) : (
      <div className="product-grid marketplace-grid">
        {list.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            saved={saved.includes(p.id)}
            onSave={toggleSaved}
            onOpen={(product) => setModal({ type: "product", product })}
          />
        ))}
      </div>
    );
  const nav = [
    ["overview", "grid"],
    ["marketplace", "leaf"],
    ["orders", "box"],
    ["producers", "people"],
    ["notifications", "box"],
    ...(farmer ? [["harvests", "leaf"]] : []),
    ["settings", "settings"],
  ];
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Skip to content
      </a>
      {menuOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={closeMenu}
        />
      )}
      <aside
        ref={drawer}
        id="workspace-navigation"
        className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}
        aria-label="Main navigation"
        inert={mobile && !menuOpen}
      >
        <button
          className="icon-button drawer-close"
          aria-label="Close navigation"
          onClick={closeMenu}
        >
          <Icon name="close" />
        </button>
        <a
          className="brand"
          href="#overview"
          onClick={() => navigate("overview")}
        >
          <span className="brand-image">
            <img src="/tellus-logo.png" alt="" />
          </span>
          <span>
            tellus<span className="brand-period">.</span>
          </span>
        </a>
        <p className="brand-tagline">GROWING BETTER, TOGETHER</p>
        <div className="workspace-switch">
          <span className="workspace-icon">
            <Icon name={farmer ? "leaf" : "bag"} />
          </span>
          <div>
            <span>Your workspace</span>
            <strong>
              {farmer
                ? "Grower"
                : session.role === "ROLE_ADMIN"
                  ? "Administrator"
                  : "Buyer"}
            </strong>
          </div>
        </div>
        <span className="nav-label">WORKSPACE</span>
        <nav>
          {nav.map(([id, icon]) => (
            <button
              className={`nav-item ${page === id ? "active" : ""}`}
              key={id}
              onClick={() => navigate(id)}
              aria-current={page === id ? "page" : undefined}
            >
              <Icon name={icon} size={19} />
              <span>{pages[id]}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="grow-card">
            <Icon name="leaf" size={24} />
            <h3>Good things grow here.</h3>
            <p>
              Closer to the farm.
              <br />
              Better for everyone.
            </p>
          </div>
          <button className="nav-item" onClick={() => onSignOut("")}>
            <Icon name="arrow" size={18} />
            Sign out
          </button>
        </div>
      </aside>
      <div className="main-shell" inert={mobile && menuOpen}>
        <header className="topbar">
          <div className="breadcrumb">
            <button
              ref={toggle}
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              aria-controls="workspace-navigation"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <Icon name="menu" />
            </button>
            <span>Workspace</span>
            <Icon name="chevron" size={13} />
            <strong>{pages[page]}</strong>
          </div>
          <div className="topbar-actions">
            <button
              className="icon-button"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Icon name={theme === "light" ? "moon" : "sun"} />
            </button>
            <button className="button" onClick={() => navigate("settings")}>
              <Icon name="people" size={18} />
              Account
            </button>
          </div>
        </header>
        <main className="main-content" id="main-content" tabIndex={-1}>
          <div className="page-heading">
            <div>
              <div className="eyebrow page-eyebrow">
                YOUR ROOTS. YOUR NETWORK.
              </div>
              <h1>
                {page === "overview"
                  ? "A little closer to the source."
                  : pages[page]}
              </h1>
              <p>Fresh produce. Strong connections.</p>
            </div>
            <button
              className="button basket-button"
              onClick={() => setModal({ type: "basket" })}
            >
              <Icon name="bag" size={17} />
              My basket <span>{cart.length}</span>
            </button>
          </div>
          {page === "overview" && (
            <>
              <section
                className="buyer-shortcuts"
                aria-label="Workspace shortcuts"
              >
                <button
                  onClick={() => {
                    reset();
                    navigate("marketplace");
                  }}
                >
                  <Icon name="leaf" />
                  <strong>Browse produce</strong>
                  <span>
                    {load === "ready"
                      ? `${products.length} published listings`
                      : "Explore the catalogue"}
                  </span>
                  <Icon name="arrow" />
                </button>
                <button
                  onClick={() => {
                    setSavedOnly(true);
                    navigate("marketplace");
                  }}
                >
                  <Icon name="heart" />
                  <strong>Saved produce</strong>
                  <span>{saved.length} saved this session</span>
                  <Icon name="arrow" />
                </button>
                <button onClick={() => navigate("orders")}>
                  <Icon name="box" />
                  <strong>My orders</strong>
                  <span>
                    {farmer
                      ? "Manage buyer requests"
                      : "Track your pickup requests"}
                  </span>
                  <Icon name="arrow" />
                </button>
              </section>
              <section className="hero">
                <div className="hero-copy">
                  <div className="hero-kicker">ROOTED IN GOOD CONNECTIONS</div>
                  <h2>
                    Welcome to your workspace<span>.</span>
                  </h2>
                  <p>
                    Explore what growers have available, and find your next
                    fresh connection.
                  </p>
                  <button
                    className="button hero-button"
                    onClick={() => navigate("marketplace")}
                  >
                    Explore the marketplace
                    <Icon name="arrow" size={17} />
                  </button>
                </div>
                <Landscape />
              </section>
              <div className="section-heading">
                <div>
                  <h2>From our growers</h2>
                  <p>The latest catalogue from Tellus.</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => navigate("marketplace")}
                >
                  View all
                  <Icon name="arrow" size={16} />
                </button>
              </div>
              {catalogue(products.slice(0, 3))}
            </>
          )}
          {page === "marketplace" && (
            <>
              <div className="filter-row">
                <label className="market-search">
                  <Icon name="search" size={18} />
                  <input
                    aria-label="Search produce"
                    placeholder="Search produce"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <label className="filter-select">
                  <select
                    aria-label="Availability"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    {["All", "Available now", "Upcoming", "Unavailable"].map(
                      (value) => (
                        <option key={value}>{value}</option>
                      ),
                    )}
                  </select>
                </label>
                <label className="filter-select">
                  <select
                    aria-label="Sort produce"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="name">Name</option>
                    <option value="price">Price: low to high</option>
                  </select>
                </label>
                <button
                  className="button"
                  aria-pressed={savedOnly}
                  onClick={() => setSavedOnly((v) => !v)}
                >
                  <Icon name="heart" size={16} />
                  Saved ({saved.length})
                </button>
              </div>
              <div className="active-filters" aria-label="Active filters">
                {growerFilter && (
                  <button onClick={() => setGrowerFilter("")}>
                    Remove grower filter <Icon name="close" size={14} />
                  </button>
                )}
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label={`Remove search ${query}`}
                  >
                    {query}
                    <Icon name="close" size={14} />
                  </button>
                )}
                {filter !== "All" && (
                  <button onClick={() => setFilter("All")}>
                    Remove {filter}
                    <Icon name="close" size={14} />
                  </button>
                )}
                {savedOnly && (
                  <button onClick={() => setSavedOnly(false)}>
                    Remove saved filter
                    <Icon name="close" size={14} />
                  </button>
                )}
                {(query ||
                  filter !== "All" ||
                  savedOnly ||
                  sort !== "name") && (
                  <button onClick={reset}>Reset all</button>
                )}
              </div>
              <div className="results-caption">
                <span>
                  {load === "ready" ? `${shown.length} listings` : "Catalogue"}
                </span>
                <button
                  className="button"
                  disabled={load === "loading"}
                  onClick={() => setRevision((v) => v + 1)}
                >
                  Refresh
                </button>
              </div>
              {catalogue(shown)}
            </>
          )}
          {page === "orders" && (
            <Orders
              api={api}
              farmer={farmer}
              revision={orderRevision}
              onChange={() => setRevision((v) => v + 1)}
            />
          )}
          {page === "producers" && (
            <Growers
              api={api}
              onBrowse={(id) => {
                reset();
                setGrowerFilter(id);
                navigate("marketplace");
              }}
            />
          )}
          {page === "harvests" &&
            (farmer ? (
              <Harvests api={api} onChange={() => setRevision((v) => v + 1)} />
            ) : (
              <Empty
                title="Grower account required"
                text="Sign in with a grower account to manage harvests."
              />
            ))}
          {page === "notifications" && (
            <Notifications api={api} revision={orderRevision} />
          )}
          {success && (
            <p role="status" className="service-notice">
              {success}
            </p>
          )}
          {page === "settings" && (
            <section className="panel account-panel">
              <h2>Your account</h2>
              <dl className="purchase-facts">
                <div>
                  <dt>Email</dt>
                  <dd>{session.email}</dd>
                </div>
                <div>
                  <dt>Account type</dt>
                  <dd>
                    {farmer
                      ? "Grower"
                      : session.role === "ROLE_ADMIN"
                        ? "Administrator"
                        : "Buyer"}
                  </dd>
                </div>
              </dl>
              <Account api={api} onPasswordChanged={() => onSignOut("Password updated. Sign in with your new password.")} />
              <h2>Appearance</h2>
              <button
                className="button"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                Use {theme === "light" ? "dark" : "light"} theme
              </button>
              <p className="field-hint">
                Your basket and saved produce are kept for this session only.
                Signing out clears them.
              </p>
              <button className="button primary" onClick={() => onSignOut("")}>
                Sign out
              </button>
            </section>
          )}
          <footer className="page-footer">
            <span>Rooted in trust. Growing together.</span>
            <span>Tellus</span>
          </footer>
        </main>
      </div>
      <nav
        className="mobile-bottom-nav"
        aria-label="Quick navigation"
        inert={mobile && menuOpen}
      >
        {[
          ["overview", "grid", "Home"],
          ["marketplace", "leaf", "Market"],
          ["orders", "box", "Orders"],
          ["basket", "bag", `Basket (${cart.length})`],
        ].map(([id, icon, label]) => (
          <button
            key={id}
            aria-current={page === id ? "page" : undefined}
            onClick={() =>
              id === "basket" ? setModal({ type: "basket" }) : navigate(id)
            }
          >
            <Icon name={icon} size={21} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      {modal?.type === "product" && (
        <ProductDetail
          product={modal.product}
          onClose={() => setModal(null)}
          inCart={
            cart.find((item) => item.id === modal.product.id)?.quantity || 0
          }
          onAdd={(quantity) => {
            if (pendingCheckout.current) return;
            setCart((prev) => {
              const exists = prev.find((item) => item.id === modal.product.id);
              return exists
                ? prev.map((item) =>
                    item.id === exists.id
                      ? { ...item, quantity: item.quantity + quantity }
                      : item,
                  )
                : [...prev, { id: modal.product.id, quantity }];
            });
            setModal({ type: "basket" });
          }}
        />
      )}
      {modal?.type === "basket" && (
        <Modal
          title="Your basket"
          onClose={() => {
            if (!basketBusy) setModal(null);
          }}
          wide
        >
          {!cart.length ? (
            <Empty
              title="Your basket is empty"
              text="Browse produce to start planning your next order."
            />
          ) : (
            <>
              <div className="basket-items">
                {cart.map((item) => {
                  const p = products.find((product) => product.id === item.id);
                  return (
                    <div className="basket-item" key={item.id}>
                      <div className="basket-item-main">
                        <strong>{p?.name || "Listing unavailable"}</strong>
                        <span>
                          {item.quantity} kg
                          {p ? ` × ${price(p.price, p.currency)}` : ""}
                        </span>
                        {p &&
                          (availability(p) !== "Available now" ||
                            item.quantity > p.stock) && (
                            <span className="field-error">
                              This quantity is no longer available.
                            </span>
                          )}
                      </div>
                      <button
                        className="icon-button"
                        disabled={
                          basketBusy || Boolean(pendingCheckout.current)
                        }
                        aria-label={`Remove ${p?.name || "unavailable listing"}`}
                        onClick={() =>
                          setCart((prev) =>
                            prev.filter((value) => value.id !== item.id),
                          )
                        }
                      >
                        <Icon name="trash" />
                      </button>
                    </div>
                  );
                })}
              </div>
              {pendingCheckout.current && (
                <p className="service-notice">
                  An interrupted request is awaiting confirmation. Retry the
                  same request below before changing your basket.
                </p>
              )}
              <Checkout
                api={api}
                cart={cart}
                products={products}
                session={session}
                pending={pendingCheckout}
                onBusy={setBasketBusy}
                onConflict={() => setRevision((v) => v + 1)}
                onDone={() => {
                  setCart([]);
                  setModal(null);
                  setRevision((v) => v + 1);
                  setOrderRevision((v) => v + 1);
                  setSuccess(
                    "Your order request was submitted. Follow its progress in My orders.",
                  );
                  navigate("orders");
                }}
              />
            </>
          )}
          <button
            className="button primary full-width"
            disabled={basketBusy}
            onClick={() => {
              setModal(null);
              navigate("marketplace");
            }}
          >
            Browse produce
            <Icon name="arrow" size={18} />
          </button>
        </Modal>
      )}
    </div>
  );
}
function ProductDetail({ product, onClose, onAdd, inCart }) {
  const [quantity, setQuantity] = useState(String(product.minimum));
  const available = product.stock - inCart;
  const valid =
    Number.isFinite(Number(quantity)) &&
    Number(quantity) >= product.minimum &&
    Number(quantity) <= available &&
    availability(product) === "Available now";
  return (
    <Modal title={product.name} onClose={onClose}>
      <div className="detail-art green">
        <Photo product={product} />
      </div>
      <div className="detail-top">
        <span className="badge confirmed">{availability(product)}</span>
        <span className="price">
          {price(product.price, product.currency)}
          <small> / kg</small>
        </span>
      </div>
      <div className="purchase-facts">
        <p>
          <strong>Listed quantity</strong>
          <span>{product.stock.toLocaleString()} kg</span>
        </p>
        <p>
          <strong>Available from</strong>
          <span>{dateLabel(product.date)}</span>
        </p>
        <p>
          <strong>Grower label</strong>
          <span>{product.label || "Not provided"}</span>
        </p>
        <p>
          <strong>Minimum order / pickup</strong>
          <span>
            {product.minimum} kg · {product.pickup || "Not provided"}
          </span>
        </p>
        {!product.currency && (
          <p>
            <strong>Currency</strong>
            <span>Not specified by the service</span>
          </p>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onAdd(Number(quantity));
        }}
      >
        <label className="field">
          Quantity (kg)
          <input
            type="number"
            min={product.minimum}
            max={Math.max(product.minimum, available)}
            step="0.01"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>
        <p className="field-hint">
          {inCart > 0 ? `${inCart} kg already in your basket. ` : ""}This does
          not reserve stock or place an order.
        </p>
        <button
          className="button primary full-width"
          type="submit"
          disabled={!valid}
        >
          Add to basket
          <Icon name="bag" size={18} />
        </button>
      </form>
    </Modal>
  );
}
export default function App() {
  const [session, setSession] = useState(null);
  const [notice, setNotice] = useState("");
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("tellus.preferences.theme") === "dark"
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });
  useEffect(() => {
    try {
      clearLegacyData(localStorage);
    } catch {
      /* Legacy data is never read, even when storage is unavailable. */
    }
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("tellus.preferences.theme", theme);
    } catch {
      /* Theme remains usable in memory. */
    }
  }, [theme]);
  const signOut = useCallback((message) => {
    setSession(null);
    setNotice(message);
    location.hash = "overview";
    document.title = "Sign in — Tellus";
  }, []);
  return session ? (
    <Workspace
      key={session.email}
      session={session}
      onSignOut={signOut}
      theme={theme}
      setTheme={setTheme}
    />
  ) : (
    <SignIn
      notice={notice}
      onSignIn={(value) => {
        setNotice("");
        setSession(value);
      }}
    />
  );
}
