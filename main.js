/**
 * =====================================================================
 * IMPORTS - Importar dependencias de Firebase y autenticación
 * =====================================================================
 * Se importan las funciones necesarias de Firestore para realizar
 * operaciones CRUD en la base de datos (agregar, leer, actualizar, eliminar).
 * También se importan funciones de autenticación para proteger la página.
 */
// import { db } from "./firebase-config.js";
// import {
//     collection,
//     getDocs,
//     addDoc,
//     updateDoc,
//     deleteDoc,
//     doc,
//     writeBatch
// } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { verifyAuthentication, logout } from "./auth.js";

// =================================================================================
// INICIALIZACIÓN DE LA APLICACIÓN
// =================================================================================

/**
 * EVENT LISTENER: DOMContentLoaded
 * Propósito: Esperar a que el DOM se cargue completamente antes de inicializar la app.
 * - Ejecuta protectPage(initializeApp) que verifica la autenticación del usuario.
 * - Si el usuario está autenticado, inicia la aplicación.
 * - Si no está autenticado, redirige a la página de login.
 */
window.addEventListener('DOMContentLoaded', () => {
    // Protege la página verificando que el usuario esté autenticado
    // Si es válido, ejecuta la función initializeApp con los datos del usuario
    verifyAuthentication()
    initializeApp()    
});

// =================================================================================
// ESTADO GLOBAL - Variables que almacenan los datos en memoria
// =================================================================================

// Array que almacena todos los productos cargados de Firestore
let products = [];

// Array que almacena todos los clientes cargados de Firestore
let clients = [];

// Array que almacena todos los proveedores cargados de Firestore
let suppliers = [];

// Array que almacena todas las ventas registradas en Firestore
let sales = [];

// Array que almacena los productos agregados al carrito actual
let cart = [];

// Variables para almacenar referencias a los gráficos de Chart.js
let categoryChart = null; // Gráfico de ventas por categoría
let paymentMethodChart = null; // Gráfico de métodos de pago utilizados

// =================================================================================
// FUNCIONES PRINCIPALES DE LA APLICACIÓN
// =================================================================================

/**
 * FUNCIÓN: initializeApp()
 * Propósito: Inicializar la aplicación después de que el usuario se autentica.
 * Parámetros: 
 *   - user: Objeto del usuario autenticado (contiene email y otros datos)
 * 
 * Funcionalidades:
 *   1. Registra en consola que el usuario se ha autenticado
 *   2. Agrega dinámicamente un botón "Cerrar Sesión" en la barra lateral
 *   3. Carga todos los datos de Firestore (productos, clientes, proveedores, ventas)
 *   4. Configura los event listeners para la interacción del usuario
 *   5. Renderiza todo el contenido dinámico en la página
 *   6. Muestra la sección de inicio por defecto
 */
async function initializeApp() {
    // Registrar en consola el email del usuario autenticado
    // console.log("Authenticated user:", user.email);
    // console.log("Initializing app...");

    // Obtener referencia a la barra de navegación lateral
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        // Crear elemento de botón para cerrar sesión
        const logoutButton = document.createElement('a');
        logoutButton.href = "#";
        logoutButton.className = "nav-item";
        logoutButton.id = "nav-logout";
        logoutButton.innerHTML = '<span class="nav-icon">🚪</span>Cerrar Sesión';
        
        // Asignar evento click al botón de logout
        logoutButton.onclick = (e) => {
            e.preventDefault(); // Prevenir comportamiento por defecto del enlace
            logout(); // Llamar función logout del módulo auth.js
        };
        
        // Agregar el botón al final de la barra lateral
        sidebar.appendChild(logoutButton);
    }

    // Cargar todos los datos de la base de datos Firestore
    await loadAllData();

    // Configurar todos los event listeners para los controles de la UI
    setupEventListeners();

    // Renderizar todo el contenido dinámico (tablas, gráficos, carrito, etc)
    renderAll();

    // Mostrar la sección de inicio ('inicio-section') por defecto
    showSection('inicio');
    console.log("App initialized successfully.");
}

/**
 * FUNCIÓN: loadAllData()
 * Propósito: Cargar todos los datos de Firestore en memoria (caché local).
 * 
 * Funcionalidades:
 *   1. Ejecuta consultas paralelas a Firestore para obtener 4 colecciones
 *   2. Mapea los documentos de Firestore a arrays JavaScript con sus IDs
 *   3. Almacena los datos en las variables globales (products, clients, suppliers, sales)
 *   4. Registra en consola toda la información cargada
 *   5. Muestra un alert si hay error al cargar los datos
 */
async function loadAllData() {
    console.log("Loading all data from Firestore...");
    try {
        // Ejecutar 4 consultas en paralelo usando Promise.all
        // Esto es más eficiente que esperar a cada consulta secuencialmente
        const [productsSnapshot, clientsSnapshot, suppliersSnapshot, salesSnapshot] = await Promise.all([
            // Obtener todos los documentos de la colección "products"
            getDocs(collection(db, "products")),
            // Obtener todos los documentos de la colección "clients"
            getDocs(collection(db, "clients")),
            // Obtener todos los documentos de la colección "suppliers"
            getDocs(collection(db, "suppliers")),
            // Obtener todos los documentos de la colección "sales"
            getDocs(collection(db, "sales"))
        ]);

        // Mapear cada snapshot a un array de objetos JavaScript
        // cada objeto contiene el id del documento y todos los campos del mismo
        products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        clients = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        suppliers = suppliersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        sales = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Registrar en consola los datos cargados
        console.log("Data loaded:", { products, clients, suppliers, sales });
    } catch (error) {
        // Si hay un error en la carga de datos, registrarlo en consola
        console.error("Error loading data from Firestore:", error);
        // Mostrar un alert al usuario informando del error
        alert("Error al cargar los datos. Por favor, revisa la consola para más detalles.");
    }
}

/**
 * FUNCIÓN: setupEventListeners()
 * Propósito: Configurar todos los event listeners de la interfaz de usuario.
 * 
 * Funcionalidades:
 *   1. Configura listeners para la navegación (menú lateral)
 *   2. Configura listeners para los formularios (crear/actualizar items)
 *   3. Configura listeners para búsqueda y lectura de códigos de barras
 *   4. Configura listeners para generación de reportes
 * 
 * Los event listeners permiten que la app responda a las acciones del usuario.
 */
