import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "" });
  const [editingId, setEditingId] = useState(null);
  const [editedBook, setEditedBook] = useState({ title: "", author: "" });
  const [username, setUsername] = useState("User");
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return router.push("/");
    fetchBooks();
    decodeUserFromToken();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_BASE}/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("❌ Failed to fetch books:", err);
    }
  };

  const decodeUserFromToken = () => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUsername(payload.username || "User");
    } catch (err) {
      console.error("❌ Invalid token:", err);
      setUsername("User");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch("process.env.NEXT_PUBLIC_API_BASE}/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newBook),
    });
    if (res.ok) {
      setNewBook({ title: "", author: "" });
      fetchBooks();
    }
  };

  const startEdit = (book) => {
    setEditingId(book._id);
    setEditedBook({ title: book.title, author: book.author });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const res = await fetch(`process.env.NEXT_PUBLIC_API_BASE}/api/books/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editedBook),
    });
    if (res.ok) {
      setEditingId(null);
      fetchBooks();
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`process.env.NEXT_PUBLIC_API_BASE}/api/books/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchBooks();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🧭 Navigation Bar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">📚 BookAuth</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Logged in as <strong>{username}</strong></span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ➕ Add Book Form */}
      <div className="p-6">
        <form onSubmit={handleAdd} className="mb-6 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Add a New Book</h2>
          <input
            type="text"
            placeholder="Title"
            className="border p-2 mr-2"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Author"
            className="border p-2 mr-2"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
        </form>

        {/* 📋 Book List */}
        <ul className="space-y-4">
          {books.map((book) => (
            <li key={book._id} className="bg-white p-4 rounded shadow">
              {editingId === book._id ? (
                <form onSubmit={handleEdit} className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="border p-2"
                    value={editedBook.title}
                    onChange={(e) => setEditedBook({ ...editedBook, title: e.target.value })}
                  />
                  <input
                    type="text"
                    className="border p-2"
                    value={editedBook.author}
                    onChange={(e) => setEditedBook({ ...editedBook, author: e.target.value })}
                  />
                  <button className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                  <button
                    type="button"
                    className="bg-gray-300 px-3 py-1 rounded"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{book.title}</p>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => startEdit(book)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(book._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
