

function Sidebar({ isOpen }) {
    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <ul>
                <li>🏠 Home</li>
                <li>📺 Subscriptions</li>
                <li>📚 Library</li>
                <li>📈 Trending</li>
                <li>🎵 Music</li>
                <li>🎮 Gaming</li>
                <li>⚙️ Settings</li>
            </ul>
        </div>
    );
}

export default Sidebar;