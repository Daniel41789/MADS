document.querySelector('#registroForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: email,
                password: password,
            }),
        });

        const data = await response.json();

        if (data.success) {
            alert('Registro exitoso');
            window.location.href = './index.html';  // Redireccionar a la página de inicio de sesión
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al registrar. Inténtalo nuevamente');
    }
});
// Evento para el botón "Regresar"
document.querySelector('#regresarBtn').addEventListener('click', function () {
    window.location.href = './index.html';  // Redirigir al inicio de sesión
});