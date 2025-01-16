const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

exports.handler = async (event, context) => {
    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: corsHeaders
        };
    }

    try {
        if (event.httpMethod === 'GET') {
            const entries = await sql`
                SELECT player_name, wave, damage, created_at 
                FROM leaderboard 
                ORDER BY wave DESC, damage DESC 
                LIMIT 100
            `;
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify(entries)
            };
        }

        if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
            const { player_name, wave, damage } = JSON.parse(event.body);
            
            if (event.httpMethod === 'PUT') {
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
            
            return {
                statusCode: event.httpMethod === 'POST' ? 201 : 200,
                headers: corsHeaders,
                body: JSON.stringify({ 
                    message: event.httpMethod === 'POST' ? 'Score added' : 'Score updated' 
                })
            };
        }

        return {
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Method not allowed' })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Server error' })
        };
    }
};
