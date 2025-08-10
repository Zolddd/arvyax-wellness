import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrash, FaUpload, FaExternalLinkAlt } from "react-icons/fa";

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Edit modal states
  const [editingSession, setEditingSession] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editJsonUrl, setEditJsonUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [confirmModal, setConfirmModal] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch user's sessions
  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/sessions/my-sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSessions(data || []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Delete Session
  const deleteSession = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/sessions/my-sessions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.msg || "Delete failed");
      }
      setConfirmModal(null);
      fetchSessions();
    } catch (err) {
      console.error("Error deleting session:", err);
      setConfirmModal(null);
      // show a quick error toast inside modal area
      setMessage({ text: "❌ Failed to delete session.", type: "error" });
      setTimeout(() => setMessage(null), 2500);
    }
  };

  // Publish Draft 
  const publishSession = async (id) => {
    try {
      const res = await fetch("${process.env.REACT_APP_API_URL}/sessions/my-sessions/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.msg || "Publish failed");
      }
      setConfirmModal(null);
      fetchSessions();
    } catch (err) {
      console.error("Error publishing session:", err);
      setConfirmModal(null);
      setMessage({ text: "❌ Failed to publish session.", type: "error" });
      setTimeout(() => setMessage(null), 2500);
    }
  };

  const saveEditedSession = async () => {
    if (!editTitle || !editTags || !editJsonUrl) {
      setMessage({ text: "⚠ Please fill all fields before saving.", type: "error" });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        id: editingSession._id,
        title: editTitle,
        tags: editTags,
        json_file_url: editJsonUrl,
      };

      const res = await fetch("${process.env.REACT_APP_API_URL}/sessions/my-sessions/save-draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        // success
        setMessage({ text: "✅ Changes saved successfully!", type: "success" });

        // refresh list and close modal after short delay
        setTimeout(() => {
          setEditingSession(null);
          fetchSessions();
          setMessage(null);
        }, 1500);
      } else {
        // show backend message or fallback
        setMessage({
          text: `❌ ${data.msg || "Something went wrong. Please try again."}`,
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error saving edited session:", err);
      setMessage({ text: "❌ Something went wrong. Please try again.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const SessionCard = ({ session, isDraft }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
    >
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white truncate">{session.title}</h3>
        <span
          className={`text-xs px-3 py-1 rounded-full ${
            isDraft ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"
          }`}
        >
          {isDraft ? "Draft" : "Published"}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {session.tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <a
            href={session.json_file_url}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <FaExternalLinkAlt /> View
          </a>

          <button
            onClick={() => {
              setEditingSession(session);
              setEditTitle(session.title || "");
              setEditTags((session.tags || []).join(", "));
              setEditJsonUrl(session.json_file_url || "");
              setMessage(null);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
          >
            <FaEdit /> Edit
          </button>

          <button
            onClick={() => setConfirmModal({ id: session._id, action: "delete" })}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            <FaTrash /> Delete
          </button>

          {isDraft && (
            <button
              onClick={() => setConfirmModal({ id: session._id, action: "publish" })}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              <FaUpload /> Publish
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

  const drafts = sessions.filter((s) => s.status === "draft");
  const published = sessions.filter((s) => s.status === "published");

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col relative">
      <Navbar onMobileMenuToggle={setMobileMenuOpen} />

      <motion.div
        animate={{ marginTop: mobileMenuOpen ? 220 : 64 }}
        transition={{ duration: 0.3 }}
        className="flex-1"
      >
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
            📂 My Sessions
          </h1>

          {loading ? (
            <p className="text-center text-gray-500">Loading sessions...</p>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4">✅ Published</h2>
              {published.length === 0 ? (
                <p className="text-gray-500 mb-6">No published sessions yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {published.map((session) => (
                    <SessionCard key={session._id} session={session} />
                  ))}
                </div>
              )}

              <h2 className="text-2xl font-semibold mb-4">📝 Drafts</h2>
              {drafts.length === 0 ? (
                <p className="text-gray-500">No draft sessions yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {drafts.map((session) => (
                    <SessionCard key={session._id} session={session} isDraft />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>

      <Footer />

      {/* Edit Modal */}
      <AnimatePresence>
        {editingSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg"
            >
              <h3 className="text-xl font-semibold mb-4">✏ Edit Session</h3>

              <div className="space-y-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Session Title"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="Tags (comma separated)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
                <input
                  type="text"
                  value={editJsonUrl}
                  onChange={(e) => setEditJsonUrl(e.target.value)}
                  placeholder="JSON File URL"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />

                {message && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      message.type === "success"
                        ? "bg-green-100 border border-green-400 text-green-700"
                        : "bg-red-100 border border-red-400 text-red-700"
                    }`}
                  >
                    {message.text}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditingSession(null)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedSession}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete/Publish Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl p-6 w-11/12 max-w-sm text-center"
            >
              <h3 className="text-lg font-semibold mb-3">
                {confirmModal.action === "delete" ? "Confirm Delete" : "Publish Session"}
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                {confirmModal.action === "delete"
                  ? "Are you sure you want to delete this session?"
                  : "Are you sure you want to publish this draft?"}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() =>
                    confirmModal.action === "delete"
                      ? deleteSession(confirmModal.id)
                      : publishSession(confirmModal.id)
                  }
                  className={`px-4 py-2 ${
                    confirmModal.action === "delete" ? "bg-red-500" : "bg-green-600"
                  } text-white rounded-lg`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MySessions;
