// Load the SQL.js and SQL.js-HTTPvfs libraries
(async function() {
    const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });
    const Httpvfs = await loadSqlJsHttpvfs();

    // Load the SQLite database hosted as a static file
    const db = await Httpvfs.openDatabase({
        backend: 'httpvfs',
        arguments: ['/users_database_with_index.sqlite'],
        baseUrl: '.',
    });

    // Function to serve API requests
    async function fetchData(query) {
        const stmt = db.prepare(query);
        const result = [];
        while (stmt.step()) {
            result.push(stmt.getAsObject());
        }
        stmt.free();
        return result;
    }

    // Example API endpoint for fetching users by name
    async function apiGetUsersByName(name) {
        const query = `SELECT * FROM users WHERE name LIKE '%${name}%'`;
        const data = await fetchData(query);
        console.log('Users:', data);
        return data;
    }

    // Testing the API function in the console (for demonstration purposes)
    apiGetUsersByName('Kacie').then(users => {
        console.log('API Response:', users);
    });
})();
