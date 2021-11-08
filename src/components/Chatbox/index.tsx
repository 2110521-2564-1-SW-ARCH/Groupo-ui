import { Box, Typography, Grid, TextField } from "@mui/material";

import "./style.css";
import { BoardItem } from "../../models/type/board";
import { FormEvent, useState } from "react";

const Chatbox = ({ messages }: { messages: string[] }) => {
  const [message, setMessage] = useState("");
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
  };
  return (
    <Box
      width="250px"
      height="300px"
      position="fixed"
      zIndex="100"
      bottom="0"
      right="20px"
      bgcolor="white"
      border="1px solid black"
      borderRadius="10px 10px 0 0"
      display="flex"
      flexDirection="column"
    >
      <Box p="20px" width="200px" height="250px" overflow="scroll">
        {messages.map((m) => (
          <Typography>{m}</Typography>
        ))}
      </Box>
      <form onSubmit={handleSubmit}>
        <Box width="100%">
          <TextField
            fullWidth
            name="message"
            placeholder="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Box>
      </form>
    </Box>
  );
};

export default Chatbox;
