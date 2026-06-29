

import { useLocation } from 'react-router-dom';
import VideoGrid from './VideoGrid';

function Home() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';

    return (
        <div>
            <VideoGrid search={search} />
        </div>
    );
}

export default Home;