function setupEventListeners() {
    // ===== NAVEGACIÓN =====
    // Listener para el botón "Inicio" - muestra la sección de inicio
    document.getElementById('nav-inicio').addEventListener('click', () => showSection('inicio'));
    
    // Listener para el botón "Cajero" - muestra la sección de punto de venta
    document.getElementById('nav-cajero').addEventListener('click', () => showSection('cajero'));
    
    // Listener para el botón "Informes" - muestra la sección de reportes
    document.getElementById('nav-informes').addEventListener('click', () => showSection('informes'));
    
    // Listener para el botón "Productos" - muestra la sección de administración de productos
    document.getElementById('nav-productos').addEventListener('click', () => showSection('productos'));
    
    // Listener para el botón "Clientes" - muestra la sección de administración de clientes
    document.getElementById('nav-clientes').addEventListener('click', () => showSection('clientes'));
    
    // Listener para el botón "Proveedor" - muestra la sección de administración de proveedores
    document.getElementById('nav-proveedor').addEventListener('click', () => showSection('proveedor'));

    // ===== FORMULARIOS =====
    // Listener para el formulario de productos - guarda un nuevo producto o actualiza uno existente
    document.getElementById('productForm').addEventListener('submit', saveProduct);
    
    // Listener para el formulario de clientes - guarda un nuevo cliente o actualiza uno existente
    document.getElementById('clientForm').addEventListener('submit', saveClient);
    
    // Listener para el formulario de proveedores - guarda un nuevo proveedor o actualiza uno existente
    document.getElementById('supplierForm').addEventListener('submit', saveSupplier);

    // ===== BÚSQUEDA Y CÓDIGOS DE BARRAS =====
    // Listener para la búsqueda de productos - filtra productos por nombre o código de barras
    document.getElementById('productSearch').addEventListener('keyup', searchProducts);
    
    // Listener para el input de código de barras - agrega producto al carrito al presionar Enter
    document.getElementById('barcodeInput').addEventListener('keydown', handleBarcodeInput);

    // ===== REPORTES =====
    // Listener para cambiar el rango de tiempo en los reportes (hoy, semana, mes, año)
    document.getElementById('time-range-selector').addEventListener('change', updateReports);
}

// =================================================================================
// FUNCIONES DE RENDERIZACIÓN - Mostrar datos en la interfaz
// =================================================================================

/**
 * FUNCIÓN: renderAll()
 * Propósito: Renderizar todo el contenido dinámico de la aplicación en la página.
 * 
 * Funcionalidades:
 *   - Renderiza la cuadrícula de productos (para POS)
 *   - Renderiza las tablas de productos, clientes y proveedores
 *   - Actualiza el carrito de compras
 *   - Actualiza el dashboard con estadísticas
 *   - Actualiza los reportes/informes
 */
function renderAll() {
    // Renderizar la cuadrícula de productos en la sección de cajero
    renderProductGrid();
    
    // Renderizar la tabla de productos en la sección de administración
    renderProductTable();
    
    // Renderizar la tabla de clientes en la sección de administración
    renderClientTable();
    
    // Renderizar la tabla de proveedores en la sección de administración
    renderSupplierTable();
    
    // Actualizar la visualización del carrito (aunque esté vacío)
    updateCart();
    
    // Actualizar el dashboard con estadísticas del día
    updateDashboard();
    
    // Actualizar los gráficos y reportes
    updateReports();
}

/**
 * FUNCIÓN: updateDashboard()
 * Propósito: Actualizar las estadísticas principales mostradas en el inicio.
 * 
 * Calcula y muestra:
 *   - Total de productos en stock
 *   - Cantidad de productos con stock bajo (< 20 unidades)
 *   - Número de ventas del día
 *   - Ingresos totales del día
 */
function updateDashboard() {
    // Contar el total de productos en inventario
    document.getElementById('totalProducts').textContent = products.length;
    
    // Contar productos con stock bajo (menor a 20 unidades)
    const lowStock = products.filter(p => p.stock < 20).length;
    document.getElementById('lowStockProducts').textContent = lowStock;
    
    // Obtener ventas del día de hoy
    const todaySales = getSalesByTimeRange('today');
    
    // Mostrar el número de ventas del día
    document.getElementById('totalSales').textContent = todaySales.length;
    
    // Calcular los ingresos totales sumando el total de cada venta
    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    
    // Mostrar los ingresos del día formateados con 2 decimales
    document.getElementById('totalRevenue').textContent = `$${todayRevenue.toFixed(2)}`;
}

/**
 * FUNCIÓN: renderProductGrid(filteredProducts = products)
 * Propósito: Renderizar una cuadrícula de productos (tarjetas clickeables).
 * 
 * Parámetros:
 *   - filteredProducts: Array de productos a mostrar (por defecto todos los productos)
 * 
 * Funcionalidades:
 *   - Limpia el HTML anterior
 *   - Muestra un mensaje si no hay productos
 *   - Crea tarjetas clickeables para cada producto
 *   - Cada tarjeta muestra el nombre y precio
 *   - Al hacer click, agrega el producto al carrito
 */
function renderProductGrid(filteredProducts = products) {
    // Obtener el contenedor de la cuadrícula de productos
    const productsGrid = document.getElementById('productsGrid');
    
    // Limpiar el contenido anterior
    productsGrid.innerHTML = '';

    // Si no hay productos a mostrar, mostrar mensaje de "no encontrados"
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p>No se encontraron productos.</p>';
        return; // Salir de la función
    }

    // Iterar sobre cada producto y crear una tarjeta
    filteredProducts.forEach(product => {
        // Crear HTML de la tarjeta del producto
        const productCard = `
            <div class="product-card" onclick="addToCart('${product.id}')">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
            </div>
        `;
        // Agregar la tarjeta al contenedor de la cuadrícula
        productsGrid.innerHTML += productCard;
    });
}

/**
 * FUNCIÓN: renderProductTable()
 * Propósito: Renderizar una tabla HTML con todos los productos.
 * 
 * Funcionalidades:
 *   - Limpia la tabla anterior
 *   - Para cada producto, crea una fila con:
 *     - ID (primeros 6 caracteres)
 *     - Nombre
 *     - Categoría
 *     - Precio
 *     - Stock
 *     - Código de barras
 *     - Botones para editar y eliminar
 */
function renderProductTable() {
    // Obtener referencia al cuerpo de la tabla de productos
    const tableBody = document.getElementById('productsTableBody');
    
    // Limpiar todas las filas anteriores
    tableBody.innerHTML = '';
    
    // Iterar sobre cada producto
    products.forEach(product => {
        // Crear una fila de tabla con los datos del producto
        tableBody.innerHTML += `
            <tr>
                <td>${product.id.substring(0, 6)}...</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>${product.barcode}</td>
                <td class="actions-cell">
                    <button onclick="editProduct('${product.id}')">✏️</button>
                    <button class="delete-btn" onclick="deleteItem('products', '${product.id}')">🗑️</button>
                </td>
            </tr>
        `;
    });
}

/**
 * FUNCIÓN: renderClientTable()
 * Propósito: Renderizar una tabla HTML con todos los clientes.
 * 
 * Funcionalidades:
 *   - Limpia la tabla anterior
 *   - Para cada cliente, crea una fila con:
 *     - ID (primeros 6 caracteres)
 *     - Nombre
 *     - Email
 *     - Teléfono
 *     - Dirección
 *     - Botones para editar y eliminar
 */
