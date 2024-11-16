const clients = [];
let editingIndex = null;

// Elementos del DOM
const clientModal = document.getElementById('client-modal');
const closeModal = document.getElementById('close-modal');
const addClientBtn = document.getElementById('add-client-btn');
const clientForm = document.getElementById('clientForm');
const clientSearchBar = document.getElementById('client-search-bar');
const modalTitle = document.getElementById('modal-title');

// Abrir modal
function openModal(isEditing = false, index = null) {
    clientModal.style.display = 'block';
    if (isEditing) {
        editingIndex = index;
        modalTitle.textContent = 'Editar Cliente';
        const client = clients[index];
        document.getElementById('name').value = client.name;
        document.getElementById('direccion').value = client.direccion;
        document.getElementById('phone').value = client.phone;
        document.getElementById('email').value = client.email;
    } else {
        modalTitle.textContent = 'Agregar Cliente';
        clientForm.reset();
        editingIndex = null;
    }
}

// Cerrar modal
function closeModalWindow() {
    clientModal.style.display = 'none';
}

// Renderizar tabla de clientes
function renderClients() {
    const clientTableBody = document.querySelector('#client-table tbody');
    clientTableBody.innerHTML = '';

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(clientSearchBar.value.toLowerCase())
    );

    filteredClients.forEach((client, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td class="client-actions">
                <button class="edit-btn" onclick="openModal(true, ${index})">Editar</button>
                <button class="delete-btn" onclick="deleteClient(${index})">Eliminar</button>
            </td>
        `;

        clientTableBody.appendChild(row);
    });
}

// Agregar o editar cliente
function saveClient(event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();

    if (editingIndex === null) {
        clients.push({ name, direccion, phone, email });
    } else {
        clients[editingIndex] = { name, direccion, phone, email };
    }

    renderClients();
    closeModalWindow();
}

// Eliminar cliente
function deleteClient(index) {
    if (confirm(`¿Está seguro de eliminar al cliente ${clients[index].name}?`)) {
        clients.splice(index, 1);
        renderClients();
    }
}

// Event Listeners
addClientBtn.addEventListener('click', () => openModal());
closeModal.addEventListener('click', closeModalWindow);
clientSearchBar.addEventListener('input', renderClients);
clientForm.addEventListener('submit', saveClient);
window.addEventListener('click', (e) => {
    if (e.target === clientModal) closeModalWindow();
});

// No cerrar el formulario al hacer clic fuera de él
document.querySelector('#modal-container').addEventListener('click', (e) => {
    // Detener la propagación para evitar que el fondo cierre el modal
    e.stopPropagation();
});

// Asegurarnos de que no se cierre al hacer clic dentro del formulario
document.querySelector('.modal-content').addEventListener('click', (e) => {
    // Detener la propagación para evitar que se cierre al hacer clic dentro del formulario
    e.stopPropagation();
});

// Cerrar solo al hacer clic en el botón de salir
document.querySelectorAll('.close-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('#modal-container').style.display = 'none'; // Cerrar el modal
    });
});

// Cerrar también al guardar
document.querySelectorAll('.save-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('#modal-container').style.display = 'none'; // Cerrar el modal al guardar
    });
});
