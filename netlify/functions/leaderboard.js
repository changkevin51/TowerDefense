const { neon } = require('@neondatabase/serverless');

// Initialize database connection
let sql;
try {
    sql = neon(process.env.DATABASE_URL, {
        ssl: { rejectUnauthorized: false }
    });
} catch (error) {
    console.error('Database connection error:', error);
    throw error;
}

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
};

// Vercel API route handler
export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(204).end();
    }

    try {
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
                    SET wave = ${wave}, damage = ${damage}, created_at = CURRENT_TIMESTAMP
                    WHERE player_name = ${player_name}
                `;
            } else {
                await sql`
                    INSERT INTO leaderboard (player_name, wave, damage)
                    VALUES (${player_name}, ${wave}, ${damage})
                `;
            }
            
            return res.status(req.method === 'POST' ? 201 : 200)
                     .json({ message: req.method === 'POST' ? 'Score added' : 'Score updated' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Error in handler:', error);
        return res.status(500).json({ error: 'Server error', details: error.message });
    }
}