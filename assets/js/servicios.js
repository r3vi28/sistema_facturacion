const services = [];
let editingIndex = null;
const BASE_URL = 'http://localhost:3000';

// Elementos del DOM
const serviceModal = document.getElementById('service-modal');
const closeModal = document.getElementById('close-modal');
const addServiceBtn = document.getElementById('add-service-btn');
const serviceForm = document.getElementById('serviceForm');
const serviceSearchBar = document.getElementById('service-search-bar');
const modalTitle = document.getElementById('modal-title');

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

// Validar producto
function validateServiceForm() {
    const nombre = document.getElementById('name').value.trim();
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

// Abrir modal
function openModal(isEditing = false, index = null) {
    serviceModal.style.display = 'block';
    if (isEditing && index !== null) {
        editingIndex = index;
        modalTitle.textContent = 'Editar Servicio';
        const service = services[index];

        document.getElementById('name').value = service.nombre;
        document.getElementById('description').value = service.cantidad;
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

// Fetch productos
async function fetchServices() {
    try {
        const response = await fetch(`${BASE_URL}/servicios`);
        const data = await response.json();
        services.splice(0, services.length, ...data);
        renderServices();
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        showError('No se pudieron cargar los servicios. Verifique la conexión.');
    }
}

// Agregar o editar gasto
async function saveService(event) {
    event.preventDefault();

    const validation = validateServiceForm();
    if (!validation.isValid) {
        showError(validation.errorMessages.join('\n'));
        return;
    }

    const nombre = document.getElementById('name').value.trim();
    const descripcion = document.getElementById('description').value.trim();
    const precio = document.getElementById('price').value.trim();

    const serviceData = { nombre, descripcion, precio }

    try {
        if (editingIndex === null) {
            // Agregar nuevo servicio
            await fetch(`${BASE_URL}/servicios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(serviceData),
            });
        } else {
            // Editar servicio existente
            const serviceId = services[editingIndex].id;
            await fetch(`${BASE_URL}/servicios/${serviceId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(serviceData),
            });
        }
        // Recargar los servicios
        await fetchServices();
        closeModalWindow();
    } catch (error) {
        console.error('Error al guardar servicio:', error);
        showError('No se pudo guardar el servicio. Intente nuevamente.');
    }
}

// Eliminar gasto
async function deleteService(index) {
    const service = services[index];
    
    if (confirm(`¿Está seguro de eliminar el servicio ${service.name}?`)) {
        try {
            await fetch(`${BASE_URL}/servicios/${service.id}`, {
                method: 'DELETE',
            });
            await fetchServices();
        } catch (error) {
            console.error('Error al eliminar servicio:', error);
            showError('No se pudo eliminar el servicio. Intente nuevamente.');
        }
    }
}

// Event Listeners
addServiceBtn.addEventListener('click', () => openModal());
closeModal.addEventListener('click', closeModalWindow);
serviceSearchBar.addEventListener('input', renderServices);
serviceForm.addEventListener('submit', saveService);
window.addEventListener('load', fetchServices);
