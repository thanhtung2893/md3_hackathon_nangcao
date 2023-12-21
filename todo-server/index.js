// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 5000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todoapp'
});

db.connect((err) => {
    if (err) {
        console.error('loi ket noi MySQL:', err);
    } else {
        console.log('da ket noi voi MySQL');
    }
});

app.use(cors());
app.use(bodyParser.json());

// Middleware to check JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ message: 'khong tim thay token' });
    }

    jwt.verify(token, 'token_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'token khong hop le' });
        }
        req.user = decoded;
        next();
    });
};

// Routes for authentication
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ message: 'thong tin khong hop le' });
        }

        const user = results[0];
        const token = jwt.sign({ userId: user.id, role: user.role }, 'token_key', {
            expiresIn: '1h'
        });

        res.json({ token, role: user.role });
    })
});

//C: them task moi
app.post('/tasks', verifyToken, (req, res) => {
    const { title, description } = req.body;
    const createdBy = req.user.userId;
    if (title==''||description==''){
        return res.status(400).json({
            message:"khong duoc de trong"
        })
    }
    db.query('INSERT INTO tasks (title, description, createdBy) VALUES (?, ?, ?)', [title, description, createdBy], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'loi he thong' });
        }
        res.json({ message: 'them task thanh cong', taskId: result.insertId });
    });
});

// R: doc task
app.get('/tasks', (req, res) => {
   
        db.query('SELECT * FROM tasks', (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'loi he thong' });
            }
            res.json(results);
        });
});

//U: Update a task
app.put('/tasks/:id', verifyToken, (req, res) => {
    const taskId = req.params.id;
    const { title, description } = req.body;

    db.query('UPDATE tasks SET title = ?, description = ? WHERE id = ?', [title, description, taskId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'loi he thong' });
        }
        res.json({ message: 'chinh sua thanh cong' });
    });
});

//D: xoa 1 task
app.delete('/tasks/:id', verifyToken, (req, res) => {
    const taskId = req.params.id;

    db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'loi he thong' });
        }
        res.json({ message: 'xoa thanh cong' });
    });
});

app.listen(PORT, () => {
    console.log(`Server dang chay tren cong ${PORT}`);
});
