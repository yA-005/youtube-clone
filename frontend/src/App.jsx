

import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import VideoPlayer from './components/VideoPlayer';
import ChannelPage from './components/ChannelPage';
import UploadVideo from './components/UploadVideo';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <AuthProvider>
            <BrowserRouter>
                <Header toggleSidebar={toggleSidebar} />
                <Sidebar isOpen={sidebarOpen} />
                <Routes>
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/video/:id" element={<VideoPlayer />} />
                    <Route path="/channel/:userId" element={<ChannelPage />} />
                    <Route path="/upload" element={<ProtectedRoute><UploadVideo /></ProtectedRoute>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;