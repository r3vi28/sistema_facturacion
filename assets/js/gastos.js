const spents = [];
let editingIndex = null;

// Elementos del DOM
const spentModal = document.getElementById('spent-modal');
const closeModal = document.getElementById('close-modal');
const addSpentBtn = document.getElementById('add-spent-btn');
const spentForm = document.getElementById('spentForm');
const spentSearchBar = document.getElementById('spent-search-bar');
const modalTitle = document.getElementById('modal-title');

// Abrir modal
function openModal(isEditing = false, index = null) {
    spentModal.style.display = 'block';
    if (isEditing) {
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
        spentTableBody.innerHTML = '<tr><td colspan="5">No hay gastos registrados.</td></tr>';
        return;
    }

    const filteredSpents = spents.filter(spent =>
        spent.concepto.toLowerCase().includes(spentSearchBar.value.toLowerCase())
    );

    filteredSpents.forEach((spent, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${spent.concepto}</td>
            <td>${spent.categoria}</td>
            <td>${spent.fecha}</td>
            <td>${formatCurrency(spent.monto)}</td>
            <td>
                <button class="edit-btn" onclick="openModal(true, ${index})">Editar</button>
                <button class="delete-btn" onclick="deleteSpent(${index})">Eliminar</button>
            </td>
        `;

        spentTableBody.appendChild(row);
    });
}

// Agregar o editar gasto
function saveSpent(event) {
    event.preventDefault();
    const concepto = document.getElementById('concepto').value.trim();
    const categoria = document.getElementById('categoria').value.trim();
    const fecha = document.getElementById('fecha').value.trim();
    const monto = document.getElementById('monto').value.trim();

    if (editingIndex === null) {
        spents.push({ concepto, categoria, fecha, monto });
    } else {
        spents[editingIndex] = { concepto, categoria, fecha, monto };
    }

    renderSpents();
    closeModalWindow();
}

// Eliminar gasto
function deleteSpent(index) {
    if (confirm(`¿Está seguro de eliminar el gasto ${spents[index].concepto}?`)) {
        spents.splice(index, 1);
        renderSpents();
    }
}

// Event Listeners
addSpentBtn.addEventListener('click', () => openModal());
closeModal.addEventListener('click', closeModalWindow);
spentSearchBar.addEventListener('input', renderSpents);
spentForm.addEventListener('submit', saveSpent);
window.addEventListener('click', (e) => {
    if (e.target === spentModal) closeModalWindow();
});
