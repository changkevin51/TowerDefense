require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);


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

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
            return res.status(200).json(entries);
        }

        if (req.method === 'POST' || req.method === 'PUT') {
            const { player_name, wave, damage } = req.body;
            
            if (req.method === 'PUT') {
                await sql`
                    UPDATE leaderboard 
                    SET wave = ${wave}, damage = ${damage}
                    WHERE player_name = ${player_name}
                `;
            } else {
                await sql`
                    INSERT INTO leaderboard (player_name, wave, damage)
                    VALUES (${player_name}, ${wave}, ${damage})
                `;
            }
            
            return res.status(req.method === 'POST' ? 201 : 200).json({
                message: req.method === 'POST' ? 'Score added' : 'Score updated'
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}