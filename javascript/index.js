document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario: email,
                contraseña: password,
            }),
        });

        const data = await response.json();

        if (data.success) {
            alert('Inicio de sesión exitoso');
            // Redirigir a otra página, si es necesario
        } else {
            alert('Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al iniciar sesión. Inténtalo más tarde.');
    }
});
