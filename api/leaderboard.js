require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization'
};

const initDB = async () => {
    await sql`
        CREATE TABLE IF NOT EXISTS leaderboard (
            id SERIAL PRIMARY KEY,
            player_name VARCHAR(100) NOT NULL,
            wave INTEGER NOT NULL,
            damage INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
};

module.exports = async (req, res) => {
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    try {
        await initDB();

        if (req.method === 'GET') {
            const entries = await sql`
                SELECT player_name, wave, damage, created_at 
                FROM leaderboard 
                ORDER BY wave DESC, damage DESC 
                LIMIT 100
            `;
            res.status(200).json(entries);
        } else if (req.method === 'POST' || req.method === 'PUT') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                const { player_name, wave, damage } = JSON.parse(body);
                
                if (req.method === 'PUT') {
                    await sql`
                        UPDATE leaderboard 
                        SET wave = ${wave}, damage = ${damage}, created_at = CURRENT_TIMESTAMP
                        WHERE player_name = ${player_name}
                    `;
                } else {
                    await sql`
                        INSERT INTO leaderboard (player_name, wave, damage)
                        VALUES (${player_name}, ${wave}, ${damage})
                    `;
                }
                
                res.status(req.method === 'POST' ? 201 : 200).json({ 
                    message: req.method === 'POST' ? 'Score added' : 'Score updated' 
                });
            });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};