import { useState, useEffect, useReducer, useCallback, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from "recharts";

/* ═══════════════════════════════════════════════
   EDO SISTEMA — Ferretería Estrella de Occidente
   Demo Interactiva ERP
   ═══════════════════════════════════════════════ */

// ── Constantes ─────────────────────────────────
const SUCURSALES = ["Central", "Xela", "Escuintla", "Cobán", "Antigua"];
const SUCURSAL_COLORS = {
  Central: "#006B6B",
  Xela: "#2C7873",
  Escuintla: "#D97B00",
  Cobán: "#1E8449",
  Antigua: "#8e44ad"
};

const CATEGORIAS = {
  "Cemento Progreso 42.5kg": "Construcción",
  "Varilla corrugada 3/8\" x 6m": "Construcción",
  "Tornillo hexagonal 1/2\" (caja 50u)": "Fijación",
  "Lámina galvanizada 8x3 pies": "Construcción",
  "Pintura blanca Synteko 1 gal": "Pintura",
  "Tubo PVC 1/2\" x 6m": "Plomería",
  "Cable eléctrico 12 AWG (rollo 100m)": "Eléctrico",
  "Cerradura entrada Schlage": "Cerrajería",
  "Silicón transparente Loctite": "Adhesivos",
  "Broca SDS 16mm": "Herramientas",
  "Manguera jardín 1/2\" x 25m": "Jardín",
  "Bisagra acero inox 3\"": "Fijación"
};

// ── Datos Iniciales ────────────────────────────
const initialProducts = [
  { id: 1, name: "Cemento Progreso 42.5kg", category: "Construcción", stock: { Central: 45, Xela: 32, Escuintla: 28, Cobán: 15, Antigua: 20 }, price: 89.50 },
  { id: 2, name: "Varilla corrugada 3/8\" x 6m", category: "Construcción", stock: { Central: 80, Xela: 45, Escuintla: 60, Cobán: 25, Antigua: 35 }, price: 125.00 },
  { id: 3, name: "Tornillo hexagonal 1/2\" (caja 50u)", category: "Fijación", stock: { Central: 120, Xela: 85, Escuintla: 95, Cobán: 40, Antigua: 70 }, price: 45.00 },
  { id: 4, name: "Lámina galvanizada 8x3 pies", category: "Construcción", stock: { Central: 25, Xela: 18, Escuintla: 22, Cobán: 8, Antigua: 12 }, price: 185.00 },
  { id: 5, name: "Pintura blanca Synteko 1 gal", category: "Pintura", stock: { Central: 35, Xela: 28, Escuintla: 30, Cobán: 12, Antigua: 18 }, price: 225.00 },
  { id: 6, name: "Tubo PVC 1/2\" x 6m", category: "Plomería", stock: { Central: 90, Xela: 65, Escuintla: 75, Cobán: 30, Antigua: 50 }, price: 38.50 },
  { id: 7, name: "Cable eléctrico 12 AWG (rollo 100m)", category: "Eléctrico", stock: { Central: 15, Xela: 10, Escuintla: 12, Cobán: 4, Antigua: 7 }, price: 450.00 },
  { id: 8, name: "Cerradura entrada Schlage", category: "Cerrajería", stock: { Central: 22, Xela: 15, Escuintla: 18, Cobán: 6, Antigua: 10 }, price: 385.00 },
  { id: 9, name: "Silicón transparente Loctite", category: "Adhesivos", stock: { Central: 60, Xela: 45, Escuintla: 50, Cobán: 20, Antigua: 35 }, price: 28.00 },
  { id: 10, name: "Broca SDS 16mm", category: "Herramientas", stock: { Central: 18, Xela: 12, Escuintla: 14, Cobán: 3, Antigua: 8 }, price: 165.00 },
  { id: 11, name: "Manguera jardín 1/2\" x 25m", category: "Jardín", stock: { Central: 30, Xela: 20, Escuintla: 25, Cobán: 8, Antigua: 15 }, price: 95.00 },
  { id: 12, name: "Bisagra acero inox 3\"", category: "Fijación", stock: { Central: 75, Xela: 55, Escuintla: 65, Cobán: 22, Antigua: 40 }, price: 22.00 },
];

const initialClients = [
  { nit: "1234567-8", name: "Juan García", compras: 47, desde: "2019", total: 89450, ultimaVisita: "hace 3 días", badge: "frecuente",
    historial: [
      { fecha: "13/04/2026", productos: "Cemento Progreso x5, Varilla 3/8 x10", monto: 1697.50 },
      { fecha: "10/04/2026", productos: "Tornillo hexagonal x3", monto: 135.00 },
      { fecha: "02/04/2026", productos: "Lámina galvanizada x4", monto: 740.00 },
      { fecha: "25/03/2026", productos: "Cable 12 AWG x1, Cerradura Schlage x2", monto: 1220.00 },
      { fecha: "18/03/2026", productos: "Pintura Synteko x2", monto: 450.00 },
    ],
    topProductos: ["Cemento Progreso 42.5kg", "Varilla corrugada 3/8\"", "Lámina galvanizada"]
  },
  { nit: "9876543-2", name: "Constructora Moderna S.A.", compras: 203, desde: "2018", total: 445200, ultimaVisita: "hace 1 semana", badge: "corporativo",
    historial: [
      { fecha: "09/04/2026", productos: "Cemento Progreso x50, Varilla x100", monto: 16975.00 },
      { fecha: "01/04/2026", productos: "Lámina galvanizada x30, Tubo PVC x40", monto: 7090.00 },
      { fecha: "22/03/2026", productos: "Cable 12 AWG x10", monto: 4500.00 },
      { fecha: "15/03/2026", productos: "Tornillo hexagonal x20, Bisagra x15", monto: 1230.00 },
      { fecha: "05/03/2026", productos: "Cerradura Schlage x8", monto: 3080.00 },
    ],
    topProductos: ["Cemento Progreso 42.5kg", "Varilla corrugada 3/8\"", "Cable eléctrico 12 AWG"]
  },
  { nit: "5555555-5", name: "María López", compras: 12, desde: "2024", total: 18900, ultimaVisita: "hace 2 meses", badge: "nuevo",
    historial: [
      { fecha: "15/02/2026", productos: "Pintura Synteko x2", monto: 450.00 },
      { fecha: "10/01/2026", productos: "Silicón Loctite x5, Bisagra x4", monto: 228.00 },
      { fecha: "28/12/2025", productos: "Manguera jardín x1", monto: 95.00 },
      { fecha: "15/12/2025", productos: "Cerradura Schlage x1", monto: 385.00 },
      { fecha: "01/12/2025", productos: "Broca SDS x2", monto: 330.00 },
    ],
    topProductos: ["Pintura blanca Synteko", "Silicón Loctite", "Bisagra acero inox"]
  },
  { nit: "CF", name: "Consumidor Final", compras: null, desde: null, total: null, ultimaVisita: null, badge: null,
    historial: [],
    topProductos: []
  },
];

// ── Helpers ────────────────────────────────────
function formatQ(num) {
  return "Q " + num.toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getTotalStock(product) {
  return SUCURSALES.reduce((sum, s) => sum + product.stock[s], 0);
}

function getStatus(totalStock) {
  if (totalStock > 20) return "ok";
  if (totalStock >= 5) return "low";
  return "critical";
}

function getStatusLabel(status) {
  if (status === "ok") return "OK";
  if (status === "low") return "Bajo";
  return "Crítico";
}

// ── Reducer ────────────────────────────────────
function inventoryReducer(state, action) {
  switch (action.type) {
    case "SELL":
      return state.map(p =>
        p.id === action.productId
          ? {
            ...p,
            stock: {
              ...p.stock,
              [action.sucursal]: Math.max(0, p.stock[action.sucursal] - action.qty)
            }
          }
          : p
      );
    case "UPDATE_PRICE":
      return state.map(p =>
        p.id === action.productId ? { ...p, price: action.newPrice } : p
      );
    default:
      return state;
  }
}

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════
export default function EDOSistema() {
  const [products, dispatch] = useReducer(inventoryReducer, initialProducts);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [ventasHoy, setVentasHoy] = useState(12450);
  const [ventas, setVentas] = useState([]);
  const [clients, setClients] = useState(initialClients);
  const [toast, setToast] = useState(null);

  // Simulate real-time sales counter
  useEffect(() => {
    const interval = setInterval(() => {
      setVentasHoy(v => v + Math.floor(Math.random() * 650 + 150));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = useCallback((msg, icon = "✅") => {
    setToast({ msg, icon });
  }, []);

  const lowStockCount = products.filter(p => getStatus(getTotalStock(p)) !== "ok").length;

  const sidebarItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "ventas", icon: "🛒", label: "Punto de Venta" },
    { id: "precios", icon: "💰", label: "Gestión Precios", badge: null },
    { id: "clientes", icon: "👥", label: "Clientes CRM" },
  ];

  return (
    <>
      {/* ── Header ────────────────────── */}
      <header className="edo-header">
        <div className="logo-area">
          <h1>⚙️ EDO Sistema</h1>
          <span className="odoo-badge">Powered by Odoo</span>
        </div>
        <div className="header-right">
          <div className="live-indicator">
            <span className="live-dot" />
            Sistema en línea
          </div>
          <span>📅 {new Date().toLocaleDateString("es-GT", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </header>

      {/* ── Layout ────────────────────── */}
      <div className="edo-layout">
        {/* Sidebar */}
        <nav className="edo-sidebar">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
              {item.id === "dashboard" && lowStockCount > 0 && (
                <span className="badge">{lowStockCount}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="edo-content">
          {activeTab === "dashboard" && (
            <Dashboard products={products} ventasHoy={ventasHoy} lowStockCount={lowStockCount} />
          )}
          {activeTab === "ventas" && (
            <PuntoVenta
              products={products}
              dispatch={dispatch}
              ventas={ventas}
              setVentas={setVentas}
              setVentasHoy={setVentasHoy}
              showToast={showToast}
              clients={clients}
            />
          )}
          {activeTab === "precios" && (
            <GestionPrecios products={products} dispatch={dispatch} showToast={showToast} />
          )}
          {activeTab === "clientes" && (
            <CRM clients={clients} setClients={setClients} showToast={showToast} />
          )}
        </main>
      </div>

      {/* ── Footer ────────────────────── */}
      <footer className="edo-footer">
        EDO Sistema v1.0 — Powered by Odoo Community | Grupo 4 — Sistemas de Gestión URL 2026
      </footer>

      {/* ── Toast ─────────────────────── */}
      {toast && (
        <div className="toast toast-success">
          <span className="toast-icon">{toast.icon}</span>
          <span>{toast.msg}</span>
        </div>
      )}
    </>
  );
}


// ═══════════════════════════════════════════════
// TAB 1: DASHBOARD
// ═══════════════════════════════════════════════
function Dashboard({ products, ventasHoy, lowStockCount }) {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = products.reduce((sum, p) => sum + getTotalStock(p), 0);

  const chartData = selectedProduct
    ? SUCURSALES.map(s => ({
      sucursal: s,
      stock: selectedProduct.stock[s],
      fill: SUCURSAL_COLORS[s]
    }))
    : null;

  return (
    <div className="animate-in">
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ animationDelay: "0s" }}>
          <div className="kpi-icon">📦</div>
          <div className="kpi-label">Productos en Stock</div>
          <div className="kpi-value">{totalStock.toLocaleString()}</div>
          <div className="kpi-sub">📈 12 productos activos</div>
        </div>
        <div className="kpi-card" style={{ animationDelay: "0.1s" }}>
          <div className="kpi-icon">🏪</div>
          <div className="kpi-label">Sucursales Activas</div>
          <div className="kpi-value">5</div>
          <div className="kpi-sub"><span style={{ color: "var(--success-light)" }}>● Todas en línea</span></div>
        </div>
        <div className="kpi-card" style={{ animationDelay: "0.2s" }}>
          <div className="kpi-icon">⚠️</div>
          <div className="kpi-label">Alertas Stock Bajo</div>
          <div className="kpi-value" style={{ color: lowStockCount > 0 ? "var(--warning)" : "var(--success-light)" }}>
            {lowStockCount}
          </div>
          <div className="kpi-sub" style={{ color: lowStockCount > 0 ? "var(--warning)" : "var(--success-light)" }}>
            {lowStockCount > 0 ? "⚡ Requiere atención" : "✓ Todo normal"}
          </div>
        </div>
        <div className="kpi-card" style={{ animationDelay: "0.3s" }}>
          <div className="kpi-icon">💰</div>
          <div className="kpi-label">Ventas Hoy</div>
          <div className="kpi-value">{formatQ(ventasHoy)}</div>
          <div className="kpi-sub">📈 Actualizando en vivo</div>
        </div>
      </div>

      {/* Search */}
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          className="input"
          placeholder="Buscar producto o categoría..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Inventory Table */}
      <div className="card" style={{ padding: 0, overflow: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Central</th>
              <th>Xela</th>
              <th>Escuintla</th>
              <th>Cobán</th>
              <th>Antigua</th>
              <th>Total</th>
              <th>Precio</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const total = getTotalStock(p);
              const status = getStatus(total);
              return (
                <tr
                  key={p.id}
                  className={selectedProduct?.id === p.id ? "selected" : ""}
                  onClick={() => setSelectedProduct(selectedProduct?.id === p.id ? null : p)}
                >
                  <td style={{ fontWeight: 600, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.name}
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>{p.category}</td>
                  {SUCURSALES.map(s => (
                    <td key={s} style={{ color: p.stock[s] < 5 ? "var(--danger-light)" : "inherit", fontWeight: p.stock[s] < 5 ? 700 : 400 }}>
                      {p.stock[s]}
                    </td>
                  ))}
                  <td style={{ fontWeight: 700 }}>{total}</td>
                  <td style={{ fontWeight: 600, color: "var(--accent-light)" }}>{formatQ(p.price)}</td>
                  <td>
                    <span className={`status-badge status-${status}`}>
                      {status === "ok" ? "●" : status === "low" ? "▲" : "✖"} {getStatusLabel(status)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      {selectedProduct && (
        <div className="card animate-in-up" style={{ marginTop: 20 }}>
          <h3 className="section-title">
            📊 Stock por Sucursal — {selectedProduct.name}
          </h3>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,107,107,0.15)" />
                <XAxis dataKey="sucursal" stroke="#8AA5C0" tick={{ fontSize: 12 }} />
                <YAxis stroke="#8AA5C0" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "#0F1F3D",
                    border: "1px solid #006B6B",
                    borderRadius: 8,
                    color: "#E8F4F4",
                    fontSize: 13
                  }}
                  formatter={(value) => [`${value} unidades`, "Stock"]}
                />
                <Bar dataKey="stock" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════
// TAB 2: PUNTO DE VENTA
// ═══════════════════════════════════════════════
function PuntoVenta({ products, dispatch, ventas, setVentas, setVentasHoy, showToast, clients }) {
  const [sucursal, setSucursal] = useState("Central");
  const [nitInput, setNitInput] = useState("");
  const [clienteFound, setClienteFound] = useState(null);
  const [showNotFound, setShowNotFound] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);

  const buscarCliente = () => {
    const found = clients.find(c => c.nit === nitInput.trim());
    if (found) {
      setClienteFound(found);
      setShowNotFound(false);
    } else {
      setClienteFound(null);
      setShowNotFound(true);
    }
  };

  const addToCart = () => {
    const prodId = parseInt(selectedProductId);
    if (!prodId || qty < 1) return;
    const prod = products.find(p => p.id === prodId);
    if (!prod) return;
    if (prod.stock[sucursal] < qty) {
      showToast(`Stock insuficiente en ${sucursal}. Disponible: ${prod.stock[sucursal]}`, "⚠️");
      return;
    }
    setCart(prev => {
      const existing = prev.find(c => c.productId === prodId);
      if (existing) {
        return prev.map(c => c.productId === prodId ? { ...c, qty: c.qty + qty } : c);
      }
      return [...prev, { productId: prodId, name: prod.name, price: prod.price, qty }];
    });
    setSelectedProductId("");
    setQty(1);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(c => c.productId !== productId));
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  const procesarVenta = () => {
    if (cart.length === 0) return;
    setProcessing(true);
    setLastInvoice(null);

    setTimeout(() => {
      // Dispatch stock decrements
      cart.forEach(item => {
        dispatch({ type: "SELL", productId: item.productId, sucursal, qty: item.qty });
      });

      const invoiceNum = `FEL-2026-${String(Math.floor(Math.random() * 9000 + 1000))}`;
      const venta = {
        id: Date.now(),
        invoice: invoiceNum,
        sucursal,
        cliente: clienteFound?.name || "Consumidor Final",
        items: [...cart],
        total: cartTotal,
        fecha: new Date().toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" })
      };

      setVentas(prev => [venta, ...prev].slice(0, 5));
      setVentasHoy(v => v + cartTotal);
      setLastInvoice(venta);
      setCart([]);
      setProcessing(false);
      showToast(`Venta ${invoiceNum} procesada — ${formatQ(cartTotal)}`);
    }, 1500);
  };

  return (
    <div className="animate-in">
      <h2 className="section-title">🛒 Punto de Venta</h2>
      <p className="section-subtitle">Procesa ventas en tiempo real con actualización inmediata de inventario</p>

      <div className="pos-layout">
        {/* Left Panel — New Sale */}
        <div className="pos-panel">
          <h3 className="section-title" style={{ fontSize: "1rem" }}>Nueva Venta</h3>

          {/* Sucursal Select */}
          <div className="form-group">
            <label className="form-label">Sucursal</label>
            <select className="select" value={sucursal} onChange={e => setSucursal(e.target.value)}>
              {SUCURSALES.map(s => <option key={s} value={s}>{s === "Central" ? "Central (Guatemala City)" : s}</option>)}
            </select>
          </div>

          {/* NIT Lookup */}
          <div className="form-group">
            <label className="form-label">Cliente NIT</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="input"
                placeholder="Ej: 1234567-8"
                value={nitInput}
                onChange={e => { setNitInput(e.target.value); setClienteFound(null); setShowNotFound(false); }}
                onKeyDown={e => e.key === "Enter" && buscarCliente()}
              />
              <button className="btn btn-primary btn-sm" onClick={buscarCliente}>Buscar</button>
            </div>
          </div>

          {/* Client Result */}
          {clienteFound && (
            <div className="card-glass animate-scale" style={{ marginBottom: 16, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="client-avatar" style={{ width: 36, height: 36, fontSize: "0.9rem" }}>
                  {clienteFound.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{clienteFound.name}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    NIT: {clienteFound.nit} {clienteFound.compras !== null && `• ${clienteFound.compras} compras`}
                  </div>
                </div>
                {clienteFound.badge && (
                  <span className={`client-badge badge-${clienteFound.badge}`} style={{ marginLeft: "auto" }}>
                    {clienteFound.badge === "frecuente" ? "Cliente Frecuente" : clienteFound.badge === "corporativo" ? "Corporativo" : "Nuevo"}
                  </span>
                )}
              </div>
            </div>
          )}
          {showNotFound && (
            <div className="card-glass animate-scale" style={{ marginBottom: 16, padding: 14, borderColor: "var(--warning)" }}>
              <span style={{ color: "var(--warning)" }}>⚠️ NIT no encontrado.</span>
              <button className="btn btn-outline btn-sm" style={{ marginLeft: 12 }} onClick={() => { /* could open register form */ }}>
                Registrar nuevo cliente
              </button>
            </div>
          )}

          <div className="divider" />

          {/* Product Select */}
          <div className="form-group">
            <label className="form-label">Producto</label>
            <select className="select" value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)}>
              <option value="">— Seleccionar producto —</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatQ(p.price)} (Stock {sucursal}: {p.stock[sucursal]})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label className="form-label">Cantidad</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                className="input"
                type="number"
                min="1"
                value={qty}
                onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: 100 }}
              />
              <button className="btn btn-primary" onClick={addToCart}>
                ➕ Agregar al carrito
              </button>
            </div>
          </div>

          <div className="divider" />

          {/* Cart */}
          <h4 style={{ marginBottom: 12, fontSize: "0.9rem", color: "var(--text-muted)" }}>
            🛒 Carrito ({cart.length} {cart.length === 1 ? "item" : "items"})
          </h4>

          {cart.length === 0 ? (
            <div className="empty-state" style={{ padding: 20 }}>
              <div style={{ fontSize: "1.5rem", opacity: 0.3 }}>🛒</div>
              <div style={{ fontSize: "0.85rem" }}>Carrito vacío</div>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.productId} className="cart-item">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{item.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {formatQ(item.price)} × {item.qty}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontWeight: 600, color: "var(--accent-light)" }}>
                      {formatQ(item.price * item.qty)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      style={{ background: "none", border: "none", color: "var(--danger-light)", cursor: "pointer", fontSize: "1.1rem" }}
                    >✕</button>
                  </div>
                </div>
              ))}

              <div className="cart-total">
                <div style={{ fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 400, color: "var(--text-muted)", marginBottom: 4 }}>
                  Total a pagar
                </div>
                {formatQ(cartTotal)}
              </div>
            </>
          )}

          {/* Process Button */}
          <button
            className="btn btn-accent btn-lg"
            style={{ width: "100%", justifyContent: "center", marginTop: 16, fontSize: "1.05rem" }}
            onClick={procesarVenta}
            disabled={cart.length === 0 || processing}
          >
            {processing ? (
              <>
                <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                Procesando...
              </>
            ) : (
              "🧾 PROCESAR VENTA"
            )}
          </button>

          {/* Invoice Result */}
          {lastInvoice && !processing && (
            <div className="animate-scale" style={{ marginTop: 16, padding: 16, background: "rgba(30,132,73,0.1)", border: "1px solid var(--success)", borderRadius: "var(--radius)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: "1.4rem", animation: "successBounce 0.4s ease" }}>✅</span>
                <strong>Venta procesada exitosamente</strong>
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Factura: <strong style={{ color: "var(--accent-light)" }}>{lastInvoice.invoice}</strong>
              </div>
              <div style={{ marginTop: 8, fontSize: "0.82rem", color: "var(--success-light)", display: "flex", alignItems: "center", gap: 6 }}>
                ✓ Inventario actualizado en tiempo real en las 5 sucursales
              </div>
            </div>
          )}
        </div>

        {/* Right Panel — Recent Sales */}
        <div className="pos-panel" style={{ background: "var(--surface2)" }}>
          <h3 className="section-title" style={{ fontSize: "1rem" }}>📋 Últimas Ventas</h3>

          {ventas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <div>No hay ventas registradas en esta sesión</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {ventas.map(v => (
                <div key={v.id} className="card animate-in" style={{ padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, color: "var(--accent-light)", fontSize: "0.85rem" }}>{v.invoice}</span>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{v.fecha}</span>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 4 }}>
                    🏪 {v.sucursal} • 👤 {v.cliente}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {v.items.map(i => `${i.name} ×${i.qty}`).join(", ")}
                  </div>
                  <div style={{ textAlign: "right", fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginTop: 6 }}>
                    {formatQ(v.total)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════
// TAB 3: GESTIÓN DE PRECIOS
// ═══════════════════════════════════════════════
function GestionPrecios({ products, dispatch, showToast }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [propagating, setPropagating] = useState(false);
  const [propagationStage, setPropagationStage] = useState([]);
  const [propagationDone, setPropagationDone] = useState(false);
  const [propagatedProduct, setPropagatedProduct] = useState(null);
  const inputRef = useRef(null);

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditValue(String(product.price));
    setPropagationDone(false);
    setPropagatedProduct(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const commitEdit = () => {
    const newPrice = parseFloat(editValue);
    if (isNaN(newPrice) || newPrice <= 0) {
      setEditingId(null);
      return;
    }

    const prod = products.find(p => p.id === editingId);
    if (!prod || prod.price === newPrice) {
      setEditingId(null);
      return;
    }

    setEditingId(null);
    setPropagating(true);
    setPropagationStage([]);
    setPropagatedProduct(prod.name);

    // Sequential propagation animation
    SUCURSALES.forEach((s, i) => {
      setTimeout(() => {
        setPropagationStage(prev => [...prev, s]);
      }, (i + 1) * 350);
    });

    // Complete after all sucursales
    setTimeout(() => {
      dispatch({ type: "UPDATE_PRICE", productId: prod.id, newPrice });
      setPropagating(false);
      setPropagationDone(true);
      showToast(`Precio de ${prod.name} actualizado a ${formatQ(newPrice)} en 5/5 sucursales`);
    }, SUCURSALES.length * 350 + 400);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setEditingId(null);
  };

  return (
    <div className="animate-in">
      <h2 className="section-title">💰 Gestión de Precios</h2>
      <p className="section-subtitle">Modifica precios y propaga automáticamente a las 5 sucursales</p>

      {/* Comparison Section */}
      <div className="comparison-grid">
        <div className="comparison-before">
          <h3>🚫 SISTEMA ANTERIOR</h3>
          <div className="comparison-item">❌ Generar archivo de precios</div>
          <div className="comparison-item">❌ Copiar a USB</div>
          <div className="comparison-item">❌ Ir físicamente a cada sucursal</div>
          <div className="comparison-item">❌ Cargar manualmente (5 veces)</div>
          <div className="comparison-item">❌ Verificar manualmente</div>
          <div className="comparison-result" style={{ color: "var(--danger-light)" }}>
            ⏱ Resultado: 2-3 horas de trabajo
          </div>
        </div>
        <div className="comparison-after">
          <h3>✅ SISTEMA NUEVO (EDO)</h3>
          <div className="comparison-item">✓ Modificar precio en sistema</div>
          <div className="comparison-item">✓ Propagación automática</div>
          <div className="comparison-item">✓ Las 5 sucursales actualizadas</div>
          <div className="comparison-item">✓ En menos de 2 segundos</div>
          <div className="comparison-item">✓ Confirmación automática</div>
          <div className="comparison-result" style={{ color: "var(--success-light)" }}>
            ⚡ Resultado: 2 segundos
          </div>
        </div>
      </div>

      {/* Propagation Animation */}
      {(propagating || propagationDone) && (
        <div className="card animate-in-up" style={{ marginBottom: 20, textAlign: "center" }}>
          <h4 style={{ marginBottom: 16, fontFamily: "'Syne', sans-serif" }}>
            {propagating ? `⚡ Propagando precio — ${propagatedProduct}` : `✅ Precio propagado — ${propagatedProduct}`}
          </h4>
          <div className="sucursal-indicators">
            {SUCURSALES.map(s => {
              const isDone = propagationStage.includes(s);
              return (
                <div key={s} className={`sucursal-indicator ${isDone ? (propagating ? "propagating" : "done") : ""} ${!propagating && isDone ? "done" : ""}`}>
                  {isDone ? <span className="check">✓</span> : <span style={{ fontSize: "1.2rem", opacity: 0.3 }}>⏳</span>}
                  <span className="name">{s}</span>
                </div>
              );
            })}
          </div>
          {propagationDone && (
            <div className="propagation-result">
              ✓ Precio actualizado en 5/5 sucursales — 1.2s
            </div>
          )}
        </div>
      )}

      {/* Price Editor Table */}
      <div className="card" style={{ padding: 0, overflow: "auto" }}>
        <h3 className="section-title" style={{ padding: "16px 20px 0 20px" }}>
          📝 Editor de Precios en Vivo
        </h3>
        <p style={{ padding: "0 20px 12px 20px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
          Click en cualquier precio para editarlo. Presiona Enter para confirmar.
        </p>
        <table className="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio Actual (Q)</th>
              <th>Stock Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const total = getTotalStock(p);
              const status = getStatus(total);
              return (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td style={{ color: "var(--text-muted)" }}>{p.category}</td>
                  <td>
                    {editingId === p.id ? (
                      <input
                        ref={inputRef}
                        className="price-input"
                        type="number"
                        step="0.01"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={handleKeyDown}
                      />
                    ) : (
                      <span
                        className="price-cell"
                        onClick={() => !propagating && startEdit(p)}
                        style={{ color: "var(--accent-light)", fontWeight: 600 }}
                      >
                        {formatQ(p.price)} ✏️
                      </span>
                    )}
                  </td>
                  <td>{total}</td>
                  <td>
                    <span className={`status-badge status-${status}`}>
                      {status === "ok" ? "●" : status === "low" ? "▲" : "✖"} {getStatusLabel(status)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════
// TAB 4: CLIENTES CRM
// ═══════════════════════════════════════════════
function CRM({ clients, setClients, showToast }) {
  const [searchNit, setSearchNit] = useState("");
  const [foundClient, setFoundClient] = useState(null);
  const [searched, setSearched] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerForm, setRegisterForm] = useState({ nit: "", nombre: "", telefono: "", direccion: "", email: "" });
  const [registerError, setRegisterError] = useState(null);

  const buscar = () => {
    const nit = searchNit.trim();
    if (!nit) return;
    const found = clients.find(c => c.nit.toLowerCase() === nit.toLowerCase());
    setFoundClient(found || null);
    setSearched(true);
  };

  const handleRegister = () => {
    setRegisterError(null);
    const nit = registerForm.nit.trim();
    if (!nit || !registerForm.nombre.trim()) {
      setRegisterError("NIT y Nombre son obligatorios.");
      return;
    }
    // Check for duplicate
    const exists = clients.find(c => c.nit === nit);
    if (exists) {
      setRegisterError(`El NIT ${nit} ya está registrado: ${exists.name}`);
      return;
    }
    const newClient = {
      nit,
      name: registerForm.nombre,
      compras: 0,
      desde: "2026",
      total: 0,
      ultimaVisita: "nuevo",
      badge: "nuevo",
      historial: [],
      topProductos: [],
      telefono: registerForm.telefono,
      direccion: registerForm.direccion,
      email: registerForm.email,
    };
    setClients(prev => [...prev, newClient]);
    showToast(`Cliente ${registerForm.nombre} registrado exitosamente`);
    setRegisterForm({ nit: "", nombre: "", telefono: "", direccion: "", email: "" });
    setShowRegister(false);
  };

  return (
    <div className="animate-in">
      <h2 className="section-title">👥 Clientes — CRM</h2>
      <p className="section-subtitle">Gestión centralizada de clientes con NIT como identificador único</p>

      {/* Problem Banner */}
      <div className="card" style={{ marginBottom: 24, padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", color: "var(--danger-light)", marginBottom: 8, fontSize: "1rem" }}>
            ⚠️ PROBLEMA ANTERIOR
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            Cada compra generaba un cliente nuevo. Un mismo cliente podía tener 8-15 registros diferentes en el sistema.
          </p>
        </div>

        {/* Duplicate Example Cards */}
        <div className="duplicate-cards">
          <div className="duplicate-card">
            <div className="dup-name">Juan García</div>
            <div className="dup-nit">NIT: 1234567-8</div>
            <div style={{ fontSize: "0.72rem", color: "var(--danger-light)", marginTop: 4 }}>Registro #1 — 2019</div>
          </div>
          <div className="duplicate-card">
            <div className="dup-name">Juan A. García</div>
            <div className="dup-nit">NIT: 1234568-9</div>
            <div style={{ fontSize: "0.72rem", color: "var(--danger-light)", marginTop: 4 }}>Registro #4 — 2021</div>
          </div>
          <div className="duplicate-card">
            <div className="dup-name">J. García López</div>
            <div className="dup-nit">NIT: 1234569-0</div>
            <div style={{ fontSize: "0.72rem", color: "var(--danger-light)", marginTop: 4 }}>Registro #8 — 2023</div>
          </div>
        </div>

        <div className="arrow-connector">⬇️</div>

        <div style={{ background: "rgba(30,132,73,0.08)", border: "1px solid rgba(30,132,73,0.2)", borderRadius: "var(--radius-sm)", padding: 16, textAlign: "center" }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", color: "var(--success-light)", fontSize: "1rem", marginBottom: 4 }}>
            ✅ SISTEMA NUEVO: NIT como identificador único
          </h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Un cliente = Un NIT = Un historial completo de compras
          </p>
        </div>
      </div>

      {/* Search by NIT */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 className="section-title" style={{ fontSize: "1rem" }}>🔍 Buscar Cliente por NIT</h3>
        <div style={{ display: "flex", gap: 8, maxWidth: 450 }}>
          <input
            className="input"
            placeholder="Ingrese NIT (ej: 1234567-8, CF)"
            value={searchNit}
            onChange={e => { setSearchNit(e.target.value); setSearched(false); setFoundClient(null); }}
            onKeyDown={e => e.key === "Enter" && buscar()}
          />
          <button className="btn btn-primary" onClick={buscar}>Buscar</button>
        </div>

        {/* Client Card */}
        {searched && foundClient && (
          <div className="client-card" style={{ marginTop: 20 }}>
            <div className="client-header">
              <div className="client-avatar">{foundClient.name.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <strong style={{ fontSize: "1.1rem" }}>{foundClient.name}</strong>
                  {foundClient.badge && (
                    <span className={`client-badge badge-${foundClient.badge}`}>
                      {foundClient.badge === "frecuente" ? "Cliente Frecuente" : foundClient.badge === "corporativo" ? "Corporativo" : "Nuevo"}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 4 }}>
                  NIT: {foundClient.nit}
                  {foundClient.desde && ` • Cliente desde ${foundClient.desde}`}
                  {foundClient.ultimaVisita && ` • Última visita: ${foundClient.ultimaVisita}`}
                </div>
              </div>
            </div>

            {/* Stats */}
            {foundClient.compras !== null && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
                <div style={{ background: "var(--surface2)", padding: 12, borderRadius: "var(--radius-sm)", textAlign: "center" }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{foundClient.compras}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Compras</div>
                </div>
                <div style={{ background: "var(--surface2)", padding: 12, borderRadius: "var(--radius-sm)", textAlign: "center" }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: 700, fontFamily: "'Syne', sans-serif", color: "var(--accent-light)" }}>
                    {formatQ(foundClient.total)}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Total en compras</div>
                </div>
                <div style={{ background: "var(--surface2)", padding: 12, borderRadius: "var(--radius-sm)", textAlign: "center" }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{foundClient.ultimaVisita}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Última visita</div>
                </div>
              </div>
            )}

            {/* Top Products */}
            {foundClient.topProductos.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <h4 style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 8 }}>🏆 Productos más comprados</h4>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {foundClient.topProductos.map((p, i) => (
                    <span key={i} style={{ background: "var(--surface2)", padding: "5px 12px", borderRadius: 20, fontSize: "0.8rem", border: "1px solid var(--surface3)" }}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"} {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Purchase History */}
            {foundClient.historial.length > 0 && (
              <div>
                <h4 style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 8 }}>📋 Últimas 5 compras</h4>
                <table className="data-table" style={{ fontSize: "0.82rem" }}>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Productos</th>
                      <th>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foundClient.historial.map((h, i) => (
                      <tr key={i} style={{ cursor: "default" }}>
                        <td>{h.fecha}</td>
                        <td style={{ color: "var(--text-muted)", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis" }}>{h.productos}</td>
                        <td style={{ fontWeight: 600, color: "var(--accent-light)" }}>{formatQ(h.monto)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* CF Special */}
            {foundClient.nit === "CF" && (
              <div style={{ textAlign: "center", padding: 20, color: "var(--text-muted)" }}>
                <p>Consumidor Final — Solo compras sin registro de historial</p>
              </div>
            )}
          </div>
        )}

        {searched && !foundClient && (
          <div className="animate-scale" style={{ marginTop: 16, padding: 16, background: "rgba(243,156,18,0.08)", border: "1px solid rgba(243,156,18,0.2)", borderRadius: "var(--radius-sm)" }}>
            <span style={{ color: "var(--warning)" }}>⚠️ No se encontró cliente con NIT: <strong>{searchNit}</strong></span>
            <button className="btn btn-outline btn-sm" style={{ marginLeft: 12 }} onClick={() => { setShowRegister(true); setRegisterForm({ ...registerForm, nit: searchNit }); }}>
              Registrar nuevo cliente
            </button>
          </div>
        )}
      </div>

      {/* Register form */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showRegister ? 16 : 0 }}>
          <h3 className="section-title" style={{ fontSize: "1rem", marginBottom: 0 }}>📝 Registrar Nuevo Cliente</h3>
          <button className="btn btn-outline btn-sm" onClick={() => setShowRegister(!showRegister)}>
            {showRegister ? "Cerrar" : "Abrir formulario"}
          </button>
        </div>

        {showRegister && (
          <div className="animate-in-up">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">NIT *</label>
                <input className="input" placeholder="Ej: 1234567-8" value={registerForm.nit}
                  onChange={e => setRegisterForm({ ...registerForm, nit: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input className="input" placeholder="Nombre completo" value={registerForm.nombre}
                  onChange={e => setRegisterForm({ ...registerForm, nombre: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input className="input" placeholder="+502 XXXX-XXXX" value={registerForm.telefono}
                  onChange={e => setRegisterForm({ ...registerForm, telefono: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="input" type="email" placeholder="correo@ejemplo.com" value={registerForm.email}
                  onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label className="form-label">Dirección</label>
                <input className="input" placeholder="Dirección completa" value={registerForm.direccion}
                  onChange={e => setRegisterForm({ ...registerForm, direccion: e.target.value })} />
              </div>
            </div>

            {registerError && (
              <div className="animate-scale" style={{ padding: 12, background: "rgba(192,57,43,0.1)", border: "1px solid var(--danger)", borderRadius: "var(--radius-sm)", marginBottom: 12, color: "var(--danger-light)", fontSize: "0.85rem" }}>
                ❌ {registerError}
              </div>
            )}

            <button className="btn btn-primary" onClick={handleRegister}>
              ✓ Registrar Cliente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
