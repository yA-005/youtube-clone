

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

function VideoPlayer() {
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await api.get(`/videos/${id}`);
                setVideo(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [id]);

    if (loading) return <div>Loading video...</div>;
    if (!video) return <div>Video not found</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <video controls style={{ width: '100%' }} src={video.videoUrl} />
            <h1>{video.title}</h1>
            <p>{video.description}</p>
            <p><Link to={`/channel/${video.uploader}`}>{video.channelId?.channelName}</Link></p>
            <p>Views: {video.views}</p>
            {/* Like/Dislike will be added in next commit */}
        </div>
    );
}

export default VideoPlayer;