// Notes App - single page application using React.js
// Features: view, add, update and delete notes saved in the browser's localStorage

const { useState, useEffect } = React;
const STORAGE_KEY = "react-notes-app";
const COLORS = ["yellow", "blue", "green", "pink"];

function loadNotes() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch (error) {
    // Start with a sample note if saved data cannot be read.
  }
  return [{
    id: Date.now(),
    title: "Welcome",
    body: "Add a note with the form, edit it with Edit, or remove it with Delete.",
    color: "yellow",
    updated: new Date().toISOString()
  }];
}

function formatDate(iso) {
  return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function NoteForm({ editingNote, onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [color, setColor] = useState("yellow");

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setBody(editingNote.body);
      setColor(editingNote.color);
    } else {
      setTitle("");
      setBody("");
      setColor("yellow");
    }
  }, [editingNote]);

  function handleSubmit(event) {
    event.preventDefault();
    if (title.trim() === "" && body.trim() === "") return;
    onSave({ title: title.trim() || "Untitled", body: body.trim(), color });
  }

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <h2>{editingNote ? "Edit note" : "New note"}</h2>
      <label htmlFor="title">Title</label>
      <input id="title" type="text" value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="e.g. Lab viva topics" />
      <label htmlFor="body">Note</label>
      <textarea id="body" rows="6" value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Write your note here..." />
      <fieldset className="colors">
        <legend>Colour</legend>
        {COLORS.map((c) => (
          <label key={c} className={"swatch " + c + (color === c ? " selected" : "")}>
            <input type="radio" name="color" value={c} checked={color === c}
              onChange={() => setColor(c)} />
            <span className="sr-only">{c}</span>
          </label>
        ))}
      </fieldset>
      <div className="form-actions">
        <button type="submit" className="btn primary">
          {editingNote ? "Save changes" : "Add note"}
        </button>
        {editingNote && <button type="button" className="btn" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

function NoteCard({ note, onEdit, onDelete }) {
  return (
    <article className={"note " + note.color}>
      <h3>{note.title}</h3>
      <p>{note.body}</p>
      <footer>
        <time dateTime={note.updated}>{formatDate(note.updated)}</time>
        <div className="note-actions">
          <button className="btn small" onClick={() => onEdit(note)}>Edit</button>
          <button className="btn small danger" onClick={() => onDelete(note)}>Delete</button>
        </div>
      </footer>
    </article>
  );
}

function App() {
  const [notes, setNotes] = useState(loadNotes);
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  function saveNote(data) {
    const now = new Date().toISOString();
    if (editingNote) {
      setNotes(notes.map((note) => note.id === editingNote.id
        ? { ...note, ...data, updated: now } : note));
      setEditingNote(null);
    } else {
      setNotes([{ id: Date.now(), ...data, updated: now }, ...notes]);
    }
  }

  function deleteNote(note) {
    if (!window.confirm('Delete "' + note.title + '"?')) return;
    setNotes(notes.filter((item) => item.id !== note.id));
    if (editingNote && editingNote.id === note.id) setEditingNote(null);
  }

  const query = search.toLowerCase();
  const visible = notes.filter((note) =>
    note.title.toLowerCase().includes(query) || note.body.toLowerCase().includes(query)
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Notes</h1>
        <p>{notes.length} {notes.length === 1 ? "note" : "notes"} saved on this device</p>
      </header>
      <main className="layout">
        <NoteForm editingNote={editingNote} onSave={saveNote}
          onCancel={() => setEditingNote(null)} />
        <section aria-label="Your notes">
          <input type="search" className="search" value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search notes" aria-label="Search notes" />
          {visible.length === 0 ? (
            <p className="empty">
              {notes.length === 0 ? "No notes yet. Write your first note in the form."
                : "No notes match your search."}
            </p>
          ) : (
            <div className="grid">
              {visible.map((note) => (
                <NoteCard key={note.id} note={note}
                  onEdit={(item) => {
                    setEditingNote(item);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onDelete={deleteNote} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);