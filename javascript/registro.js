document.querySelector('#RegistroRegresar').addEventListener('click', function () {
    window.location.href = 'index.html';
});

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional
            
            // Obtiene los valores de los campos del formulario
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Validar los campos (opcional)
            if (!email || !password) {
                alert('Por favor complete todos los campos.');
                return;
            }

            // Enviar los datos al servidor
            fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: email,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Registro exitoso');
                    // Opcionalmente, redirigir a otra página
                    window.location.href = '../html/index.html'; // Ajusta según tu flujo
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al registrar el usuario.');
            });
        });
    }
});
