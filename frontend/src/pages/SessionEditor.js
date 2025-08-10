import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function SessionEditor() {
  const { id: sessionIdFromUrl } = useParams(); 
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [jsonFileUrl, setJsonFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [draftId, setDraftId] = useState(null); 
  const autoSaveTimer = useRef(null);
  const messageTimer = useRef(null);

  // Show message for 2.5 seconds
  const showMessage = (msg) => {
    setMessage(msg);
    if (messageTimer.current) clearTimeout(messageTimer.current);
    messageTimer.current = setTimeout(() => setMessage(""), 2500);
  };

  useEffect(() => {
    if (!sessionIdFromUrl) return; 

    const fetchSession = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/sessions/my-sessions/${sessionIdFromUrl}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) {
          if (res.status === 404) {
            showMessage("❌ Session not found.");
          } else {
            showMessage("❌ Failed to load session.");
          }
          setLoading(false);
          return;
        }

        const data = await res.json();

        setTitle(data.title || "");
        setTags(Array.isArray(data.tags) ? data.tags.join(", ") : "");
        setJsonFileUrl(data.json_file_url || "");
        setDraftId(data._id);
      } catch (err) {
        showMessage("❌ Error loading session.");
      }
      setLoading(false);
    };

    fetchSession();
  }, [sessionIdFromUrl]);

  useEffect(() => {
    if (loading) return;
    if (!title && !tags && !jsonFileUrl) return;

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

    autoSaveTimer.current = setTimeout(async () => {
      showMessage("⏳ Auto-saving draft...");

      try {
        const bodyPayload = {
          title,
          tags,
          json_file_url: jsonFileUrl,
        };
        if (draftId) {
          bodyPayload.id = draftId;
        }

        const res = await fetch(
          "http://localhost:8000/sessions/my-sessions/save-draft",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(bodyPayload),
          }
        );

        const data = await res.json();

        if (res.ok && data._id) {
          if (!draftId) setDraftId(data._id);
          showMessage("✅ Draft saved");
        } else {
          showMessage(`❌ ${data.msg || "Failed to save draft"}`);
        }
      } catch {
        showMessage("❌ Auto-save failed. Please check your connection.");
      }
    }, 2000);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [title, tags, jsonFileUrl, draftId, loading]);

  // Manual save draft button
  const handleSaveDraft = async () => {
    if (!title || !tags || !jsonFileUrl) {
      showMessage("⚠ Please fill all fields before saving.");
      return;
    }
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

    setLoading(true);
    setMessage("");

    try {
      const bodyPayload = {
        title,
        tags,
        json_file_url: jsonFileUrl,
      };
      if (draftId) bodyPayload.id = draftId;

      const res = await fetch(
        "http://localhost:8000/sessions/my-sessions/save-draft",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bodyPayload),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setDraftId(data._id || draftId);
        showMessage("✅ Draft saved successfully!");
      } else {
        showMessage(`❌ ${data.msg || "Failed to save draft"}`);
      }
    } catch {
      showMessage("❌ Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  // Publish button
  const handlePublish = async () => {
    if (!title || !tags || !jsonFileUrl) {
      showMessage("⚠ Please fill all fields before publishing.");
      return;
    }
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

    setLoading(true);
    setMessage("");

    try {
      // Save draft first 
      const draftPayload = {
        title,
        tags,
        json_file_url: jsonFileUrl,
      };
      if (draftId) draftPayload.id = draftId;

      const draftRes = await fetch(
        "http://localhost:8000/sessions/my-sessions/save-draft",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(draftPayload),
        }
      );

      const draftData = await draftRes.json();

      if (draftRes.ok && draftData._id) {
        const publishRes = await fetch(
          "http://localhost:8000/sessions/my-sessions/publish",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ id: draftData._id }),
          }
        );

        const publishData = await publishRes.json();

        if (publishRes.ok) {
          showMessage("✅ Session published successfully!");
          setTitle("");
          setTags("");
          setJsonFileUrl("");
          setDraftId(null);
        } else {
          showMessage(`❌ ${publishData.msg || "Failed to publish session"}`);
        }
      } else {
        showMessage(`❌ ${draftData.msg || "Failed to save draft"}`);
      }
    } catch {
      showMessage("❌ Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar onMobileMenuToggle={setMobileMenuOpen} />

      <motion.div
        animate={{ marginTop: mobileMenuOpen ? 220 : 64 }}
        transition={{ duration: 0.3 }}
        className="flex-1 w-full max-w-7xl mx-auto px-4 py-10"
      >
        <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
          ✏ Create a New Session
        </h1>

        <div className="bg-white shadow-lg rounded-xl p-8 space-y-6 border border-gray-200 w-full">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Session Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter session title"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. yoga, meditation, wellness"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">Separate tags with commas.</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              JSON File URL
            </label>
            <input
              type="text"
              value={jsonFileUrl}
              onChange={(e) => setJsonFileUrl(e.target.value)}
              placeholder="Enter JSON file link"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
            />
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-3 rounded-lg text-sm ${
                message.startsWith("✅")
                  ? "bg-green-100 text-green-700"
                  : message.startsWith("⚠")
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </motion.div>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={handleSaveDraft}
              disabled={loading}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "💾 Save as Draft"}
            </button>
            <button
              onClick={handlePublish}
              disabled={loading}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Publishing..." : "🚀 Publish"}
            </button>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
