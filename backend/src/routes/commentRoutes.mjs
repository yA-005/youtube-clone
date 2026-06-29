

import express from 'express';
import { Comment } from '../models/Comment.mjs';
import { auth } from '../middleware/auth.mjs';

const router = express.Router();

// GET all comments for a video (public)
router.get('/video/:videoId', async (req, res) => {
    try {
        const comments = await Comment.find({ videoId: req.params.videoId })
            .populate('userId', 'username')
            .sort({ timestamp: -1 }); // newest first
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new comment (protected)
router.post('/', auth, async (req, res) => {
    try {
        const { videoId, text } = req.body;
        if (!videoId || !text) {
            return res.status(400).json({ message: 'Video ID and text are required' });
        }
        const comment = new Comment({
            videoId,
            userId: req.user.userId,
            text
        });
        await comment.save();
        await comment.populate('userId', 'username');
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update a comment (protected) – only owner can update
router.put('/:id', auth, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Text is required' });
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        if (comment.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You are not the owner of this comment' });
        }
        comment.text = text;
        await comment.save();
        await comment.populate('userId', 'username');
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE a comment (protected) – only owner can delete
router.delete('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        if (comment.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You are not the owner of this comment' });
        }
        await comment.deleteOne();
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;