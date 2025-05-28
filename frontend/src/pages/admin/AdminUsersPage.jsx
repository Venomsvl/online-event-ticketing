import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import UserRow from '../../components/admin/UserRow';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/v1/admin/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await axios.put(`/api/v1/admin/users/${userId}`, { role: newRole });
      if (response.data) {
        toast.success('User role updated successfully');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(`/api/v1/admin/users/${userId}`);
      if (response.data) {
        toast.success('User deleted successfully');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#9f7aea', 
      minHeight: '100vh', 
      padding: '2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <Container style={{ maxWidth: '1200px', width: '100%' }}>
        <div 
          className="rounded-lg shadow-lg" 
          style={{ 
            backgroundColor: '#ffffff',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ 
            backgroundColor: '#9f7aea',
            padding: '1.5rem',
            borderBottom: '1px solid #e9d8fd'
          }}>
            <h2 style={{ 
              fontSize: '1.75rem', 
              color: '#ffffff',
              textAlign: 'center',
              margin: '0',
              fontWeight: '600'
            }}>User Management</h2>
          </div>
          <Table hover className="mb-0">
            <thead>
              <tr style={{ backgroundColor: '#f8f5ff' }}>
                <th style={{ padding: '1rem', color: '#553c9a', fontWeight: '600', fontSize: '0.95rem', borderBottom: '1px solid #e9d8fd' }}>Name</th>
                <th style={{ padding: '1rem', color: '#553c9a', fontWeight: '600', fontSize: '0.95rem', borderBottom: '1px solid #e9d8fd' }}>Email</th>
                <th style={{ padding: '1rem', color: '#553c9a', fontWeight: '600', fontSize: '0.95rem', borderBottom: '1px solid #e9d8fd' }}>Role</th>
                <th style={{ padding: '1rem', color: '#553c9a', fontWeight: '600', fontSize: '0.95rem', borderBottom: '1px solid #e9d8fd' }}>Status</th>
                <th style={{ padding: '1rem', color: '#553c9a', fontWeight: '600', fontSize: '0.95rem', textAlign: 'right', borderBottom: '1px solid #e9d8fd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <UserRow
                  key={user._id}
                  user={user}
                  onUpdateRole={handleUpdateRole}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
};

export default AdminUsersPage; 