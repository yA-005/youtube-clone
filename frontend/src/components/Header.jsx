

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
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
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f1f1f1' }}>
            <h1><Link to="/" style={{ textDecoration: 'none', color: '#000' }}>YouTube Clone</Link></h1>
            <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, maxWidth: '500px', margin: '0 1rem' }}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem' }}
                />
                <button type="submit" style={{ padding: '0.5rem 1rem' }}>Search</button>
            </form>
            <div>
                {user ? (
                    <>
                        <span>{user.username}</span>
                        <button onClick={logout} style={{ marginLeft: '0.5rem' }}>Logout</button>
                    </>
                ) : (
                    <Link to="/login">Sign In</Link>
                )}
            </div>
        </header>
    );
}

export default Header;