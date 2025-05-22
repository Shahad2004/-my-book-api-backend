import express from 'express';
import pgclient from '../db.js';

const myRouter = express.Router();

   // GET /api/books - Get all books
myRouter.get('/', async (req, res) => {
    try {
        const result = await pgclient.query('SELECT * FROM books ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/books/:id - Get book by ID
myRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pgclient.query('SELECT * FROM books WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Book not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/books - Add a new book
myRouter.post('/', async (req, res) => {
    const { title, author, year } = req.body;
    try {
        const result = await pgclient.query(
            'INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING *',
            [title, author, year]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/books/:id - Update a book
myRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, year } = req.body;
    try {
        const result = await pgclient.query(
            'UPDATE books SET title = $1, author = $2, year = $3 WHERE id = $4 RETURNING *',
            [title, author, year, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Book not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/books/:id - Delete a book
myRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pgclient.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Book not found' });
        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default myRouter; 

