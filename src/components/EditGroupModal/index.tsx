import { Button, Dialog, Modal, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { FormEvent, useState } from "react";

type Props = {
  onEditGroup: Function;
  onClose: () => void;
  isOpen: boolean;
  // preData: string;
};

const EditGroupModal = ({ isOpen, onEditGroup, onClose }: Props) => {
  const [group, setGroup] = useState("");

  const handleOnClose = () => {
    setGroup("");
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onEditGroup(group);
    handleOnClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit}>
        <Box m={2} display="flex" gap={1}>
          <TextField
            autoFocus
            name="group"
            placeholder="Edit Group Name"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          />
          <Button type="submit" variant="contained">
            Save change
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

export default EditGroupModal;
