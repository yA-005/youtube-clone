

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from './LoadingSpinner';

function VideoGrid({ search = '', category = 'all' }) {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await api.get('/videos', { params: { search, category } });
                setVideos(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, [search, category]);

    if (loading) return <LoadingSpinner />;
    if (videos.length === 0) return <p style={{ textAlign: 'center', padding: '2rem' }}>No videos found.</p>;

    return (
        <div className="video-grid">
            {videos.map(video => (
                <div key={video._id} className="video-card">
                    <Link to={`/video/${video._id}`}>
                        <img src={video.thumbnailUrl} alt={video.title} />
                    </Link>
                    <div className="card-body">
                        <h4>{video.title}</h4>
                        <p>{video.channelId?.channelName || 'Unknown Channel'}</p>
                        <p>{video.views} views</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default VideoGrid;