function renderClientTable() {
    // Obtener referencia al cuerpo de la tabla de clientes
    const tableBody = document.getElementById('clientsTableBody');
    
    // Limpiar todas las filas anteriores
    tableBody.innerHTML = '';
    
    // Iterar sobre cada cliente
    clients.forEach(client => {
        // Crear una fila de tabla con los datos del cliente
        tableBody.innerHTML += `
            <tr>
                <td>${client.id.substring(0, 6)}...</td>
                <td>${client.name}</td>
                <td>${client.email}</td>
                <td>${client.phone}</td>
                <td>${client.address}</td>
                <td class="actions-cell">
                    <button onclick="editClient('${client.id}')">✏️</button>
                    <button class="delete-btn" onclick="deleteItem('clients', '${client.id}')">🗑️</button>
                </td>
            </tr>
        `;
    });
}

/**
 * FUNCIÓN: renderSupplierTable()
 * Propósito: Renderizar una tabla HTML con todos los proveedores.
 * 
 * Funcionalidades:
 *   - Limpia la tabla anterior
 *   - Para cada proveedor, crea una fila con:
 *     - ID (primeros 6 caracteres)
 *     - Nombre de la empresa
 *     - Contacto
 *     - Email
 *     - Teléfono
 *     - Dirección
 *     - Productos que suministra
 *     - Botones para editar y eliminar
 */
function renderSupplierTable() {
    // Obtener referencia al cuerpo de la tabla de proveedores
    const tableBody = document.getElementById('suppliersTableBody');
    
    // Limpiar todas las filas anteriores
    tableBody.innerHTML = '';
    
    // Iterar sobre cada proveedor
    suppliers.forEach(supplier => {
        // Crear una fila de tabla con los datos del proveedor
        tableBody.innerHTML += `
            <tr>
                <td>${supplier.id.substring(0, 6)}...</td>
                <td>${supplier.company}</td>
                <td>${supplier.contact}</td>
                <td>${supplier.email}</td>
                <td>${supplier.phone}</td>
                <td>${supplier.address}</td>
                <td>${supplier.products}</td>
                <td class="actions-cell">
                    <button onclick="editSupplier('${supplier.id}')">✏️</button>
                    <button class="delete-btn" onclick="deleteItem('suppliers', '${supplier.id}')">🗑️</button>
                </td>
            </tr>
        `;
    });
}


// =================================================================================
// OPERACIONES CRUD (Create, Read, Update, Delete)
// =================================================================================

// ===== PRODUCTOS =====

/**
 * FUNCIÓN: openProductModal(productId = null)
 * Propósito: Abrir el modal para crear o editar un producto.
 * 
 * Parámetros:
 *   - productId: ID del producto a editar (null si es nuevo producto)
 * 
 * Funcionalidades:
 *   - Limpia el formulario anterior
 *   - Si es edición: prerrellena los campos con datos existentes
 *   - Si es nuevo: deja los campos vacíos
 *   - Cambia el título del modal según sea crear o editar
 *   - Muestra el modal en la pantalla
 */
function openProductModal(productId = null) {
    // Resetear todos los campos del formulario a su estado inicial
    document.getElementById('productForm').reset();
    
    // Limpiar el ID del producto (usado para identificar si es crear o editar)
    document.getElementById('productId').value = '';
    
    // Obtener referencia al título del modal
    const modalTitle = document.getElementById('productModalTitle');

    // Si se proporciona un ID, es modo edición
    if (productId) {
        // Cambiar título a "Editar Producto"
        modalTitle.textContent = 'Editar Producto';
        
        // Buscar el producto en el array de productos globales
        const product = products.find(p => p.id === productId);
        
        // Si se encontró el producto, prerrellena los campos del formulario
        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productBarcode').value = product.barcode;
        }
    } else {
        // Si no hay ID, es modo crear nuevo producto
        modalTitle.textContent = 'Agregar Producto';
    }
    
    // Mostrar el modal agregando la clase 'active'
    document.getElementById('productModal').classList.add('active');
}

/**
 * FUNCIÓN: saveProduct(event)
 * Propósito: Guardar un producto nuevo o actualizar uno existente en Firestore.
 * 
 * Parámetros:
 *   - event: Evento del formulario (usado para prevenir envío por defecto)
 * 
 * Funcionalidades:
 *   - Obtiene los datos del formulario
 *   - Si hay ID: actualiza el producto en Firestore (UPDATE)
 *   - Si no hay ID: crea un nuevo producto en Firestore (CREATE)
 *   - Cierra el modal após guardar
 *   - Recarga todos los datos de Firestore
 *   - Renderiza nuevamente todas las tablas
 */
async function saveProduct(event) {
    // Prevenir que el navegador envíe el formulario automáticamente
    event.preventDefault();
    
    // Obtener el ID del producto (si es edición) del campo oculto
    const id = document.getElementById('productId').value;
    
    // Recopilar todos los datos del formulario en un objeto
    const data = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        barcode: document.getElementById('productBarcode').value,
    };

    try {
        // Si hay ID, significa que es una actualización
        if (id) {
            // Actualizar el documento en Firestore usando su ID
            await updateDoc(doc(db, "products", id), data);
        } else {
            // Si no hay ID, es un nuevo producto - agregarlo a la colección
            await addDoc(collection(db, "products"), data);
        }
        
        // Cerrar el modal después de guardar exitosamente
        closeProductModal();
        
        // Recargar todos los datos de Firestore para obtener cambios recientes
        await loadAllData();
        
        // Renderizar todas las tablas y gráficos con los datos nuevos
        renderAll();
    } catch (error) {
        // Si hay error, registrarlo en consola
        console.error("Error saving product:", error);
        // Mostrar un alert al usuario
        alert("Error al guardar el producto.");
    }
}

/**
 * FUNCIÓN: editProduct(id)
 * Propósito: Atajo para abrir el modal de edición de un producto.
 * 
 * Parámetros:
 *   - id: ID del producto a editar
 */
function editProduct(id) {
    // Abrir modal de producto en modo edición
    openProductModal(id);
}

// ===== CLIENTES =====

/**
 * FUNCIÓN: openClientModal(clientId = null)
 * Propósito: Abrir el modal para crear o editar un cliente.
 * 
 * Parámetros:
 *   - clientId: ID del cliente a editar (null si es nuevo)
 * 
 * Funcionalidades:
 *   - Limpia el formulario anterior
 *   - Si es edición: prerrellena los campos con datos existentes
 *   - Si es nuevo: deja los campos vacíos
 *   - Cambia el título del modal según sea crear o editar
 */
function openClientModal(clientId = null) {
    // Resetear todos los campos del formulario
    document.getElementById('clientForm').reset();
    
    // Limpiar el ID del cliente
    document.getElementById('clientId').value = '';
    
    // Obtener referencia al título del modal
    const modalTitle = document.getElementById('clientModalTitle');

    // Si se proporciona un ID, es modo edición
    if (clientId) {
        // Cambiar título a "Editar Cliente"
        modalTitle.textContent = 'Editar Cliente';
        
        // Buscar el cliente en el array de clientes globales
        const client = clients.find(c => c.id === clientId);
        
        // Si se encontró, prerrellena los campos
        if (client) {
            document.getElementById('clientId').value = client.id;
            document.getElementById('clientName').value = client.name;
            document.getElementById('clientEmail').value = client.email;
            document.getElementById('clientPhone').value = client.phone;
            document.getElementById('clientAddress').value = client.address;
        }
    } else {
        // Si no hay ID, es modo crear nuevo cliente
        modalTitle.textContent = 'Agregar Cliente';
    }
    
    // Mostrar el modal
    document.getElementById('clientModal').classList.add('active');
}

/**
 * FUNCIÓN: saveClient(event)
 * Propósito: Guardar un cliente nuevo o actualizar uno existente en Firestore.
 * 
 * Parámetros:
 *   - event: Evento del formulario
 */
async function saveClient(event) {
    // Prevenir el envío automático del formulario
    event.preventDefault();
    
    // Obtener el ID del cliente (si es edición)
    const id = document.getElementById('clientId').value;
    
    // Recopilar todos los datos del formulario
    const data = {
        name: document.getElementById('clientName').value,
        email: document.getElementById('clientEmail').value,
        phone: document.getElementById('clientPhone').value,
        address: document.getElementById('clientAddress').value,
    };

    try {
        // Si hay ID, actualizar el cliente
        if (id) {
            await updateDoc(doc(db, "clients", id), data);
        } else {
            // Si no hay ID, crear un nuevo cliente
            await addDoc(collection(db, "clients"), data);
        }
        
        // Cerrar el modal
        closeClientModal();
        
        // Recargar datos de Firestore
        await loadAllData();
        
        // Renderizar la tabla de clientes
        renderClientTable();
    } catch (error) {
        console.error("Error saving client:", error);
        alert("Error al guardar el cliente.");
    }
}

/**
 * FUNCIÓN: editClient(id)
 * Propósito: Atajo para abrir el modal de edición de un cliente.
 */
function editClient(id) {
    openClientModal(id);
}

// ===== PROVEEDORES =====

/**
 * FUNCIÓN: openSupplierModal(supplierId = null)
 * Propósito: Abrir el modal para crear o editar un proveedor.
 * 
 * Parámetros:
 *   - supplierId: ID del proveedor a editar (null si es nuevo)
 */
function openSupplierModal(supplierId = null) {
    // Resetear todos los campos del formulario
    document.getElementById('supplierForm').reset();
    
    // Limpiar el ID del proveedor
    document.getElementById('supplierId').value = '';
    
    // Obtener referencia al título del modal
    const modalTitle = document.getElementById('supplierModalTitle');

    // Si se proporciona un ID, es modo edición
    if (supplierId) {
        // Cambiar título a "Editar Proveedor"
        modalTitle.textContent = 'Editar Proveedor';
        
        // Buscar el proveedor en el array de proveedores globales
        const supplier = suppliers.find(s => s.id === supplierId);
        
        // Si se encontró, prerrellena los campos
        if (supplier) {
            document.getElementById('supplierId').value = supplier.id;
            document.getElementById('supplierCompany').value = supplier.company;
            document.getElementById('supplierContact').value = supplier.contact;
            document.getElementById('supplierEmail').value = supplier.email;
            document.getElementById('supplierPhone').value = supplier.phone;
            document.getElementById('supplierAddress').value = supplier.address;
            document.getElementById('supplierProducts').value = supplier.products;
        }
    } else {
        // Si no hay ID, es modo crear nuevo proveedor
        modalTitle.textContent = 'Agregar Proveedor';
    }
    
    // Mostrar el modal
    document.getElementById('supplierModal').classList.add('active');
}

/**
 * FUNCIÓN: saveSupplier(event)
 * Propósito: Guardar un proveedor nuevo o actualizar uno existente en Firestore.
 * 
 * Parámetros:
 *   - event: Evento del formulario
 */
async function saveSupplier(event) {
    // Prevenir el envío automático del formulario
    event.preventDefault();
    
    // Obtener el ID del proveedor (si es edición)
    const id = document.getElementById('supplierId').value;
    
    // Recopilar todos los datos del formulario
    const data = {
        company: document.getElementById('supplierCompany').value,
        contact: document.getElementById('supplierContact').value,
        email: document.getElementById('supplierEmail').value,
        phone: document.getElementById('supplierPhone').value,
        address: document.getElementById('supplierAddress').value,
        products: document.getElementById('supplierProducts').value,
    };

    try {
        // Si hay ID, actualizar el proveedor
        if (id) {
            await updateDoc(doc(db, "suppliers", id), data);
        } else {
            // Si no hay ID, crear un nuevo proveedor
            await addDoc(collection(db, "suppliers"), data);
        }
        
        // Cerrar el modal
        closeSupplierModal();
        
        // Recargar datos de Firestore
        await loadAllData();
        
        // Renderizar la tabla de proveedores
        renderSupplierTable();
    } catch (error) {
        console.error("Error saving supplier:", error);
        alert("Error al guardar el proveedor.");
    }
}

/**
 * FUNCIÓN: editSupplier(id)
 * Propósito: Atajo para abrir el modal de edición de un proveedor.
 */
function editSupplier(id) {
    openSupplierModal(id);
}

// ===== ELIMINAR GENÉRICO =====

/**
 * FUNCIÓN: deleteItem(collectionName, id)
 * Propósito: Función genérica para eliminar un documento de cualquier colección.
 * 
 * Parámetros:
 *   - collectionName: Nombre de la colección de Firestore (products, clients, suppliers, sales)
 *   - id: ID del documento a eliminar
 * 
 * Funcionalidades:
 *   1. Pide confirmación al usuario antes de eliminar
 *   2. Si confirma: elimina el documento de Firestore
 *   3. Recarga todos los datos de Firestore
 *   4. Renderiza nuevamente todas las tablas
 */
async function deleteItem(collectionName, id) {
    // Pedir confirmación al usuario antes de eliminar
    if (confirm(`¿Estás seguro de que quieres eliminar este elemento?`)) {
        try {
            // Eliminar el documento de la colección especificada
            await deleteDoc(doc(db, collectionName, id));
            
            // Registrar en consola que fue eliminado
            console.log(`${collectionName} item ${id} deleted.`);
            
            // Recargar todos los datos de Firestore
            await loadAllData();
            
            // Renderizar todas las tablas y gráficos
            renderAll();
        } catch (error) {
            // Si hay error registrarlo en consola
            console.error(`Error deleting item from ${collectionName}:`, error);
            // Mostrar un alert al usuario
            alert("Error al eliminar el elemento.");
        }
    }
}


// =================================================================================
// LÓGICA DEL PUNTO DE VENTA (POS) Y CARRITO DE COMPRAS
// =================================================================================

/**
 * FUNCIÓN: searchProducts()
 * Propósito: Buscar y filtrar productos por nombre o código de barras.
 * 
 * Funcionalidades:
 *   1. Obtiene el término de búsqueda del input
 *   2. Filtra productos cuyo nombre o código de barras coincidan
 *   3. Renderiza la cuadrícula actualizada con solo los productos encontrados
 *   4. Se ejecuta en tiempo real a cada tecla que se presiona (evento keyup)
 */
function searchProducts() {
    // Obtener el texto buscado del input y convertir a minúsculas
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    
    // Filtrar productos que coincidan con el término de búsqueda
    // Busca en el nombre del producto o en el código de barras
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        (p.barcode && p.barcode.includes(searchTerm))
    );
    
    // Renderizar solo los productos filtrados
    renderProductGrid(filtered);
}

/**
 * FUNCIÓN: handleBarcodeInput(event)
 * Propósito: Manejar el evento de tecla en el input de código de barras.
 * 
 * Parámetros:
 *   - event: Evento del teclado
 * 
 * Funcionalidades:
 *   - Si se presiona Enter: agrega el producto al carrito
 *   - Si se presiona otra tecla: no hace nada (solo acumula caracteres)
 */
function handleBarcodeInput(event) {
    // Verificar si la tecla presionada es Enter
    if (event.key === 'Enter') {
        // Prevenir el comportamiento por defecto (envío de formulario)
        event.preventDefault();
        // Llamar función para buscar y agregar el producto por código de barras
        addByBarcode();
    }
}

/**
 * FUNCIÓN: addByBarcode()
 * Propósito: Buscar un producto por código de barras y agregarlo al carrito.
 * 
 * Funcionalidades:
 *   1. Lee el código de barras del input
 *   2. Busca el producto correspondiente en el array
 *   3. Si encuentra el producto: lo agrega al carrito
 *   4. Si no encuentra: muestra un alert
 *   5. Limpia el input para el siguiente escaneo
 */
function addByBarcode() {
    // Obtener el código de barras del input
    const barcode = document.getElementById('barcodeInput').value;
    
    // Buscar el producto con ese código de barras
    const product = products.find(p => p.barcode === barcode);
    
    // Si se encontró el producto
    if (product) {
        // Agregar al carrito
        addToCart(product.id);
        // Limpiar el input para el próximo código
        document.getElementById('barcodeInput').value = '';
    } else {
        // Si no se encontró, avisar al usuario
        alert('Producto no encontrado con ese código de barras.');
    }
}

/**
 * FUNCIÓN: addToCart(productId)
 * Propósito: Agregar un producto al carrito de compras.
 * 
 * Parámetros:
 *   - productId: ID del producto a agregar
 * 
 * Funcionalidades:
 *   1. Busca el producto en el array de productos
 *   2. Verifica que haya stock disponible
 *   3. Si el producto ya está en el carrito: incrementa cantidad (si hay stock)
 *   4. Si no está: lo agrega como nuevo item con cantidad 1
 *   5. Actualiza la visualización del carrito
 */
function addToCart(productId) {
    // Buscar el producto en el array global
    const product = products.find(p => p.id === productId);
    
    // Si no existe el producto, salir de la función
    if (!product) return;

    // Verificar que el producto tiene stock disponible
    if (product.stock <= 0) {
        alert("Producto sin stock.");
        return; // Salir de la función
    }

    // Buscar si el producto ya está en el carrito
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        // El producto ya está en el carrito - incrementar cantidad
        // Pero solo si hay suficiente stock
        if (cartItem.quantity < product.stock) {
            cartItem.quantity++;
        } else {
            // No hay suficiente stock para agregar más
            alert("Stock insuficiente.");
        }
    } else {
        // El producto no está en el carrito - agregarlo por primera vez
        // Copiar todos los datos del producto y agregar cantidad inicial de 1
        cart.push({ ...product, quantity: 1 });
    }
    
    // Actualizar la visualización del carrito
    updateCart();
}

/**
 * FUNCIÓN: updateCart()
 * Propósito: Actualizar la visualización del carrito en la página.
 * 
 * Funcionalidades:
 *   1. Calcula el subtotal, impuestos y total
 *   2. Muestra cada item del carrito con opciones para cambiar cantidad
 *   3. Muestra el total y permite completar la venta
 *   4. Muestra un mensaje si el carrito está vacío
 *   5. Deshabilita el botón de completar venta si no hay items
 */
function updateCart() {
    // Obtener referencias a los elementos del HTML
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const completeBtn = document.getElementById('completeBtn');

    // Si el carrito está vacío
    if (cart.length === 0) {
        // Mostrar mensaje de carrito vacío
        cartItems.innerHTML = '<div class="empty-cart"><p>No hay productos en el carrito</p></div>';
        // Ocultar la sección de totales
        cartTotal.style.display = 'none';
        // Deshabilitar el botón de completar venta
        completeBtn.disabled = true;
    } else {
        // El carrito tiene items - renderizarlos
        cartItems.innerHTML = '';
        let subtotal = 0; // Variable para acumular el subtotal
        
        // Iterar sobre cada item del carrito
        cart.forEach(item => {
            // Calcular el precio total del item (precio × cantidad)
            const itemTotal = item.price * item.quantity;
            // Sumar al subtotal
            subtotal += itemTotal;
            
            // Crear HTML para el item
            cartItems.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart('${item.id}')">🗑️</button>
                    </div>
                </div>
            `;
        });

        // Calcular impuestos (19% del subtotal)
        const tax = subtotal * 0.19;
        // Calcular total (subtotal + impuestos)
        const total = subtotal + tax;

        // Mostrar los valores computados en la página
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
        
        // Mostrar la sección de totales
        cartTotal.style.display = 'block';
        // Habilitar el botón de completar venta
        completeBtn.disabled = false;
    }
}

/**
 * FUNCIÓN: changeQuantity(productId, amount)
 * Propósito: Cambiar la cantidad de un producto en el carrito.
 * 
 * Parámetros:
 *   - productId: ID del producto cuya cantidad cambiar
 *   - amount: Cantidad a sumar o restar (-1 para restar, +1 para sumar)
 * 
 * Funcionalidades:
 *   1. Busca el producto en el carrito
 *   2. Si es incremento: verifica que hay stock disponible
 *   3. Si es decremento: reduce la cantidad
 *   4. Si cantidad llega a 0: elimina el producto del carrito
 *   5. Actauliza la visualización del carrito
 */
function changeQuantity(productId, amount) {
    // Buscar el item en el carrito
    const cartItem = cart.find(item => item.id === productId);
    
    // Si no existe en el carrito, salir de la función
    if (!cartItem) return;

    // Buscar el producto en el array global (para saber el stock máximo)
    const product = products.find(p => p.id === productId);
    
    // Si el amount es positivo (incrementar cantidad)
    if (amount > 0 && cartItem.quantity < product.stock) {
        // Incrementar la cantidad (si no excede el stock)
        cartItem.quantity++;
    } else if (amount < 0) {
        // Si el amount es negativo (decrementar cantidad)
        cartItem.quantity--;
        
        // Si la cantidad llega a 0 o menos, eliminar del carrito
        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
    } else if (amount > 0) {
        // Si intenta incrementar pero no hay stock
        alert("Stock insuficiente");
    }

    // Actualizar la visualización del carrito
    updateCart();
}

/**
 * FUNCIÓN: removeFromCart(productId)
 * Propósito: Eliminar completamente un producto del carrito.
 * 
 * Parámetros:
 *   - productId: ID del producto a eliminar
 */
function removeFromCart(productId) {
    // Filtrar el carrito para eliminar el producto especificado
    cart = cart.filter(item => item.id !== productId);
    // Actualizar la visualización del carrito
    updateCart();
}

/**
 * FUNCIÓN: clearCart()
 * Propósito: Vaciar completamente el carrito.
 * 
 * Funcionalidades:
 *   - Limpia el array del carrito
 *   - Actualiza la visualización
 */
function clearCart() {
    // Vaciar el array del carrito
    cart = [];
    // Actualizar la visualización
    updateCart();
}

/**
 * FUNCIÓN: completeSale()
 * Propósito: Completar una venta y guardarla en Firestore.
 * 
 * Funcionalidades:
 *   1. Si el carrito está vacío: no hace nada
 *   2. Obtiene el método de pago seleccionado
 *   3. Crea un objeto de venta con todos los datos
 *   4. Usa WriteBatch para operaciones atómicas:
 *      - Actualiza el stock de cada producto (decrementa)
 *      - Guarda el documento de la venta
 *   5. Limpia el carrito tras completar
 *   6. Recarga los datos de Firestore
 *   7. Re-renderiza toda la aplicación
 */
async function completeSale() {
    // Si el carrito está vacío, no hacer nada
    if (cart.length === 0) return;

    // Obtener el total de la venta (eliminando el símbolo $)
    const total = parseFloat(document.getElementById('total').textContent.replace('$', ''));
    
    // Obtener el método de pago seleccionado (efectivo, tarjeta crédito, etc)
    const paymentMethod = document.querySelector('.payment-method.selected input').value;

    // Crear un batch para ejecutar múltiples operaciones de forma atómica
    // Esto significa: todas se ejecutan o ninguna se ejecuta
    const batch = writeBatch(db);

    // Crear el objeto de venta con todos los datos necesarios
    const sale = {
        date: new Date().toISOString(), // Fecha/hora actual en formato ISO
        // Mapear los items del carrito (copiar solo los datos necesarios)
        items: cart.map(item => ({ 
            id: item.id, 
            name: item.name, 
            quantity: item.quantity, 
            price: item.price, 
            category: item.category 
        })),
        total, // Total de la venta
        paymentMethod // Método de pago usado
    };
    
    // PASO 1: Actualizar el stock para cada producto en el carrito
    for (const item of cart) {
        // Obtener referencia al documento del producto en Firestore
        const productRef = doc(db, "products", item.id);
        // Calcular el nuevo stock (stock actual - cantidad vendida)
        const newStock = item.stock - item.quantity;
        // Agregar operación al batch
        batch.update(productRef, { stock: newStock });
    }
    
    // PASO 2: Agregar el nuevo documento de venta a la colección "sales"
    const salesRef = doc(collection(db, "sales"));
    batch.set(salesRef, sale);

    try {
        // Ejecutar todas las operaciones del batch de forma atómica
        await batch.commit();
        
        // Si todo fue exitoso, mostrar mensaje de confirmación
        alert('¡Venta completada con éxito!');
        
        // Vaciar el carrito
        clearCart();
        
        // Recargar todos los datos de Firestore para obtener cambios
        await loadAllData();
        
        // Re-renderizar toda la interfaz
        renderAll();
    } catch (error) {
        // Si hay error en la transacción
        console.error("Error completing sale:", error);
        alert("Error al completar la venta. El stock puede no estar actualizado. Por favor, refresca la página.");
    }
}


// =================================================================================
// LÓGICA DE REPORTES E INFORMES
// =================================================================================

/**
 * FUNCIÓN: updateReports()
 * Propósito: Actualizar todos los gráficos y estadísticas de reportes.
 * 
 * Funcionalidades:
 *   1. Obtiene el rango de tiempo seleccionado del selector
 *   2. Filtra las ventas según el rango (hoy, semana, mes, año)
 *   3. Actualiza la cuadrícula de estadísticas
 *   4. Actualiza el gráfico de categorías
 *   5. Actualiza el gráfico de métodos de pago
 *   6. Actualiza la tabla de productos más vendidos
 */
function updateReports() {
    // Obtener el rango de tiempo seleccionado (today, week, month, year)
    const timeRange = document.getElementById('time-range-selector').value;
    
    // Filtrar las ventas según el rango de tiempo seleccionado
    const filteredSales = getSalesByTimeRange(timeRange);

    // Actualizar las estadísticas numéricas
    updateStatsGrid(filteredSales);
    
    // Actualizar el gráfico de ventas por categoría
    updateCategoryChart(filteredSales);
    
    // Actualizar el gráfico de métodos de pago
    updatePaymentMethodChart(filteredSales);
    
    // Actualizar la tabla de los 10 productos más vendidos
    updateBestSellingProducts(filteredSales);
}

/**
 * FUNCIÓN: getSalesByTimeRange(timeRange)
 * Propósito: Filtrar ventas por un rango de tiempo específico.
 * 
 * Parámetros:
 *   - timeRange: String que indica el rango ('today', 'week', 'month', 'year')
 * 
 * Retorna: Array de ventas dentro del rango especificado
 * 
 * Lógica:
 *   - 'today': Todas las ventas del día actual
 *   - 'week': Todas las ventas desde el domingo de la semana actual
 *   - 'month': Todas las ventas desde el 1ro del mes actual
 *   - 'year': Todas las ventas desde el 1ro del año actual
 */
function getSalesByTimeRange(timeRange) {
    // Obtener la fecha actual
    const now = new Date();
    
    // Si es hoy, filtrar solo por la fecha actual
    if (timeRange === 'today') {
        // Obtener solo la parte de la fecha (YYYY-MM-DD)
        const today = now.toISOString().split('T')[0];
        // Retornar ventas que comiencen con esa fecha
        return sales.filter(s => s.date.startsWith(today));
    } 
    
    // Para otros rangos, calcular la fecha de inicio
    const startTime = new Date(now);
    
    if (timeRange === 'week') {
        // Restar días hasta el inicio de la semana (domingo)
        // getDay() devuelve 0=domingo, 1=lunes, etc
        startTime.setDate(now.getDate() - now.getDay());
    } else if (timeRange === 'month') {
        // Ir al primer día del mes actual
        startTime.setDate(1);
    } else if (timeRange === 'year') {
        // Ir al primer día del año actual
        startTime.setMonth(0, 1);
    }
    
    // Establecer la hora a las 00:00:00 para incluir todo el día de inicio
    startTime.setHours(0, 0, 0, 0);

    // Retornar solo las ventas que ocurrieron en o después del startTime
    return sales.filter(s => new Date(s.date) >= startTime);
}

/**
 * FUNCIÓN: updateStatsGrid(filteredSales)
 * Propósito: Actualizar tarjetas con estadísticas numéricas principales.
 * 
 * Parámetros:
 *   - filteredSales: Array de ventas para calcular estadísticas
 * 
 * Calcula y muestra:
 *   - Ingresos totales (suma de todos los totales de venta)
 *   - Número de ventas (cantidad de transacciones)
 *   - Productos vendidos (suma de cantidades)
 *   - Venta promedio (ingresos / número de ventas)
 */
function updateStatsGrid(filteredSales) {
    // Obtener referencia al contenedor de estadísticas
    const statsGrid = document.getElementById('reports-stats-grid');
    
    // Calcular el total de ingresos sumando los totales de cada venta
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    
    // Contar el número total de ventas (transacciones)
    const totalSales = filteredSales.length;
    
    // Calcular el total de productos vendidos
    // Primero expande todos los items de todas las ventas
    // Luego suma las cantidades
    const productsSold = filteredSales.reduce((sum, sale) => 
        sum + sale.items.reduce((s, i) => s + i.quantity, 0), 0
    );
    
    // Calcular el promedio de venta (ingresos / número de ventas)
    // Si no hay ventas, el promedio es 0
    const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Crear el HTML con las tarjetas de estadísticas
    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-number">$${totalRevenue.toFixed(2)}</div>
            <div class="stat-label">Ingresos Totales</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${totalSales}</div>
            <div class="stat-label">Ventas Totales</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${productsSold}</div>
            <div class="stat-label">Productos Vendidos</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">$${averageSale.toFixed(2)}</div>
            <div class="stat-label">Venta Promedio</div>
        </div>
    `;
}

/**
 * FUNCIÓN: updateCategoryChart(filteredSales)
 * Propósito: Actualizar el gráfico de ventas por categoría de producto.
 * 
 * Parámetros:
 *   - filteredSales: Array de ventas para generar el gráfico
 * 
 * Funcionalidades:
 *   1. Agrupa todas las ventas por categoría del producto
 *   2. Calcula los ingresos totales por cada categoría (precio × cantidad)
 *   3. Crea un gráfico circular (pie chart) con Chart.js
 *   4. Destruye el gráfico anterior si existe
 *   5. Usa colores predefinidos para diferenciar categorías
 */
function updateCategoryChart(filteredSales) {
    // Expandir todas los items de todas las ventas y agrupar por categoría
    const categoryData = filteredSales
        // Expandir items de todas las ventas en un solo array
        .flatMap(s => s.items)
        // Filtrar solo items que tienen categoría asignada
        .filter(item => item.category)
        // Agrupar por categoría y sumar ingresos
        .reduce((acc, item) => {
            // Si es la primera vez que vemos esta categoría, inicializar en 0
            acc[item.category] = (acc[item.category] || 0) + (item.price * item.quantity);
            return acc;
        }, {});

    // Obtener el contexto del canvas para dibujar el gráfico
    const ctx = document.getElementById('category-chart').getContext('2d');
    
    // Si existe un gráfico anterior, destruirlo para evitar conflictos
    if(categoryChart) categoryChart.destroy();
    
    // Crear el nuevo gráfico con Chart.js
    categoryChart = new Chart(ctx, {
        // Tipo de gráfico: pie (gráfico circular)
        type: 'pie',
        // Datos para el gráfico
        data: {
            // Etiquetas: nombres de las categorías
            labels: Object.keys(categoryData),
            // Datasets: números y colores
            datasets: [{
                // Valores de ingresos por categoría
                data: Object.values(categoryData),
                // Colores para cada categoría
                backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'],
            }]
        },
        // Opciones de visualización
        options: { 
            responsive: true, // Adaptarse al tamaño del contenedor
            maintainAspectRatio: false // No mantener proporción fija
        }
    });
}

/**
 * FUNCIÓN: updatePaymentMethodChart(filteredSales)
 * Propósito: Actualizar el gráfico de métodos de pago utilizados.
 * 
 * Parámetros:
 *   - filteredSales: Array de ventas para generar el gráfico
 * 
 * Funcionalidades:
 *   1. Agrupa las ventas por método de pago
 *   2. Cuenta cuántas transacciones se hicieron con cada método
 *   3. Crea un gráfico de rosquilla (doughnut chart)
 *   4. Destruye el gráfico anterior si existe
 *   5. Convierte nombres de métodos a mayúscula inicial
 */
function updatePaymentMethodChart(filteredSales) {
    // Agrupar ventas por método de pago y contar transacciones
    const paymentData = filteredSales.reduce((acc, sale) => {
        // Contar cantidad de ventas por cada método de pago
        acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + 1;
        return acc;
    }, {});

    // Obtener el contexto del canvas para dibujar el gráfico
    const ctx = document.getElementById('payment-method-chart').getContext('2d');
    
    // Si existe un gráfico anterior, destruirlo para evitar conflictos
    if(paymentMethodChart) paymentMethodChart.destroy();
    
    // Crear el nuevo gráfico de rosquilla con Chart.js
    paymentMethodChart = new Chart(ctx, {
        // Tipo de gráfico: doughnut (gráfico de rosquilla/anillo)
        type: 'doughnut',
        // Datos para el gráfico
        data: {
            // Etiquetas: nombres de los métodos de pago (convertir a mayúscula inicial)
            // 'efectivo' -> 'Efectivo', 'tarjeta' -> 'Tarjeta', etc
            labels: Object.keys(paymentData).map(p => p.charAt(0).toUpperCase() + p.slice(1)),
            // Datasets: números y colores
            datasets: [{
                // Valores de cantidad de transacciones por método
                data: Object.values(paymentData),
                // Colores para cada método de pago
                backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
            }]
        },
        // Opciones de visualización
        options: { 
            responsive: true, // Adaptarse al tamaño del contenedor
            maintainAspectRatio: false // No mantener proporción fija
        }
    });
}

/**
 * FUNCIÓN: updateBestSellingProducts(filteredSales)
 * Propósito: Actualizar la tabla de los 10 productos más vendidos.
 * 
 * Parámetros:
 *   - filteredSales: Array de ventas a analizar
 * 
 * Funcionalidades:
 *   1. Agrupa todos los items vendidos por producto
 *   2. Calcula cantidad total vendida e ingresos de cada producto
 *   3. Ordena productos por cantidad vendida (de mayor a menor)
 *   4. Toma solo los top 10
 *   5. Renderiza una tabla HTML con los resultados
 */
function updateBestSellingProducts(filteredSales) {
    // Agrupar todos los items vendidos por ID de producto
    const productSales = filteredSales
        // Expandir items de todas las ventas en un solo array
        .flatMap(sale => sale.items)
        // Agrupar por ID de producto y sumar cantidades e ingresos
        .reduce((acc, item) => {
            // Si es la primera vez que vemos este producto, inicializar objeto
            if (!acc[item.id]) {
                acc[item.id] = { 
                    name: item.name, 
                    quantity: 0,  // Cantidad total vendida
                    revenue: 0    // Ingresos totales
                };
            }
            // Sumar la cantidad vendida en esta transacción
            acc[item.id].quantity += item.quantity;
            // Sumar los ingresos (precio × cantidad de esta transacción)
            acc[item.id].revenue += item.price * item.quantity;
            return acc;
        }, {});

    // Convertir el objeto a array, ordenar por cantidad (descendente) y tomar los top 10
    const sortedProducts = Object
        .values(productSales)  // Convertir objeto a array
        .sort((a, b) => b.quantity - a.quantity)  // Ordenar por cantidad (de mayor a menor)
        .slice(0, 10);  // Tomar solo los primeros 10

    // Obtener referencia al cuerpo de la tabla
    const tableBody = document.getElementById('best-selling-products-body');
    
    // Limpiar la tabla anterior
    tableBody.innerHTML = '';
    
    // Para cada producto en top 10, crear una fila en la tabla
    sortedProducts.forEach(p => {
        tableBody.innerHTML += `
            <tr>
                <td>${p.name}</td>
                <td>${p.quantity}</td>
                <td>$${p.revenue.toFixed(2)}</td>
            </tr>
        `;
    });
}

/**
 * FUNCIÓN: exportPDF()
 * Propósito: Exportar reportes en formato PDF.
 * 
 * Nota: Esta funcionalidad aún no está implementada en esta versión.
 *       Se muestra un mensaje al usuario informando de esto.
 */
function exportPDF() {
    alert('La funcionalidad de exportar a PDF no está implementada en esta versión.');
}

// =================================================================================
// FUNCIONES DE UTILIDAD E INTERFAZ
// =================================================================================

/**
 * FUNCIÓN: showSection(sectionId)
 * Propósito: Mostrar una sección específica de la aplicación y actualizar el menú.
 * 
 * Parámetros:
 *   - sectionId: ID de la sección a mostrar (inicio, cajero, informes, etc)
 * 
 * Funcionalidades:
 *   1. Oculta todas las secciones existentes
 *   2. Muestra la sección solicitada
 *   3. Desmarca todos los elementos del menú
 *   4. Marca el elemento del menú correspondiente como activo
 */
function showSection(sectionId) {
    // Obtener todos los elementos con clase 'section' (todas las secciones)
    document.querySelectorAll('.section').forEach(section => 
        // Remover la clase 'active' de todas las secciones (ocultarlas)
        section.classList.remove('active')
    );
    
    // Obtener la sección específica a mostrar (ej: 'inicio-section')
    const activeSection = document.getElementById(`${sectionId}-section`);
    
    // Si la sección existe, agregarle la clase 'active' (mostrarla)
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    // Remover la clase 'active' de todos los elementos del menú
    document.querySelectorAll('.nav-item').forEach(item => 
        item.classList.remove('active')
    );
    
    // Obtener el elemento del menú correspondiente a la sección
    const activeNavItem = document.getElementById(`nav-${sectionId}`);
    
    // Si existe, agregarle la clase 'active' (marcarlo como seleccionado)
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
}

/**
 * FUNCIÓN: selectPayment(method)
 * Propósito: Seleccionar el método de pago para la transacción.
 * 
 * Parámetros:
 *   - method: Método de pago ('efectivo', 'tarjeta', etc)
 * 
 * Funcionalidades:
 *   1. Desmarca todos los métodos de pago
 *   2. Marca el método seleccionado como activo
 *   3. Muestra el formulario de efectivo si se selecciona ese método
 */
function selectPayment(method) {
    // Remover la clase 'selected' de todos los métodos de pago
    document.querySelectorAll('.payment-method').forEach(m => 
        m.classList.remove('selected')
    );
    
    // Obtener el elemento con el método de pago seleccionado y marcarlo
    // Usa selectores de atributo para encontrar el elemento por el onclick
    document.querySelector(`.payment-method[onclick*="${method}"]`).classList.add('selected');
    
    // Si se selecciona efectivo, mostrar el formulario de cálculo de cambio
    // Si se selecciona otro método, ocultarlo
    document.getElementById('cashPayment').style.display = method === 'efectivo' ? 'block' : 'none';
}

/**
 * FUNCIÓN: calculateChange()
 * Propósito: Calcular el cambio si se paga en efectivo.
 * 
 * Funcionalidades:
 *   1. Obtiene el total de la venta del carrito
 *   2. Obtiene el monto recibido del cliente
 *   3. Si el monto es suficiente: calcula y muestra el cambio
 *   4. Si el monto es insuficiente: oculta la información de cambio
 */
function calculateChange() {
    // Obtener el total de la venta (eliminando el símbolo $)
    const total = parseFloat(document.getElementById('total').textContent.replace('$', ''));
    
    // Obtener el monto que pagó el cliente
    const received = parseFloat(document.getElementById('receivedAmount').value);
    
    // Obtener referencia al elemento donde mostrar el cambio
    const changeInfo = document.getElementById('changeInfo');
    
    // Si lo pagado es mayor o igual al total
    if (received >= total) {
        // Calcular el cambio restando el total del monto pagado
        const change = received - total;
        
        // Mostrar el cambio en el elemento HTML
        document.getElementById('changeAmount').textContent = `$${change.toFixed(2)}`;
        
        // Mostrar la sección de cambio
        changeInfo.style.display = 'block';
    } else {
        // Si no hay suficiente monto, ocultar la sección de cambio
        changeInfo.style.display = 'none';
    }
}

/**
 * FUNCIÓN: closeProductModal()
 * Propósito: Cerrar el modal de productos.
 * Funcionalidad: Remover la clase 'active' para ocultarlo.
 */
function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

/**
 * FUNCIÓN: closeClientModal()
 * Propósito: Cerrar el modal de clientes.
 * Funcionalidad: Remover la clase 'active' para ocultarlo.
 */
function closeClientModal() {
    document.getElementById('clientModal').classList.remove('active');
}

/**
 * FUNCIÓN: closeSupplierModal()
 * Propósito: Cerrar el modal de proveedores.
 * Funcionalidad: Remover la clase 'active' para ocultarlo.
 */
function closeSupplierModal() {
    document.getElementById('supplierModal').classList.remove('active');
}

// =================================================================================
// EXPORTAR FUNCIONES AL OBJETO WINDOW
// =================================================================================
/**
 * SECCIÓN: Hacer funciones globalmente disponibles
 * 
 * Propósito: Registrar todas las funciones en el objeto window para que
 * puedan ser llamadas directamente desde atributos HTML onclick.
 * 
 * Nota: Aunque no es la mejor práctica, es necesario para que los
 * eventos de onclick en HTML funcionen correctamente.
 * 
 * Ejemplo: <button onclick="saveProduct(event)">Guardar</button>
 */

// Funciones de navegación
window.showSection = showSection;

// Funciones de productos
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.saveProduct = saveProduct;
window.editProduct = editProduct;

// Funciones de clientes
window.openClientModal = openClientModal;
window.closeClientModal = closeClientModal;
window.saveClient = saveClient;
window.editClient = editClient;

// Funciones de proveedores
window.openSupplierModal = openSupplierModal;
window.closeSupplierModal = closeSupplierModal;
window.saveSupplier = saveSupplier;
window.editSupplier = editSupplier;

// Funciones de eliminación
window.deleteItem = deleteItem;

// Funciones de búsqueda y carrito
window.searchProducts = searchProducts;
window.handleBarcodeInput = handleBarcodeInput;
window.addByBarcode = addByBarcode;
window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;

// Funciones de pago
window.selectPayment = selectPayment;
window.calculateChange = calculateChange;
window.completeSale = completeSale;
