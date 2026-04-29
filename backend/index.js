import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Helper to read DB
const readDB = async () => {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
};

// Helper to write DB
const writeDB = async (data) => {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};

// Routes
app.get('/api/db', async (req, res) => {
    try {
        const db = await readDB();
        res.json(db);
    } catch (error) {
        res.status(500).json({ error: 'DB oxunmadı' });
    }
});

// Update AI Instructions
app.post('/api/ai-instructions', async (req, res) => {
    try {
        const db = await readDB();
        db.ai_instructions = req.body;
        await writeDB(db);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Data yenilənmədi' });
    }
});

// Update CMS
app.post('/api/cms', async (req, res) => {
    try {
        const db = await readDB();
        db.cms = { ...db.cms, ...req.body };
        await writeDB(db);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'CMS yenilənmədi' });
    }
});

// Helpdesk: Get all tickets
app.get('/api/helpdesk', async (req, res) => {
    try {
        const db = await readDB();
        res.json(db.helpdesk);
    } catch (error) {
        res.status(500).json({ error: 'Biletlər tapılmadı' });
    }
});

// Helpdesk: Create ticket
app.post('/api/helpdesk', async (req, res) => {
    try {
        const db = await readDB();
        const newTicket = {
            id: Date.now(),
            ...req.body,
            status: 'open',
            created_at: new Date().toISOString(),
            replies: []
        };
        db.helpdesk.push(newTicket);
        await writeDB(db);
        res.json(newTicket);
    } catch (error) {
        res.status(500).json({ error: 'Bilet yaradılmadı' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
