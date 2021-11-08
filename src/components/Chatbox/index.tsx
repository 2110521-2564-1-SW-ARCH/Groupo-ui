import { Box, Typography, Grid, TextField } from "@mui/material";
import socketIOClient, { Socket } from "socket.io-client";

import "./style.css";
import { getTokenHeader } from "../../client/index";
import { BoardItem } from "../../models/type/board";
import { FormEvent, useEffect, useState } from "react";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const Chatbox = ({ bid }: { bid: string }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([""]);
  const [socket, setSocket] =
    useState<Socket<DefaultEventsMap, DefaultEventsMap>>();

  const handleSubmit = () => {
    sendMessage(message);
    setMessage("");
  };

  const addChatMessage = (email: string, newMessage: string) => {
    setMessages([...messages, `${email}: ${newMessage}`]);
  };

  const sendMessage = (newMessage: string) => {
    if (socket) {
      socket.emit("chat", newMessage);
    }
  };

  useEffect(() => {
    (async () => {
      const header = await getTokenHeader();
      const sock = socketIOClient(
        `${
          process.env.REACT_APP_WEBSOCKET_HOST
        }/?boardID=${bid}&token=${header.headers["Authorization"].replace(
          "Bearer ",
          ""
        )}`
      );

      sock.on("chat", (email: string, message: string) => {
        // handle email and message

        setMessages([...messages, `${email}: ${message}`]);
      });

      setSocket(sock);

      return () => {
        console.log("websocket unmounting!!!!!");
        sock.off();
        sock.disconnect();
      };
    })();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("chat", (email: string, message: string) => {
        // handle email and message
        setMessages([...messages, `${email}: ${message}`]);
      });
    }
    return () => {
      socket && socket.off("message");
    };
  }, [messages, socket]);

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
        {messages.map((m, idx) => (
          <Typography key={`${idx}`}>{m}</Typography>
        ))}
      </Box>
      <Box width="100%">
        <TextField
          fullWidth
          name="message"
          placeholder="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default Chatbox;
