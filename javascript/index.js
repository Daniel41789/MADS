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
                username: email,
                password: password,
            }),
        });        

        const data = await response.json();

        if (data.success) {
            alert('Inicio de sesión exitoso');
            // Almacenar el ID del usuario en el almacenamiento local
            localStorage.setItem('userId', data.userId);

            if (data.userId === 1) {
                window.location.href = 'admin.html';  // Redirige a la página de administrador
            } else {
                window.location.href = 'main.html';  // Redirige a la página de usuario regular
            }
        } else {
            alert('Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al iniciar sesión. Inténtalo nuevamente');
    }
});
