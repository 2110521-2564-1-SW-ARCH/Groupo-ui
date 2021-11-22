import { Box, Typography, Grid,IconButton, Dialog, Button } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { Link } from "react-router-dom";
import { Delete as DeleteIcon } from "@mui/icons-material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import "./style.css";
import { BoardItem } from "../../models/type/board";

type Key = string | number;

const isNotBoardOwner = (boardOwner:string | undefined, user:string | undefined) => {
  console.log("user =",user)

  if (boardOwner?.toLowerCase() == user?.toLowerCase()) {return false;}
  else {return true;}
}

const BoardListItem = ({board,user}: {board: BoardItem, user:string|undefined}) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  return (
    <Box p={1} borderRadius={2} border="1px solid #00000020">
      <Box
        style={{
          borderLeft: "4px solid",
          borderLeftColor: board.isAssign ? "#039BE5" : "#E53935",
        }}
        pl={1}
        display="flex"
        flexDirection="column"
        gap={0.5}
      >
        <Link to={"/board/" + board.boardID} className="title">
          <Typography variant="h5">{board.name}</Typography>
        </Link>
        <Grid container spacing={1}>
          <Grid item xs={4} display="flex" gap={1} color="gray" fontSize="10px">
            <GroupsIcon />
            <Typography>{board.totalGroup} groups</Typography>
          </Grid>
          <Grid item xs={4} display="flex" gap={1} color="gray" fontSize="10px">
            <PermIdentityIcon />
            <Typography>{board.totalMember} joined</Typography>
          </Grid>
          {/* <Grid item xs={1} display="flex">
            <IconButton
              color="warning"
              size="small"
              disabled={isNotBoardOwner(board.owner, user)}
              onClick={() => {setDeleteModalOpen(true)}}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
          <Grid item xs={1} display="flex">
            <IconButton
              color="warning"
              size="small"
              disabled={!isNotBoardOwner(board.owner, user)}
              onClick={() => {}}
            >
              <ExitToAppIcon />
            </IconButton>
          </Grid> */}
        </Grid>
        {/* <Dialog
          open={isDeleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
          }}
        >
          <Box m={2} display="flex" gap={1}>
            <h2>Confirm deletion?</h2>
            <Button
              type="submit"
              variant="contained"
              onClick={() => {
                setDeleteModalOpen(false);
              }}
            >
              Yes
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={() => {
                setDeleteModalOpen(false);
              }}
            >
              No
            </Button>
          </Box>
        </Dialog> */}
      </Box>
    </Box>
  );
};

export default BoardListItem;
