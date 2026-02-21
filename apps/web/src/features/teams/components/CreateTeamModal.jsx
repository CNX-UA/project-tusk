import React, { useState } from "react";
import { TextField, Button, MenuItem } from "@mui/material";
import EntityModal from "@/components/ui/EntityModal";
import { useTeamMutation } from "../hooks/useTeams";

const DEPARTMENT_TYPES = [
  { value: "general", label: "General" },
  { value: "it", label: "IT" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "hr", label: "HR" },
];

const CreateTeamModal = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("general");
  const { createMutation } = useTeamMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      await createMutation.mutateAsync({
        name,
        department_type: department,
      });
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };
  const handleClose = () => {
    setName("");
    setDepartment("general");
    onClose();
  };

  const modalAction = (
    <>
      <Button onClick={handleClose} disabled={createMutation.isPending}>
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        variant="contained"
        disabled={!name.trim() || createMutation.isPending}
      >
        {createMutation.isPending ? "Creating..." : "Create Team"}
      </Button>
    </>
  );

  return (
    <EntityModal
      open={open}
      onClose={handleClose}
      title="Create Team"
      subtitle="Organize your people into functional groups."
      actions={modalAction}
      isLoading={createMutation.isPending}
    >
      <form onSubmit={handleSubmit} id="create-team-form">
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Team Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Backend Squad"
          required
        />
        <TextField
          margin="dense"
          id="department"
          select
          label="Department"
          fullWidth
          variant="outlined"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          {DEPARTMENT_TYPES.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </form>
    </EntityModal>
  );
};

export default CreateTeamModal;
