const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Session = require('../models/Session');

router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'published' });
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/my-sessions', authenticateToken, async (req, res) => {
  try {
    const sessions = await Session.find({ user_id: req.user.userId });
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/my-sessions/:id', authenticateToken, async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user_id: req.user.userId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/my-sessions/save-draft', authenticateToken, async (req, res) => {
  try {
    const { id, title, tags, json_file_url } = req.body;
    const updatedSession = {
      title,
      tags: tags.split(',').map(t => t.trim()),
      json_file_url,
      status: 'draft',
      updated_at: new Date()
    };

    let session;
    if (id) {
      session = await Session.findOneAndUpdate(
        { _id: id, user_id: req.user.userId },
        updatedSession,
        { new: true }
      );
    } else {
      session = new Session({
        ...updatedSession,
        user_id: req.user.userId
      });
      await session.save();
    }

    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/my-sessions/publish', authenticateToken, async (req, res) => {
  try {
    const { id } = req.body;
    const session = await Session.findOneAndUpdate(
      { _id: id, user_id: req.user.userId },
      { status: 'published', updated_at: new Date() },
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/my-sessions/:id', authenticateToken, async (req, res) => {
  try {
    const deletedSession = await Session.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.userId
    });

    if (!deletedSession) {
      return res.status(404).json({ error: 'Session not found or unauthorized' });
    }

    res.json({ msg: 'Session deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
