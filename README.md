# ⚙️ EDO Sistema — Demo Interactiva ERP

**Ferretería Estrella de Occidente** — Sistema de gestión empresarial  
Demo interactiva para licitación universitaria | Grupo 4 — Sistemas de Gestión URL 2026

---

## 🚀 Cómo ejecutar el proyecto

### Requisitos previos
- **Node.js** versión 18 o superior → [Descargar aquí](https://nodejs.org/)
- **Git** (para clonar el repositorio)

### Pasos para correr desde cualquier computadora

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

# 2. Entrar a la carpeta del proyecto
cd "Gestion Demo"

# 3. Instalar dependencias
npm install

# 4. Ejecutar el servidor de desarrollo
npm run dev
```

Después de ejecutar `npm run dev`, abre tu navegador en:

```
http://localhost:5173/
```

> **Nota:** Si el puerto 5173 está ocupado, Vite automáticamente usa el siguiente disponible (5174, 5175, etc.) y lo muestra en la terminal.

### Si quieres que sea accesible desde otra computadora en la misma red:

```bash
npm run dev -- --host
```

Esto expone el servidor en tu IP local (ej: `http://192.168.1.XX:5173/`), útil para presentar desde otra máquina.

---

## 📦 Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| **React** | 19.x | Framework de interfaz |
| **Vite** | 8.x | Bundler y servidor de desarrollo |
| **Recharts** | 2.x | Gráficos de barras interactivos |
| **Google Fonts** | — | Tipografías Syne (títulos) y DM Sans (cuerpo) |
| **CSS puro** | — | Estilos, animaciones, glassmorphism |

No se usa backend ni base de datos. Todo el estado vive en memoria con `useState` y `useReducer` de React.

---

## 🏗️ Estructura del proyecto

```
Gestion Demo/
├── index.html          ← HTML base con Google Fonts y meta tags
├── package.json        ← Dependencias (react, recharts, vite)
├── vite.config.js      ← Configuración de Vite
├── README.md           ← Este archivo
└── src/
    ├── main.jsx        ← Punto de entrada de React
    ├── index.css       ← Sistema de diseño completo (~500 líneas)
    └── App.jsx         ← Toda la aplicación (~600 líneas)
```

---

## 🎯 Contexto del negocio

La **Ferretería Estrella de Occidente (EDO)** es una ferretería guatemalteca con **5 sucursales**:
- Central (Guatemala City)
- Xela (Quetzaltenango)
- Escuintla
- Cobán
- Antigua

Maneja más de **3,000 productos** y está modernizando su sistema con **Odoo Community**.

### Problemas que el sistema resuelve:

| # | Problema anterior | Solución con EDO Sistema |
|---|---|---|
| 1 | Inventario desincronizado entre sucursales | Inventario en tiempo real compartido |
| 2 | Precios actualizados por USB (2-3 horas) | Propagación automática en 2 segundos |
| 3 | Clientes duplicados (8-15 registros por persona) | NIT como identificador único |
| 4 | Integridad referencial rota | Ventas como transacciones ACID |

---

## 📋 Módulos — Qué hace cada uno

### 📊 Módulo 1: Dashboard (pantalla inicial)

**¿Qué muestra?**
- **4 tarjetas KPI** en la parte superior:
  - **Productos en Stock**: suma total de unidades en todas las sucursales
  - **Sucursales Activas**: siempre 5, con indicador verde "Todas en línea"
  - **Alertas Stock Bajo**: cuenta productos con stock < 20 unidades
  - **Ventas Hoy**: monto en Quetzales que **incrementa automáticamente** cada 8 segundos (simula ventas en vivo)

- **Tabla de inventario consolidado**: muestra los 12 productos con:
  - Stock individual por cada sucursal (Central, Xela, Escuintla, Cobán, Antigua)
  - Stock total sumado
  - Precio en Quetzales
  - Estado con colores:
    - 🟢 **OK** → stock total > 20
    - 🟡 **Bajo** → stock entre 5 y 20
    - 🔴 **Crítico** → stock < 5

- **Barra de búsqueda**: filtra productos por nombre o categoría en tiempo real

- **Gráfico de barras** (Recharts): al hacer **click en cualquier fila** de la tabla, aparece un gráfico mostrando la distribución de stock de ese producto en las 5 sucursales con colores distintos

**¿Qué demuestra?** Que el sistema tiene visibilidad centralizada del inventario en tiempo real.

---

### 🛒 Módulo 2: Punto de Venta

**¿Qué hace?** Simula el proceso completo de una venta.

**Panel izquierdo — "Nueva Venta":**

1. **Selector de sucursal**: eliges en cuál sucursal se hace la venta
2. **Búsqueda de cliente por NIT**:
   - Escribes un NIT y das click en "Buscar"
   - Si el NIT existe, muestra los datos del cliente con animación (nombre, badge de categoría, número de compras)
   - Si no existe, aparece botón "Registrar nuevo cliente"
   - **NITs de prueba**: `1234567-8` (Juan García), `9876543-2` (Constructora Moderna), `5555555-5` (María López), `CF` (Consumidor Final)
3. **Selector de producto**: dropdown con los 12 productos, mostrando precio y stock disponible en la sucursal seleccionada
4. **Cantidad**: campo numérico
5. **"Agregar al carrito"**: agrega el producto con su cantidad
6. **Carrito**: lista de items con subtotales y botón para eliminar
7. **Total**: muestra el monto total en grande con formato `Q X,XXX.XX`
8. **"PROCESAR VENTA"** (botón naranja grande):
   - Muestra un **spinner de carga** por 1.5 segundos
   - Genera un **número de factura** aleatorio (FEL-2026-XXXX)
   - Muestra mensaje de éxito con "✓ Inventario actualizado en tiempo real en las 5 sucursales"
   - **El stock se descuenta realmente** — si vuelves al Dashboard, verás que cambió

**Panel derecho — "Últimas Ventas":**
- Muestra las últimas 5 ventas realizadas en la sesión actual
- Cada venta muestra: número de factura, hora, sucursal, cliente, productos y total

**¿Qué demuestra?** Que cada venta actualiza el inventario automáticamente en todas las sucursales (transacción ACID).

---

### 💰 Módulo 3: Gestión de Precios

**Esta es la pantalla MÁS IMPACTANTE de la demo.**

**Parte superior — Comparativa visual:**

Dos columnas lado a lado:

| 🚫 SISTEMA ANTERIOR (fondo rojo) | ✅ SISTEMA NUEVO EDO (fondo verde) |
|---|---|
| ❌ Generar archivo de precios | ✓ Modificar precio en sistema |
| ❌ Copiar a USB | ✓ Propagación automática |
| ❌ Ir físicamente a cada sucursal | ✓ Las 5 sucursales actualizadas |
| ❌ Cargar manualmente (5 veces) | ✓ En menos de 2 segundos |
| ❌ Verificar manualmente | ✓ Confirmación automática |
| **⏱ Resultado: 2-3 horas** | **⚡ Resultado: 2 segundos** |

**Parte inferior — Editor de precios en vivo:**

1. Tabla con los 12 productos y su precio actual
2. **Click en cualquier precio** → se convierte en un input editable con borde animado
3. **Presiona Enter** para confirmar el nuevo precio
4. Se activa la **animación de propagación**:
   - Aparecen 5 indicadores (uno por sucursal)
   - Cada sucursal se ilumina **secuencialmente** (cada 350ms)
   - Al completarse, cada una muestra un ✓ verde
   - Mensaje final: "✓ Precio actualizado en 5/5 sucursales — 1.2s"
5. El precio se actualiza globalmente — visible también en el Dashboard

**¿Qué demuestra?** El contraste dramático entre el proceso manual (USB, horas) vs. automático (2 segundos). Este es el momento WOW de la presentación.

---

### 👥 Módulo 4: Clientes CRM

**Parte superior — Banner del problema:**

Muestra visualmente el problema de duplicados:
- Texto: "Cada compra generaba un cliente nuevo. Un mismo cliente podía tener 8-15 registros diferentes"
- **3 tarjetas ejemplo** del sistema viejo:
  - "Juan García" / NIT: 1234567-8 / Registro #1 — 2019
  - "Juan A. García" / NIT: 1234568-9 / Registro #4 — 2021
  - "J. García López" / NIT: 1234569-0 / Registro #8 — 2023
- Flecha ⬇️
- "SISTEMA NUEVO: NIT como identificador único — Un cliente = Un NIT = Un historial completo"

**Búsqueda por NIT:**
- Input para escribir NIT + botón Buscar
- Al encontrar un cliente, muestra **tarjeta completa** con:
  - Avatar con inicial, nombre, badge (Frecuente/Corporativo/Nuevo)
  - 3 estadísticas: total compras, monto total en Q, última visita
  - 🏆 Top 3 productos más comprados (con medallas 🥇🥈🥉)
  - 📋 Tabla con últimas 5 compras (fecha, productos, monto)
- Si el NIT no existe, opción de "Registrar nuevo cliente"

**Formulario de registro:**
- Campos: NIT, Nombre, Teléfono, Email, Dirección
- **Validación de duplicados**: si el NIT ya existe, muestra error con los datos del cliente existente
- Botón registrar con feedback de éxito

**Clientes de prueba:**

| NIT | Cliente | Compras | Total | Tipo |
|---|---|---|---|---|
| 1234567-8 | Juan García | 47 | Q89,450 | Frecuente |
| 9876543-2 | Constructora Moderna S.A. | 203 | Q445,200 | Corporativo |
| 5555555-5 | María López | 12 | Q18,900 | Nuevo |
| CF | Consumidor Final | — | — | Sin registro |

**¿Qué demuestra?** Que con NIT único se eliminan duplicados y se tiene historial completo por cliente.

---

## 🎨 Diseño visual

- **Tema oscuro** tipo "enterprise SaaS"
- **Paleta de colores**:
  - Primary: `#006B6B` (teal oscuro)
  - Accent: `#D97B00` (naranja)
  - Background: `#0A1628` (azul marino muy oscuro)
  - Superficies: `#0F1F3D`, `#162845`
- **Glassmorphism** sutil con `backdrop-filter: blur()`
- **Bordes con glow teal** en hover
- **Animaciones suaves**: fade-in, slide-in, scale, pulse
- **Tipografía**: Syne (títulos), DM Sans (cuerpo)
- **Sidebar** con navegación e indicador de alertas

---

## 🔄 Cómo funciona internamente

### Estado compartido
Todos los datos de productos/inventario viven en un **`useReducer`** en el componente principal `EDOSistema`. Esto permite que:
- Una **venta en POS** descuente stock → visible inmediatamente en Dashboard
- Un **cambio de precio** → visible en la tabla del Dashboard y en el POS

### Acciones del reducer:
- `SELL`: descuenta `qty` unidades del producto en la sucursal especificada
- `UPDATE_PRICE`: cambia el precio de un producto (propaga a todas las sucursales)

### Simulación en tiempo real:
- `setInterval` cada 8 segundos suma entre Q150-Q800 al contador de "Ventas Hoy"
- La animación de propagación de precios usa `setTimeout` secuencial (350ms por sucursal)
- El proceso de venta simula latencia con `setTimeout` de 1.5 segundos

---

## 📝 Guía para la presentación

| Paso | Acción | Impacto |
|---|---|---|
| 1 | Abrir Dashboard | El jurado ve KPIs en vivo, inventario con alertas de color |
| 2 | Click en un producto → gráfico | Visualización de stock distribuido por sucursal |
| 3 | Ir a Punto de Venta | Demostrar flujo de venta completo |
| 4 | Buscar NIT 1234567-8 | Se autocomplementan datos del cliente |
| 5 | Agregar productos al carrito | Proceso intuitivo y rápido |
| 6 | Procesar venta | Spinner + factura generada + mensaje de éxito |
| 7 | Volver al Dashboard | **Stock actualizado** — este es el momento "ajá" |
| 8 | Ir a Gestión de Precios | Mostrar comparativa ANTES vs AHORA |
| 9 | Editar un precio | **Animación de propagación** — momento WOW |
| 10 | Ir a Clientes CRM | Mostrar problema de duplicados vs solución NIT |
| 11 | Buscar NIT 9876543-2 | Cliente corporativo con historial completo |

---

## 📄 Licencia

Proyecto académico — Grupo 4, Sistemas de Gestión, Universidad Rafael Landívar 2026
