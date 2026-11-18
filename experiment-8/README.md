# Experiment 08 — Book Collection REST API

Build a simple RESTful API using Node.js and Express.js for managing a book collection with CRUD operations.

## Resources Used
- VS Code
- Node.js
- Express.js
- JavaScript
- Web Browser

## Setup
1. Install Node.js.
2. Open this folder in the terminal.
3. Run `npm install`.
4. Run `npm start`.
5. The API runs locally at `http://localhost:3000`.

## API Routes

| Method | Endpoint | Operation |
|---|---|---|
| GET | `/` | API status |
| GET | `/books` | Read all books |
| GET | `/books/:id` | Read one book |
| POST | `/books` | Create a book |
| PUT | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |

### Example POST body
```json
{
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt"
}
```

This experiment is locally hosted; it does not have a public live website URL.
