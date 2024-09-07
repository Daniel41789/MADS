const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Daniel4178',
    database: 'mads'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL server.');
});


// Consulta para el inicio de sesión
app.post('/login', (req, res) => {
    const { usuario, contraseña } = req.body;

    if (!usuario || !contraseña) {
        return res.status(400).json({ success: false, message: 'Campos incompletos' });
    }

    const query = 'SELECT * FROM users WHERE usuario = ?';
    
    db.query(query, [usuario], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        if (results.length > 0) {
            const user = results[0];

            if (user.contraseña === contraseña) {
                // Inicio de sesión exitoso
                return res.json({ success: true, message: 'Inicio de sesión exitoso' });
            } else {
                // Contraseña incorrecta
                return res.json({ success: false, message: 'Contraseña incorrecta' });
            }
        } else {
            // Usuario no encontrado
            return res.json({ success: false, message: 'Usuario no encontrado' });
        }
    });
});
