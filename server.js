// require('dotenv').config();
// const http = require('http');
// const { neon } = require('@neondatabase/serverless');
// const cors = require('cors');
// const PORT = process.env.PORT || 3000;


// console.log("DATABASE_URL:", process.env.DATABASE_URL);
// // Initialize database connection
// const sql = neon(process.env.DATABASE_URL);

// const initDB = async () => {
//     await sql`
//         CREATE TABLE IF NOT EXISTS leaderboard (
//             id SERIAL PRIMARY KEY,
//             player_name VARCHAR(100) NOT NULL,
//             wave INTEGER NOT NULL,
//             damage INTEGER NOT NULL,
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         )
//     `;
// };

// const corsHeaders = {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
//     'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization'
// };
// const requestHandler = async (req, res) => {
//     Object.entries(corsHeaders).forEach(([key, value]) => {
//         res.setHeader(key, value);
//     });

//     if (req.method === 'OPTIONS') {
//         res.writeHead(204);
//         res.end();
//         return;
//     }

//     if (req.url.startsWith('/api/v1/leaderboard')) {
//         if (req.method === 'GET') {
//             try {
//                 const entries = await sql`
//                     SELECT player_name, wave, damage, created_at 
//                     FROM leaderboard 
//                     ORDER BY wave DESC, damage DESC 
//                     LIMIT 100
//                 `;
//                 res.writeHead(200, { 'Content-Type': 'application/json' });
//                 res.end(JSON.stringify(entries));
//             } catch (error) {
//                 res.writeHead(500, { 'Content-Type': 'application/json' });
//                 res.end(JSON.stringify({ error: 'Database error' }));
//             }
//         } else if (req.method === 'POST' || req.method === 'PUT') {
//             let body = '';
//             req.on('data', chunk => body += chunk);
//             req.on('end', async () => {
//                 try {
//                     const { player_name, wave, damage } = JSON.parse(body);
                    
//                     if (req.method === 'PUT') {
//                         await sql`
//                             UPDATE leaderboard 
//                             SET wave = ${wave}, damage = ${damage}, created_at = CURRENT_TIMESTAMP
//                             WHERE player_name = ${player_name}
//                         `;
//                     } else {
//                         await sql`
//                             INSERT INTO leaderboard (player_name, wave, damage)
//                             VALUES (${player_name}, ${wave}, ${damage})
//                         `;
//                     }
                    
//                     res.writeHead(req.method === 'POST' ? 201 : 200, { 'Content-Type': 'application/json' });
//                     res.end(JSON.stringify({ 
//                         message: req.method === 'POST' ? 'Score added' : 'Score updated' 
//                     }));
//                 } catch (error) {
//                     console.error('Error:', error);
//                     res.writeHead(400, { 'Content-Type': 'application/json' });
//                     res.end(JSON.stringify({ error: 'Invalid request' }));
//                 }
//             });
//         }
//     } else {
//         res.writeHead(404);
//         res.end();
//     }
// };

// initDB().then(() => {
//     const server = http.createServer(requestHandler);
//     server.listen(3000, () => {
//         console.log('Server running at http://localhost:3000');
//     });
// }).catch(console.error);

