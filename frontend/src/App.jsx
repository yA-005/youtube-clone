

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home'; 
import UploadVideo from './components/UploadVideo';
import VideoGrid from './components/VideoGrid';
import VideoPlayer from './components/VideoPlayer';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/upload" element={<ProtectedRoute><UploadVideo /></ProtectedRoute>} />
                    <Route path="/" element={<ProtectedRoute><VideoGrid /></ProtectedRoute>} />
                    <Route path="/video/:id" element={<VideoPlayer />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;