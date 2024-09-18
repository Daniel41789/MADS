// Función para cambiar entre modo claro/oscuro
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode'); // Cambiar la clase 'dark-mode'
}

// Evento para el botón de cambiar modo claro/oscuro
document.getElementById('toggle-dark-mode').addEventListener('click', toggleDarkMode);

document.querySelector('#logout').addEventListener('click', function () {
    window.location.href = 'index.html';
});

document.getElementById('searchUserBtn').addEventListener('click', async function () {
    const username = document.getElementById('usernameInput').value;
    
    if (!username) {
        alert('Por favor, ingrese un nombre de usuario.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/jornadas/${username}`);
        const data = await response.json();

        const jornadasResultDiv = document.getElementById('jornadasResult');
        jornadasResultDiv.innerHTML = '';  // Limpiar resultados anteriores

        if (data.success) {
            // Mostrar las jornadas en pantalla
            data.jornadas.forEach(jornada => {
                const jornadaElement = document.createElement('div');
                jornadaElement.classList.add('jornada-entry');
                jornadaElement.innerHTML = `
                    <p>Inicio: ${new Date(jornada.start_time).toLocaleString()}</p>
                    <p>Fin: ${jornada.end_time ? new Date(jornada.end_time).toLocaleString() : 'No finalizado'}</p>
                `;
                jornadasResultDiv.appendChild(jornadaElement);
            });
        } else {
            jornadasResultDiv.innerHTML = `<p>No se encontraron jornadas para el usuario "${username}".</p>`;
        }
    } catch (error) {
        console.error('Error al consultar las jornadas:', error);
        alert('Error al consultar las jornadas. Inténtelo nuevamente.');
    }
});
