

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import LoadingSpinner from './LoadingSpinner';

function VideoPlayer() {
    const { id } = useParams();
    const { user } = useAuth();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userLike, setUserLike] = useState(null);
    const [comments, setComments] = useState([]);

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

    const addComment = (newComment) => setComments(prev => [newComment, ...prev]);

    const handleLike = async () => {
        if (!user) { alert('Please login to like'); return; }
        const action = userLike === 'like' ? 'unlike' : 'like';
        try {
            const res = await api.post(`/videos/${id}/like`, { action });
            setLikes(res.data.likes);
            setUserLike(action === 'like' ? 'like' : null);
        } catch (err) { console.error(err); }
    };

    const handleDislike = async () => {
        if (!user) { alert('Please login to dislike'); return; }
        const action = userLike === 'dislike' ? 'undislike' : 'dislike';
        try {
            const res = await api.post(`/videos/${id}/dislike`, { action });
            setDislikes(res.data.dislikes);
            setUserLike(action === 'dislike' ? 'dislike' : null);
        } catch (err) { console.error(err); }
    };

    if (loading) return <LoadingSpinner />;
    if (!video) return <div>Video not found</div>;

    return (
        <div className="video-player">
            <video controls src={video.videoUrl} />
            <h1>{video.title}</h1>
            <p>{video.description}</p>
            <div className="meta">
                <Link to={`/channel/${video.uploader?._id || video.uploader}`}>
                    {video.channelId?.channelName}
                </Link>
                <span>{video.views} views</span>
            </div>
            <div className="actions">
                <button onClick={handleLike}>👍 {likes}</button>
                <button onClick={handleDislike}>👎 {dislikes}</button>
            </div>
            <div className="comment-section">
                <CommentForm videoId={id} onCommentAdded={addComment} />
                <CommentList videoId={id} comments={comments} setComments={setComments} />
            </div>
        </div>
    );
}

export default VideoPlayer;