import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const UpdateUserRoleModal = ({ show, onHide, onUpdateRole, currentRole }) => {
  const [selectedRole, setSelectedRole] = useState(currentRole);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateRole(selectedRole);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update User Role</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Role</Form.Label>
            <Form.Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="User">User</option>
              <option value="Organizer">Organizer</option>
              <option value="Admin">Admin</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Update Role
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateUserRoleModal;
