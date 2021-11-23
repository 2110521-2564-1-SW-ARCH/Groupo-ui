import { Button, Dialog, Modal, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { FormEvent, useState, useEffect } from "react";

type Props = {
  onEditGroup: Function;
  onClose: () => void;
  isOpen: boolean;
  preName: string | null;
};

const EditGroupModal = ({ isOpen, onEditGroup, onClose, preName }: Props) => {
  const [group, setGroup] = useState(preName);
  const [tags, setTags] = useState("");
  const [capacity, setCapacity] = useState("0");

  const handleOnClose = () => {
    setGroup(preName);
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onEditGroup(group, tags.split(',').map(x => x.trim()), parseInt(capacity));
    handleOnClose();
  };

  useEffect(() =>{
    setGroup(preName);
  },[isOpen])

  return (
    <Dialog open={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit}>
        <Box m={2} display="flex" flexDirection="column" gap={1}>
          <TextField
            autoFocus
            name="group"
            placeholder="Edit Group Name"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          />
          <TextField
            autoFocus
            name="tags"
            placeholder="Tags (comma seperated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <TextField
            autoFocus
            name="tags"
            placeholder="Auto Group Capacity (0 for unlimited)"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
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
