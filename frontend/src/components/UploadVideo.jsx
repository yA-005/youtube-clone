

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function UploadVideo() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        thumbnailUrl: '',
        videoUrl: '',
        category: 'Education'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/videos', form);
            navigate('/'); // redirect to home after upload
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <h2>Upload Video</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title *</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>
                <div>
                    <label>Thumbnail URL *</label>
                    <input
                        type="url"
                        name="thumbnailUrl"
                        value={form.thumbnailUrl}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Video URL *</label>
                    <input
                        type="url"
                        name="videoUrl"
                        value={form.videoUrl}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Category *</label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="Education">Education</option>
                        <option value="Music">Music</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Sports">Sports</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Technology">Technology</option>
                    </select>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload Video'}
                </button>
            </form>
        </div>
    );
}

export default UploadVideo;