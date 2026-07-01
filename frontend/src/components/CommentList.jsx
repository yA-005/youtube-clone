

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function CommentList({ videoId, comments, setComments }) {
    const { user } = useAuth();
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    const handleDelete = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await api.delete(`/comments/${commentId}`);
            setComments(prev => prev.filter(c => c._id !== commentId));
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    const startEdit = (comment) => {
        setEditingId(comment._id);
        setEditText(comment.text);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const saveEdit = async (commentId) => {
        if (!editText.trim()) return;
        try {
            const res = await api.put(`/comments/${commentId}`, { text: editText });
            setComments(prev => prev.map(c => c._id === commentId ? res.data : c));
            setEditingId(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        }
    };

    if (comments.length === 0) return <p>No comments yet.</p>;

    return (
        <div>
            <h3>Comments ({comments.length})</h3>
            {comments.map(comment => (
                <div key={comment._id} className="comment">
                    <strong>{comment.userId?.username || 'Unknown User'}</strong>
                    {editingId === comment._id ? (
                        <div>
                            <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                rows="2"
                                style={{ width: '100%' }}
                            />
                            <button onClick={() => saveEdit(comment._id)}>Save</button>
                            <button onClick={cancelEdit}>Cancel</button>
                        </div>
                    ) : (
                        <p>{comment.text}</p>
                    )}
                    <small>{new Date(comment.timestamp).toLocaleString()}</small>
                    {user && comment.userId && comment.userId._id === user.id && (
                        <div className="comment-actions">
                            <button onClick={() => startEdit(comment)}>Edit</button>
                            <button onClick={() => handleDelete(comment._id)} className="delete">Delete</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default CommentList;