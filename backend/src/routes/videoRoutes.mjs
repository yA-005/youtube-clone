

import express from 'express';
import { Video } from '../models/Video.mjs';
import { Channel } from '../models/Channel.mjs';
import { auth } from '../middleware/auth.mjs';

const router = express.Router();

// GET all videos (public) – with optional category filter
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category && category !== 'all' ? { category } : {};
        const videos = await Video.find(filter)
            .populate('channelId', 'channelName')
            .sort({ uploadDate: -1 });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single video by ID (public) – increments views
router.get('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)
            .populate('channelId', 'channelName')
            .populate('uploader', 'username');
        if (!video) return res.status(404).json({ message: 'Video not found' });
        // Increment views
        video.views += 1;
        await video.save();
        res.json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create a new video (protected) – requires channel
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, thumbnailUrl, videoUrl, category } = req.body;
        if (!title || !thumbnailUrl || !videoUrl || !category) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Find the user's channel
        const channel = await Channel.findOne({ owner: req.user.userId });
        if (!channel) {
            return res.status(404).json({ message: 'You must create a channel first' });
        }
        const video = new Video({
            title,
            description,
            thumbnailUrl,
            videoUrl,
            category,
            channelId: channel._id,
            uploader: req.user.userId
        });
        await video.save();
        // Add video to channel's videos array
        channel.videos.push(video._id);
        await channel.save();
        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update a video (protected) – only owner can update
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description, thumbnailUrl, videoUrl, category } = req.body;
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });
        // Check ownership: video.uploader should match req.user.userId
        if (video.uploader.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You are not the owner of this video' });
        }
        video.title = title || video.title;
        video.description = description !== undefined ? description : video.description;
        video.thumbnailUrl = thumbnailUrl || video.thumbnailUrl;
        video.videoUrl = videoUrl || video.videoUrl;
        video.category = category || video.category;
        await video.save();
        res.json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE a video (protected) – only owner can delete
router.delete('/:id', auth, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });
        if (video.uploader.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You are not the owner of this video' });
        }
        // Remove video from channel's videos array
        await Channel.updateOne(
            { _id: video.channelId },
            { $pull: { videos: video._id } }
        );
        await video.deleteOne();
        res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;