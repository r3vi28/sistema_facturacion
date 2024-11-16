// /assets/js/inventory.js
document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const productList = document.getElementById('product-list');
    const searchBar = document.getElementById('search-bar');

    let products = [];
    let editingIndex = null;

    // Agregar o editar producto
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('product-name').value;
        const quantity = parseInt(document.getElementById('product-quantity').value);
        const price = parseFloat(document.getElementById('product-price').value);

        if (editingIndex === null) {
            // Agregar producto
            products.push({ name, quantity, price });
        } else {
            // Editar producto
            products[editingIndex] = { name, quantity, price };
            editingIndex = null;
        }
        
        productForm.reset();
        renderProducts();
    });

    // Renderizar lista de productos
    // Renderizar tabla de productos
    function renderProducts() {
        const productTableBody = document.querySelector('#product-table tbody');
        productTableBody.innerHTML = '';

        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchBar.value.toLowerCase())
        );

        filteredProducts.forEach((product, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td class="product-actions">
                    <button class="edit-btn" onclick="editProduct(${index})">Editar</button>
                    <button class="delete-btn" onclick="deleteProduct(${index})">Eliminar</button>
                </td>
            `;

            productTableBody.appendChild(row);
        });
    }


    // Editar producto
    window.editProduct = (index) => {
        const product = products[index];
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-quantity').value = product.quantity;
        document.getElementById('product-price').value = product.price;
        editingIndex = index;
    };

    // Eliminar producto
    window.deleteProduct = (index) => {
        products.splice(index, 1);
        renderProducts();
    };

    // Buscar producto
    searchBar.addEventListener('input', renderProducts);
});
