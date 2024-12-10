// /assets/js/ventas.js
const sales = [];
let editingSale = null;
const BASE_URL = 'http://localhost:3000';

// Elementos del DOM
const saleModal = document.getElementById('sale-modal');
const closeSaleModal = document.getElementById('close-sale-modal');
const addSaleBtn = document.getElementById('add-sale-btn');
const saleForm = document.getElementById('saleForm');
const saleSearchBar = document.getElementById('sale-search-bar');
const modalTitle = document.getElementById('modal-title');
const itemTableBody = document.getElementById('item-list-body');
const addItemBtn = document.getElementById('add-item-btn');
const clientSelect = document.getElementById('client-select');
const generateInvoiceBtn = document.getElementById('generate-invoice-btn');

// Función para mostrar el mensaje de error
function showError(message) {
    const errorToast = document.createElement('div');
    errorToast.classList.add('error-toast');
    errorToast.textContent = message;

    document.body.appendChild(errorToast);

    // Hacer que el mensaje se desvanezca después de unos segundos
    setTimeout(() => {
        errorToast.style.opacity = '0';
        setTimeout(() => {
            errorToast.remove();
        }, 500); // Espera medio segundo para remover el mensaje después de desvanecerse
    }, 3000); // El mensaje permanecerá visible por 3 segundos
}

// Renderizar clientes en el selector
async function populateClientSelect() {
    try {
        const response = await fetch(`${BASE_URL}/clientes`);
        const clients = await response.json();
        clientSelect.innerHTML = '<option value="">Seleccionar Cliente</option>';
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.nombre;
            clientSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar clientes:', error);
        showError('No se pudieron cargar los clientes');
    }
}

// Abrir modal de venta
function openSaleModal(isEditing = false, saleIndex = null) {
    saleModal.style.display = 'block';
    if (isEditing && saleIndex !== null) {
        editingSale = sales[saleIndex];
        modalTitle.textContent = 'Editar Venta';
        // Cargar datos de venta existente
    } else {
        modalTitle.textContent = 'Nueva Venta';
        saleForm.reset();
        editingSale = null;
        // Limpiar lista de items
        itemTableBody.innerHTML = '';
    }
}

// Cerrar modal
function closeSaleModalWindow() {
    saleModal.style.display = 'none';
}

// Añadir ítem a la venta
function addSaleItem() {
    const productSelect = document.getElementById('product-select');
    const serviceSelect = document.getElementById('service-select');
    const quantity = document.getElementById('item-quantity');
    const unitPrice = document.getElementById('item-price');
    const discount = document.getElementById('item-discount');

    // Validaciones
    if ((!productSelect.value && !serviceSelect.value) || !quantity.value || !unitPrice.value) {
        showError('Por favor complete todos los campos del ítem');
        return;
    }

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${productSelect.value ? productSelect.options[productSelect.selectedIndex].text : serviceSelect.options[serviceSelect.selectedIndex].text}</td>
        <td>${quantity.value}</td>
        <td>${unitPrice.value}</td>
        <td>${discount.value || '0'}%</td>
        <td>
            <button onclick="removeItem(this)">Eliminar</button>
        </td>
    `;
    itemTableBody.appendChild(row);

    // Limpiar campos
    productSelect.selectedIndex = 0;
    serviceSelect.selectedIndex = 0;
    quantity.value = '';
    unitPrice.value = '';
    discount.value = '';
}

// Eliminar ítem de la venta
function removeItem(button) {
    button.closest('tr').remove();
}

// Guardar venta
async function saveSale(event) {
    event.preventDefault();
    
    // Validaciones básicas
    if (!clientSelect.value) {
        showError('Debe seleccionar un cliente');
        return;
    }

    if (itemTableBody.children.length === 0) {
        showError('Debe agregar al menos un ítem a la venta');
        return;
    }

    const items = Array.from(itemTableBody.children).map(row => ({
        productId: row.querySelector('select[name="product"]')?.value,
        serviceId: row.querySelector('select[name="service"]')?.value,
        quantity: row.cells[1].textContent,
        unitPrice: row.cells[2].textContent,
        discount: row.cells[3].textContent.replace('%', '')
    }));

    const saleData = {
        clienteId: clientSelect.value,
        laborCost: document.getElementById('labor-cost').value || 0,
        totalDiscount: document.getElementById('total-discount').value || 0,
        items: items
    };

    try {
        const url = editingSale 
            ? `${BASE_URL}/ventas/${editingSale.id}` 
            : `${BASE_URL}/ventas`;
        const method = editingSale ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saleData)
        });

        if (response.ok) {
            await fetchSales();
            closeSaleModalWindow();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al guardar la venta');
        }
    } catch (error) {
        console.error('Error al guardar venta:', error);
        showError(error.message || 'No se pudo guardar la venta');
    }
}

// Obtener ventas
async function fetchSales() {
    try {
        const response = await fetch(`${BASE_URL}/ventas`);
        const data = await response.json();
        if (Array.isArray(data)) {
            sales.splice(0, sales.length, ...data);
        }        
        renderSales();
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        showError('No se pudieron cargar las ventas');
    }
}

// Renderizar ventas
function renderSales() {
    const saleTableBody = document.querySelector('#sale-table tbody');
    saleTableBody.innerHTML = '';

    const filteredSales = sales.filter(sale => 
        sale.id.toString().includes(saleSearchBar.value) ||
        sale.cliente.nombre.toLowerCase().includes(saleSearchBar.value.toLowerCase())
    );

    filteredSales.forEach((sale, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.id}</td>
            <td>${sale.cliente.nombre}</td>
            <td>${sale.totalVenta.toFixed(2)}</td>
            <td>${sale.fechaVenta}</td>
            <td>
                <button class="edit-btn" onclick="openSaleModal(true, ${index})">Editar</button>
                <button class="delete-btn" onclick="deleteSale(${sale.id})">Eliminar</button>
            </td>
        `;
        saleTableBody.appendChild(row);
    });
}

// Eliminar venta
async function deleteSale(saleId) {
    if (confirm('¿Está seguro de eliminar esta venta?')) {
        try {
            const response = await fetch(`${BASE_URL}/ventas/${saleId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchSales();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar la venta');
            }
        } catch (error) {
            console.error('Error al eliminar venta:', error);
            showError(error.message || 'No se pudo eliminar la venta');
        }
    }
}

// Generar factura
function generateInvoice() {
    // Lógica para generar factura PDF
    showError('Funcionalidad de generación de factura PDF pendiente');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    populateClientSelect();
    fetchSales();
});

addSaleBtn.addEventListener('click', () => openSaleModal());
closeSaleModal.addEventListener('click', closeSaleModalWindow);
saleSearchBar.addEventListener('input', renderSales);
saleForm.addEventListener('submit', saveSale);
addItemBtn.addEventListener('click', addSaleItem);
generateInvoiceBtn.addEventListener('click', generateInvoice);