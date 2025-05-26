import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Container, Alert, Spinner } from 'react-bootstrap';
import UserRow from '../components/admin/UserRow';
import { toast } from 'react-toastify';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/admin/users');
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await axios.patch(`/api/v1/admin/users/${userId}/role`, { role: newRole });
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user role');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/v1/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: '#2c3e50' }}>
          Manage Users
        </h2>
      </div>
      <div className="bg-white rounded-3 p-4" style={{ 
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        backgroundColor: '#fafafa' 
      }}>
        {users.length === 0 ? (
          <p className="text-muted text-center mb-0">No users found.</p>
        ) : (
          users.map((user) => (
            <UserRow
              key={user._id}
              user={user}
              onUpdateRole={handleUpdateRole}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </Container>
  );
};

export default AdminUsersPage; 