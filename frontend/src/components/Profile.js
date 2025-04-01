import React, { useState } from 'react';
import { updateUsername } from '../services/authService';

const Profile = ({ user, updateUser }) => {
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Username validation (no special characters)
  const isValidUsername = (username) => {
    if (!username || username.trim() === '') {
      return false;
    }
    
    // Check for special characters
    // eslint-disable-next-line no-useless-escape
    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    return !specialCharsRegex.test(username);
  };

  // Handle username change
  const handleChange = (e) => {
    setUsername(e.target.value);
    setError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    setSuccess('');
    
    // Validate username
    if (!isValidUsername(username)) {
      setError('Username cannot be empty or contain special characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await updateUsername(user.id, username);
      updateUser(response.user);
      setSuccess('Username updated successfully');
      setEditing(false);
    } catch (error) {
      setError(error.error || 'An error occurred while updating the username');
    } finally {
      setLoading(false);
    }
  };

  // Format date for better display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="card">
      <h2>User Profile</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="profile-info">
        <div className="profile-label">ID:</div>
        <div>{user.id}</div>
        
        <div className="profile-label">Username:</div>
        <div>
          {editing ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className={`form-control ${error ? 'invalid' : ''}`}
                value={username}
                onChange={handleChange}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setEditing(false);
                  setUsername(user.username);
                  setError('');
                }}
                style={{ backgroundColor: '#f14668' }}
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              {user.username}{' '}
              <button
                onClick={() => setEditing(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3273dc',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Edit
              </button>
            </>
          )}
        </div>
        
        <div className="profile-label">Email:</div>
        <div>{user.email}</div>
        
        <div className="profile-label">Created:</div>
        <div>{formatDate(user.createdAt)}</div>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>API Key Information</h3>
        <p>
          This application uses the API key <code>EXAM2024-KEY-5678</code> for all protected API requests.
          The key is included automatically in requests to the server.
        </p>
      </div>
    </div>
  );
};

export default Profile;