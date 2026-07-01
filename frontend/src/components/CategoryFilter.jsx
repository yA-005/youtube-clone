

import { useNavigate, useLocation } from 'react-router-dom';

const categories = ['all', 'Education', 'Music', 'Gaming', 'Sports', 'Comedy', 'Entertainment', 'Technology'];

function CategoryFilter() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const currentCategory = params.get('category') || 'all';

    const handleCategoryClick = (category) => {
        params.set('category', category);
        const search = params.get('search');
        const query = search ? `?search=${search}&category=${category}` : `?category=${category}`;
        navigate(`/${query}`);
    };

    const clearFilters = () => navigate('/');

    return (
        <div className="category-filter">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={currentCategory === cat ? 'active' : ''}
                >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
            ))}
            <button onClick={clearFilters} className="clear">Clear Filters</button>
        </div>
    );
}

export default CategoryFilter;