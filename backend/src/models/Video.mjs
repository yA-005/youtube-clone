

import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    thumbnailUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    uploadDate: { type: Date, default: Date.now },
    category: { type: String, required: true }
});

export const Video = mongoose.model('Video', videoSchema);