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
    const data = JSON.parse(fs.readFileSync(SCORE_FILE, 'utf8'));
    res.json(data);
});

app.post('/submit', (req, res) => {
    const { player, score, time } = req.body;
    if (!player || typeof score !== 'number') return res.status(400).json({ error: 'Datos inválidos' });

    let data = [];
    if (fs.existsSync(SCORE_FILE)) {
        try {
            // Leer los puntajes actuales
            data = JSON.parse(fs.readFileSync(SCORE_FILE, 'utf8'));

            // Hacer backup antes de sobrescribir
            const backupFile = SCORE_FILE.replace('.json', `_backup_${Date.now()}.json`);
            fs.copyFileSync(SCORE_FILE, backupFile);

        } catch {
            data = [];
        }
    }

    // Agregar el nuevo score
    data.push({ player, score, time });

    // Ordenar de mayor a menor
    data.sort((a, b) => b.score - a.score);

    // Guardar todos los puntajes (no eliminamos antiguos)
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

app.get('/highscores', (req, res) => {
    if (!fs.existsSync(SCORE_FILE)) return res.json([]);
    let data = JSON.parse(fs.readFileSync(SCORE_FILE, 'utf8'));

    // Ordenar de mayor a menor por score
    data.sort((a, b) => b.score - a.score);

    // Tomar solo los primeros 10
    const top10 = data.slice(0, 10);

    res.json(top10);
});
