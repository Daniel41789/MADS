// Función para cambiar entre modo claro/oscuro
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode'); // Cambiar la clase 'dark-mode'
}

// Evento para el botón de cambiar modo claro/oscuro
document.getElementById('toggle-dark-mode').addEventListener('click', toggleDarkMode);