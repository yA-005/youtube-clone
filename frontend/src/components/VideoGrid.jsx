

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function VideoGrid() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await api.get('/videos');
                setVideos(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    if (loading) return <div>Loading videos...</div>;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {videos.map(video => (
                <div key={video._id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                    <Link to={`/video/${video._id}`}>
                        <img src={video.thumbnailUrl} alt={video.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                    </Link>
                    <div style={{ padding: '0.5rem' }}>
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