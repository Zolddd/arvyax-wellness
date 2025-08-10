import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MySessions from "./pages/MySessions";
import SessionEditor from "./pages/SessionEditor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-sessions" element={<MySessions />} />
        <Route path="/session-editor" element={<SessionEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
