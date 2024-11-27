// /assets/js/clientes.js
const clients = [];
let editingIndex = null;
const BASE_URL = 'http://localhost:3000'; // Eliminé process.env para simplicidad

const clientModal = document.getElementById('client-modal');
const closeModal = document.getElementById('close-modal');
const addClientBtn = document.getElementById('add-client-btn');
const clientForm = document.getElementById('clientForm');
const clientSearchBar = document.getElementById('client-search-bar');
const modalTitle = document.getElementById('modal-title');

function validateClientForm() {
    const nombre = document.getElementById('name').value.trim();
    const telefono = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();

    const errorMessages = [];

    if (nombre.length < 2 || nombre.length > 50) {
        errorMessages.push('El nombre debe tener entre 2 y 50 caracteres');
    }

    if (telefono && !/^[0-9+\-\s]+$/.test(telefono)) {
        errorMessages.push('El teléfono no tiene un formato válido');
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorMessages.push('El email no tiene un formato válido');
    }

    return {
        isValid: errorMessages.length === 0,
        errorMessages
    };
}

function openModal(isEditing = false, index = null) {
    clientModal.style.display = 'block';
    if (isEditing && index !== null) {
        editingIndex = index;
        modalTitle.textContent = 'Editar Cliente';
        const client = clients[index];
        document.getElementById('name').value = client.nombre;
        document.getElementById('direccion').value = client.direccion || '';
        document.getElementById('phone').value = client.telefono;
        document.getElementById('email').value = client.email || '';
    } else {
        modalTitle.textContent = 'Agregar Cliente';
        clientForm.reset();
        editingIndex = null;
    }
}

function closeModalWindow() {
    clientModal.style.display = 'none';
}

function renderClients() {
    const clientTableBody = document.querySelector('#client-table tbody');
    clientTableBody.innerHTML = '';

    if (clients.length === 0) {
        clientTableBody.innerHTML = '<tr><td colspan="4">No hay clientes disponibles.</td></tr>';
        return;
    }

    const filteredClients = clients.filter(client =>
        client.nombre.toLowerCase().includes(clientSearchBar.value.toLowerCase()) ||
        (client.email && client.email.toLowerCase().includes(clientSearchBar.value.toLowerCase())) ||
        (client.telefono && client.telefono.includes(clientSearchBar.value))
    );

    filteredClients.forEach((client, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.nombre}</td>
            <td>${client.email || 'N/A'}</td>
            <td>${client.telefono}</td>
            <td class="client-actions">
                <button class="edit-btn" onclick="openModal(true, ${index})">Editar</button>
                <button class="delete-btn" onclick="deleteClient(${index})">Eliminar</button>
            </td>
        `;
        clientTableBody.appendChild(row);
    });
}

async function fetchClients() {
    try {
        const response = await fetch(`${BASE_URL}/clientes`);
        const data = await response.json();
        clients.splice(0, clients.length, ...data);
        renderClients();
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        alert('No se pudieron cargar los clientes. Verifique la conexión.');
    }
}

async function saveClient(event) {
    event.preventDefault();
    
    const validation = validateClientForm();
    if (!validation.isValid) {
        alert(validation.errorMessages.join('\n'));
        return;
    }

    const nombre = document.getElementById('name').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const telefono = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim() || null;

    const clientData = { nombre, direccion, telefono, email };

    try {
        if (editingIndex === null) {
            // Agregar nuevo cliente
            await fetch(`${BASE_URL}/clientes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientData),
            });
        } else {
            // Editar cliente existente
            const clientId = clients[editingIndex].id;
            await fetch(`${BASE_URL}/clientes/${clientId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientData),
            });
        }
        
        await fetchClients();
        closeModalWindow();
    } catch (error) {
        console.error('Error al guardar cliente:', error);
        alert('No se pudo guardar el cliente. Intente nuevamente.');
    }
}

async function deleteClient(index) {
    const client = clients[index];
    if (confirm(`¿Está seguro de eliminar al cliente ${client.nombre}?`)) {
        try {
            await fetch(`${BASE_URL}/clientes/${client.id}`, {
                method: 'DELETE',
            });
            await fetchClients();
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            alert('No se pudo eliminar el cliente. Intente nuevamente.');
        }
    }
}

// Event Listeners
addClientBtn.addEventListener('click', () => openModal());
closeModal.addEventListener('click', closeModalWindow);
clientSearchBar.addEventListener('input', renderClients);
clientForm.addEventListener('submit', saveClient);
window.addEventListener('load', fetchClients);