const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Servir todo el servidor como estático
app.use(express.static(path.join(__dirname)));

// Archivo donde guardaremos los scores
const SCORE_FILE = path.join(__dirname, 'scores.json');

// --- RUTA GET para highscores ---
app.get('/highscores', (req, res) => {
    if (!fs.existsSync(SCORE_FILE)) return res.json([]);
    let data = JSON.parse(fs.readFileSync(SCORE_FILE, 'utf8'));

    // Ordenar de mayor a menor y quedarnos con los 10 primeros
    data.sort((a, b) => b.score - a.score);
    const top10 = data.slice(0, 10);

    res.json(top10);
});

app.post('/submit', (req, res) => {
    const { player, score, time } = req.body;
    if (!player || typeof score !== 'number') {
        return res.status(400).json({ error: 'Datos inválidos' });
    }

    let data = [];
    if (fs.existsSync(SCORE_FILE)) {
        try {
            data = JSON.parse(fs.readFileSync(SCORE_FILE, 'utf8'));
        } catch {
            data = [];
        }
    }

    // Agregar el nuevo score
    data.push({ player, score, time });

    // Ordenar y dejar solo los 10 mejores
    data.sort((a, b) => b.score - a.score);
    data = data.slice(0, 10);

    // Guardar el top 10 actualizado en el archivo
    fs.writeFileSync(SCORE_FILE, JSON.stringify(data, null, 2));

    res.json({ ok: true });
});

// --- Servir SCARGAME.html al acceder a "/" ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'SCARGAME.html'));
});

app.listen(PORT, () => {
    console.log(`SCARGAME - ACTIVED en http://localhost:${PORT}`);
});
