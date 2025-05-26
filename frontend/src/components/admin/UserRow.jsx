import React, { useState } from 'react';
import { Button, Badge, Modal, Form } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';

const UserRow = ({ user, onUpdateRole, onDelete }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);

  const handleUpdateRole = () => {
    if (selectedRole && selectedRole !== user.role) {
      onUpdateRole(user._id, selectedRole);
      setShowUpdateModal(false);
    }
  };

  const handleDelete = () => {
    if (user._id) {
      onDelete(user._id);
      setShowDeleteModal(false);
    }
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const getRoleBadgeVariant = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'danger';
      case 'organizer':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const StatusIcon = ({ isActive }) => (
    isActive ? 
      <FaCheck style={{ color: '#48bb78', fontSize: '1.25rem' }} /> : 
      <FaTimes style={{ color: '#f56565', fontSize: '1.25rem' }} />
  );

  return (
    <>
      <tr className="align-middle" style={{ 
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e9d8fd'
      }}>
        <td style={{ padding: '1rem', color: '#2d3748', fontWeight: '500' }}>{user.name}</td>
        <td style={{ padding: '1rem', color: '#4a5568' }}>{user.email}</td>
        <td style={{ padding: '1rem', color: '#4a5568', textTransform: 'capitalize' }}>{user.role}</td>
        <td style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <StatusIcon isActive={user.isActive} />
            <span style={{ 
              color: user.isActive ? '#48bb78' : '#f56565', 
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </td>
        <td style={{ padding: '1rem', textAlign: 'right' }}>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Button
              variant="outline-primary"
              size="sm"
              style={{ 
                fontSize: '0.85rem',
                padding: '0.375rem 0.75rem',
                backgroundColor: '#f8f5ff',
                borderColor: '#9f7aea',
                color: '#553c9a',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
              onClick={() => setShowUpdateModal(true)}
            >
              Update Role
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              style={{ 
                fontSize: '0.85rem',
                padding: '0.375rem 0.75rem',
                backgroundColor: '#f8f5ff',
                borderColor: '#9f7aea',
                color: '#553c9a',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        </td>
      </tr>

      {/* Update Role Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} size="sm" centered>
        <Modal.Header closeButton style={{ backgroundColor: '#9f7aea', borderBottom: '1px solid #e9d8fd' }}>
          <Modal.Title style={{ fontSize: '1.1rem', color: '#ffffff' }}>Update User Role</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#ffffff', padding: '1.5rem' }}>
          <Form.Group>
            <Form.Label style={{ color: '#4a5568', marginBottom: '0.5rem' }}>Select Role</Form.Label>
            <Form.Select
              value={selectedRole}
              onChange={handleRoleChange}
              style={{ 
                fontSize: '0.95rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e9d8fd',
                borderRadius: '0.375rem'
              }}
            >
              <option value="user">User</option>
              <option value="organizer">Organizer</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#f8f5ff', borderTop: '1px solid #e9d8fd', padding: '1rem' }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowUpdateModal(false)}
            style={{ 
              backgroundColor: '#edf2f7',
              borderColor: '#cbd5e0',
              color: '#4a5568'
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpdateRole}
            style={{ 
              backgroundColor: '#9f7aea',
              borderColor: '#9f7aea',
              color: '#ffffff'
            }}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} size="sm" centered>
        <Modal.Header closeButton style={{ backgroundColor: '#fff5f5', borderBottom: '1px solid #fed7d7' }}>
          <Modal.Title style={{ fontSize: '1.1rem', color: '#c53030' }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#fff5f5', padding: '1.5rem' }}>
          Are you sure you want to delete this user?
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#fff5f5', borderTop: '1px solid #fed7d7', padding: '1rem' }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            style={{ 
              backgroundColor: '#edf2f7',
              borderColor: '#cbd5e0',
              color: '#4a5568'
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            style={{ 
              backgroundColor: '#f56565',
              borderColor: '#f56565',
              color: '#ffffff'
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserRow;