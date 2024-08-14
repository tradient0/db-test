# SQLite API on GitHub Pages

This repository demonstrates how to serve a read-only SQLite database as an API using SQL.js and SQL.js-HTTPvfs, hosted on GitHub Pages.

## Structure

- `index.html`: Entry point of the application.
- `script.js`: Contains the logic to load the SQLite database and serve API requests.
- `users_database_with_index.sqlite`: SQLite database file with a `users` table and an index on the `name` column.

## Usage

To run the API, simply open `index.html` in a browser. The JavaScript code will load the SQLite database and allow you to query it directly from the console.

## Example

In the browser console, you can test the API by calling:

```javascript
apiGetUsersByName('Kacie').then(users => console.log(users));
