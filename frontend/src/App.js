import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Profile from './components/Profile';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <Router>
      <div>
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/" className="navbar-brand">NCIS403 Web App</Link>
            <div className="navbar-menu">
              {user ? (
                <>
                  <Link to="/profile" className="navbar-item">Profile</Link>
                  <button onClick={handleLogout} className="navbar-item" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
                </>
              ) : (
                <Link to="/auth" className="navbar-item">Login/Register</Link>
              )}
            </div>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={
              <div className="card">
                <h1>Welcome to NCIS403 Web Application</h1>
                <p>This application demonstrates a full-stack web application with user authentication and profile management.</p>
                {!user && <p>Please <Link to="/auth">login or register</Link> to continue.</p>}
              </div>
            } />
            <Route 
              path="/auth" 
              element={user ? <Navigate to="/profile" /> : <AuthForm onLogin={handleLogin} />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} updateUser={handleLogin} /> : <Navigate to="/auth" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;