

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header({ toggleSidebar }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?search=${encodeURIComponent(searchTerm)}`);
        } else {
            navigate('/');
        }
    };

    return (
        <header>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button onClick={toggleSidebar} className="hamburger" style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', marginRight: '0.5rem' }}>
                    ☰
                </button>
                <h1><Link to="/">YouTube Clone</Link></h1>
            </div>
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <button type="submit">Search</button>
            </form>
            <div className="user-info">
                {user ? (
                    <>
                        <span>{user.username}</span>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <button onClick={() => navigate('/login')}>Sign In</button>
                )}
            </div>
        </header>
    );
}

export default Header;