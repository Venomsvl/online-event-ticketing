import React, { useState } from 'react';
import { Button, Badge, Modal, Form } from 'react-bootstrap';
import { FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

const UserRow = ({ user, onUpdateRole, onDelete }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);

  const handleUpdateRole = () => {
    console.log('Update clicked - selectedRole:', selectedRole, 'user.role:', user.role);
    if (selectedRole && selectedRole !== user.role) {
      console.log('Calling onUpdateRole with:', user._id, selectedRole);
      onUpdateRole(user._id, selectedRole);
      setShowUpdateModal(false);
    } else {
      console.log('Update cancelled - no change detected');
      // If no change, still close the modal
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
    console.log('Role changed to:', e.target.value);
    setSelectedRole(e.target.value);
  };

  const getRoleBadgeStyle = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return {
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          color: '#ffffff',
          padding: '0.25rem 0.75rem',
          borderRadius: '12px',
          fontSize: '0.85rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        };
      case 'organizer':
        return {
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#ffffff',
          padding: '0.25rem 0.75rem',
          borderRadius: '12px',
          fontSize: '0.85rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        };
      default:
        return {
          background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
          color: '#ffffff',
          padding: '0.25rem 0.75rem',
          borderRadius: '12px',
          fontSize: '0.85rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        };
    }
  };

  const StatusIcon = ({ isActive }) => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.5rem',
      padding: '0.5rem 0.75rem',
      borderRadius: '12px',
      background: isActive 
        ? 'rgba(16, 185, 129, 0.1)' 
        : 'rgba(239, 68, 68, 0.1)',
      border: `1px solid ${isActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
    }}>
      {isActive ? 
        <FaCheck style={{ color: '#10b981', fontSize: '0.9rem' }} /> : 
        <FaTimes style={{ color: '#ef4444', fontSize: '0.9rem' }} />
      }
      <span style={{ 
        color: isActive ? '#10b981' : '#ef4444', 
        fontSize: '0.9rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
      }}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
  );

  const styles = {
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 150px',
      gap: '1rem',
      alignItems: 'center',
      padding: '1.5rem 2rem',
      borderBottom: '1px solid rgba(151, 125, 255, 0.1)',
      transition: 'all 0.3s ease',
      backgroundColor: 'rgba(255,255,255,0.02)',
      '&:hover': {
        backgroundColor: 'rgba(151, 125, 255, 0.05)',
      }
    },
    name: {
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '1rem',
    },
    email: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: '0.95rem',
    },
    role: {
      display: 'flex',
      alignItems: 'center',
    },
    status: {
      display: 'flex',
      alignItems: 'center',
    },
    actions: {
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'flex-end',
    },
    actionButton: {
      padding: '0.5rem 0.75rem',
      borderRadius: '8px',
      border: 'none',
      fontSize: '0.85rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    editButton: {
      background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
      color: '#ffffff',
      boxShadow: '0 2px 8px rgba(151, 125, 255, 0.3)',
    },
    deleteButton: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: '#ffffff',
      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
    },
    modal: {
      borderRadius: '20px',
      overflow: 'hidden',
      border: 'none',
    },
    modalHeader: {
      background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
      borderBottom: 'none',
      padding: '2rem 2rem 1rem 2rem',
      textAlign: 'center',
    },
    modalTitle: {
      fontSize: '1.4rem',
      color: '#ffffff',
      fontWeight: '700',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    modalBody: {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      padding: '2rem 2rem 1rem 2rem',
      color: '#ffffff',
    },
    modalFooter: {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderTop: 'none',
      padding: '1rem 2rem 2rem 2rem',
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    formLabel: {
      color: '#C4B5FD',
      marginBottom: '0.75rem',
      fontWeight: '600',
      fontSize: '1.1rem',
      display: 'block',
    },
    select: {
      width: '100%',
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      border: '2px solid rgba(151, 125, 255, 0.3)',
      background: 'rgba(255,255,255,0.05)',
      color: '#ffffff',
      fontSize: '1rem',
      outline: 'none',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:focus': {
        borderColor: '#977DFF',
        boxShadow: '0 0 0 3px rgba(151, 125, 255, 0.2)',
        background: 'rgba(255,255,255,0.1)',
      }
    },
    selectOption: {
      background: '#1a1a2e',
      color: '#ffffff',
      padding: '0.75rem',
    },
    cancelButton: {
      background: 'rgba(255,255,255,0.1)',
      borderColor: 'rgba(255,255,255,0.3)',
      color: '#ffffff',
      padding: '1rem 2rem',
      borderRadius: '12px',
      border: '2px solid',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '600',
      fontSize: '1rem',
      minWidth: '120px',
    },
    confirmButton: {
      background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
      color: '#ffffff',
      padding: '1rem 2rem',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '700',
      transition: 'all 0.3s ease',
      fontSize: '1rem',
      minWidth: '120px',
      boxShadow: '0 4px 15px rgba(151, 125, 255, 0.4)',
    },
    deleteModalHeader: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      borderBottom: 'none',
      padding: '2rem 2rem 1rem 2rem',
      textAlign: 'center',
    },
    deleteConfirmButton: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: '#ffffff',
      padding: '1rem 2rem',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '700',
      transition: 'all 0.3s ease',
      fontSize: '1rem',
      minWidth: '120px',
      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
    },
    userInfo: {
      background: 'rgba(151, 125, 255, 0.1)',
      border: '1px solid rgba(151, 125, 255, 0.3)',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    userName: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '0.5rem',
    },
    userEmail: {
      fontSize: '1rem',
      color: 'rgba(255,255,255,0.7)',
    },
    currentRole: {
      display: 'inline-block',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      background: 'rgba(151, 125, 255, 0.2)',
      color: '#C4B5FD',
      fontSize: '0.9rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  };

  return (
    <>
      <style>
        {`
        .user-row:hover {
          background-color: rgba(151, 125, 255, 0.05) !important;
        }
        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(151, 125, 255, 0.4);
        }
        .delete-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }
        .modal-backdrop {
          background-color: rgba(0, 0, 0, 0.8) !important;
          backdrop-filter: blur(10px);
        }
        .role-select:focus {
          border-color: #977DFF !important;
          box-shadow: 0 0 0 3px rgba(151, 125, 255, 0.2) !important;
          background: rgba(255,255,255,0.1) !important;
        }
        .role-select option {
          background: #1a1a2e !important;
          color: #ffffff !important;
          padding: 0.75rem !important;
        }
        .cancel-btn-modal:hover {
          background: rgba(255,255,255,0.2) !important;
          border-color: rgba(255,255,255,0.5) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255,255,255,0.1);
        }
        .confirm-btn-modal:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(151, 125, 255, 0.6) !important;
        }
        .modal-content {
          border: none !important;
          border-radius: 20px !important;
          overflow: hidden !important;
        }
        .modal-header .btn-close {
          background: rgba(255,255,255,0.2) !important;
          border-radius: 50% !important;
          opacity: 0.8 !important;
          margin: 0 !important;
        }
        .modal-header .btn-close:hover {
          background: rgba(255,255,255,0.3) !important;
          opacity: 1 !important;
        }
        `}
      </style>
      
      <div 
        style={styles.row} 
        className="user-row"
      >
        <div style={styles.name}>{user.name}</div>
        <div style={styles.email}>{user.email}</div>
        <div style={styles.role}>
          <span style={getRoleBadgeStyle(user.role)}>
            {user.role}
          </span>
        </div>
        <div style={styles.status}>
          <StatusIcon isActive={user.isActive} />
        </div>
        <div style={styles.actions}>
          <button
            style={{...styles.actionButton, ...styles.editButton}}
            className="action-btn"
            onClick={() => setShowUpdateModal(true)}
          >
            <FaEdit size={12} />
            Edit
          </button>
          <button
            style={{...styles.actionButton, ...styles.deleteButton}}
            className="delete-btn"
            onClick={() => setShowDeleteModal(true)}
          >
            <FaTrash size={12} />
            Delete
          </button>
        </div>
      </div>

      {/* Update Role Modal */}
      <Modal 
        show={showUpdateModal} 
        onHide={() => setShowUpdateModal(false)} 
        size="md" 
        centered
        style={styles.modal}
      >
        <Modal.Header closeButton style={styles.modalHeader}>
          <Modal.Title style={styles.modalTitle}>
            <span>✨</span>
            Update User Role
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user.name}</div>
            <div style={styles.userEmail}>{user.email}</div>
            <div style={{ marginTop: '1rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.8)', marginRight: '0.5rem' }}>Current Role:</span>
              <span style={styles.currentRole}>{user.role}</span>
            </div>
          </div>
          
                     <div style={styles.formGroup}>
             <Form.Label style={styles.formLabel}>
               Select New Role
             </Form.Label>
             <Form.Select
               value={selectedRole}
               onChange={handleRoleChange}
               style={styles.select}
               className="role-select"
             >
               <option value="user">👤 User - Basic access</option>
               <option value="organizer">🎯 Organizer - Can create events</option>
             </Form.Select>
           </div>
        </Modal.Body>
        <Modal.Footer style={styles.modalFooter}>
          <button 
            style={styles.cancelButton}
            className="cancel-btn-modal"
            onClick={() => setShowUpdateModal(false)}
          >
            Cancel
          </button>
          <button 
            style={styles.confirmButton}
            className="confirm-btn-modal"
            onClick={handleUpdateRole}
          >
            Update Role
          </button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)} 
        size="sm" 
        centered
        style={styles.modal}
      >
        <Modal.Header closeButton style={styles.deleteModalHeader}>
          <Modal.Title style={styles.modalTitle}>🗑️ Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: '1.5' }}>
            Are you sure you want to delete <strong>{user.name}</strong>?
            <br />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
              This action cannot be undone.
            </span>
          </p>
        </Modal.Body>
        <Modal.Footer style={styles.modalFooter}>
          <button 
            style={styles.cancelButton}
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
          <button 
            style={styles.deleteConfirmButton}
            onClick={handleDelete}
          >
            Delete User
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserRow;