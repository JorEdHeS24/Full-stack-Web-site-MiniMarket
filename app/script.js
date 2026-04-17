            // Base de datos simulada
            let products = [
                { id: 1, name: "Coca Cola 350ml", price: 2.50, barcode: "7501234567890", stock: 50 },
                { id: 2, name: "Pan de molde", price: 3.20, barcode: "7502234567891", stock: 25 },
                { id: 3, name: "Leche entera 1L", price: 4.80, barcode: "7503234567892", stock: 30 },
                { id: 4, name: "Arroz 1kg", price: 5.50, barcode: "7504234567893", stock: 40 },
                { id: 5, name: "Aceite girasol 500ml", price: 6.75, barcode: "7505234567894", stock: 20 },
                { id: 6, name: "Huevos docena", price: 4.20, barcode: "7506234567895", stock: 35 },
                { id: 7, name: "Papel higiénico 4 rollos", price: 8.90, barcode: "7507234567896", stock: 15 },
                { id: 8, name: "Jabón de manos", price: 3.45, barcode: "7508234567897", stock: 25 },
                { id: 9, name: "Pasta dental", price: 4.60, barcode: "7509234567898", stock: 18 },
                { id: 10, name: "Shampoo 400ml", price: 7.80, barcode: "7510234567899", stock: 22 },
                { id: 11, name: "Galletas Oreo", price: 3.90, barcode: "7511234567890", stock: 45 },
                { id: 12, name: "Yogurt natural", price: 2.80, barcode: "7512234567891", stock: 28 },
                { id: 13, name: "Café molido 250g", price: 6.20, barcode: "7513234567892", stock: 32 },
                { id: 14, name: "Azúcar 1kg", price: 3.75, barcode: "7514234567893", stock: 38 },
                { id: 15, name: "Sal 500g", price: 1.20, barcode: "7515234567894", stock: 55 },
                { id: 16, name: "Atún enlatado", price: 2.95, barcode: "7516234567895", stock: 42 },
                { id: 17, name: "Detergente líquido", price: 9.50, barcode: "7517234567896", stock: 12 },
                { id: 18, name: "Cerveza 6 pack", price: 12.80, barcode: "7518234567897", stock: 16 },
                { id: 19, name: "Queso fresco 250g", price: 5.40, barcode: "7519234567898", stock: 24 },
                { id: 20, name: "Mantequilla 200g", price: 4.85, barcode: "7520234567899", stock: 29 }
            ];

            let clients = [
                { id: 1, name: "Juan Pérez", email: "juanperez@email.com", phone: "987654321", address: "Calle Falsa 123" },
                { id: 2, name: "María Gómez", email: "mariagomez@email.com", phone: "912345678", address: "Avenida Siempre Viva 742" },
                { id: 3, name: "Pedro López", email: "pedrolopez@email.com", phone: "987123456", address: "Calle Verdadera 456" },
                { id: 4, name: "Luisa Martínez", email: "luismartinez@email.com", phone: "963852741", address: "Avenida del Libertador 852" },
                { id: 5, name: "Carlos Sánchez", email: "carlossanchez@email.com", phone: "789456123", address: "Calle de la Paz 159" },
                { id: 6, name: "Ana Torres", email: "anatorres@email.com", phone: "654789321", address: "Avenida de Mayo 753" },
                { id: 7, name: "Jorge Díaz", email: "jorgediaz@email.com", phone: "321654987", address: "Calle de la Libertad 951" },
                { id: 8, name: "Laura Fernández", email: "laurafernandez@email.com", phone: "147258369", address: "Avenida de la República 159" }
            ];

            let suppliers = [
                { id: 1, name: "Proveedor 1", contact: "Contacto 1", email: "proveedor1@email.com", phone: "987654321", address: "Calle Proveedor 1", products: "Producto A, Producto B" },
                { id: 2, name: "Proveedor 2", contact: "Contacto 2", email: "proveedor2@email.com", phone: "912345678", address: "Avenida Proveedor 2", products: "Producto C, Producto D" },
                { id: 3, name: "Proveedor 3", contact: "Contacto 3", email: "proveedor3@email.com", phone: "987123456", address: "Calle Proveedor 3", products: "Producto E, Producto F" },
                { id: 4, name: "Proveedor 4", contact: "Contacto 4", email: "proveedor4@email.com", phone: "963852741", address: "Avenida Proveedor 4", products: "Producto G, Producto H" },
                { id: 5, name: "Proveedor 5", contact: "Contacto 5", email: "proveedor5@email.com", phone: "789456123", address: "Calle Proveedor 5", products: "Producto I, Producto J" },
                { id: 6, name: "Proveedor 6", contact: "Contacto 6", email: "proveedor6@email.com", phone: "654789321", address: "Avenida Proveedor 6", products: "Producto K, Producto L" },
                { id: 7, name: "Proveedor 7", contact: "Contacto 7", email: "proveedor7@email.com", phone: "321654987", address: "Calle Proveedor 7", products: "Producto M, Producto N" },
                { id: 8, name: "Proveedor 8", contact: "Contacto 8", email: "proveedor8@email.com", phone: "147258369", address: "Avenida Proveedor 8", products: "Producto O, Producto P" }
            ];

            
            let cart = [];
            let sales = [];
            let saleCounter = 1;

            // Inicializar la aplicación
            function init() {
                displayProducts(); // Mostrar productos en la sección de cajero
                updateCartDisplay(); // Actualizar el carrito
                updateDashboardStats(); // Actualizar estadísticas del dashboard
            }

            // Mostrar productos en la sección de cajero
            function displayProducts(filteredProducts = products) {
                const grid = document.getElementById('productsGrid');
                grid.innerHTML = ''; // Limpiar el contenedor de productos

                filteredProducts.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    productCard.onclick = () => addToCart(product); // Agregar producto al carrito
                    productCard.innerHTML = `
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-stock">Stock: ${product.stock}</div>
                `;
                    grid.appendChild(productCard);
                });
            }

            // Buscar productos por nombre
            function searchProducts() {
                const searchTerm = document.getElementById('productSearch').value.toLowerCase();
                const filtered = products.filter(product =>
                    product.name.toLowerCase().includes(searchTerm)
                );
                displayProducts(filtered); // Mostrar productos filtrados
            }

            // Agregar producto al carrito
            function addToCart(product) {
                const existingItem = cart.find(item => item.id === product.id);

                if (existingItem) {
                    if (existingItem.quantity < product.stock) {
                        existingItem.quantity += 1; // Incrementar cantidad si hay stock
                    } else {
                        alert('Stock insuficiente');
                        return;
                    }
                } else {
                    cart.push({ ...product, quantity: 1 }); // Agregar nuevo producto al carrito
                }

                updateCartDisplay(); // Actualizar vista del carrito
            }

            // Actualizar cantidad de un producto en el carrito
            function updateQuantity(productId, change) {
                const cartItem = cart.find(item => item.id === productId);

                if (!cartItem) return;

                cartItem.quantity += change;

                if (cartItem.quantity <= 0) {
                    // Si la cantidad es 0 o menor, eliminar el producto del carrito
                    cart = cart.filter(item => item.id !== productId);
                } else if (cartItem.quantity > cartItem.stock) {
                    // Si la cantidad supera el stock disponible, revertir el cambio
                    alert('Stock insuficiente');
                    cartItem.quantity -= change;
                }

                updateCartDisplay(); // Actualizar la vista del carrito
            }

            // Actualizar vista del carrito
            function updateCartDisplay() {
                const cartItems = document.getElementById('cartItems');
                const cartTotal = document.getElementById('cartTotal');
                const completeBtn = document.getElementById('completeBtn');

                if (cart.length === 0) {
                    cartItems.innerHTML = `
                <div class="empty-cart">
                    <p>No hay productos en el carrito</p>
                    <p style="font-size: 14px; margin-top: 8px;">Busca y agrega productos para comenzar</p>
                </div>
            `;
                    cartTotal.style.display = 'none';
                    completeBtn.disabled = true;
                    return;
                }

                cartItems.innerHTML = '';
                let subtotal = 0;

                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    subtotal += itemTotal;

                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} c/u</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <div style="font-weight: 600;">$${itemTotal.toFixed(2)}</div>
            `;
                    cartItems.appendChild(cartItem);
                });

                const tax = subtotal * 0.19;
                const total = subtotal + tax;

                document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
                document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
                document.getElementById('total').textContent = `$${total.toFixed(2)}`;

                cartTotal.style.display = 'block';
                completeBtn.disabled = false;
            }

            // Completar venta
            function completeSale() {
                if (cart.length === 0) return;

                const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
                const total = parseFloat(document.getElementById('total').textContent.replace('$', ''));

                if (paymentMethod === 'efectivo') {
                    const receivedAmount = parseFloat(document.getElementById('receivedAmount').value) || 0;
                    if (receivedAmount < total) {
                        alert('El monto recibido es insuficiente');
                        return;
                    }
                }

                // Reducir stock
                cart.forEach(cartItem => {
                    const product = products.find(p => p.id === cartItem.id);
                    if (product) {
                        product.stock -= cartItem.quantity;
                    }
                });

                // Registrar venta
                const sale = {
                    id: saleCounter++,
                    items: [...cart],
                    total: total,
                    paymentMethod: paymentMethod,
                    date: new Date().toLocaleString('es-ES'),
                    customer: 'cliente@mail.com'
                };
                sales.push(sale);

                alert(`Venta completada exitosamente!\nTotal: $${total.toFixed(2)}\nMétodo: ${paymentMethod}`);
                clearCart(); // Limpiar carrito
                updateDashboardStats(); // Actualizar estadísticas
            }

            // Limpiar carrito
            function clearCart() {
                cart = [];
                updateCartDisplay();
                document.getElementById('receivedAmount').value = '';
            }

            // Actualizar estadísticas del dashboard
            function updateDashboardStats() {
                const totalProducts = products.length;
                const totalSales = sales.length;
                const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
                const lowStockProducts = products.filter(p => p.stock <= 10).length;

                document.getElementById('totalProducts').textContent = totalProducts;
                document.getElementById('totalSales').textContent = totalSales;
                document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
                document.getElementById('lowStockProducts').textContent = lowStockProducts;
            }

            // Mostrar la sección seleccionada
            function showSection(sectionId) {
                // Ocultar todas las secciones
                const sections = document.querySelectorAll('.section');
                sections.forEach(section => section.classList.remove('active'));

                // Mostrar la sección seleccionada
                const selectedSection = document.getElementById(`${sectionId}-section`);
                if (selectedSection) {
                    selectedSection.classList.add('active');
                }

                // Actualizar la clase "active" en los elementos de la barra lateral
                const navItems = document.querySelectorAll('.nav-item');
                navItems.forEach(item => item.classList.remove('active'));

                const activeNavItem = Array.from(navItems).find(item => item.getAttribute('onclick') === `showSection('${sectionId}')`);
                if (activeNavItem) {
                    activeNavItem.classList.add('active');
                }
            }




            // ------------------ PRODUCTOS ------------------

            function updateProductTable() {
                const tbody = document.querySelector('#productos-section .table-content tbody');
                tbody.innerHTML = '';
                products.forEach(product => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="editProduct(${product.id})">✏️ Editar</button>
                    <button class="action-btn btn-delete" onclick="deleteProduct(${product.id})">🗑️ Eliminar</button>
                </td>
            `;
                    tbody.appendChild(row);
                });
            }

            function editProduct(id) {
                const product = products.find(p => p.id === id);
                if (!product) return;
                document.getElementById('editProductId').value = product.id;
                document.getElementById('editProductName').value = product.name;
                document.getElementById('editProductCategory').value = product.category;
                document.getElementById('editProductPrice').value = product.price;
                document.getElementById('editProductStock').value = product.stock;
                document.getElementById('editProductModal').classList.add('show');
            }

            function closeEditProductModal() {
                document.getElementById('editProductModal').classList.remove('show');
                document.getElementById('editProductForm').reset();
            }

            function updateProduct(event) {
                event.preventDefault();
                const id = parseInt(document.getElementById('editProductId').value);
                const name = document.getElementById('editProductName').value;
                const category = document.getElementById('editProductCategory').value;
                const price = parseFloat(document.getElementById('editProductPrice').value);
                const stock = parseInt(document.getElementById('editProductStock').value);
                const product = products.find(p => p.id === id);
                if (!product) return;
                product.name = name;
                product.category = category;
                product.price = price;
                product.stock = stock;
                updateProductTable();
                closeEditProductModal();
                alert('Producto actualizado exitosamente');
            }

            function deleteProduct(id) {
                if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
                    products = products.filter(p => p.id !== id);
                    updateProductTable();
                    alert('Producto eliminado exitosamente');
                }
            }

            function openAddProductModal() {
                document.getElementById('addProductModal').classList.add('show');
            }

            function closeAddProductModal() {
                document.getElementById('addProductModal').classList.remove('show');
                               document.getElementById('addProductForm').reset();
            }

            function addNewProduct(event) {
                event.preventDefault();
                const name = document.getElementById('newProductName').value;
                const category = document.getElementById('newProductCategory').value;
                const price = parseFloat(document.getElementById('newProductPrice').value);
                const stock = parseInt(document.getElementById('newProductStock').value);
                if (!name || !category || isNaN(price) || isNaN(stock)) {
                    alert('Completa todos los campos correctamente.');
                    return;
                }
                const newProduct = {
                    id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
                    name,
                    category,
                    price,
                    stock
                };
                products.push(newProduct);
                updateProductTable();
                closeAddProductModal();
                alert('Producto agregado exitosamente');
            }

            // ------------------ CLIENTES ------------------

            function updateClientList() {
                const tbody = document.querySelector('#clientes-section .table-content tbody');
                tbody.innerHTML = '';
                clients.forEach(client => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                <td>${client.name}</td>
                <td>${client.email}</td>
                <td>${client.phone}</td>
                <td>${client.address}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="editClient(${client.id})">✏️ Editar</button>
                    <button class="action-btn btn-delete" onclick="deleteClient(${client.id})">🗑️ Eliminar</button>
                </td>
            `;
                    tbody.appendChild(row);
                });
            }

            function editClient(id) {
                const client = clients.find(c => c.id === id);
                if (!client) return;
                document.getElementById('editClientId').value = client.id;
                document.getElementById('editClientName').value = client.name;
                document.getElementById('editClientEmail').value = client.email;
                document.getElementById('editClientPhone').value = client.phone;
                document.getElementById('editClientAddress').value = client.address;
                showSection('editar-cliente');
            }

            function updateClient(event) {
                event.preventDefault();
                const id = parseInt(document.getElementById('editClientId').value);
                const name = document.getElementById('editClientName').value;
                const email = document.getElementById('editClientEmail').value;
                const phone = document.getElementById('editClientPhone').value;
                const address = document.getElementById('editClientAddress').value;
                const client = clients.find(c => c.id === id);
                if (!client) return;
                client.name = name;
                client.email = email;
                client.phone = phone;
                client.address = address;
                updateClientList();
                showSection('clientes');
                alert('Cliente actualizado exitosamente');
            }

            function deleteClient(id) {
                if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
                    clients = clients.filter(c => c.id !== id);
                    updateClientList();
                    alert('Cliente eliminado exitosamente');
                }
            }

            // -------- Agregar cliente --------
            function showSection(sectionId) {
                document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
                const selected = document.getElementById(`${sectionId}-section`);
                if (selected) selected.classList.add('active');
            }

            // ------------------ PROVEEDORES ------------------

            function updateSupplierList() {
                const tbody = document.querySelector('#proveedor-section .table-content tbody');
                tbody.innerHTML = '';
                suppliers.forEach(supplier => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                <td>${supplier.name}</td>
                <td>${supplier.contact}</td>
                <td>${supplier.email}</td>
                <td>${supplier.phone}</td>
                <td>${supplier.address}</td>
                <td>${supplier.products}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="editSupplier(${supplier.id})">✏️ Editar</button>
                    <button class="action-btn btn-delete" onclick="deleteSupplier(${supplier.id})">🗑️ Eliminar</button>
                </td>
            `;
                    tbody.appendChild(row);
                });
            }

            function editSupplier(id) {
                const supplier = suppliers.find(s => s.id === id);
                if (!supplier) return;
                document.getElementById('editSupplierId').value = supplier.id;
                document.getElementById('editSupplierCompany').value = supplier.name;
                document.getElementById('editSupplierContact').value = supplier.contact;
                document.getElementById('editSupplierEmail').value = supplier.email;
                document.getElementById('editSupplierPhone').value = supplier.phone;
                document.getElementById('editSupplierAddress').value = supplier.address;
                document.getElementById('editSupplierProducts').value = supplier.products;
                showSection('editar-proveedor');
            }

            function updateSupplier(event) {
                event.preventDefault();
                const id = parseInt(document.getElementById('editSupplierId').value);
                const name = document.getElementById('editSupplierCompany').value;
                const contact = document.getElementById('editSupplierContact').value;
                const email = document.getElementById('editSupplierEmail').value;
                const phone = document.getElementById('editSupplierPhone').value;
                const address = document.getElementById('editSupplierAddress').value;
                const productsStr = document.getElementById('editSupplierProducts').value;
                const supplier = suppliers.find(s => s.id === id);
                if (!supplier) return;
                supplier.name = name;
                supplier.contact = contact;
                supplier.email = email;
                supplier.phone = phone;
                supplier.address = address;
                supplier.products = productsStr;
                updateSupplierList();
                showSection('proveedor');
                alert('Proveedor actualizado exitosamente');
            }

            function deleteSupplier(id) {
                if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
                    suppliers = suppliers.filter(s => s.id !== id);
                    updateSupplierList();
                    alert('Proveedor eliminado exitosamente');
                }
            }

            // -------- Agregar proveedor --------
            function saveSupplier(event) {
                event.preventDefault();
                const name = document.getElementById('supplierCompany').value;
                const contact = document.getElementById('supplierContact').value;
                const email = document.getElementById('supplierEmail').value;
                const phone = document.getElementById('supplierPhone').value;
                const address = document.getElementById('supplierAddress').value;
                const productsStr = document.getElementById('supplierProducts').value;
                if (!name || !contact || !email || !phone) {
                    alert('Completa todos los campos obligatorios.');
                    return;
                }
                const newSupplier = {
                    id: suppliers.length ? Math.max(...suppliers.map(s => s.id)) + 1 : 1,
                    name,
                    contact,
                    email,
                    phone,
                    address,
                    products: productsStr
                };
                suppliers.push(newSupplier);
                updateSupplierList();
                showSection('proveedor');
                alert('Proveedor agregado exitosamente');
            }

            function clearSupplierForm() {
                document.getElementById('supplierForm').reset();
                showSection('proveedor');
            }

            // -------- Agregar cliente desde sección (puedes crear un formulario similar al de proveedor) --------
            // Si tienes un formulario para agregar cliente, implementa aquí la función
            // function saveClient(event) { ... }

            // --------- Inicialización ---------
            window.onload = function () {
                updateProductTable();
                updateClientList();
                updateSupplierList();
                init()
            };