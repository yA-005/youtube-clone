

import { useNavigate, useLocation } from 'react-router-dom';

const categories = ['all', 'Education', 'Music', 'Gaming', 'Sports', 'Comedy', 'Entertainment', 'Technology'];

function CategoryFilter() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const currentCategory = params.get('category') || 'all';

    const handleCategoryClick = (category) => {
        params.set('category', category);
        // Preserve search term if present
        const search = params.get('search');
        const query = search ? `?search=${search}&category=${category}` : `?category=${category}`;
        navigate(`/${query}`);
    };

    return (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: currentCategory === cat ? '#007bff' : '#e9ecef',
                        color: currentCategory === cat ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer'
                    }}
                >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
            ))}
        </div>
    );
}

export default CategoryFilter;