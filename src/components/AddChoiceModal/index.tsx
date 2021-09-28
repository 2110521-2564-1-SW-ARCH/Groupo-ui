import { Button, Dialog, Modal, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { FormEvent, useState } from "react";

type Props = {
  onAddChoice: Function;
  onClose: () => void;
  isOpen: boolean;
};

const AddChoiceModal = ({ isOpen, onAddChoice, onClose }: Props) => {
  const [choice, setChoice] = useState("");

  const handleOnClose = () => {
    setChoice("");
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddChoice(choice);
    handleOnClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit}>
        <Box m={2} display="flex" gap={1}>
          <TextField
            autoFocus
            name="choice"
            placeholder="Enter choice"
            value={choice}
            onChange={(e) => setChoice(e.target.value)}
          />
          <Button type="submit" variant="contained">
            Add Choice
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

export default AddChoiceModal;
