import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import UpdateUserRoleModal from './UpdateUserRoleModal';
import ConfirmationDialog from './ConfirmationDialog';

const UserRow = ({ user, onUpdateRole, onDelete }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleUpdateRole = (newRole) => {
    onUpdateRole(user.id, newRole);
    setShowUpdateModal(false);
  };

  const handleDelete = () => {
    onDelete(user.id);
    setShowDeleteDialog(false);
  };

  return (
    <div className="user-row p-3 border-bottom d-flex justify-content-between align-items-center">
      <div className="user-info">
        <h5 className="mb-1">{user.name}</h5>
        <p className="mb-1 text-muted">{user.email}</p>
        <span className="badge bg-primary">{user.role}</span>
      </div>
      
      <div className="user-actions">
        <Button 
          variant="outline-primary" 
          className="me-2"
          onClick={() => setShowUpdateModal(true)}
        >
          Update Role
        </Button>
        <Button 
          variant="outline-danger"
          onClick={() => setShowDeleteDialog(true)}
        >
          Delete
        </Button>
      </div>

      <UpdateUserRoleModal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        onUpdateRole={handleUpdateRole}
        currentRole={user.role}
      />

      <ConfirmationDialog
        show={showDeleteDialog}
        onHide={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${user.name}?`}
      />
    </div>
  );
};

export default UserRow;
