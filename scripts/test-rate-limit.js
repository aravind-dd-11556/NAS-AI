// Native fetch is available in this Node version

async function testRateLimit() {
    const url = 'http://localhost:3000/api/no?language=English';
    console.log(`Testing rate limit against ${url}...`);

    let successCount = 0;
    let limitedCount = 0;

    for (let i = 1; i <= 25; i++) {
        try {
            const start = Date.now();
            const res = await fetch(url);
            const duration = Date.now() - start;

            if (res.status === 200) {
                successCount++;
                console.log(`Request ${i}: OK (${duration}ms)`);
            } else if (res.status === 429) {
                limitedCount++;
                console.log(`Request ${i}: Rate Limited (429)`);
            } else {
                console.log(`Request ${i}: Unexpected status ${res.status}`);
            }
        } catch (e) {
            console.error(`Request ${i} failed:`, e.message);
        }
        // minimal delay to ensure we hit the rate limit "per minute" logic fast enough
        await new Promise(r => setTimeout(r, 100));
    }

    console.log('\n--- Summary ---');
    console.log(`Successful requests: ${successCount}`);
    console.log(`Rate limited requests: ${limitedCount}`);

    if (limitedCount > 0) {
        console.log('✅ Rate limiting is working!');
    } else {
        console.log('❌ Rate limiting did not trigger.');
    }
}

testRateLimit();
