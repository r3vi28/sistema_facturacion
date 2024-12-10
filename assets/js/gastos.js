// /assets/js/gastos.js
const spents = [];
let editingIndex = null;
const BASE_URL = 'http://localhost:3000';

// Elementos del DOM
const spentModal = document.getElementById('spent-modal');
const closeModal = document.getElementById('close-modal');
const addSpentBtn = document.getElementById('add-spent-btn');
const spentForm = document.getElementById('spentForm');
const spentSearchBar = document.getElementById('spent-search-bar');
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


// Validar gastos
function validateSpentForm() {
    const concepto = document.getElementById('concepto').value.trim();
    const categoria = document.getElementById('categoria').value.trim();
    const fecha = document.getElementById('fecha').value.trim();
    const monto = document.getElementById('monto').value.trim();

    const errorMessages = [];

    if (concepto.length < 2 || concepto.length > 50) {
        errorMessages.push('El concepto debe tener entre 2 y 50 caracteres');
    }

    if (!categoria) {
        errorMessages.push('Debe seleccionar una categoría válida');
    }

    if (!fecha) {
        errorMessages.push('Debe ingresar una fecha válida');
    }

    if (!monto || isNaN(monto) || parseFloat(monto) <= 0) {
        errorMessages.push('El monto debe ser un número válido mayor a 0');
    }

    return {
        isValid: errorMessages.length === 0,
        errorMessages
    };
}

// Abrir modal
function openModal(isEditing = false, index = null) {
    spentModal.style.display = 'block';
    if (isEditing && index !== null) {
        editingIndex = index;
        modalTitle.textContent = 'Editar Gasto';
        const spent = spents[index];
        document.getElementById('concepto').value = spent.concepto;
        document.getElementById('categoria').value = spent.categoria;
        document.getElementById('fecha').value = spent.fecha;
        document.getElementById('monto').value = spent.monto;
    } else {
        modalTitle.textContent = 'Agregar Gasto';
        spentForm.reset();
        editingIndex = null;
    }
}

// Cerrar modal
function closeModalWindow() {
    spentModal.style.display = 'none';
}

// Formatear precio
function formatCurrency(monto) {
    if (isNaN(monto)) return "RD$0.00";
    return `RD$${parseFloat(monto).toFixed(2)}`;
}

// Renderizar tabla de gastos
function renderSpents() {
    const spentTableBody = document.querySelector('#spent-table tbody');
    spentTableBody.innerHTML = '';

    if (spents.length === 0) {
        spentTableBody.innerHTML = '<tr><td colspan="4">No hay gastos disponibles.</td></tr>';
        return;
    }

    const filteredSpents = spents.filter(spent =>
        spent.concepto.toLowerCase().includes(spentSearchBar.value.toLowerCase()) ||
        (spent.categoria.includes(spentSearchBar.value.toLowerCase()))
    );

    filteredSpents.forEach((spent, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${spent.concepto}</td>
            <td>${spent.categoria}</td>
            <td>${spent.fecha}</td>
            <td>${formatCurrency(spent.monto)}</td>
            <td class="client-actions">
                <button class="edit-btn" onclick="openModal(true, ${index})">Editar</button>
                <button class="delete-btn" onclick="deleteClient(${index})">Eliminar</button>
            </td>
        `;
        spentTableBody.appendChild(row);
    });
}

// Fetch gastos
async function fetchSpents() {
    try {
        const response = await fetch(`${BASE_URL}/gastos`);
        const data = await response.json();
        spents.splice(0, spents.length, ...data);
        renderSpents();
    } catch (error) {
        console.error('Error al obtener gastos:', error);
        showError('No se pudieron cargar los gastos. Verifique la conexión.');
    }
}

// Guardar clientes
async function saveSpent(event) {
    event.preventDefault();
    
    const validation = validateSpentForm();
    if (!validation.isValid) {
        showError(validation.errorMessages.join('\n'));
        return;
    }

    const concepto = document.getElementById('concepto').value.trim();
    const categoria = document.getElementById('categoria').value.trim();
    const fecha = document.getElementById('fecha').value.trim();
    const monto = document.getElementById('monto').value.trim();

    const spentData = { concepto, categoria, fecha, monto };

    try {
        if (editingIndex === null) {
            // Agregar nuevo cliente
            await fetch(`${BASE_URL}/gastos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(spentData),
            });
        } else {
            // Editar cliente existente
            const spentId = spents[editingIndex].id;
            await fetch(`${BASE_URL}/gastos/${clientId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(spentData),
            });
        }
        // Recargar los gastos
        await fetchSpents();
        closeModalWindow();
    } catch (error) {
        console.error('Error al guardar gasto:', error);
        showError('No se pudo guardar el gasto. Intente nuevamente.');
    }
}

// Eliminar gasto
async function deleteSpent(index) {
    const spent = spents[index];
    
    if (confirm(`¿Está seguro de eliminar el gasto ${spent.concepto}?`)) {
        try {
            await fetch(`${BASE_URL}/gastos/${spent.id}`, {
                method: 'DELETE',
            });
            await fetchSpents();
        } catch (error) {
            console.error('Error al eliminar gasto:', error);
            showError('No se pudo eliminar el gasto. Intente nuevamente.');
        }
    }
}

// Event Listeners

addSpentBtn.addEventListener('click', () => openModal());
closeModal.addEventListener('click', closeModalWindow);
spentSearchBar.addEventListener('input', renderSpents);
spentForm.addEventListener('submit', saveSpent);
window.addEventListener('load', fetchSpents);