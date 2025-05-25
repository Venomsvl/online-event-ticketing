import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import PropTypes from 'prop-types';
import UpdateUserRoleModal from './UpdateUserRoleModal';
import ConfirmationDialog from './ConfirmationDialog';

const UserRow = ({ user, onUpdateRole, onDeleteUser, currentUserRole }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleUpdate = (newRole) => {
    onUpdateRole(user._id, newRole);
    setShowUpdateModal(false);
  };

  const handleDelete = () => {
    onDeleteUser(user._id);
    setShowDeleteDialog(false);
  };

  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td className="text-capitalize">{user.role}</td>
      
      {/* Status indicator column */}
      <td>
        {user.active ? (
          <FaCheckCircle className="text-success" />
        ) : (
          <FaTimesCircle className="text-danger" />
        )}
      </td>

      <td>
        <Button 
          variant="warning" 
          size="sm" 
          onClick={() => setShowUpdateModal(true)}
          className="me-2"
        >
          Update Role
        </Button>
        
        {/* Role-based delete button */}
        {currentUserRole === 'admin' && (
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
          </Button>
        )}
      </td>

      {/* Modals */}
      <UpdateUserRoleModal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        currentRole={user.role}
        onUpdate={handleUpdate}
      />

      <ConfirmationDialog
        show={showDeleteDialog}
        onHide={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Confirm User Deletion"
        message={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
      />
    </tr>
  );
};

UserRow.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    active: PropTypes.bool
  }).isRequired,
  onUpdateRole: PropTypes.func.isRequired,
  onDeleteUser: PropTypes.func.isRequired,
  currentUserRole: PropTypes.string.isRequired
};

export default UserRow;