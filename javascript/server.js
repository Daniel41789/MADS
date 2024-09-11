const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rorm990913',
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
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Campos incompletos' });
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        if (results.length > 0) {
            const username = results[0];

            if (username.password === password) {
                return res.json({ success: true, message: 'Inicio de sesión exitoso' });
            } else {
                return res.json({ success: false, message: 'Contraseña incorrecta' });
            }
        } else {
            return res.json({ success: false, message: 'Usuario no encontrado' });
        }
    });
});

//Miguel--------------------------------------------------------------
// Ruta para el registro de usuarios
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Verificar que los campos no estén vacíos
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Campos incompletos' });
    }

    // Verificar si el usuario ya existe en la base de datos
    const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
    
    db.query(checkUserQuery, [username], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        if (results.length > 0) {
            // Si el usuario ya existe
            return res.status(400).json({ success: false, message: 'El usuario ya existe' });
        } else {
            // Insertar el nuevo usuario en la base de datos
            const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
            
            db.query(insertUserQuery, [username, password], (err, result) => {
                if (err) {
                    console.error('Error al insertar el usuario:', err);
                    return res.status(500).json({ success: false, message: 'Error al registrar el usuario' });
                }

                return res.status(201).json({ success: true, message: 'Usuario registrado con éxito' });
            });
        }
    });
});