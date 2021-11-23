import { Button, Dialog, Modal, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { FormEvent, useState } from "react";

type Props = {
  onAddGroup: Function;
  onClose: () => void;
  isOpen: boolean;
};

const AddGroupModal = ({ isOpen, onAddGroup, onClose }: Props) => {
  const [group, setGroup] = useState("group name");

  const handleOnClose = () => {
    setGroup("");
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddGroup(group);
    handleOnClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit}>
        <Box m={2} display="flex" gap={1}>
          <TextField
            autoFocus
            name="group"
            placeholder="Enter Group Name"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          />
          <Button type="submit" variant="contained">
            Add Group
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

export default AddGroupModal;
