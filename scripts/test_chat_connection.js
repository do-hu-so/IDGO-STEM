
const fetch = require('node-fetch'); // unlikely to be available, use built-in fetch if node 18+

async function test() {
    try {
        const response = await fetch('http://127.0.0.1:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: 'Xin chao' })
        });

        if (!response.ok) {
            console.error('Status:', response.status);
            console.error('Text:', await response.text());
        } else {
            console.log('Response:', await response.json());
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
