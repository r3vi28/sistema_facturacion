document.addEventListener("DOMContentLoaded", () => {
    // Simular carga de estadísticas
    document.getElementById("totalClientes").innerText = "120";
    document.getElementById("totalProductos").innerText = "80";
    document.getElementById("ventasMes").innerText = "50";
    document.getElementById("serviciosPendientes").innerText = "5";

    // Evento para el botón de backup
    document.getElementById("backupButton").addEventListener("click", () => {
        alert("Iniciando backup de la base de datos...");
        // Lógica para realizar el backup (a implementar)
    });
});
