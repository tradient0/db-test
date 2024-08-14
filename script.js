(async function() {
    const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });
    const Httpvfs = await loadSqlJsHttpvfs();

    // Load the SQLite database hosted as a static file
    const db = await Httpvfs.openDatabase({
        backend: 'httpvfs',
        arguments: ['/data.sqlite'],
        baseUrl: '.',
    });

    // Function to execute SQL queries and return results
    function executeQuery(query) {
        const stmt = db.prepare(query);
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    }

    // Handle API requests based on the URL
    function handleApiRequest(url) {
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        const params = new URLSearchParams(urlObj.search);

        if (path === '/api/users') {
            const name = params.get('name');
            if (name) {
                return executeQuery(`SELECT * FROM users WHERE name LIKE '%${name}%'`);
            } else {
                return executeQuery('SELECT * FROM users');
            }
        } else {
            return { error: 'Invalid API endpoint' };
        }
    }

    // Intercept fetch calls to simulate an API server
    window.fetch = (url) => {
        return new Promise((resolve) => {
            const response = handleApiRequest(url);
            resolve(new Response(JSON.stringify(response), {
                headers: { 'Content-Type': 'application/json' }
            }));
        });
    };

    // Example usage of the API
    async function apiGetUsersByName(name) {
        const response = await fetch(`/api/users?name=${name}`);
        const data = await response.json();
        console.log('API Response:', data);
        return data;
    }

    // Test the API function
    apiGetUsersByName('Kacie').then(users => {
        console.log('API Response:', users);
    });

})();
