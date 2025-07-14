import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const UserProfile = ({ userId, onUpdate }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, [userId]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/users/${userId}`);
            const userData = await response.json();
            setUser(userData);
        } catch (err) {
            setError('Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            onUpdate();
        } catch (err) {
            setError('Failed to update user');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="user-profile">
            <h2>{user.name}</h2>
            <p>Email: {user.email}</p>
        </div>
    );
};

UserProfile.propTypes = {
    userId: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired
};

export default UserProfile;
