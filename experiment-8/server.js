const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho" },
  { id: 2, title: "Atomic Habits", author: "James Clear" },
];

let nextId = 3;

// Home
app.get("/", (req, res) => {
  res.send("Book API is running. Try /books");
});

// READ all books
app.get("/books", (req, res) => {
  res.json(books);
});

// READ one book
app.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

// CREATE a book
app.post("/books", (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required" });
  }
  const book = { id: nextId++, title, author };
  books.push(book);
  res.status(201).json(book);
});

// UPDATE a book
app.put("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  book.title = req.body.title || book.title;
  book.author = req.body.author || book.author;
  res.json(book);
});

// DELETE a book
app.delete("/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Book not found" });
  const deleted = books.splice(index, 1);
  res.json({ message: "Book deleted", book: deleted[0] });
});

app.listen(PORT, () => {
  console.log(`Book API is running at http://localhost:${PORT}`);
});
