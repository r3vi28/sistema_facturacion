const services = [];
let editingIndex = null;

// Elementos del DOM
const serviceModal = document.getElementById('service-modal');
const closeModal = document.getElementById('close-modal');
const addServiceBtn = document.getElementById('add-service-btn');
const serviceForm = document.getElementById('serviceForm');
const serviceSearchBar = document.getElementById('service-search-bar');
const modalTitle = document.getElementById('modal-title');

// Abrir modal
function openModal(isEditing = false, index = null) {
    serviceModal.style.display = 'block';
    if (isEditing) {
        editingIndex = index;
        modalTitle.textContent = 'Editar Servicio';
        const service = services[index];
        document.getElementById('name').value = service.nombre;
        document.getElementById('description').value = service.descripcion;
        document.getElementById('price').value = service.precio;
    } else {
        modalTitle.textContent = 'Agregar Servicio';
        serviceForm.reset();
        editingIndex = null;
    }
}

// Cerrar modal
function closeModalWindow() {
    serviceModal.style.display = 'none';
}

// Formatear precio
function formatCurrency(precio) {
    if (isNaN(precio)) return "RD$0.00";
    return `RD$${parseFloat(precio).toFixed(2)}`;
}

// Renderizar tabla de gastos
function renderServices() {
    const serviceTableBody = document.querySelector('#service-table tbody');
    serviceTableBody.innerHTML = '';

    if (services.length === 0) {
        serviceTableBody.innerHTML = '<tr><td colspan="5">No hay gastos registrados.</td></tr>';
        return;
    }

    const filteredServices = services.filter(service =>
        service.nombre.toLowerCase().includes(serviceSearchBar.value.toLowerCase())
    );

    filteredServices.forEach((service, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${service.nombre}</td>
            <td>${service.descripcion}</td>
            <td>${formatCurrency(service.precio)}</td>
            <td>
                <button class="edit-btn" onclick="openModal(true, ${index})">Editar</button>
                <button class="delete-btn" onclick="deleteService(${index})">Eliminar</button>
            </td>
        `;

        serviceTableBody.appendChild(row);
    });
}

// Agregar o editar gasto
function saveService(event) {
    event.preventDefault();
    const nombre = document.getElementById('name').value.trim();
    const descripcion = document.getElementById('description').value.trim();
    const precio = document.getElementById('price').value.trim();

    if (editingIndex === null) {
        services.push({ nombre, descripcion, precio });
    } else {
        services[editingIndex] = { nombre, descripcion, precio };
    }

    renderServices();
    closeModalWindow();
}

// Eliminar gasto
function deleteService(index) {
    if (confirm(`¿Está seguro de eliminar el servicio ${services[index].nombre}?`)) {
        services.splice(index, 1);
        renderServices();
    }
}

// Event Listeners
addServiceBtn.addEventListener('click', () => openModal());
closeModal.addEventListener('click', closeModalWindow);
serviceSearchBar.addEventListener('input', renderServices);
serviceForm.addEventListener('submit', saveService);
window.addEventListener('click', (e) => {
    if (e.target === serviceModal) closeModalWindow();
});
