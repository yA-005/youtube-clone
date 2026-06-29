

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function ChannelPage() {
    const { userId } = useParams();
    const { user } = useAuth();
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingVideo, setEditingVideo] = useState(null);

    useEffect(() => {
        const fetchChannel = async () => {
            try {
                const res = await api.get(`/channel/${userId}`);
                setChannel(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchChannel();
    }, [userId]);

    const isOwner = user && channel && channel.owner === user.id;

    const handleDelete = async (videoId) => {
        if (!window.confirm('Delete this video?')) return;
        try {
            await api.delete(`/videos/${videoId}`);
            // Remove from UI
            setChannel(prev => ({
                ...prev,
                videos: prev.videos.filter(v => v._id !== videoId)
            }));
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    const handleUpdate = async (videoId, updatedData) => {
        try {
            const res = await api.put(`/videos/${videoId}`, updatedData);
            setChannel(prev => ({
                ...prev,
                videos: prev.videos.map(v => v._id === videoId ? res.data : v)
            }));
            setEditingVideo(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!channel) return <div>Channel not found</div>;

    return (
        <div>
            <h1>{channel.channelName}</h1>
            <p>{channel.description}</p>
            <p>Subscribers: {channel.subscribers}</p>
            <h2>Videos</h2>
            <div>
                {channel.videos && channel.videos.length > 0 ? (
                    channel.videos.map(video => (
                        <div key={video._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '0.5rem' }}>
                            {editingVideo && editingVideo._id === video._id ? (
                                // Edit form
                                <div>
                                    <input
                                        type="text"
                                        defaultValue={video.title}
                                        ref={input => input && (input.value = video.title)}
                                        id={`edit-title-${video._id}`}
                                    />
                                    <textarea
                                        defaultValue={video.description}
                                        id={`edit-desc-${video._id}`}
                                    />
                                    <input
                                        type="url"
                                        defaultValue={video.thumbnailUrl}
                                        id={`edit-thumb-${video._id}`}
                                    />
                                    <input
                                        type="url"
                                        defaultValue={video.videoUrl}
                                        id={`edit-video-${video._id}`}
                                    />
                                    <select defaultValue={video.category} id={`edit-cat-${video._id}`}>
                                        <option value="Education">Education</option>
                                        <option value="Music">Music</option>
                                        <option value="Gaming">Gaming</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Comedy">Comedy</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Technology">Technology</option>
                                    </select>
                                    <button onClick={() => {
                                        const title = document.getElementById(`edit-title-${video._id}`).value;
                                        const description = document.getElementById(`edit-desc-${video._id}`).value;
                                        const thumbnailUrl = document.getElementById(`edit-thumb-${video._id}`).value;
                                        const videoUrl = document.getElementById(`edit-video-${video._id}`).value;
                                        const category = document.getElementById(`edit-cat-${video._id}`).value;
                                        handleUpdate(video._id, { title, description, thumbnailUrl, videoUrl, category });
                                    }}>Save</button>
                                    <button onClick={() => setEditingVideo(null)}>Cancel</button>
                                </div>
                            ) : (
                                <div>
                                    <h3>{video.title}</h3>
                                    <p>{video.description}</p>
                                    <p>Views: {video.views}</p>
                                    {isOwner && (
                                        <div>
                                            <button onClick={() => setEditingVideo(video)}>Edit</button>
                                            <button onClick={() => handleDelete(video._id)} style={{ backgroundColor: 'red', color: 'white' }}>Delete</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No videos uploaded yet.</p>
                )}
            </div>
        </div>
    );
}

export default ChannelPage;