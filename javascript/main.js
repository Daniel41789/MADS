let jornadaIniciada = false;
let horaInicio = null;
let horaFin = null;
let comidaIniciada = false;
// Función para habilitar/deshabilitar botones
function toggleButtons() {
    document.getElementById('start-day').disabled = jornadaIniciada;
    document.getElementById('end-day').disabled = !jornadaIniciada;
}

// Función para cambiar entre modo claro/oscuro
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode'); // Cambiar la clase 'dark-mode'
}

// Evento para el botón de cambiar modo claro/oscuro
document.getElementById('toggle-dark-mode').addEventListener('click', toggleDarkMode);

// Función para formatear la fecha en el formato 'YYYY-MM-DD HH:MM:SS'
function formatDateForMySQL(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Función para iniciar la jornada
function iniciarJornada() {
    const now = new Date();
    const formattedDate = formatDateForMySQL(now);

    document.getElementById('start-time').textContent = formattedDate;
    jornadaIniciada = true;
    toggleButtons();

    const userId = localStorage.getItem('userId');

    if (!userId) {
        console.error('No se encontró el userId en localStorage');
        return;
    }

    const data = {
        user_id: userId,
        start_time: formattedDate
    };

    fetch('http://localhost:3000/api/jornada/iniciar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Jornada iniciada:', data);
    })
    .catch(error => {
        console.error('Error al iniciar jornada:', error);
    });
}



// Función para terminar la jornada
function acabarJornada() {
    const now = new Date();
    const formattedDate = formatDateForMySQL(now);

    document.getElementById('end-time').textContent = formattedDate;
    jornadaIniciada = false;
    toggleButtons();

    const userId = localStorage.getItem('userId');

    if (!userId) {
        console.error('No se encontró el userId en localStorage');
        return;
    }

    const data = {
        user_id: userId,
        end_time: formattedDate
    };

    fetch('http://localhost:3000/api/jornada/terminar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Jornada finalizada:', data);
    })
    .catch(error => {
        console.error('Error al finalizar jornada:', error);
    });
}


// Función para verificar si hay una jornada activa al cargar la página
/*function checkJornadaActiva() {
    fetch(`http://localhost:3000/api/jornada/estado/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.jornadaActiva) {
                jornadaIniciada = true;
                const formattedDate = formatDateForMySQL(new Date(data.start_time));
                document.getElementById('start-time').textContent = formattedDate;
                toggleButtons();
            }
        })
        .catch(error => {
            console.error('Error al verificar jornada activa:', error);
        });
}*/

// Inicializar los botones al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    //checkJornadaActiva();  // Verificar si hay una jornada activa
    toggleButtons();  // Asegurarse de que los botones estén en el estado correcto

    // Evento para iniciar la jornada
    document.getElementById('start-day').addEventListener('click', iniciarJornada);

    // Evento para acabar la jornada
    document.getElementById('end-day').addEventListener('click', acabarJornada);


    toggleButtonsLunch(); 
    document.getElementById('start-lunch').addEventListener('click', iniciarComida);
    document.getElementById('end-lunch').addEventListener('click', acabarComida);
});


document.querySelector('#logout').addEventListener('click', function () {
    window.location.href = 'index.html';
});


//////////// Editar perfil
// Función para actualizar perfil
document.getElementById('save-changes').addEventListener('click', function() {
    const email = document.getElementById('correo-input').value;
    const password = document.getElementById('password-input').value;

    // Obtener el ID del usuario desde el localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('No se ha encontrado el ID del usuario.');
        return;
    }

    fetch('http://localhost:3000/api/update-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: userId,
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Perfil actualizado exitosamente');
            //closeUpdateProfileModal();
        } else {
            alert('Error al actualizar el perfil: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

/*Mostrar jornadas del user */
document.getElementById('show-jornadas-btn').addEventListener('click', async function () {
    // Obtén el username almacenado en localStorage
    const username = localStorage.getItem('username');

    if (!username) {
        alert('Usuario no autenticado. Inicie sesión nuevamente.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/jornadas/${username}`, {
            method: 'GET',
        });

        const data = await response.json();

        if (data.success) {
            const jornadasList = document.getElementById('jornadas-list');
            jornadasList.innerHTML = ''; // Limpia el contenido anterior

            // Muestra cada jornada
            data.jornadas.forEach(jornada => {
                const jornadaItem = document.createElement('div');
                jornadaItem.innerHTML = `
                    <p>Inicio: ${jornada.start_time}</p>
                    <p>Fin: ${jornada.end_time ? jornada.end_time : 'En curso'}</p>
                `;
                jornadasList.appendChild(jornadaItem);
            });
        } else {
            alert('No se encontraron jornadas para este usuario.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al obtener las jornadas.');
    }
});


/* Iniciar comida */
// Función para habilitar/deshabilitar botones
function toggleButtonsLunch() {
    document.getElementById('start-lunch').disabled = comidaIniciada;
    document.getElementById('end-lunch').disabled = !comidaIniciada;
}
function iniciarComida() {
    const now = new Date();
    const formattedDate = formatDateForMySQL(now);

    document.getElementById('start-timeC').textContent = formattedDate;
    comidaIniciada = true;
    toggleButtonsLunch();

    const userId = localStorage.getItem('userId');

    if (!userId) {
        console.error('No se encontró el userId en localStorage');
        return;
    }

    const data = {
        user_id: userId,
        start_timeC: formattedDate
    };

    fetch('http://localhost:3000/api/comida/iniciar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Comida iniciada:', data);
    })
    .catch(error => {
        console.error('Error al iniciar Comida:', error);
    });
}

function acabarComida() {
    const now = new Date();
    const formattedDate = formatDateForMySQL(now);

    document.getElementById('end-timeC').textContent = formattedDate;
    jornadaIniciada = false;
    toggleButtonsLunch();

    const userId = localStorage.getItem('userId');

    if (!userId) {
        console.error('No se encontró el userId en localStorage');
        return;
    }

    const data = {
        user_id: userId,
        end_timeC: formattedDate
    };

    fetch('http://localhost:3000/api/comida/terminar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Comida finalizada:', data);
    })
    .catch(error => {
        console.error('Error al finalizar Comida:', error);
    });
}