
async function test() {
    try {
        console.log("Sending request...");
        const response = await fetch('http://127.0.0.1:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: 'Xin chao' })
        });

        console.log('Status:', response.status);
        if (!response.ok) {
            console.error('Error Text:', await response.text());
        } else {
            console.log('Response:', await response.json());
        }
    } catch (e) {
        console.error('Fetch Error:', e);
    }
}

test();
