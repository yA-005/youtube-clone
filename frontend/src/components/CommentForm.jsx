

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function CommentForm({ videoId, onCommentAdded }) {
    const { user } = useAuth();
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!user) {
        return <p>Please <a href="/login">login</a> to comment.</p>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/comments', { videoId, text });
            setText('');
            if (onCommentAdded) onCommentAdded(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post comment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
                style={{ width: '100%', padding: '0.5rem' }}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={loading}>
                {loading ? 'Posting...' : 'Post Comment'}
            </button>
        </form>
    );
}

export default CommentForm; 