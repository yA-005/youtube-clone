

import { useLocation } from 'react-router-dom';
import VideoGrid from './VideoGrid';
import CategoryFilter from './CategoryFilter';

function Home() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    const category = params.get('category') || 'all';

    return (
        <div>
            <CategoryFilter />
            <VideoGrid search={search} category={category} />
        </div>
    );
}

export default Home;