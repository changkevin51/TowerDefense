const { neon } = require('@neondatabase/serverless');
console.log('Function loaded');
console.log('Environment:', process.env.NODE_ENV);
console.log('Database URL:', process.env.DATABASE_URL);
// Initialize database connection with error handling
let sql;
try {
    sql = neon(process.env.DATABASE_URL);
    console.log('Database connected');
} catch (error) {
    console.error('Connection error:', error);
    throw error;
}

// Expanded CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
};

// Initialize database table
const initDB = async () => {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS leaderboard (
                id SERIAL PRIMARY KEY,
                player_name VARCHAR(100) NOT NULL,
                wave INTEGER NOT NULL,
                damage INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
};

exports.handler = async () => {
    try {
        const result = await sql`SELECT 1 AS test`;
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, result }),
        };
    } catch (error) {
        console.error('Database connection test failed:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message }),
        };
    }
};
// exports.handler = async (event, context) => {
//     // Handle preflight requests
//     if (event.httpMethod === 'OPTIONS') {
//         return {
//             statusCode: 204,
//             headers: corsHeaders
//         };
//     }

//     try {
//         if (event.httpMethod === 'GET') {
//             const entries = await sql`
//                 SELECT player_name, wave, damage, created_at 
//                 FROM leaderboard 
//                 ORDER BY wave DESC, damage DESC 
//                 LIMIT 100
//             `;
            
//             console.log('Fetched entries:', entries.length);
            
//             return {
//                 statusCode: 200,
//                 headers: corsHeaders,
//                 body: JSON.stringify(entries)
//             };
//         }

//         if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
//             const { player_name, wave, damage } = JSON.parse(event.body);
            
//             if (event.httpMethod === 'PUT') {
//                 await sql`
//                     UPDATE leaderboard 
//                     SET wave = ${wave}, damage = ${damage}, created_at = CURRENT_TIMESTAMP
//                     WHERE player_name = ${player_name}
//                 `;
//             } else {
//                 await sql`
//                     INSERT INTO leaderboard (player_name, wave, damage)
//                     VALUES (${player_name}, ${wave}, ${damage})
//                 `;
//             }
            
//             return {
//                 statusCode: event.httpMethod === 'POST' ? 201 : 200,
//                 headers: corsHeaders,
//                 body: JSON.stringify({ 
//                     message: event.httpMethod === 'POST' ? 'Score added' : 'Score updated' 
//                 })
//             };
//         }

//         return {
//             statusCode: 405,
//             headers: corsHeaders,
//             body: JSON.stringify({ error: 'Method not allowed' })
//         };
//     } catch (error) {
//         console.error('Error in handler:', error);
//         return {
//             statusCode: 500,
//             headers: corsHeaders,
//             body: JSON.stringify({ error: 'Server error', details: error.message }),
//         };
//     }
// };