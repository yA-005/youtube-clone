

import { useEffect, useState } from 'react';
import api from '../api/axios';

function CommentList({ videoId }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await api.get(`/comments/video/${videoId}`);
                setComments(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [videoId]);

    if (loading) return <div>Loading comments...</div>;

    return (
        <div>
            <h3>Comments ({comments.length})</h3>
            {comments.length === 0 ? (
                <p>No comments yet. Be the first!</p>
            ) : (
                comments.map(comment => (
                    <div key={comment._id} style={{ borderBottom: '1px solid #eee', padding: '0.5rem 0' }}>
                        <strong>{comment.userId?.username || 'Unknown User'}</strong>
                        <p>{comment.text}</p>
                        <small>{new Date(comment.timestamp).toLocaleString()}</small>
                    </div>
                ))
            )}
        </div>
    );
}

export default CommentList;