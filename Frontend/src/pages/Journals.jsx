import { useEffect, useState } from "react";
import { get, post, put, del } from "../api";

const defaultForm = {
  topicName: "",
  description: "",
  studyDuration: "",
  difficultyLevel: "Easy",
};

export default function Journals() {
  const [journals, setJournals] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadJournals = async () => {
    try {
      const data = await get("/api/journal/allJournal");
      setJournals(data.journal || []);
    } catch (err) {
      setError(err.message || "Could not load journals.");
    }
  };

  useEffect(() => {
    loadJournals();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        studyDuration: Number(form.studyDuration),
      };

      if (editingId) {
        await put(`/api/journal/update-journal/${editingId}`, payload);
        setMessage("Journal updated successfully.");
      } else {
        await post("/api/journal/create-journal", payload);
        setMessage("Journal created successfully.");
      }

      setForm(defaultForm);
      setEditingId(null);
      await loadJournals();
    } catch (err) {
      setError(err.message || "Journal save failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (journal) => {
    setEditingId(journal._id);
    setForm({
      topicName: journal.topicName,
      description: journal.description,
      studyDuration: journal.studyDuration,
      difficultyLevel: journal.difficultyLevel,
    });
    setMessage("");
  };

  const handleDelete = async (journalId) => {
    if (!window.confirm("Delete this journal?")) {
      return;
    }

    try {
      await del(`/api/journal/${journalId}`);
      setMessage("Journal deleted successfully.");
      await loadJournals();
    } catch (err) {
      setError(err.message || "Delete failed.");
    }
  };

  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          <h1>{editingId ? "Edit Journal" : "Create Journal"}</h1>
          <p>Manage your study topics and progress.</p>
        </div>
      </div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <label>
          Topic Name
          <input
            name="topicName"
            value={form.topicName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </label>

        <label>
          Study Duration (hours)
          <input
            name="studyDuration"
            type="number"
            min="0"
            value={form.studyDuration}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Difficulty Level
          <select
            name="difficultyLevel"
            value={form.difficultyLevel}
            onChange={handleChange}
            required
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : editingId ? "Update Journal" : "Create Journal"}
        </button>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>

      <div className="cards">
        {journals.length ? (
          journals.map((journal) => (
            <div key={journal._id} className="card journal-card">
              <h3>{journal.topicName}</h3>
              <p>{journal.description}</p>
              <p>
                <strong>Hours:</strong> {journal.studyDuration}
              </p>
              <p>
                <strong>Difficulty:</strong> {journal.difficultyLevel}
              </p>
              <div className="card-actions">
                <button type="button" onClick={() => handleEdit(journal)}>
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(journal._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No journals found yet. Create your first record.</p>
        )}
      </div>
    </section>
  );
}
