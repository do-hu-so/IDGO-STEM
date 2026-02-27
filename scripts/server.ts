import "dotenv/config";
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../api/chat';

// Helper to parse body
const parseBody = (req: IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                resolve({});
            }
        });
        req.on('error', reject);
    });
};

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
    }

    console.log(`${req.method} ${req.url}`);

    if (req.url === '/api/chat' && req.method === 'POST') {
        try {
            const body = await parseBody(req);

            // Mock VercelRequest keys
            const vReq = Object.assign(req, {
                body,
                query: {},
                cookies: {},
            }) as unknown as VercelRequest;

            // Mock VercelResponse methods
            const vRes = res as unknown as VercelResponse;

            vRes.status = (statusCode: number) => {
                res.statusCode = statusCode;
                return vRes;
            };

            vRes.json = (data: any) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return vRes;
            };

            // Call the actual handler
            await handler(vReq, vRes);

        } catch (error) {
            console.error('Server error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Local API Server running on http://127.0.0.1:${PORT}`);
    console.log('Ready to handle requests...');
});
