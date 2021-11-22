import { Box, Typography, Grid } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { Link } from "react-router-dom";
import { Delete as DeleteIcon, ExitToApp } from "@mui/icons-material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import "./style.css";
import { BoardItem } from "../../models/type/board";

const BoardListItem = ({board}: {board: BoardItem, user: string|undefined}) => {
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
          <Grid item xs={2} display="flex" gap={1}>
            <DeleteIcon/>
          </Grid>
          <Grid item xs={2} display="flex">
            <ExitToAppIcon/>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default BoardListItem;
