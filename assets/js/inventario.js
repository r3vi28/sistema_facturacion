const products = [];
let editingIndex = null;

// Elementos del DOM
const productModal = document.getElementById('product-modal');
const closeModal = document.getElementById('close-modal');
const addProductBtn = document.getElementById('add-product-btn');
const productForm = document.getElementById('productForm');
const productSearchBar = document.getElementById('product-search-bar');
const modalTitle = document.getElementById('modal-title');

// Modal de entrada de cantidad
const increaseQuantityModal = document.getElementById('increase-quantity-modal');
const quantityInput = document.getElementById('quantity-input');
const confirmQuantityBtn = document.getElementById('confirm-quantity');

// Abrir modal de producto
function openModal(isEditing = false, index = null) {
    productModal.style.display = 'block';
    if (isEditing) {
        editingIndex = index;
        modalTitle.textContent = 'Editar Producto';
        const product = products[index];
        document.getElementById('name').value = product.name;
        document.getElementById('cantidad').value = product.cantidad;
        document.getElementById('price').value = product.precio; 
    } else {
        modalTitle.textContent = 'Agregar Producto';
        productForm.reset();
        editingIndex = null;
    }
}

// Cerrar modal de producto
function closeModalWindow() {
    productModal.style.display = 'none';
}

// Renderizar tabla de productos
function renderProducts() {
    const productTableBody = document.querySelector('#product-table tbody');
    productTableBody.innerHTML = '';

    if (products.length === 0) {
        productTableBody.innerHTML = '<tr><td colspan="4">No hay productos disponibles.</td></tr>';
        return;
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(productSearchBar.value.toLowerCase())
    );

    filteredProducts.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.cantidad}</td>
            <td>${formatCurrency(product.precio)}</td>
            <td class="product-actions">
                <button class="increase-btn" onclick="openIncreaseQuantityModal(${index})">Sumar Cantidad</button>
                <button class="edit-btn" onclick="openModal(true, ${index})">Editar</button>
                <button class="delete-btn" onclick="deleteProduct(${index})">Eliminar</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}

// Función para abrir el modal de aumentar cantidad
function openIncreaseQuantityModal(index) {
    const product = products[index];
    increaseQuantityModal.style.display = 'block';
    quantityInput.value = ''; // Limpiar el input antes de usarlo
    confirmQuantityBtn.onclick = () => increaseQuantity(index);  // Configurar el botón de confirmar
}

// Función para aumentar la cantidad de un producto
function increaseQuantity(index) {
    const cantidadParaSumar = quantityInput.value.trim();
    if (cantidadParaSumar && !isNaN(cantidadParaSumar) && parseInt(cantidadParaSumar) > 0) {
        products[index].cantidad = parseInt(products[index].cantidad) + parseInt(cantidadParaSumar);
        renderProducts();
        closeIncreaseQuantityModal();  // Cerrar el modal
    } else {
        alert("Por favor, ingresa una cantidad válida mayor a 0.");
    }
}

// Función para cerrar el modal de aumentar cantidad
function closeIncreaseQuantityModal() {
    // Cambiar el estilo para ocultar el modal
    document.getElementById('increase-quantity-modal').style.display = 'none';
}

// Agregar o editar producto
function saveProduct(event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const cantidad = document.getElementById('cantidad').value.trim();
    const price = document.getElementById('price').value.trim();

    if (!name || !cantidad || !price || isNaN(price)) {
        alert("Por favor, complete todos los campos correctamente.");
        return;
    }

    if (editingIndex === null) {
        products.push({ name, cantidad, precio: parseFloat(price) });
    } else {
        products[editingIndex] = { name, cantidad, precio: parseFloat(price) };
    }

    renderProducts();
    closeModalWindow();
}

// Eliminar producto
function deleteProduct(index) {
    if (confirm(`¿Está seguro de eliminar al producto ${products[index].name}?`)) {
        products.splice(index, 1);
        renderProducts();
    }
}

// Formatear precio
function formatCurrency(price) {
    if (isNaN(price)) return "RD$0.00";
    return `RD$${parseFloat(price).toFixed(2)}`;
}

// Event Listeners
addProductBtn.addEventListener('click', () => openModal());
closeModal.addEventListener('click', closeModalWindow);
productSearchBar.addEventListener('input', renderProducts);
productForm.addEventListener('submit', saveProduct);
window.addEventListener('click', (e) => {
    if (e.target === productModal) closeModalWindow();
    if (e.target === increaseQuantityModal) closeIncreaseQuantityModal();
});
