const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
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
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Campos incompletos' });
    }

    const query = 'SELECT id, password FROM users WHERE username = ?';
    
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        if (results.length > 0) {
            const user = results[0];

            if (user.password === password) {
                // Devolver el ID del usuario y el estado de éxito´
                return res.json({ success: true, message: 'Inicio de sesión exitoso', userId: user.id });
            } else {
                return res.json({ success: false, message: 'Contraseña incorrecta' });
            }
        } else {
            return res.json({ success: false, message: 'Usuario no encontrado' });
        }
    });
});

app.post('/api/jornada/iniciar', (req, res) => {
    const { user_id, start_time } = req.body;

    if (!user_id || !start_time) {
        return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }

    const query = 'INSERT INTO jornadas (user_id, start_time) VALUES (?, ?)';

    db.query(query, [user_id, start_time], (err, results) => {
        if (err) {
            console.error('Error al registrar el inicio de la jornada:', err);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        return res.json({ success: true, message: 'Jornada iniciada correctamente' });
    });
});

// Endpoint para terminar la jornada
app.post('/api/jornada/terminar', (req, res) => {
    const { user_id, end_time } = req.body;

    if (!user_id || !end_time) {
        return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }

    const query = 'UPDATE jornadas SET end_time = ? WHERE user_id = ? AND end_time IS NULL';

    db.query(query, [end_time, user_id], (err, results) => {
        if (err) {
            console.error('Error al finalizar la jornada:', err);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        return res.json({ success: true, message: 'Jornada finalizada correctamente' });
    });
});

// Obtención del id del user que inicia sesión
app.post('/api/obtener-user-id', (req, res) => {
    const { username } = req.body;
    
    const query = 'SELECT id FROM users WHERE username = ?';
    db.query(query, [username], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (result.length > 0) {
            res.json({ userId: result[0].id });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    });
});

///////////////////////////////////////// 

// Endpoint para actualizar perfil
app.post('/api/update-profile', (req, res) => {
    const { id, email, password } = req.body;

    if (!id || !email || !password) {
        return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }

    const query = `
        UPDATE users 
        SET username = ?, password = ? 
        WHERE id = ?
    `;

    db.query(query, [email, password, id], (err, results) => {
        if (err) {
            console.error('Error al actualizar perfil:', err);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        return res.json({ success: true, message: 'Perfil actualizado correctamente' });
    });
});


/* ----------------------------------------------- Registro de usuario ----------------------------------------*/
// Endpoint para registrar un nuevo usuario
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Campos incompletos' });
    }

    // Verifica si el usuario ya existe
    const checkQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(checkQuery, [username], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'El usuario ya existe' });
        }

        // Inserta el nuevo usuario en la base de datos
        const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(insertQuery, [username, password], (err, results) => {
            if (err) {
                console.error('Error al registrar el usuario:', err);
                return res.status(500).json({ success: false, message: 'Error en el servidor' });
            }

            return res.json({ success: true, message: 'Usuario registrado correctamente' });
        });
    });
});
