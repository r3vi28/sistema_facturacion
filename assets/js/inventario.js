// /assets/js/inventario.js
const products = [];
let editingIndex = null;
const BASE_URL = 'http://localhost:3000';

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

// Validar producto
function validateProductForm() {
    const nombre = document.getElementById('name').value.trim();
    const cantidad = document.getElementById('cantidad').value.trim();
    const precio = document.getElementById('price').value.trim();

    const errorMessages = [];

    if (nombre.length < 2 || nombre.length > 50) {
        errorMessages.push('El nombre debe tener entre 2 y 50 caracteres');
    }

    if (!precio || isNaN(precio) || parseFloat(precio) <= 0) {
        errorMessages.push('El precio debe ser un número válido mayor a 0');
    }

    return {
        isValid: errorMessages.length === 0,
        errorMessages
    };
}

// Abrir modal de producto
function openModal(isEditing = false, index = null) {
    productModal.style.display = 'block';
    if (isEditing && index !== null) {
        editingIndex = index;
        modalTitle.textContent = 'Editar Producto';
        const product = products[index];

        document.getElementById('name').value = product.nombre;
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

// Formatear precio
function formatCurrency(precio) {
    if (isNaN(precio)) return "RD$0.00";
    return `RD$${parseFloat(precio).toFixed(2)}`;
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
        product.nombre.toLowerCase().includes(productSearchBar.value.toLowerCase())
    );

    filteredProducts.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.nombre}</td>
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

// Fetch productos
async function fetchProducts() {
    try {
        const response = await fetch(`${BASE_URL}/productos`);
        const data = await response.json();
        products.splice(0, products.length, ...data);
        renderProducts();
    } catch (error) {
        console.error('Error al obtener productos:', error);
        alert('No se pudieron cargar los productos. Verifique la conexión.');
    }
}

// Función para aumentar la cantidad de un producto
async function increaseQuantity(index) {
    const cantidadParaSumar = quantityInput.value.trim();
    
    if (cantidadParaSumar && !isNaN(cantidadParaSumar) && parseInt(cantidadParaSumar) > 0) {
        try {
            // Obtener el producto actual de la base de datos
            const producto = products[index];
            
            // Calcular la nueva cantidad sumando la cantidad actual con la cantidad a sumar
            const nuevaCantidad = parseInt(producto.cantidad) + parseInt(cantidadParaSumar);
            
            // Depuración: muestra los datos que se van a enviar
            console.log('Datos a enviar:', {
                id: producto.id,
                nombre: producto.nombre,
                cantidad: nuevaCantidad,
                precio: producto.precio
            });

            // Actualizar la cantidad en la base de datos
            const response = await fetch(`${BASE_URL}/productos/${producto.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    nombre: producto.nombre,
                    cantidad: nuevaCantidad,
                    precio: producto.precio
                })
            });
            
            // Manejo más detallado de errores
            if (!response.ok) {
                const errorBody = await response.json();
                console.error('Error completo del servidor:', errorBody);
                throw new Error(`No se pudo actualizar la cantidad del producto. Detalles: ${JSON.stringify(errorBody)}`);
            }
            
            // Actualizar el arreglo local de productos
            products[index].cantidad = nuevaCantidad;
            
            // Renderizar los productos actualizados
            renderProducts();
            closeIncreaseQuantityModal();

        } catch (error) {
            console.error('Error al actualizar la cantidad:', error);
            alert(`Hubo un problema al actualizar la cantidad del producto: ${error.message}`);
        }
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
async function saveProduct(event) {
    event.preventDefault();

    const validation = validateProductForm();
    if (!validation.isValid) {
        alert(validation.errorMessages.join('\n'));
        return;
    }

    const nombre = document.getElementById('name').value.trim();
    const cantidad = document.getElementById('cantidad').value.trim();
    const precio = document.getElementById('price').value.trim();

    const productData = { nombre, cantidad, precio }

    try {
        if (editingIndex === null) {
            // Agregar nuevo cliente
            await fetch(`${BASE_URL}/productos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
        } else {
            // Editar cliente existente
            const productId = products[editingIndex].id;
            await fetch(`${BASE_URL}/productos/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
        }
        // Recargar los gastos
        await fetchProducts();
        closeModalWindow();
    } catch (error) {
        console.error('Error al guardar producto:', error);
        alert('No se pudo guardar el producto. Intente nuevamente.');
    }
}

// Eliminar producto
async function deleteProduct(index) {
    const product = products[index];
    
    if (confirm(`¿Está seguro de eliminar el producto ${product.name}?`)) {
        try {
            await fetch(`${BASE_URL}/productos/${product.id}`, {
                method: 'DELETE',
            });
            await fetchProducts();
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            alert('No se pudo eliminar el producto. Intente nuevamente.');
        }
    }
}

// Event Listeners
addProductBtn.addEventListener('click', () => openModal());
closeModal.addEventListener('click', closeModalWindow);
productSearchBar.addEventListener('input', renderProducts);
productForm.addEventListener('submit', saveProduct);
window.addEventListener('load', fetchProducts);