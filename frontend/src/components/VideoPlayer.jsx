

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

function VideoPlayer() {
    const { id } = useParams();
    const { user } = useAuth();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userLike, setUserLike] = useState(null); // 'like' or 'dislike' or null
    const [comments, setComments] = useState([]);

    // Fetch video details and comments
    useEffect(() => {
        const fetchData = async () => {
            try {
                const videoRes = await api.get(`/videos/${id}`);
                setVideo(videoRes.data);
                setLikes(videoRes.data.likes);
                setDislikes(videoRes.data.dislikes);

                const commentsRes = await api.get(`/comments/video/${id}`);
                setComments(commentsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Add a new comment to the top of the list
    const addComment = (newComment) => {
        setComments(prev => [newComment, ...prev]);
    };

    // Like handler
    const handleLike = async () => {
        if (!user) {
            alert('Please login to like');
            return;
        }
        const action = userLike === 'like' ? 'unlike' : 'like';
        try {
            const res = await api.post(`/videos/${id}/like`, { action });
            setLikes(res.data.likes);
            setUserLike(action === 'like' ? 'like' : null);
        } catch (err) {
            console.error(err);
        }
    };

    // Dislike handler
    const handleDislike = async () => {
        if (!user) {
            alert('Please login to dislike');
            return;
        }
        const action = userLike === 'dislike' ? 'undislike' : 'dislike';
        try {
            const res = await api.post(`/videos/${id}/dislike`, { action });
            setDislikes(res.data.dislikes);
            setUserLike(action === 'dislike' ? 'dislike' : null);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading video...</div>;
    if (!video) return <div>Video not found</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <video controls style={{ width: '100%' }} src={video.videoUrl} />
            <h1>{video.title}</h1>
            <p>{video.description}</p>
            <p>
                <Link to={`/channel/${video.uploader?._id || video.uploader}`}>
                    {video.channelId?.channelName}
                </Link>
            </p>

            <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
                <button onClick={handleLike}>👍 {likes}</button>
                <button onClick={handleDislike}>👎 {dislikes}</button>
            </div>

            <p>Views: {video.views}</p>

            {/* Comments section */}
            <div style={{ marginTop: '2rem' }}>
                <CommentForm videoId={id} onCommentAdded={addComment} />
                <CommentList videoId={id} comments={comments} setComments={setComments} />
            </div>
        </div>
    );
}

export default VideoPlayer;