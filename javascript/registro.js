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
            window.location.href = './index.html';  // Redirige al login después del registro
        } else {
            alert('Error en el registro: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al registrar. Inténtalo nuevamente');
    }
});
